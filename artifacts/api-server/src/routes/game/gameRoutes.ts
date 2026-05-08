import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { StartGameBody, TakeTurnBody, GetEndingBody } from "@workspace/api-zod";
import { buildStartPrompt, buildTurnPrompt, buildEndingPrompt } from "./storyPrompt.js";
import { checkStoryTurnSafety, checkEndingSafety } from "./safety.js";

const router = Router();

const STORY_MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

const FALLBACK_SCENE = {
  sceneTitle: "The Puzzle Path",
  storyText:
    "The path ahead glows with gentle puzzle magic. Your hero studies the symbols and notices three safe ways forward. Ancient runes shimmer on the walls, each one a clue to the mystery ahead. The air hums with quiet energy, and somewhere in the distance, a friendly creature calls out in encouragement.",
  choices: [
    { id: "A", label: "Study the symbols carefully" },
    { id: "B", label: "Ask a friendly guide for help" },
    { id: "C", label: "Look for a hidden pattern" },
  ],
  storySummary:
    "The hero is following a safe puzzle path and solving challenges.",
  safetyRating: "kid_safe",
};

const FALLBACK_ENDING = {
  endingTitle: "The Puzzle Champion",
  endingText:
    "With focus, courage, and careful thinking, your hero solves the final challenge and brings the adventure to a joyful end. The whole world seems to celebrate — friendly creatures cheer, lights shimmer, and a warm glow surrounds the hero. It was a journey filled with math, mystery, and courage. Well done!",
  badge: "Puzzle Champion",
  safetyRating: "kid_safe",
};

async function callOpenAI(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: STORY_MODEL,
    max_completion_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  return response.choices[0]?.message?.content ?? "";
}

function parseJSON(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("No valid JSON found in response");
  }
}

router.post("/start", async (req, res) => {
  const parsed = StartGameBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const prompt = buildStartPrompt(parsed.data);
    const raw = await callOpenAI(prompt);
    const data = parseJSON(raw);

    if (!checkStoryTurnSafety(data)) {
      req.log.warn("AI output failed safety check, using fallback");
      res.json(FALLBACK_SCENE);
      return;
    }

    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to generate start scene");
    res.json(FALLBACK_SCENE);
  }
});

router.post("/turn", async (req, res) => {
  const parsed = TakeTurnBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const prompt = buildTurnPrompt(parsed.data);
    const raw = await callOpenAI(prompt);
    const data = parseJSON(raw);

    if (!checkStoryTurnSafety(data)) {
      req.log.warn("AI output failed safety check, using fallback");
      res.json(FALLBACK_SCENE);
      return;
    }

    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to generate turn scene");
    res.json(FALLBACK_SCENE);
  }
});

router.post("/ending", async (req, res) => {
  const parsed = GetEndingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const prompt = buildEndingPrompt(parsed.data);
    const raw = await callOpenAI(prompt);
    const data = parseJSON(raw);

    if (!checkEndingSafety(data)) {
      req.log.warn("AI ending failed safety check, using fallback");
      res.json(FALLBACK_ENDING);
      return;
    }

    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to generate ending");
    res.json(FALLBACK_ENDING);
  }
});

export default router;
