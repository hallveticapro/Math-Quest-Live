import crypto from "node:crypto";
import type { StoredImage } from "./imageTypes";

const DEFAULT_TTL_MS = 45 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

const images = new Map<string, StoredImage>();

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

const MAX_STORED_IMAGES = readPositiveInt(process.env.MAX_STORED_IMAGES, 120);

function cleanupExpiredImages() {
  const now = Date.now();
  for (const [id, image] of images.entries()) {
    if (image.expiresAt <= now) {
      images.delete(id);
    }
  }
}

setInterval(cleanupExpiredImages, CLEANUP_INTERVAL_MS).unref();

function pruneOldestImagesToCapacity() {
  while (images.size >= MAX_STORED_IMAGES) {
    let oldestId: string | undefined;
    let oldestCreatedAt = Number.POSITIVE_INFINITY;

    for (const [id, image] of images.entries()) {
      if (image.createdAt < oldestCreatedAt) {
        oldestId = id;
        oldestCreatedAt = image.createdAt;
      }
    }

    if (!oldestId) return;
    images.delete(oldestId);
  }
}

export function storeImage({
  buffer,
  contentType,
  alt,
  ttlMs = DEFAULT_TTL_MS,
}: {
  buffer: Buffer;
  contentType: string;
  alt: string;
  ttlMs?: number;
}) {
  cleanupExpiredImages();
  pruneOldestImagesToCapacity();
  const id = `img_${crypto.randomUUID()}`;
  const now = Date.now();
  images.set(id, {
    id,
    buffer,
    contentType,
    alt,
    createdAt: now,
    expiresAt: now + ttlMs,
  });
  return id;
}

export function getStoredImage(id: string) {
  const image = images.get(id);
  if (!image) return null;

  if (image.expiresAt <= Date.now()) {
    images.delete(id);
    return null;
  }

  return image;
}
