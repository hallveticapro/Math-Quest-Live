import { DIFFICULTY_OPTIONS } from "./math/floridaBestMath";
import { generateMathProblem } from "./mathEngine";

const SAMPLE_COUNT = 20;

function assertValid(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const difficulty of DIFFICULTY_OPTIONS) {
  console.log(`\n${difficulty.label} (${difficulty.displayName}) - ${difficulty.description}`);

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const problem = generateMathProblem(difficulty.value);
    const uniqueChoices = new Set(problem.choices);

    assertValid(problem.difficulty === difficulty.label, `${difficulty.label}: difficulty mismatch`);
    assertValid(problem.gradeBand === difficulty.gradeBand, `${difficulty.label}: gradeBand mismatch`);
    assertValid(Boolean(problem.benchmark), `${difficulty.label}: missing benchmark`);
    assertValid(Boolean(problem.benchmarkDescription), `${difficulty.label}: missing benchmark description`);
    assertValid(Boolean(problem.skill), `${difficulty.label}: missing skill`);
    assertValid(problem.standardsSystem === "Florida B.E.S.T. Mathematics", `${difficulty.label}: standards system mismatch`);
    assertValid(problem.choices.length === 4, `${difficulty.label}: expected 4 choices`);
    assertValid(uniqueChoices.size === 4, `${difficulty.label}: choices must be unique`);
    assertValid(problem.choices.includes(problem.correctAnswer), `${difficulty.label}: correct answer missing from choices`);

    if (i === 0) {
      console.log({
        prompt: problem.prompt,
        choices: problem.choices,
        correctAnswer: problem.correctAnswer,
        difficulty: problem.difficulty,
        gradeBand: problem.gradeBand,
        benchmark: problem.benchmark,
        skill: problem.skill,
      });
    }
  }
}

console.log(`\nValidated ${SAMPLE_COUNT} generated problems for each difficulty.`);
