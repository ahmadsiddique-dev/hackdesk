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
    
    let docs = [];
    if (data.path.endsWith(".txt")) {
      const text = fs.readFileSync(data.path, "utf-8")
      docs = [new Document({ pageContent: text, metadata: { source: data.filename } })]
    } else {
      const loader = new PDFLoader(data.path);
      docs = await loader.load()
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const splitDocs = await splitter.splitDocuments(docs);
    
    const filteredDocs = splitDocs.filter(
      (doc) => doc.pageContent && doc.pageContent.trim() !== ""
    );
    
    if (filteredDocs.length === 0) {
      throw new Error("Data not found in file");
    }

    const embeddings = getEmbeddingsClient();
    
    let vectorStore;
    const batchSize = 25;
    const batches = loadash.chunk(filteredDocs, batchSize);
    
    for (let index = 0; index < batches.length; index++) {
      const batch = batches[index];
      
      if (index === 0) {
        vectorStore = await QdrantVectorStore.fromDocuments(batch, embeddings, {
          url: "http://localhost:6333",
          collectionName: "pdf-docs",
        });
      } else {
        await vectorStore.addDocuments(batch);
      }
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

worker.on("completed", (job) => {
  console.log(`File processed successfully`);
});

worker.on("failed", (job, err) => {
  console.log(`File processing failed. Try again`);
});
