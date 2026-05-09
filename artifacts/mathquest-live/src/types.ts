import type { ColorSchemeId } from "./colorSchemes";

export type Screen = 'title' | 'setup' | 'game' | 'ending';

export type Hero = {
  name: string;
  pronouns: string;
  ancestry: string;
  className: string;
};

import { MathProblem } from "./mathEngine";

export type SceneImage = {
  enabled: true;
  status: "ready";
  imageId: string;
  url: string;
  alt: string;
  provider: string;
  model: string;
};

export type GameState = {
  screen: Screen;
  hero: Hero;
  difficulty: string;
  adventureSeed: string;
  colorSchemeId: ColorSchemeId;
  turn: number;
  maxTurns: number;
  mathSolved: number;
  storySummary: string;
  sceneTitle: string;
  storyText: string;
  illustration: SceneImage | null;
  choices: Array<{ id: string; label: string }>;
  currentMathProblem: MathProblem | null;
  chosenAction: string | null;
  isLoading: boolean;
  endingTitle: string;
  endingText: string;
  badge: string;
  wrongAttempts: number;
  showHint: boolean;
  recoveryMode: boolean;
};

export const INITIAL_STATE: GameState = {
  screen: 'title',
  hero: { name: "", pronouns: "", ancestry: "", className: "" },
  difficulty: "Medium",
  adventureSeed: "Random",
  colorSchemeId: "arcaneMidnight",
  turn: 1,
  maxTurns: 8,
  mathSolved: 0,
  storySummary: "",
  sceneTitle: "",
  storyText: "",
  illustration: null,
  choices: [],
  currentMathProblem: null,
  chosenAction: null,
  isLoading: false,
  endingTitle: "",
  endingText: "",
  badge: "",
  wrongAttempts: 0,
  showHint: false,
  recoveryMode: false,
};
