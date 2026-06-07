import type { ImageMetadata } from "../../images/imageTypes.js";
import type { FallbackEnding, FallbackScene } from "./storyFallbacks.js";

export type StoryTurnData = FallbackScene & {
  episodeId?: string;
  image?: ImageMetadata;
};

export type StoryEndingData = FallbackEnding & {
  image?: ImageMetadata;
};

export type PreparedTurnResult =
  | { kind: "turn"; turn: number; data: StoryTurnData }
  | { kind: "ending"; turn: number; data: StoryEndingData };
