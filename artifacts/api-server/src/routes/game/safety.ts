const BANNED_WORDS = [
  "gore", "bleed", "stabbed", "gunshot", "murder",
  "sexual", "naked", "nude",
  "alcohol", "beer", "wine", "drunk", "vaping",
  "racist", "bullying",
  "profanity", "explicit",
  "self-harm", "suicide",
  "nightmare", "horrifying", "terrifying",
];

export function checkSafety(text: string): boolean {
  const lower = text.toLowerCase();
  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(lower)) {
      return false;
    }
  }
  return true;
}

export function checkStoryTurnSafety(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  if (typeof d.sceneTitle !== "string") return false;
  if (typeof d.storyText !== "string") return false;
  if (!Array.isArray(d.choices) || d.choices.length !== 3) return false;
  if (d.safetyRating !== "kid_safe") return false;

  for (const choice of d.choices as unknown[]) {
    if (typeof choice !== "object" || choice === null) return false;
    const c = choice as Record<string, unknown>;
    if (!["A", "B", "C"].includes(c.id as string)) return false;
    if (typeof c.label !== "string") return false;
    if ((c.label as string).length > 90) return false;
  }

  if (!checkSafety(d.sceneTitle as string)) return false;
  if (!checkSafety(d.storyText as string)) return false;

  for (const choice of d.choices as Array<Record<string, unknown>>) {
    if (!checkSafety(choice.label as string)) return false;
  }

  if (d.storyText && (d.storyText as string).length > 2000) return false;

  return true;
}

export function checkEndingSafety(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  if (typeof d.endingTitle !== "string") return false;
  if (typeof d.endingText !== "string") return false;
  if (typeof d.badge !== "string") return false;
  if (d.safetyRating !== "kid_safe") return false;

  if (!checkSafety(d.endingTitle as string)) return false;
  if (!checkSafety(d.endingText as string)) return false;

  return true;
}
