import {
  FL_BEST_MATH_BANDS,
  type DifficultyKey,
  type MathSkill,
  normalizeDifficulty,
} from './math/floridaBestMath';
import {
  DEFAULT_UNIQUE_RETRY_COUNT,
  createProblemSignature,
  randInt,
  uniqueChoices,
  type MathProblem,
  type ProblemGenerator,
} from './math/engineCore';
import { GRADE3_GENERATORS } from './math/generators/grade3';
import { GRADE4_GENERATORS } from './math/generators/grade4';
import { GRADE5_GENERATORS } from './math/generators/grade5';
import { GRADE5_EXTREME_GENERATORS } from './math/generators/grade5Extreme';

export type { MathProblem, RichMathDisplay } from './math/engineCore';

const GENERATORS: Record<string, ProblemGenerator> = {
  ...GRADE3_GENERATORS,
  ...GRADE4_GENERATORS,
  ...GRADE5_GENERATORS,
  ...GRADE5_EXTREME_GENERATORS,
};

function buildProblem(
  difficultyKey: DifficultyKey,
  skill: MathSkill,
): MathProblem {
  const band = FL_BEST_MATH_BANDS[difficultyKey];
  const generator = GENERATORS[skill.generator] ?? GRADE3_GENERATORS.g3MultiplicationFacts;
  const core = generator();
  const choices = uniqueChoices(core.correctAnswer, core.wrongAnswers);
  const signature = createProblemSignature({
    difficulty: band.label,
    benchmark: skill.benchmark,
    skillId: skill.id,
    problemType: skill.generator,
    prompt: core.prompt,
    correctAnswer: core.correctAnswer,
  });

  return {
    prompt: core.prompt,
    choices,
    correctAnswer: core.correctAnswer,
    difficulty: band.label,
    gradeBand: band.gradeBand,
    standardsSystem: band.standardsSystem,
    benchmark: skill.benchmark,
    benchmarkDescription: skill.description,
    officialBenchmark: skill.officialBenchmark,
    domain: skill.domain,
    strand: skill.strand,
    reportingCategory: skill.reportingCategory,
    verificationStatus: skill.verificationStatus,
    sourceNote: skill.sourceNote,
    skill: skill.skill,
    skillLabel: skill.skill,
    skillId: skill.id,
    varietyGroup: skill.varietyGroup ?? skill.id,
    problemType: skill.generator,
    signature,
    hint: core.hint,
    secondHint: core.secondHint,
    richDisplay: core.richDisplay,
  };
}

function getVarietyGroup(skill: MathSkill) {
  return skill.varietyGroup ?? skill.id;
}

export function getEligibleVarietyGroups(difficulty: string): string[] {
  const difficultyKey = normalizeDifficulty(difficulty);
  return [...new Set(FL_BEST_MATH_BANDS[difficultyKey].skills.map(getVarietyGroup))];
}

export function generateMathProblem(
  difficulty: string,
  preferredVarietyGroups?: ReadonlySet<string>,
): MathProblem {
  const difficultyKey = normalizeDifficulty(difficulty);
  const band = FL_BEST_MATH_BANDS[difficultyKey];
  const preferredSkills = preferredVarietyGroups?.size
    ? band.skills.filter((skill) => preferredVarietyGroups.has(getVarietyGroup(skill)))
    : [];
  const skillPool = preferredSkills.length > 0 ? preferredSkills : band.skills;
  const skill = skillPool[randInt(0, skillPool.length - 1)];

  try {
    return buildProblem(difficultyKey, skill);
  } catch {
    return buildProblem(difficultyKey, band.skills[0]);
  }
}

export function generateMathProblemForSkillId(
  difficulty: string,
  skillId: string,
): MathProblem {
  const difficultyKey = normalizeDifficulty(difficulty);
  const band = FL_BEST_MATH_BANDS[difficultyKey];
  const skill = band.skills.find((candidate) => candidate.id === skillId);
  if (!skill) {
    throw new Error(`Unknown math skill "${skillId}" for ${difficultyKey}`);
  }
  return buildProblem(difficultyKey, skill);
}

export function generateUniqueMathProblem(
  difficulty: string,
  usedSignatures: ReadonlySet<string>,
  usedVarietyGroupsOrMaxRetries?: ReadonlySet<string> | number,
  maxRetries = DEFAULT_UNIQUE_RETRY_COUNT,
  recentDomains: readonly string[] = [],
): MathProblem {
  let lastProblem: MathProblem | null = null;
  const retryCount =
    typeof usedVarietyGroupsOrMaxRetries === "number"
      ? usedVarietyGroupsOrMaxRetries
      : maxRetries;
  const usedVarietyGroups =
    typeof usedVarietyGroupsOrMaxRetries === "number"
      ? undefined
      : usedVarietyGroupsOrMaxRetries;
  const difficultyKey = normalizeDifficulty(difficulty);
  const band = FL_BEST_MATH_BANDS[difficultyKey];
  const unusedGroups = usedVarietyGroups
    ? new Set(
        band.skills
          .map(getVarietyGroup)
          .filter((group) => !usedVarietyGroups.has(group)),
      )
    : undefined;
  const recentDomainSet = new Set(recentDomains.filter(Boolean));
  const unusedGroupsOutsideRecentDomains =
    usedVarietyGroups && recentDomainSet.size > 0
      ? new Set(
          band.skills
            .filter(
              (skill) =>
                !usedVarietyGroups.has(getVarietyGroup(skill)) &&
                !recentDomainSet.has(skill.domain),
            )
            .map(getVarietyGroup),
        )
      : undefined;
  const preferredGroups =
    unusedGroupsOutsideRecentDomains && unusedGroupsOutsideRecentDomains.size > 0
      ? unusedGroupsOutsideRecentDomains
      : unusedGroups && unusedGroups.size > 0
        ? unusedGroups
        : undefined;

  for (let attempt = 0; attempt < retryCount; attempt += 1) {
    const problem = generateMathProblem(difficulty, preferredGroups);
    lastProblem = problem;

    if (!usedSignatures.has(problem.signature)) {
      return problem;
    }
  }

  console.warn(
    `Unable to find a unique ${difficulty} math problem after ${retryCount} attempts. Reusing the last generated problem.`,
  );
  return lastProblem ?? generateMathProblem(difficulty);
}

export function generateRecoveryProblem(difficulty: string): MathProblem {
  const diffMap: Record<DifficultyKey, DifficultyKey> = {
    extreme: "hard",
    hard: "medium",
    medium: "easy",
    easy: "easy",
  };
  return generateMathProblem(
    FL_BEST_MATH_BANDS[diffMap[normalizeDifficulty(difficulty)]].label,
  );
}

export function generateUniqueRecoveryProblem(
  difficulty: string,
  usedSignatures: ReadonlySet<string>,
  usedVarietyGroupsOrMaxRetries?: ReadonlySet<string> | number,
  maxRetries = DEFAULT_UNIQUE_RETRY_COUNT,
  recentDomains: readonly string[] = [],
): MathProblem {
  const diffMap: Record<DifficultyKey, DifficultyKey> = {
    extreme: "hard",
    hard: "medium",
    medium: "easy",
    easy: "easy",
  };
  const recoveryDifficulty =
    FL_BEST_MATH_BANDS[diffMap[normalizeDifficulty(difficulty)]].label;
  return generateUniqueMathProblem(
    recoveryDifficulty,
    usedSignatures,
    usedVarietyGroupsOrMaxRetries,
    maxRetries,
    recentDomains,
  );
}

