import { useEffect, useState } from "react";
import { SceneImage as SceneImageType } from "../types";

declare global {
  interface Window {
    __MATHQUEST_IMAGE_MAX_POLL_ATTEMPTS__?: number;
    __MATHQUEST_IMAGE_POLL_INTERVAL_MS__?: number;
  }
}

interface SceneImageProps {
  image: SceneImageType | null;
}

const DEFAULT_MAX_POLL_ATTEMPTS = 10;
const DEFAULT_POLL_INTERVAL_MS = 2000;

export function SceneImage({ image }: SceneImageProps) {
  const [resolvedImage, setResolvedImage] = useState<SceneImageType | null>(image);

  useEffect(() => {
    setResolvedImage(image);
    if (!image || image.status !== "pending") return;

    let cancelled = false;
    let attempts = 0;
    const maxPollAttempts = window.__MATHQUEST_IMAGE_MAX_POLL_ATTEMPTS__ ?? DEFAULT_MAX_POLL_ATTEMPTS;
    const pollIntervalMs = window.__MATHQUEST_IMAGE_POLL_INTERVAL_MS__ ?? DEFAULT_POLL_INTERVAL_MS;

    const failPendingImage = () => {
      if (!cancelled) {
        setResolvedImage({
          enabled: true,
          status: "failed",
          error: "image_generation_failed",
        });
      }
    };

    const timer = window.setInterval(async () => {
      attempts += 1;
      try {
        const response = await fetch(image.statusUrl);
        if (!response.ok) throw new Error("Image status unavailable");
        const nextImage = (await response.json()) as SceneImageType;
        if (!cancelled && nextImage.status !== "pending") {
          setResolvedImage(nextImage);
          window.clearInterval(timer);
        }
      } catch {
        failPendingImage();
        window.clearInterval(timer);
      }

      if (attempts >= maxPollAttempts) {
        failPendingImage();
        window.clearInterval(timer);
      }
    }, pollIntervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [image]);

  if (!resolvedImage || resolvedImage.status === "failed") return null;

  if (resolvedImage.status === "pending") {
    return (
      <div
        className="border-2 border-dashed border-[var(--mq-border)] bg-[var(--mq-background)] p-4 text-center text-sm font-bold uppercase tracking-wider text-[var(--mq-text-muted)]"
        role="status"
      >
        Illustration still loading...
      </div>
    );
  }

  return (
    <figure className="overflow-hidden border-2 border-[var(--mq-border)] bg-[var(--mq-background)] shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
      <img
        src={resolvedImage.url}
        alt={resolvedImage.alt}
        className="block w-full max-h-[48vh] object-cover"
        loading="lazy"
      />
    </figure>
  );
}
