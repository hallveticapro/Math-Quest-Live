import crypto from "node:crypto";
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
const imageJobs = new Map<
  string,
  {
    id: string;
    expiresAt: number;
    promise: Promise<ImageMetadata | undefined>;
    result?: ImageMetadata | undefined;
  }
>();
const IMAGE_JOB_TTL_MS = 45 * 60 * 1000;
const COVER_IMAGE_WAIT_TIMEOUT_MS = 30 * 1000;

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

const MAX_IMAGE_JOBS = readPositiveInt(process.env.MAX_IMAGE_JOBS, 120);

function cleanupImageJobs() {
  const now = Date.now();
  for (const [id, job] of imageJobs.entries()) {
    if (job.expiresAt <= now) {
      imageJobs.delete(id);
    }
  }
}

setInterval(cleanupImageJobs, 5 * 60 * 1000).unref();

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

function buildImageJobId(requestKey: string) {
  return `imgjob_${crypto.createHash("sha256").update(requestKey).digest("hex").slice(0, 24)}`;
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

  const timeoutMs = isIntro || isEnding ? COVER_IMAGE_WAIT_TIMEOUT_MS : config.timeoutMs;
  const imagePromise = generateAndStoreSceneImage({ context, turn, timeoutMs });
  inFlightImages.set(requestKey, imagePromise);

  try {
    return await imagePromise;
  } finally {
    inFlightImages.delete(requestKey);
  }
}

export function requestSceneImage({
  context,
  turn,
  maxTurns,
  isIntro = false,
  isEnding = false,
}: ImageServiceRequest): ImageMetadata | undefined {
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

  cleanupImageJobs();
  const requestKey = buildImageRequestKey({ context, turn, maxTurns, isIntro, isEnding });
  const imageJobId = buildImageJobId(requestKey);
  const existing = imageJobs.get(imageJobId);
  if (existing?.result) return existing.result;
  if (existing) {
    return {
      enabled: true,
      status: "pending",
      imageId: imageJobId,
      statusUrl: `/api/images/status/${imageJobId}`,
      alt: buildImageAlt(context),
      provider: config.provider === "openai" ? "openai" : "unsupported",
      model: config.model,
    };
  }

  if (imageJobs.size >= MAX_IMAGE_JOBS) {
    logger.warn(
      { maxImageJobs: MAX_IMAGE_JOBS },
      "Image job capacity reached; skipping optional scene image",
    );
    return { enabled: true, status: "failed", error: "image_generation_failed" };
  }

  const promise = generateAndStoreSceneImage({ context, turn }).then((result) => {
    const job = imageJobs.get(imageJobId);
    if (job) job.result = result;
    return result;
  });

  imageJobs.set(imageJobId, {
    id: imageJobId,
    expiresAt: Date.now() + IMAGE_JOB_TTL_MS,
    promise,
  });

  return {
    enabled: true,
    status: "pending",
    imageId: imageJobId,
    statusUrl: `/api/images/status/${imageJobId}`,
    alt: buildImageAlt(context),
    provider: config.provider === "openai" ? "openai" : "unsupported",
    model: config.model,
  };
}

export async function getImageJobStatus(imageJobId: string): Promise<ImageMetadata | undefined> {
  const job = imageJobs.get(imageJobId);
  if (!job || job.expiresAt <= Date.now()) {
    imageJobs.delete(imageJobId);
    return undefined;
  }

  if (job.result) return job.result;
  const result = await Promise.race([
    job.promise,
    new Promise<"pending">((resolve) => setTimeout(() => resolve("pending"), 50)),
  ]);

  if (result === "pending") {
    return {
      enabled: true,
      status: "pending",
      imageId: imageJobId,
      statusUrl: `/api/images/status/${imageJobId}`,
      alt: "",
      provider: "openai",
      model: getImageConfig().model,
    };
  }

  return result;
}

async function generateAndStoreSceneImage({
  context,
  turn,
  timeoutMs,
}: {
  context: ImageRequestContext;
  turn?: number;
  timeoutMs?: number;
}): Promise<ImageMetadata | undefined> {
  const config = getImageConfig();
  const alt = buildImageAlt(context);
  const prompt = buildImagePrompt(context);
  const imageTimeoutMs = timeoutMs ?? config.timeoutMs;
  const result = await withTimeout(callProvider({ prompt, alt }), imageTimeoutMs);

  if (result === "timeout") {
    logger.warn({ timeoutMs: imageTimeoutMs, kind: context.kind, turn }, "Image generation timed out");
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
