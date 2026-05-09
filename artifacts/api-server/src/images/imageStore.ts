import crypto from "node:crypto";
import type { StoredImage } from "./imageTypes";

const DEFAULT_TTL_MS = 45 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

const images = new Map<string, StoredImage>();

function cleanupExpiredImages() {
  const now = Date.now();
  for (const [id, image] of images.entries()) {
    if (image.expiresAt <= now) {
      images.delete(id);
    }
  }
}

setInterval(cleanupExpiredImages, CLEANUP_INTERVAL_MS).unref();

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
