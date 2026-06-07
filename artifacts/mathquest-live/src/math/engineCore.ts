import type { BenchmarkVerificationStatus } from './floridaBestMath';

export type MathProblem = {
  prompt: string;
  choices: string[];
  correctAnswer: string;
  difficulty: string;
  gradeBand: 3 | 4 | 5;
  standardsSystem: "Florida B.E.S.T. Mathematics";
  benchmark: string;
  benchmarkDescription: string;
  officialBenchmark: string;
  domain: string;
  strand: string;
  reportingCategory: string;
  verificationStatus: BenchmarkVerificationStatus;
  sourceNote: string;
  skill: string;
  skillLabel?: string;
  skillId: string;
  varietyGroup: string;
  problemType: string;
  signature: string;
  hint: string;
  secondHint: string;
  richDisplay?: RichMathDisplay[];
};

export type RichMathDisplay =
  | {
      type: "fraction";
      numerator: number | string;
      denominator: number | string;
      label?: string;
      ariaLabel?: string;
    }
  | {
      type: "table";
      caption?: string;
      headers: string[];
      rows: Array<Array<number | string>>;
    };

export type ProblemCore = {
  prompt: string;
  correctAnswer: string;
  wrongAnswers: string[];
  hint: string;
  secondHint: string;
  richDisplay?: RichMathDisplay[];
};

export type ProblemGenerator = () => ProblemCore;

export const DEFAULT_UNIQUE_RETRY_COUNT = 50;

export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function shuffle<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function uniqueChoices(
  correctAnswer: string,
  wrongAnswers: string[],
  fallbackOffsets = [1, -1, 2, -2, 5, -5],
) {
  const choices = new Set<string>([correctAnswer]);
  for (const answer of wrongAnswers) {
    if (answer !== correctAnswer) choices.add(answer);
    if (choices.size === 4) return shuffle([...choices]);
  }

  const numericAnswer = Number(correctAnswer);
  if (Number.isFinite(numericAnswer)) {
    for (const offset of fallbackOffsets) {
      const candidate = String(numericAnswer + offset);
      if (candidate !== correctAnswer) choices.add(candidate);
      if (choices.size === 4) return shuffle([...choices]);
    }
  }

  let n = 1;
  while (choices.size < 4) {
    choices.add(`${correctAnswer} + ${n}`);
    n += 1;
  }
  return shuffle([...choices]);
}

export function normalizePromptForSignature(prompt: string) {
  return prompt.trim().toLowerCase().replace(/\s+/g, " ");
}

export function createProblemSignature({
  difficulty,
  benchmark,
  skillId,
  problemType,
  prompt,
  correctAnswer,
}: {
  difficulty: string;
  benchmark: string;
  skillId: string;
  problemType: string;
  prompt: string;
  correctAnswer: string;
}) {
  return [
    difficulty,
    benchmark,
    skillId,
    problemType,
    normalizePromptForSignature(prompt),
    correctAnswer,
  ].join("|");
}

export function numberDistractors(answer: number, spread: number, count = 5) {
  const values = new Set<string>();
  while (values.size < count) {
    const candidate = answer + randInt(-spread, spread);
    if (candidate >= 0 && candidate !== answer) values.add(String(candidate));
  }
  return [...values];
}

export function degreeAnswer(value: number) {
  return `${value}°`;
}

export function degreeDistractors(answer: number, candidates: number[], count = 5) {
  const values = new Set<number>();
  for (const candidate of candidates) {
    if (
      Number.isInteger(candidate) &&
      candidate > 0 &&
      candidate <= 360 &&
      candidate !== answer
    ) {
      values.add(candidate);
    }
    if (values.size >= count) return [...values].map(degreeAnswer);
  }

  for (const offset of [5, -5, 10, -10, 15, -15, 20, -20, 30, -30, 45, -45]) {
    const candidate = answer + offset;
    if (candidate > 0 && candidate <= 360 && candidate !== answer) {
      values.add(candidate);
    }
    if (values.size >= count) return [...values].map(degreeAnswer);
  }

  let candidate = 1;
  while (values.size < count) {
    if (candidate !== answer) values.add(candidate);
    candidate += 1;
  }
  return [...values].map(degreeAnswer);
}

export function decimalDistractors(
  answer: number,
  places: number,
  stepUnits: number[],
  count = 5,
) {
  const values = new Set<string>();
  while (values.size < count) {
    const step = stepUnits[randInt(0, stepUnits.length - 1)];
    const sign = Math.random() < 0.5 ? -1 : 1;
    const candidate = answer + sign * step;
    if (candidate >= 0 && Math.abs(candidate - answer) > Number.EPSILON) {
      values.add(candidate.toFixed(places));
    }
  }
  return [...values];
}

export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function fraction(
  numerator: number,
  denominator: number,
  options: { simplify?: boolean } = {},
) {
  if (denominator === 0) {
    throw new Error("Cannot format a fraction with denominator 0.");
  }
  const simplify = options.simplify ?? true;
  const sign = denominator < 0 ? -1 : 1;
  const adjustedNumerator = numerator * sign;
  const adjustedDenominator = Math.abs(denominator);

  if (adjustedNumerator % adjustedDenominator === 0) {
    return String(adjustedNumerator / adjustedDenominator);
  }

  if (!simplify) {
    return `${adjustedNumerator}/${adjustedDenominator}`;
  }

  const divisor = gcd(adjustedNumerator, adjustedDenominator);
  const simplifiedNumerator = adjustedNumerator / divisor;
  const simplifiedDenominator = adjustedDenominator / divisor;
  return simplifiedDenominator === 1
    ? String(simplifiedNumerator)
    : `${simplifiedNumerator}/${simplifiedDenominator}`;
}

export function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function unitAnswer(
  value: number | string,
  singular: string,
  plural = `${singular}s`,
) {
  const numeric = typeof value === "number" ? value : Number(value);
  const unit = Number.isFinite(numeric) && Math.abs(numeric) === 1 ? singular : plural;
  const text = typeof value === "number" ? value.toLocaleString() : value;
  return `${text} ${unit}`;
}

export function parseFraction(value: string) {
  const mixedMatch = value.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = Number(mixedMatch[1]);
    const numerator = Number(mixedMatch[2]);
    const denominator = Number(mixedMatch[3]);
    return { numerator: whole * denominator + numerator, denominator };
  }
  if (!value.includes("/")) {
    return { numerator: Number(value), denominator: 1 };
  }
  const [n, d] = value.split("/").map(Number);
  return { numerator: n, denominator: d };
}

export function expectedFraction(numerator: number, denominator: number) {
  return fraction(numerator, denominator, { simplify: false });
}

export function mixedNumber(whole: number, numerator: number, denominator: number) {
  if (denominator === 0) {
    throw new Error("Cannot format a mixed number with denominator 0.");
  }
  if (numerator === 0) return String(whole);
  if (numerator % denominator === 0) {
    return String(whole + numerator / denominator);
  }
  if (whole === 0) {
    return expectedFraction(numerator, denominator);
  }
  return `${whole} ${expectedFraction(numerator, denominator)}`;
}

export function fractionDisplay(
  numerator: number | string,
  denominator: number | string,
  label?: string,
): RichMathDisplay {
  return {
    type: "fraction",
    numerator,
    denominator,
    label,
    ariaLabel: `${label ? `${label}: ` : ""}${numerator} over ${denominator}`,
  };
}

export function formatExpandedForm(parts: number[]) {
  return parts
    .filter((part) => part !== 0)
    .map((part) => part.toLocaleString())
    .join(" + ");
}

export function dataTableDisplay(
  caption: string,
  rows: Array<[string, number | string]>,
): RichMathDisplay {
  return {
    type: "table",
    caption,
    headers: ["Item", "Count"],
    rows,
  };
}

export type CustomaryReferenceCategory = "length" | "capacity" | "weight" | "time";

export function customaryReferenceTableDisplay(
  category: CustomaryReferenceCategory,
  gradeBand: 4 | 5 = 4,
): RichMathDisplay {
  const rowsByCategory: Record<CustomaryReferenceCategory, Array<[string, string]>> = {
    length:
      gradeBand === 5
        ? [
            ["1 foot", "12 inches"],
            ["1 yard", "3 feet"],
            ["1 mile", "5,280 feet"],
            ["1 mile", "1,760 yards"],
          ]
        : [
            ["1 foot", "12 inches"],
            ["1 yard", "3 feet"],
          ],
    capacity:
      gradeBand === 5
        ? [
            ["1 cup", "8 fluid ounces"],
            ["1 pint", "2 cups"],
            ["1 quart", "2 pints"],
            ["1 gallon", "4 quarts"],
          ]
        : [
            ["1 pint", "2 cups"],
            ["1 quart", "2 pints"],
            ["1 gallon", "4 quarts"],
          ],
    weight:
      gradeBand === 5
        ? [
            ["1 pound", "16 ounces"],
            ["1 ton", "2,000 pounds"],
          ]
        : [["1 pound", "16 ounces"]],
    time:
      gradeBand === 5
        ? [
            ["1 minute", "60 seconds"],
            ["1 hour", "60 minutes"],
            ["1 day", "24 hours"],
            ["1 week", "7 days"],
          ]
        : [
            ["1 minute", "60 seconds"],
            ["1 hour", "60 minutes"],
          ],
  };

  return {
    type: "table",
    caption: `Customary ${category} reference`,
    headers: ["Unit", "Equivalent measure"],
    rows: rowsByCategory[category],
  };
}
