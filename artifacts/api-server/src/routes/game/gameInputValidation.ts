import { PrepareGameStepBody } from "@workspace/api-zod";
import {
  ALLOWED_ADVENTURE_SEEDS,
  ALLOWED_ANCESTRIES,
  ALLOWED_CLASSES,
  ALLOWED_DIFFICULTIES,
  ALLOWED_HERO_NAMES,
  ALLOWED_MAX_TURNS,
  ALLOWED_PRONOUNS,
} from "./storyPrompt.js";

export type SafeMathSkillMetadata = {
  skillLabel: string;
  problemType: string;
  difficulty: string;
  gradeBand: number;
  storyFlavor: string;
};

function isAllowedString(value: string, allowed: readonly string[]) {
  return allowed.includes(value);
}

export function validateCommonGameInput(data: {
  hero: {
    name: string;
    pronouns: string;
    ancestry: string;
    className: string;
  };
  difficulty: string;
  adventureSeed: string;
  maxTurns: number;
}) {
  return (
    isAllowedString(data.hero.name, ALLOWED_HERO_NAMES) &&
    isAllowedString(data.hero.pronouns, ALLOWED_PRONOUNS) &&
    isAllowedString(data.hero.ancestry, ALLOWED_ANCESTRIES) &&
    isAllowedString(data.hero.className, ALLOWED_CLASSES) &&
    isAllowedString(data.difficulty, ALLOWED_DIFFICULTIES) &&
    isAllowedString(data.adventureSeed, ALLOWED_ADVENTURE_SEEDS) &&
    (ALLOWED_MAX_TURNS as readonly number[]).includes(data.maxTurns)
  );
}

export function isValidStoryStateText(value: string, maxLength: number) {
  return value.trim().length > 0 && value.length <= maxLength;
}

function isHeroInfo(value: unknown): value is {
  name: string;
  pronouns: string;
  ancestry: string;
  className: string;
} {
  if (!value || typeof value !== "object") return false;
  const hero = value as Record<string, unknown>;
  return (
    typeof hero.name === "string" &&
    typeof hero.pronouns === "string" &&
    typeof hero.ancestry === "string" &&
    typeof hero.className === "string"
  );
}

function parseSafeMathSkill(value: unknown): SafeMathSkillMetadata | undefined {
  if (!value || typeof value !== "object") return undefined;
  const data = value as Record<string, unknown>;
  if (
    typeof data.skillLabel !== "string" ||
    typeof data.problemType !== "string" ||
    typeof data.difficulty !== "string" ||
    typeof data.storyFlavor !== "string" ||
    !Number.isInteger(data.gradeBand)
  ) {
    return undefined;
  }

  return {
    skillLabel: data.skillLabel.slice(0, 80),
    problemType: data.problemType.slice(0, 80),
    difficulty: data.difficulty.slice(0, 20),
    gradeBand: data.gradeBand as number,
    storyFlavor: data.storyFlavor.slice(0, 120),
  };
}

export function parsePrepareBody(body: unknown) {
  const parsed = PrepareGameStepBody.safeParse(body);
  if (!parsed.success || !isHeroInfo(parsed.data.hero)) return null;
  const data = parsed.data;

  return {
    kind: data.kind,
    hero: data.hero,
    difficulty: data.difficulty,
    adventureSeed: data.adventureSeed,
    turn: data.turn,
    maxTurns: data.maxTurns,
    episodeId: data.episodeId ? data.episodeId.slice(0, 80) : undefined,
    storySummary: data.storySummary,
    storyHistory: data.storyHistory,
    chosenAction: data.chosenAction,
    lastMathSkill: parseSafeMathSkill(data.lastMathSkill),
    mathSolved: Number.isInteger(data.mathSolved) ? data.mathSolved : undefined,
  };
}

export type ParsedPrepareBody = NonNullable<ReturnType<typeof parsePrepareBody>>;

export function validatePreparedGameInput(data: ParsedPrepareBody) {
  if (
    !validateCommonGameInput(data) ||
    data.turn < 1 ||
    data.turn > data.maxTurns ||
    !isValidStoryStateText(data.storySummary, 1600) ||
    (data.storyHistory !== undefined && data.storyHistory.length > 12000) ||
    !isValidStoryStateText(data.chosenAction, 90)
  ) {
    return false;
  }

  if (data.kind === "ending") {
    return (
      Number.isInteger(data.mathSolved) &&
      data.mathSolved !== undefined &&
      data.mathSolved >= 0 &&
      data.mathSolved <= data.maxTurns
    );
  }

  return true;
}
