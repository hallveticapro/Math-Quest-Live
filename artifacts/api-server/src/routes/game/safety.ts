const BANNED_WORDS = [
  "gore", "bloody", "bloodshed", "bleed", "bleeding", "stab", "stabbed",
  "gun", "gunshot", "rifle", "pistol", "weapon", "murder", "kill", "killed",
  "death", "dead", "die", "dies", "died",
  "romance", "romantic", "kiss", "dating", "crush",
  "sexual", "sex", "naked", "nude",
  "profanity", "explicit", "curse word",
  "horror", "nightmare", "horrifying", "terrifying",
  "bully", "bullied", "bullying", "racist", "stereotype",
  "politics", "political", "election", "president", "religion", "religious",
  "drug", "drugs", "alcohol", "beer", "wine", "drunk", "smoking", "vape",
  "vaping",
  "self-harm", "suicide",
  "address", "phone number", "email", "real name", "last name",
];

const MAX_TITLE_LENGTH = 100;
const MAX_STORY_LENGTH = 2000;
const MAX_SUMMARY_LENGTH = 600;
const MAX_ENDING_LENGTH = 2200;
const MAX_BADGE_LENGTH = 60;

function isSafeString(value: unknown, maxLength: number): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.length > maxLength) return false;
  return checkSafety(trimmed);
}

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

  if (!isSafeString(d.sceneTitle, MAX_TITLE_LENGTH)) return false;
  if (!isSafeString(d.storyText, MAX_STORY_LENGTH)) return false;
  if (!isSafeString(d.storySummary, MAX_SUMMARY_LENGTH)) return false;
  if (!Array.isArray(d.choices) || d.choices.length !== 3) return false;
  if (d.safetyRating !== "kid_safe") return false;

  const expectedIds = ["A", "B", "C"];
  const seenIds = new Set<string>();

  for (const [index, choice] of (d.choices as unknown[]).entries()) {
    if (typeof choice !== "object" || choice === null) return false;
    const c = choice as Record<string, unknown>;
    if (c.id !== expectedIds[index]) return false;
    if (seenIds.has(c.id)) return false;
    seenIds.add(c.id);
    if (!isSafeString(c.label, 90)) return false;
  }

  return true;
}

export function checkEndingSafety(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;

  if (!isSafeString(d.endingTitle, MAX_TITLE_LENGTH)) return false;
  if (!isSafeString(d.endingText, MAX_ENDING_LENGTH)) return false;
  if (!isSafeString(d.badge, MAX_BADGE_LENGTH)) return false;
  if (d.safetyRating !== "kid_safe") return false;

  return true;
}
