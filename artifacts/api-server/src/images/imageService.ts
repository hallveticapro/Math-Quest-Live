import { logger } from "../lib/logger";
import { getImageConfig } from "./imageConfig";
import { shouldGenerateImage } from "./imageModes";
import { buildImageAlt, buildImagePrompt } from "./imagePrompt";
import { storeImage } from "./imageStore";
import { generateOpenAIImage } from "./providers/openaiImageProvider";
import type { ImageMetadata, ImageRequestContext, ProviderImageResult } from "./imageTypes";

type ImageServiceRequest = {
  context: ImageRequestContext;
  turn?: number;
  maxTurns: number;
  isIntro?: boolean;
  isEnding?: boolean;
};

const inFlightImages = new Map<string, Promise<ImageMetadata | undefined>>();

function buildImageRequestKey({
  context,
  turn,
  maxTurns,
  isIntro = false,
  isEnding = false,
}: ImageServiceRequest) {
  return [
    context.kind,
    context.hero.name,
    context.hero.ancestry,
    context.hero.className,
    context.adventureSeed,
    context.difficulty,
    context.sceneTitle,
    turn ?? "intro",
    maxTurns,
    isIntro ? "intro" : "",
    isEnding ? "ending" : "",
  ].join("|");
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | "timeout"> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<"timeout">((resolve) => {
    timer = setTimeout(() => resolve("timeout"), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function callProvider({
  prompt,
  alt,
}: {
  prompt: string;
  alt: string;
}): Promise<ProviderImageResult> {
  const config = getImageConfig();

  if (config.provider === "openai") {
    return generateOpenAIImage({ prompt, alt, config });
  }

  logger.warn({ provider: config.provider }, "No image provider available");
  return { success: false, error: "image_generation_failed" };
}

export async function maybeGenerateSceneImage({
  context,
  turn,
  maxTurns,
  isIntro = false,
  isEnding = false,
}: ImageServiceRequest): Promise<ImageMetadata | undefined> {
  const config = getImageConfig();
  const shouldGenerate = shouldGenerateImage({
    enabled: config.enabled,
    imageMode: config.mode,
    turn,
    maxTurns,
    isIntro,
    isEnding,
  });

  if (!shouldGenerate) return undefined;

  const requestKey = buildImageRequestKey({ context, turn, maxTurns, isIntro, isEnding });
  const inFlight = inFlightImages.get(requestKey);
  if (inFlight) return inFlight;

  const imagePromise = generateAndStoreSceneImage({ context, turn });
  inFlightImages.set(requestKey, imagePromise);

  try {
    return await imagePromise;
  } finally {
    inFlightImages.delete(requestKey);
  }
}

async function generateAndStoreSceneImage({
  context,
  turn,
}: {
  context: ImageRequestContext;
  turn?: number;
}): Promise<ImageMetadata | undefined> {
  const config = getImageConfig();
  const alt = buildImageAlt(context);
  const prompt = buildImagePrompt(context);
  const result = await withTimeout(callProvider({ prompt, alt }), config.timeoutMs);

  if (result === "timeout") {
    logger.warn({ timeoutMs: config.timeoutMs, kind: context.kind, turn }, "Image generation timed out");
    return { enabled: true, status: "failed", error: "image_generation_failed" };
  }

  if (!result.success) {
    return { enabled: true, status: "failed", error: "image_generation_failed" };
  }

  const imageId = storeImage({
    buffer: result.buffer,
    contentType: result.contentType,
    alt: result.alt,
  });

  return {
    enabled: true,
    status: "ready",
    imageId,
    url: `/api/images/${imageId}`,
    alt: result.alt,
    provider: result.provider,
    model: result.model,
  };
}
