import {
  FL_BEST_MATH_BANDS,
  type DifficultyKey,
  type MathSkill,
  normalizeDifficulty,
} from "./math/floridaBestMath";

export type MathProblem = {
  prompt: string;
  choices: string[];
  correctAnswer: string;
  difficulty: string;
  gradeBand: 3 | 4 | 5;
  standardsSystem: "Florida B.E.S.T. Mathematics";
  benchmark: string;
  benchmarkDescription: string;
  skill: string;
  skillLabel?: string;
};

type ProblemCore = {
  prompt: string;
  correctAnswer: string;
  wrongAnswers: string[];
};

type ProblemGenerator = () => ProblemCore;

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function shuffle(array: string[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function uniqueChoices(correctAnswer: string, wrongAnswers: string[], fallbackOffsets = [1, -1, 2, -2, 5, -5]) {
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

function numberDistractors(answer: number, spread: number, count = 5) {
  const values = new Set<string>();
  while (values.size < count) {
    const candidate = answer + randInt(-spread, spread);
    if (candidate >= 0 && candidate !== answer) values.add(String(candidate));
  }
  return [...values];
}

function decimalDistractors(answer: number, places: number, stepUnits: number[], count = 5) {
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

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function fraction(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function parseFraction(value: string) {
  const [n, d] = value.split("/").map(Number);
  return { numerator: n, denominator: d };
}

function g3AddSub1000(): ProblemCore {
  const add = Math.random() < 0.5;
  if (add) {
    const a = randInt(120, 650);
    const b = randInt(80, 320);
    const answer = a + b;
    return {
      prompt: `A map shows ${a} steps to a bridge and ${b} more steps to a tower. How many steps is that in all?`,
      correctAnswer: String(answer),
      wrongAnswers: numberDistractors(answer, 30),
    };
  }
  const a = randInt(350, 999);
  const b = randInt(80, a - 50);
  const answer = a - b;
  return {
    prompt: `A treasure chest had ${a} gems. The hero used ${b} gems to power a gate. How many gems are left?`,
    correctAnswer: String(answer),
    wrongAnswers: numberDistractors(answer, 30),
  };
}

function g3MultiplicationFacts(): ProblemCore {
  const rows = randInt(3, 10);
  const each = randInt(3, 10);
  const answer = rows * each;
  return {
    prompt: `A garden has ${rows} rows with ${each} flowers in each row. How many flowers are there?`,
    correctAnswer: String(answer),
    wrongAnswers: [rows + each, rows * (each + 1), (rows + 1) * each, answer - each, answer + rows].map(String),
  };
}

function g3DivisionFacts(): ProblemCore {
  const groups = randInt(3, 10);
  const each = randInt(3, 10);
  const total = groups * each;
  return {
    prompt: `${total} glowing stones are shared equally into ${groups} bags. How many stones go in each bag?`,
    correctAnswer: String(each),
    wrongAnswers: [groups, each + 1, Math.max(1, each - 1), total - groups, total / each].map(String),
  };
}

function g3AreaPerimeter(): ProblemCore {
  const length = randInt(4, 12);
  const width = randInt(3, 10);
  const area = Math.random() < 0.6;
  const answer = area ? length * width : 2 * (length + width);
  return {
    prompt: `A rectangle is ${length} units long and ${width} units wide. What is its ${area ? "area" : "perimeter"}?`,
    correctAnswer: String(answer),
    wrongAnswers: [length + width, length * width, 2 * (length + width), answer + length, Math.max(1, answer - width)].map(String),
  };
}

function g3FractionCompare(): ProblemCore {
  const denominator = randInt(4, 10);
  const a = randInt(1, denominator - 2);
  const b = randInt(a + 1, denominator - 1);
  const correct = `${b}/${denominator}`;
  const other = `${a}/${denominator}`;
  return {
    prompt: `Which fraction is greater: ${other} or ${correct}?`,
    correctAnswer: correct,
    wrongAnswers: [other, "They are equal", `${a + b}/${denominator}`, `1/${denominator}`],
  };
}

function g3ElapsedTime(): ProblemCore {
  const startHour = randInt(1, 9);
  const minutes = [15, 20, 25, 30, 35, 40, 45][randInt(0, 6)];
  const endHour = startHour + Math.floor(minutes / 60);
  const endMinute = minutes % 60;
  const endTime = `${endHour}:${String(endMinute).padStart(2, "0")}`;
  return {
    prompt: `A puzzle starts at ${startHour}:00 and ends at ${endTime}. How many minutes did it take?`,
    correctAnswer: String(minutes),
    wrongAnswers: numberDistractors(minutes, 15),
  };
}

function g4Rounding(): ProblemCore {
  const value = randInt(12_000, 999_999);
  const place = [10, 100, 1000, 10_000][randInt(0, 3)];
  const answer = Math.round(value / place) * place;
  return {
    prompt: `Round ${value.toLocaleString()} to the nearest ${place.toLocaleString()}.`,
    correctAnswer: answer.toLocaleString(),
    wrongAnswers: [answer + place, answer - place, Math.floor(value / place) * place, Math.ceil(value / place) * place]
      .filter((n) => n >= 0)
      .map((n) => n.toLocaleString()),
  };
}

function g4Multiplication(): ProblemCore {
  const a = randInt(24, 96);
  const b = randInt(4, 9);
  const answer = a * b;
  return {
    prompt: `A library shelf has ${a} books in each stack and ${b} stacks. How many books are there?`,
    correctAnswer: String(answer),
    wrongAnswers: [a + b, a * (b + 1), (a + 10) * b, answer - b, answer + a].map(String),
  };
}

function g4DivisionRemainders(): ProblemCore {
  const divisor = randInt(4, 9);
  const quotient = randInt(12, 45);
  const remainder = randInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  return {
    prompt: `${dividend} lanterns are packed into boxes of ${divisor}. What is ${dividend} ÷ ${divisor}?`,
    correctAnswer: `${quotient} R${remainder}`,
    wrongAnswers: [`${quotient} R${divisor - remainder}`, `${quotient + 1} R${remainder}`, `${quotient - 1} R${remainder}`, String(quotient)],
  };
}

function g4EquivalentFractions(): ProblemCore {
  const numerator = randInt(1, 5);
  const denominator = randInt(numerator + 2, 10);
  const factor = randInt(2, 5);
  const answer = `${numerator * factor}/${denominator * factor}`;
  return {
    prompt: `Which fraction is equivalent to ${numerator}/${denominator}?`,
    correctAnswer: answer,
    wrongAnswers: [`${numerator + factor}/${denominator + factor}`, `${numerator}/${denominator * factor}`, `${numerator * factor}/${denominator}`, `${denominator}/${numerator}`],
  };
}

function g4DecimalsHundredths(): ProblemCore {
  const tenths = randInt(1, 9);
  const hundredths = tenths * 10;
  return {
    prompt: `Which decimal is equal to ${hundredths}/100?`,
    correctAnswer: (hundredths / 100).toFixed(2),
    wrongAnswers: [(tenths / 100).toFixed(2), (hundredths / 10).toFixed(2), `0.${hundredths + 1}`, `${tenths}.00`],
  };
}

function g4Angles(): ProblemCore {
  const whole = [90, 120, 180][randInt(0, 2)];
  const known = randInt(2, whole / 10 - 2) * 10;
  const answer = whole - known;
  return {
    prompt: `Two angles make ${whole}°. One angle is ${known}°. What is the other angle?`,
    correctAnswer: `${answer}°`,
    wrongAnswers: [`${known}°`, `${whole + known}°`, `${Math.max(10, answer - 10)}°`, `${answer + 10}°`],
  };
}

function g5DecimalPlaceValue(): ProblemCore {
  const number = (randInt(1000, 9999) / 1000).toFixed(3);
  const thousandths = Number(number.split(".")[1][2]);
  return {
    prompt: `In the number ${number}, what digit is in the thousandths place?`,
    correctAnswer: String(thousandths),
    wrongAnswers: [number[0], number.split(".")[1][0], number.split(".")[1][1], String((thousandths + 1) % 10)],
  };
}

function g5DecimalOperations(): ProblemCore {
  const a = randInt(125, 999) / 100;
  const b = randInt(25, 499) / 100;
  const answer = a + b;
  return {
    prompt: `A robot travels ${a.toFixed(2)} miles, then ${b.toFixed(2)} more miles. How far does it travel in all?`,
    correctAnswer: answer.toFixed(2),
    wrongAnswers: decimalDistractors(answer, 2, [0.1, 0.2, 1, 0.01]),
  };
}

function g5FractionAddUnlike(): ProblemCore {
  const d1 = [3, 4, 5, 6, 8][randInt(0, 4)];
  const d2 = [5, 6, 8, 10, 12][randInt(0, 4)];
  const n1 = randInt(1, d1 - 1);
  const n2 = randInt(1, d2 - 1);
  const answer = fraction(n1 * d2 + n2 * d1, d1 * d2);
  return {
    prompt: `What is ${n1}/${d1} + ${n2}/${d2}?`,
    correctAnswer: answer,
    wrongAnswers: [fraction(n1 + n2, d1 + d2), fraction(n1 + n2, d1 * d2), fraction(Math.abs(n1 * d2 - n2 * d1) || 1, d1 * d2), `${n1 + n2}/${Math.max(d1, d2)}`],
  };
}

function g5FractionTimesWhole(): ProblemCore {
  const whole = randInt(2, 9);
  const denominator = randInt(3, 10);
  const numerator = randInt(1, denominator - 1);
  const answer = fraction(whole * numerator, denominator);
  return {
    prompt: `A recipe uses ${numerator}/${denominator} cup of spice for each batch. How much is needed for ${whole} batches?`,
    correctAnswer: answer,
    wrongAnswers: [fraction(whole + numerator, denominator), fraction(whole * denominator, numerator), `${whole}/${denominator}`, fraction(whole * numerator + 1, denominator)],
  };
}

function g5Volume(): ProblemCore {
  const length = randInt(4, 12);
  const width = randInt(3, 10);
  const height = randInt(2, 8);
  const answer = length * width * height;
  return {
    prompt: `A rectangular prism is ${length} units long, ${width} units wide, and ${height} units tall. What is its volume?`,
    correctAnswer: String(answer),
    wrongAnswers: [length * width, 2 * (length + width + height), answer + length * width, Math.max(1, answer - width * height)].map(String),
  };
}

function g5Expressions(): ProblemCore {
  const a = randInt(4, 12);
  const b = randInt(2, 9);
  const c = randInt(10, 40);
  const answer = a * b + c;
  return {
    prompt: `Evaluate ${a} × ${b} + ${c}.`,
    correctAnswer: String(answer),
    wrongAnswers: [a * (b + c), a + b + c, (a + b) * c, answer - c].map(String),
  };
}

function g5ExtremeFractionCombo(): ProblemCore {
  const d1 = [3, 4, 5, 6, 8][randInt(0, 4)];
  const d2 = [5, 6, 8, 10, 12][randInt(0, 4)];
  const n1 = randInt(1, d1 - 1);
  const n2 = randInt(1, d2 - 1);
  const add = randInt(1, 3);
  const partial = fraction(n1 * d2 + n2 * d1, d1 * d2);
  const parsed = parseFraction(partial);
  const answer = fraction(parsed.numerator + add * parsed.denominator, parsed.denominator);
  return {
    prompt: `A hero collects ${n1}/${d1} of a crystal, then ${n2}/${d2} of a crystal, then ${add} whole crystal${add === 1 ? "" : "s"}. How much crystal do they have?`,
    correctAnswer: answer,
    wrongAnswers: [partial, fraction(parsed.numerator + add, parsed.denominator), fraction(parsed.numerator, parsed.denominator + add), `${add}/${parsed.denominator}`],
  };
}

function g5ExtremeDecimalCombo(): ProblemCore {
  const a = randInt(1250, 9999) / 1000;
  const b = randInt(250, 4999) / 1000;
  const c = randInt(50, 999) / 1000;
  const answer = a + b - c;
  return {
    prompt: `A crystal weighs ${a.toFixed(3)} kg. Another weighs ${b.toFixed(3)} kg. ${c.toFixed(3)} kg chips away. What weight remains?`,
    correctAnswer: answer.toFixed(3),
    wrongAnswers: decimalDistractors(answer, 3, [0.001, 0.01, 0.1, 1]),
  };
}

function g5ExtremeVolume(): ProblemCore {
  const width = randInt(4, 10);
  const height = randInt(3, 9);
  const length = randInt(6, 14);
  const volume = width * height * length;
  return {
    prompt: `A prism has volume ${volume} cubic units, width ${width}, and height ${height}. What is its length?`,
    correctAnswer: String(length),
    wrongAnswers: [width * height, volume / width, volume / height, length + width, Math.max(1, length - 2)].map(String),
  };
}

function g5ExtremeCoordinate(): ProblemCore {
  const x1 = randInt(1, 8);
  const y1 = randInt(1, 8);
  const x2 = randInt(x1 + 1, 12);
  const y2 = y1;
  const distance = x2 - x1;
  return {
    prompt: `On a coordinate grid, one point is (${x1}, ${y1}) and another is (${x2}, ${y2}). How many units apart are they?`,
    correctAnswer: String(distance),
    wrongAnswers: [x2 + x1, y1, x2, Math.abs(y2 - y1), distance + 1].map(String),
  };
}

function g5ExtremeExpressions(): ProblemCore {
  const a = randInt(5, 12);
  const b = randInt(2, 8);
  const c = randInt(3, 9);
  const subtotal = (a + b) * c;
  const d = randInt(5, Math.max(6, subtotal - 5));
  const answer = (a + b) * c - d;
  return {
    prompt: `Evaluate (${a} + ${b}) × ${c} - ${d}.`,
    correctAnswer: String(answer),
    wrongAnswers: [a + b * c - d, (a + b) * (c - d), (a + b) * c + d, answer + c].map(String),
  };
}

const GENERATORS: Record<string, ProblemGenerator> = {
  g3AddSub1000,
  g3MultiplicationFacts,
  g3DivisionFacts,
  g3AreaPerimeter,
  g3FractionCompare,
  g3ElapsedTime,
  g4Rounding,
  g4Multiplication,
  g4DivisionRemainders,
  g4EquivalentFractions,
  g4DecimalsHundredths,
  g4Angles,
  g5DecimalPlaceValue,
  g5DecimalOperations,
  g5FractionAddUnlike,
  g5FractionTimesWhole,
  g5Volume,
  g5Expressions,
  g5ExtremeFractionCombo,
  g5ExtremeDecimalCombo,
  g5ExtremeVolume,
  g5ExtremeCoordinate,
  g5ExtremeExpressions,
};

function buildProblem(difficultyKey: DifficultyKey, skill: MathSkill): MathProblem {
  const band = FL_BEST_MATH_BANDS[difficultyKey];
  const generator = GENERATORS[skill.generator] ?? g3MultiplicationFacts;
  const core = generator();
  const choices = uniqueChoices(core.correctAnswer, core.wrongAnswers);

  return {
    prompt: core.prompt,
    choices,
    correctAnswer: core.correctAnswer,
    difficulty: band.label,
    gradeBand: band.gradeBand,
    standardsSystem: band.standardsSystem,
    benchmark: skill.benchmark,
    benchmarkDescription: skill.description,
    skill: skill.skill,
    skillLabel: skill.skill,
  };
}

export function generateMathProblem(difficulty: string): MathProblem {
  const difficultyKey = normalizeDifficulty(difficulty);
  const band = FL_BEST_MATH_BANDS[difficultyKey];
  const skill = band.skills[randInt(0, band.skills.length - 1)];

  try {
    return buildProblem(difficultyKey, skill);
  } catch {
    return buildProblem(difficultyKey, band.skills[0]);
  }
}

export function generateRecoveryProblem(difficulty: string): MathProblem {
  const diffMap: Record<DifficultyKey, DifficultyKey> = {
    extreme: "hard",
    hard: "medium",
    medium: "easy",
    easy: "easy",
  };
  return generateMathProblem(FL_BEST_MATH_BANDS[diffMap[normalizeDifficulty(difficulty)]].label);
}
