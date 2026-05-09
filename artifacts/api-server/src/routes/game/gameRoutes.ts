import crypto from "node:crypto";
import { Router } from "express";
import { StartGameBody, TakeTurnBody, GetEndingBody } from "@workspace/api-zod";
import {
  ALLOWED_ADVENTURE_SEEDS,
  ALLOWED_ANCESTRIES,
  ALLOWED_CLASSES,
  ALLOWED_DIFFICULTIES,
  ALLOWED_HERO_NAMES,
  ALLOWED_MAX_TURNS,
  ALLOWED_PRONOUNS,
  buildStartPrompt,
  buildTurnPrompt,
  buildEndingPrompt,
} from "./storyPrompt.js";
import { checkStoryTurnSafety, checkEndingSafety } from "./safety.js";
import { openai, STORY_MODEL } from "../../lib/openaiClient.js";
import { maybeGenerateSceneImage } from "../../images/imageService.js";
import type { ImageMetadata } from "../../images/imageTypes.js";

const router = Router();

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

type StoryTurnData = typeof FALLBACK_SCENE;
type EndingData = typeof FALLBACK_ENDING;
type PreparedTurnResult =
  | { kind: "turn"; turn: number; data: StoryTurnData }
  | { kind: "ending"; turn: number; data: EndingData };
type PendingTurn = {
  id: string;
  kind: PreparedTurnResult["kind"];
  turn: number;
  expiresAt: number;
  promise: Promise<PreparedTurnResult>;
};

const PENDING_TURN_TTL_MS = 10 * 60 * 1000;
const pendingTurns = new Map<string, PendingTurn>();

function cleanupPendingTurns() {
  const now = Date.now();
  for (const [id, pending] of pendingTurns.entries()) {
    if (pending.expiresAt <= now) {
      pendingTurns.delete(id);
    }
  }
}

setInterval(cleanupPendingTurns, 60 * 1000).unref();

function withOptionalImage<T extends object>(data: T, image: ImageMetadata | undefined) {
  if (!image || image.status === "failed") return data;
  return { ...data, image };
}

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

function isAllowedString(value: string, allowed: readonly string[]) {
  return allowed.includes(value);
}

function validateCommonGameInput(data: {
  hero: {
    name: string;
    pronouns: string;
    ancestry: string;
    className: string;
  };
  difficulty: string;
  adventureSeed: string;
  maxTurns: number;
}) {
  return (
    isAllowedString(data.hero.name, ALLOWED_HERO_NAMES) &&
    isAllowedString(data.hero.pronouns, ALLOWED_PRONOUNS) &&
    isAllowedString(data.hero.ancestry, ALLOWED_ANCESTRIES) &&
    isAllowedString(data.hero.className, ALLOWED_CLASSES) &&
    isAllowedString(data.difficulty, ALLOWED_DIFFICULTIES) &&
    isAllowedString(data.adventureSeed, ALLOWED_ADVENTURE_SEEDS) &&
    (ALLOWED_MAX_TURNS as readonly number[]).includes(data.maxTurns)
  );
}

function isValidStoryStateText(value: string, maxLength: number) {
  return value.trim().length > 0 && value.length <= maxLength;
}

function isHeroInfo(value: unknown): value is {
  name: string;
  pronouns: string;
  ancestry: string;
  className: string;
} {
  if (!value || typeof value !== "object") return false;
  const hero = value as Record<string, unknown>;
  return (
    typeof hero.name === "string" &&
    typeof hero.pronouns === "string" &&
    typeof hero.ancestry === "string" &&
    typeof hero.className === "string"
  );
}

function parsePrepareBody(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  if (!isHeroInfo(data.hero)) return null;
  if (data.kind !== "turn" && data.kind !== "ending") return null;
  const kind = data.kind as "turn" | "ending";
  if (
    typeof data.difficulty !== "string" ||
    typeof data.adventureSeed !== "string" ||
    typeof data.storySummary !== "string" ||
    typeof data.chosenAction !== "string" ||
    !Number.isInteger(data.turn) ||
    !Number.isInteger(data.maxTurns)
  ) {
    return null;
  }

  return {
    kind,
    hero: data.hero,
    difficulty: data.difficulty,
    adventureSeed: data.adventureSeed,
    turn: data.turn as number,
    maxTurns: data.maxTurns as number,
    storySummary: data.storySummary,
    chosenAction: data.chosenAction,
    mathSolved: Number.isInteger(data.mathSolved) ? (data.mathSolved as number) : undefined,
  };
}

function validatePreparedGameInput(data: NonNullable<ReturnType<typeof parsePrepareBody>>) {
  if (
    !validateCommonGameInput(data) ||
    data.turn < 1 ||
    data.turn > data.maxTurns ||
    !isValidStoryStateText(data.storySummary, 600) ||
    !isValidStoryStateText(data.chosenAction, 90)
  ) {
    return false;
  }

  if (data.kind === "ending") {
    return (
      Number.isInteger(data.mathSolved) &&
      data.mathSolved !== undefined &&
      data.mathSolved >= 0 &&
      data.mathSolved <= data.maxTurns
    );
  }

  return true;
}

async function generatePreparedTurn(data: NonNullable<ReturnType<typeof parsePrepareBody>>): Promise<PreparedTurnResult> {
  if (data.kind === "ending") {
    const prompt = buildEndingPrompt({
      hero: data.hero,
      difficulty: data.difficulty,
      adventureSeed: data.adventureSeed,
      turn: data.turn,
      maxTurns: data.maxTurns,
      storySummary: `${data.storySummary} The hero chose to ${data.chosenAction}.`,
      mathSolved: data.mathSolved ?? data.maxTurns,
    });
    const raw = await callOpenAI(prompt);
    const parsed = parseJSON(raw);
    if (!checkEndingSafety(parsed)) {
      return { kind: "ending", turn: data.turn, data: FALLBACK_ENDING };
    }

    const endingData = parsed as EndingData;
    const image = await maybeGenerateSceneImage({
      context: {
        kind: "ending",
        hero: data.hero,
        adventureSeed: data.adventureSeed,
        difficulty: data.difficulty,
        sceneTitle: endingData.endingTitle,
        storyText: endingData.endingText,
        storySummary: data.storySummary,
        chosenAction: data.chosenAction,
      },
      turn: data.turn,
      maxTurns: data.maxTurns,
      isEnding: true,
    });

    return { kind: "ending", turn: data.turn, data: withOptionalImage(endingData, image) as EndingData };
  }

  const prompt = buildTurnPrompt({
    hero: data.hero,
    difficulty: data.difficulty,
    adventureSeed: data.adventureSeed,
    turn: data.turn,
    maxTurns: data.maxTurns,
    storySummary: data.storySummary,
    chosenAction: data.chosenAction,
    mathResult: "The student selected this action and is solving the required math challenge before the next scene is shown.",
  });
  const raw = await callOpenAI(prompt);
  const parsed = parseJSON(raw);
  if (!checkStoryTurnSafety(parsed)) {
    return { kind: "turn", turn: data.turn, data: FALLBACK_SCENE };
  }

  const turnData = parsed as StoryTurnData;
  const image = await maybeGenerateSceneImage({
    context: {
      kind: data.turn === Math.ceil(data.maxTurns / 2) ? "milestone" : "scene",
      hero: data.hero,
      adventureSeed: data.adventureSeed,
      difficulty: data.difficulty,
      sceneTitle: turnData.sceneTitle,
      storyText: turnData.storyText,
      storySummary: turnData.storySummary,
      chosenAction: data.chosenAction,
    },
    turn: data.turn,
    maxTurns: data.maxTurns,
  });

  return { kind: "turn", turn: data.turn, data: withOptionalImage(turnData, image) as StoryTurnData };
}

router.post("/prepare", (req, res) => {
  const parsed = parsePrepareBody(req.body);
  if (!parsed || !validatePreparedGameInput(parsed)) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  cleanupPendingTurns();
  const pendingId = `pending_${crypto.randomUUID()}`;
  const promise = generatePreparedTurn(parsed).catch((err) => {
    req.log.error({ err, kind: parsed.kind, turn: parsed.turn }, "Prepared turn generation failed");
    return parsed.kind === "ending"
      ? { kind: "ending" as const, turn: parsed.turn, data: FALLBACK_ENDING }
      : { kind: "turn" as const, turn: parsed.turn, data: FALLBACK_SCENE };
  });

  pendingTurns.set(pendingId, {
    id: pendingId,
    kind: parsed.kind,
    turn: parsed.turn,
    expiresAt: Date.now() + PENDING_TURN_TTL_MS,
    promise,
  });

  res.json({ pendingId, kind: parsed.kind, turn: parsed.turn });
});

router.post("/resolve", async (req, res) => {
  const pendingId = typeof req.body?.pendingId === "string" ? req.body.pendingId : "";
  if (!pendingId.startsWith("pending_")) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const pending = pendingTurns.get(pendingId);
  if (!pending || pending.expiresAt <= Date.now()) {
    pendingTurns.delete(pendingId);
    res.status(404).json({ error: "Prepared turn not found" });
    return;
  }

  try {
    const result = await pending.promise;
    pendingTurns.delete(pendingId);
    res.json(result);
  } catch (err) {
    pendingTurns.delete(pendingId);
    req.log.error({ err, pendingId }, "Failed to resolve prepared turn");
    res.status(500).json({ error: "Prepared turn failed" });
  }
});

router.post("/start", async (req, res) => {
  const parsed = StartGameBody.safeParse(req.body);
  if (!parsed.success || !validateCommonGameInput(parsed.data)) {
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

    const turnData = data as StoryTurnData;
    const image = await maybeGenerateSceneImage({
      context: {
        kind: "intro",
        hero: parsed.data.hero,
        adventureSeed: parsed.data.adventureSeed,
        difficulty: parsed.data.difficulty,
        sceneTitle: turnData.sceneTitle,
        storyText: turnData.storyText,
        storySummary: turnData.storySummary,
      },
      maxTurns: parsed.data.maxTurns,
      isIntro: true,
    });

    res.json(withOptionalImage(turnData, image));
  } catch (err) {
    req.log.error({ err }, "Failed to generate start scene");
    res.json(FALLBACK_SCENE);
  }
});

router.post("/turn", async (req, res) => {
  const parsed = TakeTurnBody.safeParse(req.body);
  if (
    !parsed.success ||
    !validateCommonGameInput(parsed.data) ||
    !Number.isInteger(parsed.data.turn) ||
    parsed.data.turn < 1 ||
    parsed.data.turn > parsed.data.maxTurns ||
    !isValidStoryStateText(parsed.data.storySummary, 600) ||
    !isValidStoryStateText(parsed.data.chosenAction, 90) ||
    !isValidStoryStateText(parsed.data.mathResult, 160)
  ) {
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

    const turnData = data as StoryTurnData;
    const image = await maybeGenerateSceneImage({
      context: {
        kind: parsed.data.turn === Math.ceil(parsed.data.maxTurns / 2) ? "milestone" : "scene",
        hero: parsed.data.hero,
        adventureSeed: parsed.data.adventureSeed,
        difficulty: parsed.data.difficulty,
        sceneTitle: turnData.sceneTitle,
        storyText: turnData.storyText,
        storySummary: turnData.storySummary,
        chosenAction: parsed.data.chosenAction,
      },
      turn: parsed.data.turn,
      maxTurns: parsed.data.maxTurns,
    });

    res.json(withOptionalImage(turnData, image));
  } catch (err) {
    req.log.error({ err }, "Failed to generate turn scene");
    res.json(FALLBACK_SCENE);
  }
});

router.post("/ending", async (req, res) => {
  const parsed = GetEndingBody.safeParse(req.body);
  if (
    !parsed.success ||
    !validateCommonGameInput(parsed.data) ||
    !Number.isInteger(parsed.data.turn) ||
    parsed.data.turn < 1 ||
    parsed.data.turn > parsed.data.maxTurns ||
    !Number.isInteger(parsed.data.mathSolved) ||
    parsed.data.mathSolved < 0 ||
    parsed.data.mathSolved > parsed.data.maxTurns ||
    !isValidStoryStateText(parsed.data.storySummary, 600)
  ) {
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

    const endingData = data as EndingData;
    const image = await maybeGenerateSceneImage({
      context: {
        kind: "ending",
        hero: parsed.data.hero,
        adventureSeed: parsed.data.adventureSeed,
        difficulty: parsed.data.difficulty,
        sceneTitle: endingData.endingTitle,
        storyText: endingData.endingText,
        storySummary: parsed.data.storySummary,
      },
      turn: parsed.data.turn,
      maxTurns: parsed.data.maxTurns,
      isEnding: true,
    });

    res.json(withOptionalImage(endingData, image));
  } catch (err) {
    req.log.error({ err }, "Failed to generate ending");
    res.json(FALLBACK_ENDING);
  }
});

export default router;
