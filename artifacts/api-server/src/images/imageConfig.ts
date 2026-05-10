import { logger } from "../lib/logger";

export type ImageMode = "off" | "cover" | "cover_outro" | "milestones" | "every_scene";
export type ImageProviderName = "openai";
export type ImageQuality = "low" | "medium" | "high";
export type ImageSize = "1024x1024" | "1024x1536" | "1536x1024";
export type ImageStyle = "cartoon-fantasy";
export type ImageStorageMode = "memory";

export type ImageConfig = {
  enabled: boolean;
  mode: ImageMode;
  provider: ImageProviderName | "unsupported";
  model: string;
  quality: ImageQuality;
  size: ImageSize;
  style: ImageStyle;
  timeoutMs: number;
  storageMode: ImageStorageMode;
};

const IMAGE_MODES = new Set<ImageMode>(["off", "cover", "cover_outro", "milestones", "every_scene"]);
const IMAGE_QUALITIES = new Set<ImageQuality>(["low", "medium", "high"]);
const IMAGE_SIZES = new Set<ImageSize>(["1024x1024", "1024x1536", "1536x1024"]);
const IMAGE_STYLES = new Set<ImageStyle>(["cartoon-fantasy"]);
const IMAGE_STORAGE_MODES = new Set<ImageStorageMode>(["memory"]);

function readBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function readEnum<T extends string>(value: string | undefined, allowed: Set<T>, fallback: T) {
  if (!value) return fallback;
  const normalized = value.toLowerCase() as T;
  return allowed.has(normalized) ? normalized : fallback;
}

function readTimeoutMs(value: string | undefined) {
  const parsed = Number(value ?? "45000");
  if (!Number.isFinite(parsed) || parsed < 1000 || parsed > 120000) {
    return 45000;
  }
  return parsed;
}

export function getImageConfig(): ImageConfig {
  const providerValue = (process.env.IMAGE_PROVIDER ?? "openai").toLowerCase();
  const provider = providerValue === "openai" ? "openai" : "unsupported";

  if (provider === "unsupported" && readBoolean(process.env.ENABLE_IMAGE_GENERATION, false)) {
    logger.warn({ provider: providerValue }, "Unsupported image provider configured; image generation disabled");
  }

  return {
    enabled: readBoolean(process.env.ENABLE_IMAGE_GENERATION, false) && provider !== "unsupported",
    mode: readEnum(process.env.IMAGE_MODE, IMAGE_MODES, "cover_outro"),
    provider,
    model: process.env.IMAGE_MODEL || "gpt-image-1-mini",
    quality: readEnum(process.env.IMAGE_QUALITY, IMAGE_QUALITIES, "medium"),
    size: readEnum(process.env.IMAGE_SIZE, IMAGE_SIZES, "1024x1024"),
    style: readEnum(process.env.IMAGE_STYLE, IMAGE_STYLES, "cartoon-fantasy"),
    timeoutMs: readTimeoutMs(process.env.IMAGE_TIMEOUT_MS),
    storageMode: readEnum(process.env.IMAGE_STORAGE_MODE, IMAGE_STORAGE_MODES, "memory"),
  };
}
