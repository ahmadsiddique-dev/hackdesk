import { Embeddings } from "@langchain/core/embeddings";
import "dotenv/config";

class OpenRouterEmbeddings extends Embeddings {
  constructor(fields) {
    super(fields ?? {});
    this.apiKey = fields?.apiKey ?? process.env.OPENROUTER_API_KEY;
    this.modelName = fields?.modelName ?? "google/gemini-embedding-2";
  }

  async embedDocuments(texts) {
    const response = await fetch(
      "https://ai.hackclub.com/proxy/v1/embeddings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          input: texts,
          max_tokens: 2000,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Hack Club AI error: ${response.status} ${response.statusText}`,
      );
    }
    const json = await response.json();
    if (!json.data) {
      throw new Error("No data returned from Hack Club AI");
    }
    return json.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);
  }

  async embedQuery(text) {
    const response = await fetch(
      "https://ai.hackclub.com/proxy/v1/embeddings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          input: text,
          max_tokens: 2000,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`ERROOOR: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    if (!json.data || json.data.length === 0) {
      throw new Error("No data returned");
    }
    return json.data[0].embedding;
  }
}

export function getEmbeddingsClient() {
  return new OpenRouterEmbeddings();
}
