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
  if (imageMode === "cover_outro") return isIntro || isEnding;
  if (imageMode === "every_scene") return isIntro || isEnding || Number.isInteger(turn);

  if (imageMode === "milestones") {
    if (isIntro || isEnding) return true;
    if (typeof turn !== "number" || !Number.isInteger(turn)) return false;
    // Milestone illustrations are intentionally frequent enough to show up in
    // quick 5-turn quests without becoming an every-scene image mode.
    return turn > 0 && turn <= maxTurns && turn % 2 === 0;
  }

  return false;
}
