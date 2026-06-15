import "dotenv/config";
import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { getEmbeddingsClient } from "./src/embeddings.js";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import { Document } from "@langchain/core/documents";
import loadash from "lodash";

const worker = new Worker(
  "data-upload-queue",
  async (job) => {
    const data = JSON.parse(JSON.stringify(job.data));
    console.log("File Data: ", data);
    let docs = [];
    if (data.path.endsWith(".txt")) {
      const text = fs.readFileSync(data.path, "utf-8");
      docs = [
        new Document({
          pageContent: text,
          metadata: { source: data.filename },
        }),
      ];
    } else {
      const loader = new PDFLoader(data.path);
      docs = await loader.load();
    }

    console.log("File Loaded");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 10000,
      chunkOverlap: 100,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    const filteredDocs = splitDocs.filter(
      (doc) => doc.pageContent && doc.pageContent.trim() !== "",
    );

    if (filteredDocs.length === 0) {
      throw new Error("Data not found in file");
    }

    try {
      const embeddings = getEmbeddingsClient();
      console.log("Embeddings", embeddings);

      let vectorStore;
      const batchSize = 25;
      const batches = loadash.chunk(filteredDocs, batchSize);

      for (let index = 0; index < batches.length; index++) {
        const batch = batches[index];
        if (index === 0) {
          vectorStore = await QdrantVectorStore.fromDocuments(
            batch,
            embeddings,
            {
              url: "http://localhost:6333",
              collectionName: "pdf-docs",
            },
          );
        } else {
          await vectorStore.addDocuments(batch);
        }
      }
    } catch (err) {
      console.error(err.message); 
    }

    try {
      if (fs.existsSync(data.path)) {
        fs.unlinkSync(data.path);
      }
    } catch (err) {
      console.error(err.message);
    }
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);
