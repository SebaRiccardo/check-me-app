import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { exa } from "./client";

export const webSearch = tool({
  description: "Search the web for up-to-date information",
  inputSchema: z.object({
    query: z.string().min(1).max(100).describe("The search query"),
  }),
  execute: async ({ query }) => {
    const { results } = await exa.search(query, {
      numResults: 3,
      category: "news",
      type: "deep",
      userLocation: "AR",
    });
    return results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.text.slice(0, 1000), // take just the first 1000 characters
      publishedDate: result.publishedDate,
    }));
  },
});
