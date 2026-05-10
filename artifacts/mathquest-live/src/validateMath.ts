import { DIFFICULTY_OPTIONS } from "./math/floridaBestMath";
import { generateUniqueMathProblem } from "./mathEngine";

const SAMPLE_COUNT = 20;

function assertValid(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const difficulty of DIFFICULTY_OPTIONS) {
  console.log(
    `\n${difficulty.label} (${difficulty.displayName}) - ${difficulty.description}`,
  );
  const usedSignatures = new Set<string>();

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const problem = generateUniqueMathProblem(difficulty.value, usedSignatures);
    const uniqueChoices = new Set(problem.choices);

    assertValid(
      problem.difficulty === difficulty.label,
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
