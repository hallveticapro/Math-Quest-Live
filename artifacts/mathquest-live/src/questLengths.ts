export type QuestLengthId = "quick" | "standard" | "full";

export type QuestLengthOption = {
  id: QuestLengthId;
  label: string;
  maxTurns: number;
  description: string;
};

export const QUEST_LENGTH_OPTIONS: QuestLengthOption[] = [
  {
    id: "quick",
    label: "Quick Quest",
    maxTurns: 8,
    description: "Short adventure, 8 math-gated chapters.",
  },
  {
    id: "standard",
    label: "Standard Quest",
    maxTurns: 12,
    description: "Balanced adventure, 12 math-gated chapters.",
  },
  {
    id: "full",
    label: "Full Quest",
    maxTurns: 16,
    description: "Longer session, 16 math-gated chapters.",
  },
];

export const DEFAULT_QUEST_LENGTH = QUEST_LENGTH_OPTIONS[1];

export function getQuestLengthByTurns(maxTurns: number) {
  return (
    QUEST_LENGTH_OPTIONS.find((option) => option.maxTurns === maxTurns) ??
    DEFAULT_QUEST_LENGTH
  );
}
