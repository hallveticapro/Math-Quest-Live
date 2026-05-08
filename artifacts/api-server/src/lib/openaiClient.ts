import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

export const openai = new OpenAI({ apiKey });

export const STORY_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
