import { SceneImage as SceneImageType } from "../types";

interface SceneImageProps {
  image: SceneImageType | null;
}

export function SceneImage({ image }: SceneImageProps) {
  if (!image || image.status !== "ready") return null;

  return (
    <figure className="overflow-hidden border-2 border-[var(--mq-border)] bg-[var(--mq-background)] shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
      <img
        src={image.url}
        alt={image.alt}
        className="block w-full max-h-[48vh] object-cover"
        loading="lazy"
      />
    </figure>
  );
}
