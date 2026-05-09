import type { ImageMode } from "./imageConfig";

export type ImageMoment = {
  imageMode: ImageMode;
  enabled: boolean;
  turn?: number;
  maxTurns: number;
  isIntro?: boolean;
  isEnding?: boolean;
};

export function shouldGenerateImage({
  imageMode,
  enabled,
  turn,
  maxTurns,
  isIntro = false,
  isEnding = false,
}: ImageMoment) {
  if (!enabled || imageMode === "off") return false;
  if (imageMode === "cover") return isIntro;
  if (imageMode === "every_scene") return isIntro || isEnding || Number.isInteger(turn);

  if (imageMode === "milestones") {
    if (isIntro || isEnding) return true;
    if (!Number.isInteger(turn)) return false;
    return turn === Math.ceil(maxTurns / 2);
  }

  return false;
}
