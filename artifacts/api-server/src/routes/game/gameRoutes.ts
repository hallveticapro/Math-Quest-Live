import { Router } from "express";
import {
  StartGameBody,
  TakeTurnBody,
  GetEndingBody,
  ResolvePreparedGameStepBody,
} from "@workspace/api-zod";
import {
  buildStartPrompt,
  buildTurnPrompt,
  buildEndingPrompt,
  createEpisodePlan,
} from "./storyPrompt.js";
import { checkStoryTurnSafety, checkEndingSafety } from "./safety.js";
import {
  isValidStoryStateText,
  parsePrepareBody,
  validateCommonGameInput,
  validatePreparedGameInput,
  type ParsedPrepareBody,
} from "./gameInputValidation.js";
import {
  buildGenreFallbackEnding,
  buildGenreFallbackScene,
} from "./storyFallbacks.js";
import type {
  PreparedTurnResult,
  StoryEndingData,
  StoryTurnData,
} from "./storyRouteTypes.js";
import {
  createPendingTurn,
  deletePendingTurn,
  getPendingTurn,
  readStoryTimeoutMs,
  resolveEpisodePlan,
  storeEpisodePlan,
} from "./preparedTurnStore.js";
import { requireOpenAI, STORY_MODEL } from "../../lib/openaiClient.js";
import { maybeGenerateSceneImage, requestSceneImage } from "../../images/imageService.js";
import type { ImageMetadata } from "../../images/imageTypes.js";

const router = Router();

function withOptionalImage<T extends object>(data: T, image: ImageMetadata | undefined) {
  if (!image || image.status === "failed") return data;
  return { ...data, image };
}

function isMilestoneTurn(turn: number, maxTurns: number) {
  return Number.isInteger(turn) && turn > 0 && turn <= maxTurns && turn % 2 === 0;
}

async function callOpenAI(prompt: string): Promise<string> {
  const openai = requireOpenAI();
  const controller = new AbortController();
  const timeoutMs = readStoryTimeoutMs();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await openai.chat.completions.create(
      {
        model: STORY_MODEL,
        max_completion_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      },
      { signal: controller.signal },
    );

    return response.choices[0]?.message?.content ?? "";
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error("story_generation_timeout");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
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

async function generatePreparedTurn(data: ParsedPrepareBody): Promise<PreparedTurnResult> {
  const episodePlan = resolveEpisodePlan(data, data.episodeId);
  if (data.kind === "ending") {
    const fallbackEnding = buildGenreFallbackEnding(episodePlan);
    const prompt = buildEndingPrompt({
      hero: data.hero,
      difficulty: data.difficulty,
      adventureSeed: data.adventureSeed,
      turn: data.turn,
      maxTurns: data.maxTurns,
      storySummary: `${data.storySummary} The hero chose to ${data.chosenAction}.`,
      storyHistory: data.storyHistory,
      mathSolved: data.mathSolved ?? data.maxTurns,
      episodePlan,
    });
    const raw = await callOpenAI(prompt);
    const parsed = parseJSON(raw);
    if (!checkEndingSafety(parsed)) {
      return { kind: "ending", turn: data.turn, data: fallbackEnding };
    }

    const endingData = parsed as StoryEndingData;
    const image = await maybeGenerateSceneImage({
      context: {
        kind: "ending",
        hero: data.hero,
        adventureSeed: `${episodePlan.opening.genre}: ${episodePlan.opening.setting}`,
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

    return { kind: "ending", turn: data.turn, data: withOptionalImage(endingData, image) as StoryEndingData };
  }

  const fallbackScene = buildGenreFallbackScene(episodePlan);
  const prompt = buildTurnPrompt({
    hero: data.hero,
    difficulty: data.difficulty,
    adventureSeed: data.adventureSeed,
    turn: data.turn,
    maxTurns: data.maxTurns,
    storySummary: data.storySummary,
    storyHistory: data.storyHistory,
    chosenAction: data.chosenAction,
    mathResult: "The student selected this action and is solving the required math challenge before the next scene is shown.",
    episodePlan,
    lastMathSkill: data.lastMathSkill,
  });
  const raw = await callOpenAI(prompt);
  const parsed = parseJSON(raw);
  if (!checkStoryTurnSafety(parsed)) {
    return { kind: "turn", turn: data.turn, data: fallbackScene };
  }

  const turnData = parsed as StoryTurnData;
  const image = requestSceneImage({
    context: {
      kind: isMilestoneTurn(data.turn, data.maxTurns) ? "milestone" : "scene",
      hero: data.hero,
      adventureSeed: `${episodePlan.opening.genre}: ${episodePlan.opening.setting}`,
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

  const clientKey = req.ip ?? "unknown";
  const promise = generatePreparedTurn(parsed).catch((err) => {
    req.log.error({ err, kind: parsed.kind, turn: parsed.turn }, "Prepared turn generation failed");
    const plan = resolveEpisodePlan(parsed, parsed.episodeId);
    return parsed.kind === "ending"
      ? { kind: "ending" as const, turn: parsed.turn, data: buildGenreFallbackEnding(plan) }
      : { kind: "turn" as const, turn: parsed.turn, data: buildGenreFallbackScene(plan) };
  });
  const stored = createPendingTurn({
    kind: parsed.kind,
    turn: parsed.turn,
    clientKey,
    episodeId: parsed.episodeId,
    promise,
  });

  if (!stored.ok) {
    res.status(stored.status).json({ error: stored.error, message: stored.message });
    return;
  }

  res.json({ pendingId: stored.pendingId, kind: parsed.kind, turn: parsed.turn });
});

router.post("/resolve", async (req, res) => {
  const parsed = ResolvePreparedGameStepBody.safeParse(req.body);
  const pendingId = parsed.success ? parsed.data.pendingId : "";
  if (!pendingId.startsWith("pending_")) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const pending = getPendingTurn(pendingId);
  if (!pending) {
    res.status(404).json({ error: "Prepared turn not found" });
    return;
  }

  try {
    const result = await pending.promise;
    deletePendingTurn(pendingId);
    res.json(result);
  } catch (err) {
    deletePendingTurn(pendingId);
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
    const episodePlan = createEpisodePlan(parsed.data);
    const episodeId = storeEpisodePlan(episodePlan);
    if (!episodeId) {
      res.status(503).json({
        error: "capacity_reached",
        message: "The Chronicle is holding too many open quest notes right now. Please try again in a moment.",
      });
      return;
    }

    const prompt = buildStartPrompt(parsed.data, episodePlan);
    const raw = await callOpenAI(prompt);
    const data = parseJSON(raw);

    if (!checkStoryTurnSafety(data)) {
      req.log.warn("AI output failed safety check, using fallback");
      res.json({ ...buildGenreFallbackScene(episodePlan), episodeId });
      return;
    }

    const turnData = { ...(data as StoryTurnData), episodeId };
    const image = await maybeGenerateSceneImage({
      context: {
        kind: "intro",
        hero: parsed.data.hero,
        adventureSeed: `${episodePlan.opening.genre}: ${episodePlan.opening.setting}`,
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
    const episodePlan = createEpisodePlan(parsed.data);
    const episodeId = storeEpisodePlan(episodePlan) ?? undefined;
    res.json({ ...buildGenreFallbackScene(episodePlan), episodeId });
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
    !isValidStoryStateText(parsed.data.storySummary, 1600) ||
    (parsed.data.storyHistory !== undefined && parsed.data.storyHistory.length > 12000) ||
    !isValidStoryStateText(parsed.data.chosenAction, 90) ||
    !isValidStoryStateText(parsed.data.mathResult, 160)
  ) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const episodePlan = resolveEpisodePlan(parsed.data, parsed.data.episodeId);
    const prompt = buildTurnPrompt({ ...parsed.data, episodePlan });
    const raw = await callOpenAI(prompt);
    const data = parseJSON(raw);

    if (!checkStoryTurnSafety(data)) {
      req.log.warn("AI output failed safety check, using fallback");
      res.json(buildGenreFallbackScene(episodePlan));
      return;
    }

    const turnData = data as StoryTurnData;
    const image = requestSceneImage({
      context: {
        kind: isMilestoneTurn(parsed.data.turn, parsed.data.maxTurns) ? "milestone" : "scene",
        hero: parsed.data.hero,
        adventureSeed: `${episodePlan.opening.genre}: ${episodePlan.opening.setting}`,
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
    const episodePlan = resolveEpisodePlan(parsed.data, parsed.data.episodeId);
    res.json(buildGenreFallbackScene(episodePlan));
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
    !isValidStoryStateText(parsed.data.storySummary, 1600) ||
    (parsed.data.storyHistory !== undefined && parsed.data.storyHistory.length > 12000)
  ) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const episodePlan = resolveEpisodePlan(parsed.data, parsed.data.episodeId);
    const prompt = buildEndingPrompt({ ...parsed.data, episodePlan });
    const raw = await callOpenAI(prompt);
    const data = parseJSON(raw);

    if (!checkEndingSafety(data)) {
      req.log.warn("AI ending failed safety check, using fallback");
      res.json(buildGenreFallbackEnding(episodePlan));
      return;
    }

    const endingData = data as StoryEndingData;
    const image = await maybeGenerateSceneImage({
      context: {
        kind: "ending",
        hero: parsed.data.hero,
        adventureSeed: `${episodePlan.opening.genre}: ${episodePlan.opening.setting}`,
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
    const episodePlan = resolveEpisodePlan(parsed.data, parsed.data.episodeId);
    res.json(buildGenreFallbackEnding(episodePlan));
  }
});

export default router;
