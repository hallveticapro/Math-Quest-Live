export type HeroImageContext = {
  name: string;
  pronouns: string;
  ancestry: string;
  className: string;
};

export type ImageRequestContext = {
  kind: "intro" | "milestone" | "ending" | "scene";
  hero: HeroImageContext;
  adventureSeed: string;
  difficulty: string;
  sceneTitle: string;
  storyText?: string;
  storySummary?: string;
  chosenAction?: string;
};

export type StoredImage = {
  id: string;
  buffer: Buffer;
  contentType: string;
  alt: string;
  createdAt: number;
  expiresAt: number;
};

export type ReadyImageMetadata = {
  enabled: true;
  status: "ready";
  imageId: string;
  url: string;
  alt: string;
  provider: string;
  model: string;
};

export type PendingImageMetadata = {
  enabled: true;
  status: "pending";
  imageId: string;
  statusUrl: string;
  alt: string;
  provider: string;
  model: string;
};

export type FailedImageMetadata = {
  enabled: true;
  status: "failed";
  error: "image_generation_failed";
};

export type ImageMetadata =
  | ReadyImageMetadata
  | PendingImageMetadata
  | FailedImageMetadata;

export type ProviderImageResult =
  | {
      success: true;
      buffer: Buffer;
      contentType: string;
      alt: string;
      provider: string;
      model: string;
    }
  | {
      success: false;
      error: "image_generation_failed";
    };
