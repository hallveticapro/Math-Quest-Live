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
    maxTurns: 5,
    description: "Short review, about 5 math challenges.",
  },
  {
    id: "standard",
    label: "Standard Quest",
    maxTurns: 8,
    description: "Balanced adventure, about 8 math challenges.",
  },
  {
    id: "full",
    label: "Full Quest",
    maxTurns: 10,
    description: "Longer session, about 10 math challenges.",
  },
];

export const DEFAULT_QUEST_LENGTH = QUEST_LENGTH_OPTIONS[1];

export function getQuestLengthByTurns(maxTurns: number) {
  return (
    QUEST_LENGTH_OPTIONS.find((option) => option.maxTurns === maxTurns) ??
    DEFAULT_QUEST_LENGTH
  );
}
