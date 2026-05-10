import {
  ADVENTURE_SEEDS,
  HERO_ANCESTRIES,
  HERO_CLASSES,
  HERO_NAMES,
  HERO_PRONOUNS,
  QUICK_START_SEEDS,
} from "./adventureOptions";
import {
  COLOR_SCHEMES,
  DEFAULT_COLOR_SCHEME_ID,
  type ColorSchemeId,
} from "./colorSchemes";
import { QUEST_LENGTH_OPTIONS } from "./questLengths";
import type { Hero } from "./types";

export type QuickStartSession = {
  hero: Hero;
  difficulty: string;
  adventureSeed: string;
  maxTurns: number;
  colorSchemeId: ColorSchemeId;
};

function pickRandom<T>(items: readonly T[], avoid?: (item: T) => boolean): T {
  const pool = avoid ? items.filter((item) => !avoid(item)) : [...items];
  const source = pool.length > 0 ? pool : items;
  return source[Math.floor(Math.random() * source.length)];
}

export function buildQuickStartSession(
  difficulty: string,
  maxTurns: number,
  previous?: QuickStartSession | null,
): QuickStartSession {
  const previousPair = previous
    ? `${previous.hero.ancestry}|${previous.hero.className}`
    : "";

  const ancestry = pickRandom(HERO_ANCESTRIES);
  const className = pickRandom(
    HERO_CLASSES,
    (option) => `${ancestry}|${option}` === previousPair,
  );
  const questLength =
    QUEST_LENGTH_OPTIONS.find((option) => option.maxTurns === maxTurns) ??
    QUEST_LENGTH_OPTIONS[1];
  const seedPool = QUICK_START_SEEDS.length > 0 ? QUICK_START_SEEDS : ADVENTURE_SEEDS;
  const adventureSeed = pickRandom(
    seedPool,
    (option) => option === previous?.adventureSeed,
  );
  const colorScheme = pickRandom(
    COLOR_SCHEMES,
    (option) => option.id === previous?.colorSchemeId,
  );

  return {
    hero: {
      name: pickRandom(HERO_NAMES, (option) => option === previous?.hero.name),
      pronouns: pickRandom(HERO_PRONOUNS),
      ancestry,
      className,
    },
    difficulty,
    adventureSeed,
    maxTurns: questLength.maxTurns,
    colorSchemeId: colorScheme?.id ?? DEFAULT_COLOR_SCHEME_ID,
  };
}
