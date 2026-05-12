import { DIFFICULTY_OPTIONS } from "./math/floridaBestMath";
import {
  generateMathProblemForSkillId,
  generateUniqueMathProblem,
} from "./mathEngine";

const SAMPLE_COUNT = 20;
const PER_SKILL_SAMPLE_COUNT = 12;
const DUPLICATE_CHOICE_STRESS_COUNT = 120;

function assertValid(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNoDenominatorOneText(skillId: string, label: string, value: string) {
  assertValid(
    !/(^|[^\d])\d+\/1($|[^\d])/.test(value),
    `${skillId}: ${label} contains a student-facing denominator of 1: ${value}`,
  );
}

function numberFromUnitAnswer(value: string) {
  const match = value.match(/-?\d+/);
  return match ? Number(match[0]) : Number.NaN;
}

function assertModeProblemIsValid(skillId: string, problem: { prompt: string; correctAnswer: string; richDisplay?: Array<{ type: string; rows?: Array<Array<number | string>> }> }) {
  if (!/\bmode\b/i.test(problem.prompt)) return;
  const table = problem.richDisplay?.find((item) => item.type === "table");
  const values = table?.rows
    ?.map((row) => Number(row[1]))
    .filter((value) => Number.isFinite(value));
  assertValid(Boolean(values?.length), `${skillId}: mode problem missing data table`);

  const counts = new Map<number, number>();
  for (const value of values ?? []) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const maxCount = Math.max(...counts.values());
  const modes = [...counts.entries()]
    .filter(([, count]) => count === maxCount && count > 1)
    .map(([value]) => value);
  const answer = numberFromUnitAnswer(problem.correctAnswer);

  assertValid(
    modes.length === 1 && modes[0] === answer,
    `${skillId}: mode problem does not have a unique repeated mode matching the answer`,
  );
}

for (const difficulty of DIFFICULTY_OPTIONS) {
  console.log(
    `\n${difficulty.label} (${difficulty.internalLabel}) - ${difficulty.description}`,
  );
  const usedSignatures = new Set<string>();

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const problem = generateUniqueMathProblem(difficulty.value, usedSignatures);
    const uniqueChoices = new Set(problem.choices);

    assertValid(
      problem.difficulty === difficulty.internalLabel,
      `${difficulty.label}: difficulty mismatch`,
    );
    assertValid(
      problem.gradeBand === difficulty.gradeBand,
      `${difficulty.label}: gradeBand mismatch`,
    );
    assertValid(
      Boolean(problem.benchmark),
      `${difficulty.label}: missing benchmark`,
    );
    assertValid(
      Boolean(problem.benchmarkDescription),
      `${difficulty.label}: missing benchmark description`,
    );
    assertValid(
      Boolean(problem.officialBenchmark),
      `${difficulty.label}: missing official benchmark wording`,
    );
    assertValid(Boolean(problem.domain), `${difficulty.label}: missing domain`);
    assertValid(Boolean(problem.strand), `${difficulty.label}: missing strand`);
    assertValid(
      Boolean(problem.reportingCategory),
      `${difficulty.label}: missing reporting category`,
    );
    assertValid(
      Boolean(problem.verificationStatus),
      `${difficulty.label}: missing verification status`,
    );
    assertValid(
      Boolean(problem.sourceNote),
      `${difficulty.label}: missing source note`,
    );
    assertValid(Boolean(problem.skill), `${difficulty.label}: missing skill`);
    assertValid(
      Boolean(problem.skillId),
      `${difficulty.label}: missing skillId`,
    );
    assertValid(
      Boolean(problem.problemType),
      `${difficulty.label}: missing problemType`,
    );
    assertValid(
      Boolean(problem.varietyGroup),
      `${difficulty.label}: missing varietyGroup`,
    );
    assertValid(Boolean(problem.hint), `${difficulty.label}: missing hint`);
    assertValid(
      Boolean(problem.secondHint),
      `${difficulty.label}: missing second hint`,
    );
    assertValid(
      Boolean(problem.signature),
      `${difficulty.label}: missing signature`,
    );
    assertValid(
      !usedSignatures.has(problem.signature),
      `${difficulty.label}: duplicate signature ${problem.signature}`,
    );
    assertValid(
      problem.standardsSystem === "Florida B.E.S.T. Mathematics",
      `${difficulty.label}: standards system mismatch`,
    );
    assertValid(
      problem.choices.length === 4,
      `${difficulty.label}: expected 4 choices`,
    );
    assertValid(
      uniqueChoices.size === 4,
      `${difficulty.label}: choices must be unique`,
    );
    assertValid(
      problem.choices.includes(problem.correctAnswer),
      `${difficulty.label}: correct answer missing from choices`,
    );
    assertNoDenominatorOneText(problem.skillId, "prompt", problem.prompt);
    assertNoDenominatorOneText(problem.skillId, "correct answer", problem.correctAnswer);
    assertNoDenominatorOneText(problem.skillId, "hint", problem.hint);
    assertNoDenominatorOneText(problem.skillId, "second hint", problem.secondHint);
    for (const choice of problem.choices) {
      assertNoDenominatorOneText(problem.skillId, "choice", choice);
    }
    assertModeProblemIsValid(problem.skillId, problem);
    usedSignatures.add(problem.signature);

    if (i === 0) {
      console.log({
        prompt: problem.prompt,
        choices: problem.choices,
        correctAnswer: problem.correctAnswer,
        difficulty: problem.difficulty,
        gradeBand: problem.gradeBand,
        benchmark: problem.benchmark,
        benchmarkDescription: problem.benchmarkDescription,
        officialBenchmark: problem.officialBenchmark,
        verificationStatus: problem.verificationStatus,
        skill: problem.skill,
        skillId: problem.skillId,
        problemType: problem.problemType,
        varietyGroup: problem.varietyGroup,
        hint: problem.hint,
        secondHint: problem.secondHint,
        signature: problem.signature,
      });
    }
  }
}

console.log(
  `\nValidated ${SAMPLE_COUNT} generated problems for each difficulty.`,
);

for (const difficulty of DIFFICULTY_OPTIONS) {
  console.log(`\nPer-generator validation for ${difficulty.label}`);
  for (const skill of difficulty.skills) {
    for (let i = 0; i < PER_SKILL_SAMPLE_COUNT; i += 1) {
      const problem = generateMathProblemForSkillId(difficulty.value, skill.id);
      const uniqueChoices = new Set(problem.choices);

      assertValid(
        problem.skillId === skill.id,
        `${skill.id}: generated wrong skill id ${problem.skillId}`,
      );
      assertValid(Boolean(problem.prompt), `${skill.id}: missing prompt`);
      assertValid(Boolean(problem.correctAnswer), `${skill.id}: missing answer`);
      assertValid(problem.choices.length === 4, `${skill.id}: expected 4 choices`);
      assertValid(uniqueChoices.size === 4, `${skill.id}: duplicate choices`);
      assertValid(
        problem.choices.includes(problem.correctAnswer),
        `${skill.id}: correct answer missing`,
      );
      assertValid(Boolean(problem.hint), `${skill.id}: missing hint`);
      assertValid(Boolean(problem.secondHint), `${skill.id}: missing second hint`);
      assertValid(Boolean(problem.signature), `${skill.id}: missing signature`);
      assertNoDenominatorOneText(skill.id, "prompt", problem.prompt);
      assertNoDenominatorOneText(skill.id, "correct answer", problem.correctAnswer);
      assertNoDenominatorOneText(skill.id, "hint", problem.hint);
      assertNoDenominatorOneText(skill.id, "second hint", problem.secondHint);
      for (const choice of problem.choices) {
        assertNoDenominatorOneText(skill.id, "choice", choice);
      }
      assertModeProblemIsValid(skill.id, problem);
    }
  }
}

for (const difficulty of DIFFICULTY_OPTIONS) {
  for (const skill of difficulty.skills) {
    for (let i = 0; i < DUPLICATE_CHOICE_STRESS_COUNT; i += 1) {
      const problem = generateMathProblemForSkillId(difficulty.value, skill.id);
      const uniqueChoices = new Set(problem.choices);
      assertValid(
        uniqueChoices.size === problem.choices.length,
        `${skill.id}: duplicate answer choices survived stress validation`,
      );
    }
  }
}

console.log(
  `Validated every generator with ${PER_SKILL_SAMPLE_COUNT} samples and ${DUPLICATE_CHOICE_STRESS_COUNT} duplicate-choice stress samples.`,
);
