import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { getEmbeddingsClient } from "./src/embeddings.js";

const queue = new Queue("data-upload-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 250 * 1024 },
});

const app = express();
const PORT = process.env.PORT || 7000;
app.use(cors());

app.get("/", (req, res) => {
  res.send(`Server is up and running`);
});

app.post(
  "/upload/file",
  upload.single("file"),
  async function (req, res, next) {
    const job = await queue.add("file-ready", {
      filename: req.file.filename,
      destination: req.file.destination,
      path: req.file.path,
    });
    res.json({ message: "File uploaded successfully!", jobId: job.id });
  },
);

app.get("/upload/status/:jobId", async (req, res) => {
  const { jobId } = req.params;
  const job = await queue.getJob(jobId);
  if (!job) {
    return res.status(404).json({ status: "not_found" });
  }
  const state = await job.getState();
  res.json({ status: state });
});

app.get("/chat", async (req, res) => {
  const userQuery = req.query.userQuery;

  const embeddings = getEmbeddingsClient();

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "pdf-docs",
    },
  );

  const similaritySearchResults = await vectorStore.similaritySearch(userQuery);

  const context = similaritySearchResults.map((doc) => doc.pageContent).join("\n\n");
  const prompt = `Use the following context to answer the user query:

Context:
${context}

User Query: ${userQuery}`;

  const response = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    return res.status(response.status).send({ error: `Hack Club AI chat error: ${response.status} ${response.statusText}` });
  }

  const json = await response.json();
  const replyText = json.choices[0].message.content;
  console.log("Reply text: ", replyText)
  res.send({ result: { text: replyText } });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
