import { requireOpenAI } from "../../lib/openaiClient";
import { logger } from "../../lib/logger";
import type { ImageConfig } from "../imageConfig";
import type { ProviderImageResult } from "../imageTypes";

type OpenAIImageData = {
  b64_json?: string;
  url?: string;
};

export async function generateOpenAIImage({
  prompt,
  alt,
  config,
}: {
  prompt: string;
  alt: string;
  config: ImageConfig;
}): Promise<ProviderImageResult> {
  try {
    const openai = requireOpenAI();
    const response = await openai.images.generate({
      model: config.model,
      prompt,
      n: 1,
      size: config.size,
      quality: config.quality,
      output_format: "png",
      moderation: "auto",
    } as never);

    const image = response.data?.[0] as OpenAIImageData | undefined;
    if (!image?.b64_json) {
      return { success: false, error: "image_generation_failed" };
    }

    return {
      success: true,
      buffer: Buffer.from(image.b64_json, "base64"),
      contentType: "image/png",
      alt,
      provider: "openai",
      model: config.model,
    };
  } catch (err) {
    logger.warn({ err }, "OpenAI image generation failed");
    return { success: false, error: "image_generation_failed" };
  }
}
