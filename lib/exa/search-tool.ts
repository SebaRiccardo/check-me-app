import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { exa } from "./client";

export const webSearch = tool({
  description: "Search the web for up-to-date information",
  inputSchema: z.object({
    query: z.string().min(1).max(100).describe("The search query"),
  }),
  execute: async ({ query }) => {
    const { results,costDollars } = await exa.search(query, {
      numResults: 5,
      category: "news",
      type: "fast",
      userLocation: "AR",
    });
    console.log(`Web search cost: $${costDollars?.total}`);
    console.log(`Neural cost: $${costDollars?.search?.neural}`);
    console.log(`Contents cost: $${costDollars?.contents?.text}`);
    return results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.text.slice(0, 2000), // take just the first 2000 characters
      publishedDate: result.publishedDate,
    }));
  },
});
