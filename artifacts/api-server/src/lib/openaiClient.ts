import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export function requireOpenAI() {
  if (!openai) {
    throw new Error("openai_unconfigured");
  }

  return openai;
}

export const STORY_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
