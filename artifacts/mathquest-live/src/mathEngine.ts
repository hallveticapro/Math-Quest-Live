import {
  FL_BEST_MATH_BANDS,
  type BenchmarkVerificationStatus,
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

type ProblemCore = {
  prompt: string;
  correctAnswer: string;
  wrongAnswers: string[];
  hint: string;
  secondHint: string;
  richDisplay?: RichMathDisplay[];
};

type ProblemGenerator = () => ProblemCore;

const DEFAULT_UNIQUE_RETRY_COUNT = 50;

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function shuffle<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function uniqueChoices(
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

function normalizePromptForSignature(prompt: string) {
  return prompt.trim().toLowerCase().replace(/\s+/g, " ");
}

function createProblemSignature({
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

function numberDistractors(answer: number, spread: number, count = 5) {
  const values = new Set<string>();
  while (values.size < count) {
    const candidate = answer + randInt(-spread, spread);
    if (candidate >= 0 && candidate !== answer) values.add(String(candidate));
  }
  return [...values];
}

function degreeAnswer(value: number) {
  return `${value}°`;
}

function degreeDistractors(answer: number, candidates: number[], count = 5) {
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

function decimalDistractors(
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

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function fraction(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function unitAnswer(
  value: number | string,
  singular: string,
  plural = `${singular}s`,
) {
  const numeric = typeof value === "number" ? value : Number(value);
  const unit = Number.isFinite(numeric) && Math.abs(numeric) === 1 ? singular : plural;
  const text = typeof value === "number" ? value.toLocaleString() : value;
  return `${text} ${unit}`;
}

function parseFraction(value: string) {
  const [n, d] = value.split("/").map(Number);
  return { numerator: n, denominator: d };
}

function fractionDisplay(
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

function formatExpandedForm(parts: number[]) {
  return parts
    .filter((part) => part !== 0)
    .map((part) => part.toLocaleString())
    .join(" + ");
}

function dataTableDisplay(
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

type CustomaryReferenceCategory = "length" | "capacity" | "weight" | "time";

function customaryReferenceTableDisplay(
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

function g3PlaceValueDigit(): ProblemCore {
  const thousands = randInt(1, 9);
  const hundreds = randInt(1, 9);
  const tens = randInt(1, 9);
  const ones = randInt(1, 9);
  const digits = [thousands, hundreds, tens, ones];
  const places = [
    { label: "thousands", value: 1000, index: 0 },
    { label: "hundreds", value: 100, index: 1 },
    { label: "tens", value: 10, index: 2 },
    { label: "ones", value: 1, index: 3 },
  ];
  const place = places[randInt(0, places.length - 1)];
  const targetDigit = digits[place.index];
  const number = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
  const answer = targetDigit * place.value;
  const otherPlaceValues = places
    .filter((candidate) => candidate.value !== place.value)
    .map((candidate) => targetDigit * candidate.value);

  return {
    prompt: `The treasure map number is ${number.toLocaleString()}. What is the value of the ${targetDigit} in the ${place.label} place?`,
    correctAnswer: answer.toLocaleString(),
    wrongAnswers: [
      targetDigit,
      ...otherPlaceValues,
      answer + place.value,
      Math.max(place.value, answer - place.value),
    ].map((value) => value.toLocaleString()),
    hint: "Look at the place where the digit sits. Thousands, hundreds, tens, and ones have different values.",
    secondHint: `The ${place.label} place means the digit is worth ${place.value.toLocaleString()} times as much as the digit itself.`,
  };
}

function g3ExpandedForm(): ProblemCore {
  const thousands = randInt(1, 9);
  let hundreds = randInt(1, 9);
  while (hundreds === thousands) hundreds = randInt(1, 9);
  let tens = randInt(1, 9);
  while (tens === thousands || tens === hundreds) tens = randInt(1, 9);
  let ones = randInt(1, 9);
  while (ones === thousands || ones === hundreds || ones === tens) {
    ones = randInt(1, 9);
  }
  const number = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
  const correct = formatExpandedForm([
    thousands * 1000,
    hundreds * 100,
    tens * 10,
    ones,
  ]);

  return {
    prompt: `Which expanded form matches ${number.toLocaleString()}?`,
    correctAnswer: correct,
    wrongAnswers: [
      formatExpandedForm([thousands * 100, hundreds * 1000, tens * 10, ones]),
      formatExpandedForm([thousands * 1000, hundreds * 10, tens * 100, ones]),
      formatExpandedForm([thousands * 1000, hundreds * 100, tens, ones * 10]),
      `${thousands} + ${hundreds} + ${tens} + ${ones}`,
      formatExpandedForm([thousands * 1000, hundreds * 100, tens * 10]),
    ],
    hint: "Expanded form shows the value of each digit by place value.",
    secondHint: "Use thousands, hundreds, tens, and ones. For example, a 7 in the hundreds place is worth 700.",
  };
}

function g3WholeNumberCompare(): ProblemCore {
  const a = randInt(1000, 9999);
  let b = randInt(1000, 9999);
  while (b === a) b = randInt(1000, 9999);
  const greater = Math.max(a, b);
  const lesser = Math.min(a, b);
  const askGreater = Math.random() < 0.6;

  return {
    prompt: `Which number is ${askGreater ? "greater" : "less"}: ${a.toLocaleString()} or ${b.toLocaleString()}?`,
    correctAnswer: (askGreater ? greater : lesser).toLocaleString(),
    wrongAnswers: [
      (askGreater ? lesser : greater).toLocaleString(),
      "They are equal",
      (greater + 10).toLocaleString(),
      Math.max(0, lesser - 10).toLocaleString(),
      `${a.toLocaleString()} and ${b.toLocaleString()}`,
    ],
    hint: "Compare from left to right, starting with the thousands place.",
    secondHint: "The first place where the digits are different tells which whole number is greater.",
  };
}

function g3MissingFactorEquation(): ProblemCore {
  const factor = randInt(2, 12);
  const missing = randInt(2, 12);
  const product = factor * missing;
  const formats = [
    `□ × ${factor} = ${product}`,
    `${factor} × □ = ${product}`,
    `${product} ÷ ${factor} = □`,
  ];
  const promptEquation = formats[randInt(0, formats.length - 1)];

  return {
    prompt: `What number makes this equation true: ${promptEquation}?`,
    correctAnswer: String(missing),
    wrongAnswers: [
      factor,
      missing + 1,
      Math.max(1, missing - 1),
      product,
      factor + missing,
    ].map(String),
    hint: "Use the relationship between multiplication and division.",
    secondHint: `${factor} times the missing number equals ${product}. Think of the related division fact.`,
  };
}

function g3Multiples(): ProblemCore {
  const factor = randInt(2, 9);
  const multiplier = randInt(2, 16);
  const answer = factor * multiplier;
  const wrongs = new Set<number>();
  for (const offset of [1, -1, 2, -2, factor + 1, factor - 1, 10]) {
    const candidate = answer + offset;
    if (candidate > 0 && candidate <= 144 && candidate % factor !== 0) {
      wrongs.add(candidate);
    }
  }
  while (wrongs.size < 5) {
    const candidate = randInt(1, 144);
    if (candidate % factor !== 0) wrongs.add(candidate);
  }

  return {
    prompt: `Which number is a multiple of ${factor}?`,
    correctAnswer: String(answer),
    wrongAnswers: [...wrongs].map(String),
    hint: "A multiple is the result of multiplying by a whole number.",
    secondHint: `Skip-count by ${factor}. The correct answer appears in that counting pattern.`,
  };
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
      hint: "Look for what is being joined together. When two amounts are combined, addition usually helps.",
      secondHint: "Add the hundreds, tens, and ones carefully. Then check that your answer is larger than both starting amounts.",
    };
  }
  const a = randInt(350, 999);
  const b = randInt(80, a - 50);
  const answer = a - b;
  return {
    prompt: `A treasure chest had ${a} gems. The hero used ${b} gems to power a gate. How many gems are left?`,
    correctAnswer: String(answer),
    wrongAnswers: numberDistractors(answer, 30),
    hint: "Look for what is being taken away. When something is used or removed, subtraction usually helps.",
    secondHint: "Start with the larger number, subtract the smaller number, and check that your answer is less than the starting amount.",
  };
}

function g3MultiplicationFacts(): ProblemCore {
  const rows = randInt(3, 10);
  const each = randInt(3, 10);
  const answer = rows * each;
  return {
    prompt: `A garden has ${rows} rows with ${each} flowers in each row. How many flowers are there?`,
    correctAnswer: String(answer),
    wrongAnswers: [
      rows + each,
      rows * (each + 1),
      (rows + 1) * each,
      answer - each,
      answer + rows,
    ].map(String),
    hint: "Think of it as equal groups. How many rows are there, and how many flowers are in each row?",
    secondHint: "Multiply the number of rows by the number in each row. An array is a multiplication picture.",
  };
}

function g3DivisionFacts(): ProblemCore {
  const groups = randInt(3, 10);
  const each = randInt(3, 10);
  const total = groups * each;
  return {
    prompt: `${total} glowing stones are shared equally into ${groups} bags. How many stones go in each bag?`,
    correctAnswer: String(each),
    wrongAnswers: [
      groups,
      each + 1,
      Math.max(1, each - 1),
      total - groups,
      total / each,
    ].map(String),
    hint: "Ask how many are in each equal group. Division helps when a total is shared equally.",
    secondHint: "Use the related multiplication fact: groups times each bag equals the total.",
  };
}

function g3AreaPerimeter(): ProblemCore {
  const length = randInt(4, 12);
  const width = randInt(3, 10);
  const area = Math.random() < 0.6;
  const answer = area ? length * width : 2 * (length + width);
  const unitSingular = area ? "square unit" : "unit";
  const unitPlural = area ? "square units" : "units";
  return {
    prompt: `A rectangle is ${length} units long and ${width} units wide. What is its ${area ? "area" : "perimeter"}?`,
    correctAnswer: unitAnswer(answer, unitSingular, unitPlural),
    wrongAnswers: [
      length + width,
      length * width,
      2 * (length + width),
      answer + length,
      Math.max(1, answer - width),
    ].map((value) => unitAnswer(value, unitSingular, unitPlural)),
    hint: area
      ? "Area covers the inside of a rectangle. Multiply length by width."
      : "Perimeter is the distance around the rectangle. Add all four sides.",
    secondHint: area
      ? "Use length × width. Do not add the sides when the question asks for area."
      : "Use length + width + length + width, or 2 × (length + width).",
  };
}

function g3CompositeArea(): ProblemCore {
  const firstLength = randInt(4, 10);
  const firstWidth = randInt(3, 8);
  const secondLength = randInt(3, 8);
  const secondWidth = randInt(2, 6);
  const firstArea = firstLength * firstWidth;
  const secondArea = secondLength * secondWidth;
  const totalArea = firstArea + secondArea;

  return {
    prompt: `A quest garden is made from two non-overlapping rectangles. One is ${firstLength} by ${firstWidth}, and the other is ${secondLength} by ${secondWidth}. What is the total area?`,
    correctAnswer: unitAnswer(totalArea, "square unit", "square units"),
    wrongAnswers: [
      firstArea,
      secondArea,
      firstLength + firstWidth + secondLength + secondWidth,
      totalArea + firstWidth,
      Math.max(1, totalArea - secondWidth),
    ].map((value) => unitAnswer(value, "square unit", "square units")),
    hint: "Find the area of each rectangle first.",
    secondHint: "Multiply length × width for each rectangle, then add the two areas because they do not overlap.",
  };
}

function g3QuadrilateralAttributes(): ProblemCore {
  const questions = [
    {
      prompt: "Which quadrilateral has four equal sides and four right angles?",
      correctAnswer: "square",
      wrongAnswers: ["rectangle", "trapezoid", "rhombus", "triangle"],
      hint: "Look for both equal side lengths and right angles.",
      secondHint: "A square has four equal sides and four right angles.",
    },
    {
      prompt: "Which quadrilateral has exactly one pair of parallel sides?",
      correctAnswer: "trapezoid",
      wrongAnswers: ["square", "rectangle", "rhombus", "pentagon"],
      hint: "Parallel sides stay the same distance apart and never meet.",
      secondHint: "A trapezoid has exactly one pair of parallel sides in this classification.",
    },
    {
      prompt: "Which quadrilateral has four equal sides, but does not have to have four right angles?",
      correctAnswer: "rhombus",
      wrongAnswers: ["rectangle", "trapezoid", "kite", "right triangle"],
      hint: "Focus on side lengths first, not the size of the angles.",
      secondHint: "A rhombus has four equal sides. A square is a special rhombus with right angles.",
    },
  ];

  return questions[randInt(0, questions.length - 1)];
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
    wrongAnswers: [
      other,
      "They are equal",
      `${a + b}/${denominator}`,
      `1/${denominator}`,
    ],
    hint: "These fractions have the same denominator, so the pieces are the same size. Compare the numerators.",
    secondHint: "With the same denominator, the fraction with the larger numerator is greater.",
    richDisplay: [
      fractionDisplay(a, denominator, "First fraction"),
      fractionDisplay(b, denominator, "Second fraction"),
    ],
  };
}

function g3EquivalentFractions(): ProblemCore {
  const denominator = [2, 3, 4, 6, 8][randInt(0, 4)];
  const numerator = randInt(1, denominator - 1);
  const factor = randInt(2, 4);
  const answer = `${numerator * factor}/${denominator * factor}`;

  return {
    prompt: `Which fraction is equivalent to ${numerator}/${denominator}?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${numerator + factor}/${denominator + factor}`,
      `${numerator}/${denominator * factor}`,
      `${numerator * factor}/${denominator}`,
      `${denominator}/${numerator}`,
      `${numerator + 1}/${denominator}`,
    ],
    hint: "Equivalent fractions name the same amount, even when the numbers look different.",
    secondHint: "Multiply the numerator and denominator by the same number to make an equivalent fraction.",
    richDisplay: [fractionDisplay(numerator, denominator, "Starting fraction")],
  };
}

function g3Rounding(): ProblemCore {
  const place = Math.random() < 0.55 ? 10 : 100;
  const value = randInt(11, 999);
  const answer = Math.round(value / place) * place;

  return {
    prompt: `Round ${value} to the nearest ${place}.`,
    correctAnswer: String(answer),
    wrongAnswers: [
      Math.floor(value / place) * place,
      Math.ceil(value / place) * place,
      answer + place,
      Math.max(0, answer - place),
      value,
    ].map(String),
    hint: "Find the place you are rounding to. Then look at the digit just to the right.",
    secondHint: "If the next digit is 5 or more, round up. If it is 4 or less, keep the rounding place the same.",
  };
}

function g3NumberPatterns(): ProblemCore {
  const increasing = Math.random() < 0.75;
  const step = [2, 3, 4, 5, 6, 10][randInt(0, 5)];
  const start = increasing ? randInt(2, 28) : randInt(45, 96);
  const pattern = Array.from({ length: 4 }, (_, index) =>
    increasing ? start + index * step : start - index * step,
  );
  const answer = increasing
    ? pattern[pattern.length - 1] + step
    : pattern[pattern.length - 1] - step;
  const direction = increasing ? "adds" : "subtracts";

  return {
    prompt: `The rune pattern is ${pattern.join(", ")}. It ${direction} ${step} each time. What number comes next?`,
    correctAnswer: String(answer),
    wrongAnswers: [
      pattern[pattern.length - 1],
      increasing ? answer + step : answer - step,
      increasing ? answer - 1 : answer + 1,
      increasing ? answer + 1 : answer - 1,
      Math.max(0, start + step),
    ].map(String),
    hint: "Look for the rule that changes each number into the next number.",
    secondHint: increasing
      ? `Add ${step} to the last number in the pattern.`
      : `Subtract ${step} from the last number in the pattern.`,
  };
}

function g3MeasurementLength(): ProblemCore {
  const first = randInt(12, 48);
  const second = randInt(8, 36);
  const compare = Math.random() < 0.5;

  if (compare) {
    const longer = Math.max(first, second);
    const shorter = Math.min(first, second);
    const answer = longer - shorter;
    return {
      prompt: `A ribbon is ${longer} inches long. A rope is ${shorter} inches long. How many inches longer is the ribbon?`,
      correctAnswer: unitAnswer(answer, "inch", "inches"),
      wrongAnswers: [
        longer + shorter,
        shorter,
        longer,
        Math.max(1, answer - 1),
        answer + 1,
      ].map((value) => unitAnswer(value, "inch", "inches")),
      hint: "A comparison question asks how much more or less. Subtract the shorter length from the longer length.",
      secondHint: "Line up the two lengths and find the difference between them.",
    };
  }

  const answer = first + second;
  return {
    prompt: `A trail has one path that is ${first} yards long and another path that is ${second} yards long. How many yards are the paths in all?`,
    correctAnswer: unitAnswer(answer, "yard", "yards"),
    wrongAnswers: [
      Math.abs(first - second),
      first,
      second,
      answer + 5,
      Math.max(1, answer - 5),
    ].map((value) => unitAnswer(value, "yard", "yards")),
    hint: "The question asks for the total length. Add the two path lengths together.",
    secondHint: "Check that your answer is longer than either path by itself.",
  };
}

function g3MeasurementMassVolume(): ProblemCore {
  const contexts = [
    { unit: "grams", itemA: "crystal dust", itemB: "moon sand", minA: 120, maxA: 450, minB: 80, maxB: 320 },
    { unit: "milliliters", itemA: "blue potion", itemB: "gold potion", minA: 150, maxA: 600, minB: 75, maxB: 350 },
    { unit: "degrees", itemA: "morning cave temperature", itemB: "afternoon cave temperature", minA: 45, maxA: 68, minB: 5, maxB: 18 },
  ];
  const context = contexts[randInt(0, contexts.length - 1)];
  const first = randInt(context.minA, context.maxA);
  const second = randInt(context.minB, context.maxB);
  const compare = Math.random() < 0.45;

  if (compare) {
    const larger = Math.max(first, second);
    const smaller = Math.min(first, second);
    const answer = larger - smaller;
    return {
      prompt: `One supply bag has ${larger} ${context.unit} of ${context.itemA}. Another has ${smaller} ${context.unit} of ${context.itemB}. How many more ${context.unit} are in the larger bag?`,
      correctAnswer: `${answer} ${context.unit}`,
      wrongAnswers: [
        `${larger + smaller} ${context.unit}`,
        `${larger} ${context.unit}`,
        `${smaller} ${context.unit}`,
        `${answer + 10} ${context.unit}`,
        `${Math.max(1, answer - 10)} ${context.unit}`,
      ],
      hint: "When a problem asks how many more, compare the two measurements.",
      secondHint: "Subtract the smaller measurement from the larger measurement, and keep the same unit.",
    };
  }

  const answer = first + second;
  return {
    prompt: `A recipe uses ${first} ${context.unit} of ${context.itemA} and ${second} ${context.unit} of ${context.itemB}. How many ${context.unit} are used altogether?`,
    correctAnswer: `${answer} ${context.unit}`,
    wrongAnswers: [
      `${Math.abs(first - second)} ${context.unit}`,
      `${first} ${context.unit}`,
      `${second} ${context.unit}`,
      `${answer + 10} ${context.unit}`,
      `${Math.max(1, answer - 10)} ${context.unit}`,
    ],
    hint: "Altogether means combine the measurements.",
    secondHint: "Add the two measurements and keep the unit with your answer.",
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
    correctAnswer: unitAnswer(minutes, "minute", "minutes"),
    wrongAnswers: numberDistractors(minutes, 15).map((value) =>
      unitAnswer(value, "minute", "minutes"),
    ),
    hint: "Count forward from the start time to the end time. Think in chunks of 5, 10, or 15 minutes.",
    secondHint: "Because both times are in the same hour here, focus on how many minutes passed after :00.",
  };
}

function formatClockTime(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${hour}:${String(minute).padStart(2, "0")}`;
}

function g3ElapsedTimeTwoStep(): ProblemCore {
  const startHour = randInt(1, 8);
  const startMinute = [0, 5, 10, 15, 20, 25, 30][randInt(0, 6)];
  const firstPart = [15, 20, 25, 30, 35][randInt(0, 4)];
  const secondPart = [20, 25, 30, 35, 40, 45][randInt(0, 5)];
  const total = firstPart + secondPart;
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTime = formatClockTime(startTotalMinutes + total);

  return {
    prompt: `The hero starts a quest at ${formatClockTime(startTotalMinutes)}. The map walk takes ${firstPart} minutes, and the whole trip ends at ${endTime}. How many minutes did the puzzle gate take?`,
    correctAnswer: unitAnswer(secondPart, "minute", "minutes"),
    wrongAnswers: [
      total,
      firstPart,
      Math.max(5, secondPart - 5),
      secondPart + 5,
      Math.max(5, total - 5),
    ].map((value) => unitAnswer(value, "minute", "minutes")),
    hint: "Find the total time from the start to the end first. Then subtract the time already used by the map walk.",
    secondHint: "Count forward from the start time to the end time. The puzzle gate time is the part left after the first activity.",
  };
}

function g3DataInterpretation(): ProblemCore {
  const items = ["shells", "gems", "feathers", "keys", "stars"];
  const shuffledItems = shuffle(items);
  const categoryA = shuffledItems[0];
  const categoryB = shuffledItems[1];
  const categoryC = shuffledItems[2];
  const valueA = randInt(6, 18);
  let valueB = randInt(4, 16);
  while (valueB === valueA) valueB = randInt(4, 16);
  const valueC = randInt(3, 14);
  const compare = Math.random() < 0.55;
  const richDisplay = [
    dataTableDisplay("Quest table", [
      [categoryA, valueA],
      [categoryB, valueB],
      [categoryC, valueC],
    ]),
  ];

  if (compare) {
    const largerCategory = valueA > valueB ? categoryA : categoryB;
    const smallerCategory = valueA > valueB ? categoryB : categoryA;
    const largerValue = Math.max(valueA, valueB);
    const smallerValue = Math.min(valueA, valueB);
    const answer = largerValue - smallerValue;
    return {
      prompt: `Use the quest table below. How many more ${largerCategory} than ${smallerCategory} are there?`,
      correctAnswer: unitAnswer(answer, "item", "items"),
      wrongAnswers: [
        largerValue + smallerValue,
        largerValue,
        smallerValue,
        Math.max(1, answer - 1),
        answer + 1,
      ].map((value) => unitAnswer(value, "item", "items")),
      hint: "Find the two categories named in the question first. 'How many more' means compare them.",
      secondHint: "Subtract the smaller data value from the larger data value.",
      richDisplay,
    };
  }

  const answer = valueA + valueB;
  return {
    prompt: `Use the quest table below. How many ${categoryA} and ${categoryB} are there altogether?`,
    correctAnswer: unitAnswer(answer, "item", "items"),
    wrongAnswers: [
      Math.abs(valueA - valueB),
      valueA + valueC,
      valueB + valueC,
      valueA,
      answer + 1,
    ].map((value) => unitAnswer(value, "item", "items")),
    hint: "Find the categories named in the question. 'Altogether' means add those values.",
    secondHint: `Add the ${categoryA} value and the ${categoryB} value. Do not include categories the question did not ask for.`,
    richDisplay,
  };
}

function g4Rounding(): ProblemCore {
  const value = randInt(100, 10_000);
  const place = [10, 100, 1000][randInt(0, 2)];
  const answer = Math.round(value / place) * place;
  return {
    prompt: `Round ${value.toLocaleString()} to the nearest ${place.toLocaleString()}.`,
    correctAnswer: answer.toLocaleString(),
    wrongAnswers: [
      answer + place,
      answer - place,
      answer + place * 2,
      answer - place * 2,
      Math.floor(value / place) * place,
      Math.ceil(value / place) * place,
      value,
    ]
      .filter((n) => n >= 0 && n <= 10_000)
      .map((n) => n.toLocaleString()),
    hint: "Find the place you are rounding to, then look at the digit immediately to its right.",
    secondHint: "If the digit to the right is 5 or more, round up. If it is 4 or less, keep the rounding place the same.",
  };
}

function g4PlaceValueShift(): ProblemCore {
  const digit = randInt(2, 9);
  const place = Math.random() < 0.5 ? "left" : "right";
  const answer = place === "left" ? "10 times as much" : "one-tenth as much";
  return {
    prompt: `In a multi-digit number, a ${digit} moves one place to the ${place}. How does its value change?`,
    correctAnswer: answer,
    wrongAnswers: [
      place === "left" ? "one-tenth as much" : "10 times as much",
      "100 times as much",
      "one-hundredth as much",
      "it does not change",
    ],
    hint: "Each place-value move left or right changes the value by a factor of 10.",
    secondHint:
      place === "left"
        ? "Moving left makes the digit worth 10 times as much."
        : "Moving right makes the digit worth one-tenth as much.",
  };
}

function g4ExpandedForm(): ProblemCore {
  const hundredThousands = randInt(1, 9);
  const tenThousands = randInt(1, 9);
  const thousands = randInt(1, 9);
  const hundreds = randInt(1, 9);
  const tens = randInt(1, 9);
  const ones = randInt(1, 9);
  const number =
    hundredThousands * 100000 +
    tenThousands * 10000 +
    thousands * 1000 +
    hundreds * 100 +
    tens * 10 +
    ones;
  const correct = formatExpandedForm([
    hundredThousands * 100000,
    tenThousands * 10000,
    thousands * 1000,
    hundreds * 100,
    tens * 10,
    ones,
  ]);

  return {
    prompt: `Which expanded form matches ${number.toLocaleString()}?`,
    correctAnswer: correct,
    wrongAnswers: [
      formatExpandedForm([
        hundredThousands * 10000,
        tenThousands * 100000,
        thousands * 1000,
        hundreds * 100,
        tens * 10,
        ones,
      ]),
      formatExpandedForm([
        hundredThousands * 100000,
        tenThousands * 1000,
        thousands * 10000,
        hundreds * 100,
        tens * 10,
        ones,
      ]),
      `${hundredThousands} + ${tenThousands} + ${thousands} + ${hundreds} + ${tens} + ${ones}`,
      formatExpandedForm([
        hundredThousands * 100000,
        tenThousands * 10000,
        thousands * 1000,
        hundreds * 10,
        tens * 100,
        ones,
      ]),
    ],
    hint: "Expanded form shows each digit's value, not just the digit itself.",
    secondHint: "Read from left to right: hundred-thousands, ten-thousands, thousands, hundreds, tens, and ones.",
  };
}

function g4WholeNumberCompare(): ProblemCore {
  const a = randInt(10_000, 999_999);
  let b = randInt(10_000, 999_999);
  while (b === a) b = randInt(10_000, 999_999);
  const values = [a, b].sort((x, y) => x - y);
  const askGreater = Math.random() < 0.5;
  const answer = askGreater ? values[1] : values[0];

  return {
    prompt: `Which number is ${askGreater ? "greater" : "less"}: ${a.toLocaleString()} or ${b.toLocaleString()}?`,
    correctAnswer: answer.toLocaleString(),
    wrongAnswers: [
      (askGreater ? values[0] : values[1]).toLocaleString(),
      "They are equal",
      (values[1] + 1000).toLocaleString(),
      Math.max(0, values[0] - 1000).toLocaleString(),
    ],
    hint: "Compare place values from left to right.",
    secondHint: "Start with the greatest place. The first different digit decides the comparison.",
  };
}

function g4Multiplication(): ProblemCore {
  const a = randInt(24, 96);
  const b = randInt(4, 9);
  const answer = a * b;
  return {
    prompt: `A library shelf has ${a} books in each stack and ${b} stacks. How many books are there?`,
    correctAnswer: String(answer),
    wrongAnswers: [
      a + b,
      a * (b + 1),
      (a + 10) * b,
      answer - b,
      answer + a,
    ].map(String),
    hint: "This is equal groups again. Multiply the number in each stack by the number of stacks.",
    secondHint: "Break the larger number into tens and ones, multiply each part, then add the partial products.",
  };
}

function g4TwoDigitMultiplication(): ProblemCore {
  const a = randInt(12, 98);
  const b = randInt(12, 49);
  const answer = a * b;
  return {
    prompt: `A supply cart has ${a} bundles with ${b} beads in each bundle. How many beads are there?`,
    correctAnswer: answer.toLocaleString(),
    wrongAnswers: [
      a * (b + 1),
      (a + 1) * b,
      a + b,
      answer - a,
      answer + b,
    ].map((value) => value.toLocaleString()),
    hint: "Break one factor into tens and ones.",
    secondHint: `You can think of ${a} × ${b} as ${a} × ${Math.floor(b / 10) * 10} plus ${a} × ${b % 10}.`,
  };
}

function g4EstimateProduct(): ProblemCore {
  const a = randInt(31, 89);
  const b = randInt(12, 48);
  const roundedA = Math.round(a / 10) * 10;
  const roundedB = Math.round(b / 10) * 10;
  const answer = roundedA * roundedB;
  return {
    prompt: `Estimate ${a} × ${b} by rounding each factor to the nearest ten first.`,
    correctAnswer: answer.toLocaleString(),
    wrongAnswers: [
      a * b,
      roundedA * b,
      a * roundedB,
      answer + 100,
      Math.max(0, answer - 100),
    ].map((value) => value.toLocaleString()),
    hint: "Round both factors before multiplying.",
    secondHint: `${a} rounds to ${roundedA}, and ${b} rounds to ${roundedB}. Multiply the rounded numbers.`,
  };
}

function g4DivisionRemainders(): ProblemCore {
  const divisor = randInt(4, 9);
  const quotient = randInt(12, 45);
  const remainder = randInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const fractionalRemainder = `${remainder}/${divisor}`;
  return {
    prompt: `${dividend} lanterns are packed into boxes of ${divisor}. What is ${dividend} ÷ ${divisor} as a mixed number?`,
    correctAnswer: `${quotient} ${fractionalRemainder}`,
    wrongAnswers: [
      `${quotient} ${divisor - remainder}/${divisor}`,
      `${quotient + 1} ${fractionalRemainder}`,
      `${quotient - 1} ${fractionalRemainder}`,
      `${quotient} ${remainder}/${divisor + 1}`,
      String(quotient),
    ],
    hint: "Divide to find the whole number. Write the leftover part as a fraction over the divisor.",
    secondHint: "Use multiplication to check the whole number, then put the remainder over the number you divided by.",
  };
}

function g4EquationTrueFalse(): ProblemCore {
  const a = randInt(12, 48);
  const b = randInt(3, 12);
  const trueValue = a * b;
  const makeTrue = Math.random() < 0.5;
  const rightSide = makeTrue ? trueValue : trueValue + [b, -b, 10, -10][randInt(0, 3)];
  const answer = makeTrue ? "true" : "false";
  return {
    prompt: `Is this equation true or false: ${a} × ${b} = ${rightSide}?`,
    correctAnswer: answer,
    wrongAnswers: ["true", "false", "cannot tell", `${trueValue}`].filter(
      (choice) => choice !== answer,
    ),
    hint: "Evaluate both sides of the equation.",
    secondHint: `Find ${a} × ${b}, then compare it to ${rightSide}.`,
  };
}

function g4UnknownNumberEquation(): ProblemCore {
  const unknown = randInt(6, 24);
  const factor = randInt(3, 12);
  const product = unknown * factor;
  const divisionForm = Math.random() < 0.45;

  return {
    prompt: divisionForm
      ? `${product} ÷ □ = ${factor}. What number belongs in the box?`
      : `□ × ${factor} = ${product}. What number belongs in the box?`,
    correctAnswer: String(unknown),
    wrongAnswers: [
      factor,
      product,
      unknown + 1,
      Math.max(1, unknown - 1),
      factor + unknown,
    ].map(String),
    hint: "Use the relationship between multiplication and division.",
    secondHint: divisionForm
      ? `Think: ${factor} times what number equals ${product}?`
      : `Think: ${product} divided by ${factor} equals the missing factor.`,
  };
}

function g4NumberPatternRule(): ProblemCore {
  const start = randInt(3, 40);
  const step = [4, 5, 6, 8, 10, 12][randInt(0, 5)];
  const pattern = Array.from({ length: 4 }, (_, index) => start + index * step);
  const answer = pattern[pattern.length - 1] + step;
  return {
    prompt: `A number pattern starts ${pattern.join(", ")}. The rule is add ${step}. What number comes next?`,
    correctAnswer: String(answer),
    wrongAnswers: [
      pattern[pattern.length - 1],
      answer + step,
      answer - 1,
      answer + 1,
      start * step,
    ].map(String),
    hint: "Use the rule on the last number shown.",
    secondHint: `Add ${step} to ${pattern[pattern.length - 1]}.`,
  };
}

function g4FactorsPrimeComposite(): ProblemCore {
  const classify = Math.random() < 0.45;
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  if (classify) {
    const composite = Math.random() < 0.65;
    const number = composite
      ? [4, 6, 8, 9, 10, 12, 15, 16, 18, 21, 24, 27, 35, 49, 64][randInt(0, 14)]
      : primes[randInt(0, primes.length - 1)];
    const answer = composite ? "composite" : "prime";
    return {
      prompt: `Is ${number} prime, composite, or neither?`,
      correctAnswer: answer,
      wrongAnswers: ["prime", "composite", "neither", "factor"].filter(
        (choice) => choice !== answer,
      ),
      hint: "A prime number has exactly two factors: 1 and itself. A composite number has more than two factors.",
      secondHint: "Try dividing by small numbers like 2, 3, 5, or 7. If one divides evenly, the number is composite.",
    };
  }

  const a = randInt(3, 12);
  const b = randInt(3, 12);
  const product = a * b;
  const answer = `${a} and ${b}`;

  return {
    prompt: `Which factor pair makes ${product}?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${a + 1} and ${b}`,
      `${a} and ${b + 1}`,
      `${Math.max(1, a - 1)} and ${b}`,
      `${a + b} and 1`,
    ],
    hint: "A factor pair multiplies together to make the target number.",
    secondHint: `Look for two numbers whose product is ${product}.`,
  };
}

function g4AreaPerimeterRectangles(): ProblemCore {
  const length = randInt(6, 18);
  const width = randInt(4, 12);
  const missingSide = Math.random() < 0.35;

  if (missingSide) {
    const perimeter = 2 * (length + width);
    return {
      prompt: `A rectangular garden has a perimeter of ${perimeter} feet and one side is ${length} feet long. What is the other side length?`,
      correctAnswer: `${width} feet`,
      wrongAnswers: [
        `${perimeter - length} feet`,
        `${perimeter / 2} feet`,
        `${length + width} feet`,
        `${Math.max(1, width - 1)} feet`,
        `${width + 1} feet`,
      ],
      hint: "Perimeter includes two lengths and two widths.",
      secondHint: "Divide the perimeter by 2 to get length + width, then subtract the known side.",
    };
  }

  const area = Math.random() < 0.5;
  const answer = area ? length * width : 2 * (length + width);
  return {
    prompt: `A rectangle is ${length} feet long and ${width} feet wide. What is its ${area ? "area" : "perimeter"}?`,
    correctAnswer: `${answer} ${area ? "square feet" : "feet"}`,
    wrongAnswers: [
      `${length + width} feet`,
      `${length * width} square feet`,
      `${2 * (length + width)} feet`,
      `${answer + length} ${area ? "square feet" : "feet"}`,
    ],
    hint: area
      ? "Area covers the inside of the rectangle. Multiply length by width."
      : "Perimeter is the distance around the rectangle. Add all four sides.",
    secondHint: area
      ? "Use square units for area."
      : "Use length + width + length + width for perimeter.",
  };
}

function g4SamePerimeterArea(): ProblemCore {
  const lengthA = randInt(6, 16);
  const widthA = randInt(4, 12);
  const perimeter = 2 * (lengthA + widthA);
  let lengthB = randInt(5, 18);
  let widthB = perimeter / 2 - lengthB;
  let attempts = 0;
  while ((!Number.isInteger(widthB) || widthB <= 0 || lengthB * widthB === lengthA * widthA) && attempts < 25) {
    lengthB = randInt(5, 18);
    widthB = perimeter / 2 - lengthB;
    attempts += 1;
  }
  if (!Number.isInteger(widthB) || widthB <= 0) return g4AreaPerimeterRectangles();
  const areaA = lengthA * widthA;
  const areaB = lengthB * widthB;
  const answer = areaA > areaB ? "Rectangle A" : "Rectangle B";

  return {
    prompt: `Rectangle A is ${lengthA} by ${widthA}. Rectangle B is ${lengthB} by ${widthB}. They have the same perimeter. Which rectangle has the greater area?`,
    correctAnswer: answer,
    wrongAnswers: [
      answer === "Rectangle A" ? "Rectangle B" : "Rectangle A",
      "They have the same area",
      `${perimeter} square units`,
      `${Math.max(areaA, areaB)} units`,
    ],
    hint: "Same perimeter does not always mean same area. Find each rectangle's area.",
    secondHint: "Multiply length by width for each rectangle, then compare the two areas.",
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
    wrongAnswers: [
      `${numerator + factor}/${denominator + factor}`,
      `${numerator}/${denominator * factor}`,
      `${numerator * factor}/${denominator}`,
      `${denominator}/${numerator}`,
    ],
    hint: "Equivalent fractions name the same amount. Multiply the numerator and denominator by the same number.",
    secondHint: "Check whether the top and bottom changed by the same factor.",
  };
}

function g4EquivalentFractionsGreaterThanOne(): ProblemCore {
  const denominator = randInt(3, 9);
  const numerator = randInt(denominator + 1, denominator * 2 - 1);
  const factor = randInt(2, 4);
  const answer = `${numerator * factor}/${denominator * factor}`;

  return {
    prompt: `Which fraction is equivalent to ${numerator}/${denominator}?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${numerator + factor}/${denominator + factor}`,
      `${numerator * factor}/${denominator}`,
      `${numerator}/${denominator * factor}`,
      `${denominator}/${numerator}`,
      `${numerator + denominator}/${denominator * factor}`,
    ],
    hint: "Equivalent fractions can be greater than one and still name the same amount.",
    secondHint: "Multiply the numerator and denominator by the same factor. The fraction may look larger, but the value stays equal.",
  };
}

function g4FractionCompare(): ProblemCore {
  const denominators = [3, 4, 5, 6, 8, 10, 12];
  const d1 = denominators[randInt(0, denominators.length - 1)];
  let d2 = denominators[randInt(0, denominators.length - 1)];
  while (d2 === d1) d2 = denominators[randInt(0, denominators.length - 1)];
  let n1 = randInt(1, d1 + 3);
  let n2 = randInt(1, d2 + 3);
  while (n1 / d1 === n2 / d2) {
    n1 = randInt(1, d1 + 3);
    n2 = randInt(1, d2 + 3);
  }
  const first = `${n1}/${d1}`;
  const second = `${n2}/${d2}`;
  const answer = n1 / d1 > n2 / d2 ? first : second;

  return {
    prompt: `Which fraction is greater: ${first} or ${second}?`,
    correctAnswer: answer,
    wrongAnswers: [
      answer === first ? second : first,
      "They are equal",
      `${n1 + n2}/${d1 + d2}`,
      `${Math.max(n1, n2)}/${Math.max(d1, d2)}`,
    ],
    hint: "Use a benchmark fraction or make equivalent fractions with a common denominator.",
    secondHint: "Fractions with different denominators need careful comparison. Same-size pieces are easier to compare.",
    richDisplay: [
      fractionDisplay(n1, d1, "First fraction"),
      fractionDisplay(n2, d2, "Second fraction"),
    ],
  };
}

function g4DecimalsHundredths(): ProblemCore {
  const tenths = randInt(1, 9);
  const hundredths = tenths * 10;
  return {
    prompt: `Which decimal is equal to ${hundredths}/100?`,
    correctAnswer: (hundredths / 100).toFixed(2),
    wrongAnswers: [
      (tenths / 100).toFixed(2),
      (hundredths / 10).toFixed(2),
      `0.${hundredths + 1}`,
      `${tenths}.00`,
    ],
    hint: "Hundredths are two places after the decimal point. Think of 100 equal parts.",
    secondHint: "A fraction out of 100 becomes a decimal with two digits after the decimal point.",
  };
}

function g4DecimalsTenthsToFraction(): ProblemCore {
  const tenths = randInt(1, 9);
  const decimal = (tenths / 10).toFixed(1);
  return {
    prompt: `Which fraction is equal to ${decimal}?`,
    correctAnswer: `${tenths}/10`,
    wrongAnswers: [
      `${tenths}/100`,
      `${tenths * 10}/10`,
      `${10}/${tenths}`,
      `${tenths + 1}/10`,
      `${Math.max(1, tenths - 1)}/10`,
    ],
    hint: "Tenths are one digit after the decimal point.",
    secondHint: `${decimal} means ${tenths} tenths, so write ${tenths} over 10.`,
  };
}

function g4DecimalMoreLess(): ProblemCore {
  const base = randInt(10, 899) / 100;
  const change = Math.random() < 0.5 ? 0.1 : 0.01;
  const more = Math.random() < 0.55;
  const answer = more ? base + change : Math.max(0, base - change);
  const wrongs = new Set<string>();
  for (const candidate of [
    base,
    more ? base + 1 : Math.max(0, base - 1),
    more ? base + 0.1 : Math.max(0, base - 0.1),
    more ? base + 0.01 : Math.max(0, base - 0.01),
    answer + change,
    Math.max(0, answer - change),
  ]) {
    const formatted = candidate.toFixed(2);
    if (formatted !== answer.toFixed(2)) wrongs.add(formatted);
  }
  return {
    prompt: `What number is ${change.toFixed(2)} ${more ? "more" : "less"} than ${base.toFixed(2)}?`,
    correctAnswer: answer.toFixed(2),
    wrongAnswers: [...wrongs],
    hint: "Tenths and hundredths are different place values.",
    secondHint: `${change.toFixed(2)} changes the ${change === 0.1 ? "tenths" : "hundredths"} place.`,
  };
}

function g4DecimalOperations(): ProblemCore {
  const first = randInt(125, 975) / 100;
  const second = randInt(25, 425) / 100;
  const subtract = Math.random() < 0.45;
  const answer = subtract ? first - second : first + second;
  if (subtract && answer <= 0) return g4DecimalOperations();
  return {
    prompt: subtract
      ? `A potion bottle has ${first.toFixed(2)} liters. The hero uses ${second.toFixed(2)} liters. How many liters are left?`
      : `A potion bottle has ${first.toFixed(2)} liters. The hero adds ${second.toFixed(2)} liters more. How many liters are there now?`,
    correctAnswer: unitAnswer(answer.toFixed(2), "liter", "liters"),
    wrongAnswers: [
      first + second,
      Math.abs(first - second),
      answer + 0.1,
      Math.max(0, answer - 0.1),
      answer + 0.01,
    ].map((value) => unitAnswer(value.toFixed(2), "liter", "liters")),
    hint: "Line up decimal points before adding or subtracting.",
    secondHint: "Hundredths line up with hundredths, and tenths line up with tenths.",
  };
}

function g4FractionAddLikeDenominators(): ProblemCore {
  const denominator = [5, 6, 8, 10, 12][randInt(0, 4)];
  const subtract = Math.random() < 0.35;

  if (subtract) {
    const n1 = randInt(3, denominator + 3);
    const n2 = randInt(1, n1 - 1);
    const answer = fraction(n1 - n2, denominator);
    return {
      prompt: `What is ${n1}/${denominator} - ${n2}/${denominator}?`,
      correctAnswer: answer,
      wrongAnswers: [
        `${n1 - n2}/${denominator * 2}`,
        `${n1 + n2}/${denominator}`,
        `${Math.max(1, n1 - n2)}/${denominator + 1}`,
        `${n2}/${denominator}`,
      ],
      hint: "The denominators are the same, so subtract the numerators.",
      secondHint: "Keep the denominator the same. Only the top numbers change.",
      richDisplay: [
        fractionDisplay(n1, denominator, "First fraction"),
        fractionDisplay(n2, denominator, "Second fraction"),
      ],
    };
  }

  const n1 = randInt(1, denominator - 1);
  const n2 = randInt(1, denominator - 1);
  const answer = fraction(n1 + n2, denominator);
  return {
    prompt: `What is ${n1}/${denominator} + ${n2}/${denominator}?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${n1 + n2}/${denominator * 2}`,
      `${Math.abs(n1 - n2) || 1}/${denominator}`,
      `${n1 + n2 + 1}/${denominator}`,
      `${n1}/${denominator}`,
    ],
    hint: "The denominators are the same, so add the numerators.",
    secondHint: "Keep the denominator the same. Add only the top numbers.",
    richDisplay: [
      fractionDisplay(n1, denominator, "First fraction"),
      fractionDisplay(n2, denominator, "Second fraction"),
    ],
  };
}

function g4FractionDecomposition(): ProblemCore {
  const denominator = [5, 6, 8, 10, 12][randInt(0, 4)];
  const numerator = randInt(3, denominator + 4);
  const first = randInt(1, numerator - 1);
  const second = numerator - first;
  const answer = `${first}/${denominator} + ${second}/${denominator}`;

  return {
    prompt: `Which sum decomposes ${numerator}/${denominator} using the same denominator?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${first}/${denominator + 1} + ${second}/${denominator + 1}`,
      `${first + second}/${denominator + denominator}`,
      `${first}/${denominator} + ${Math.max(1, second - 1)}/${denominator}`,
      `${numerator}/${denominator} + 1/${denominator}`,
    ],
    hint: "Decompose means break one fraction into a sum of fractions.",
    secondHint: "Keep the denominator the same and make sure the numerators add to the original numerator.",
    richDisplay: [fractionDisplay(numerator, denominator, "Fraction to decompose")],
  };
}

function g4FractionTenthsHundredthsAdd(): ProblemCore {
  const tenths = randInt(1, 8);
  const hundredths = randInt(5, 85);
  const answerHundredths = tenths * 10 + hundredths;
  const answer = fraction(answerHundredths, 100);

  return {
    prompt: `What is ${tenths}/10 + ${hundredths}/100?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${tenths + hundredths}/110`,
      `${tenths + hundredths}/100`,
      `${answerHundredths}/10`,
      fraction(Math.max(1, answerHundredths - 10), 100),
      fraction(answerHundredths + 10, 100),
    ],
    hint: "Convert tenths to hundredths before adding.",
    secondHint: `${tenths}/10 is ${tenths * 10}/100. Add the hundredths after the denominators match.`,
    richDisplay: [
      fractionDisplay(tenths, 10, "Tenths"),
      fractionDisplay(hundredths, 100, "Hundredths"),
    ],
  };
}

function g4FractionTimesWhole(): ProblemCore {
  const whole = randInt(2, 8);
  const denominator = [3, 4, 5, 6, 8, 10][randInt(0, 5)];
  const numerator = randInt(1, denominator - 1);
  const answer = fraction(whole * numerator, denominator);
  const answerWithUnit = `${answer} yards`;

  return {
    prompt: `A banner uses ${numerator}/${denominator} yard of ribbon. How much ribbon is needed for ${whole} banners?`,
    correctAnswer: answerWithUnit,
    wrongAnswers: [
      fraction(whole + numerator, denominator),
      `${whole}/${denominator}`,
      fraction(whole * numerator, denominator + whole),
      fraction(whole * numerator + 1, denominator),
    ].map((value) => `${value} yards`),
    hint: "This is repeated groups of the same fraction.",
    secondHint: "Multiply the whole number by the numerator. Keep the denominator the same.",
    richDisplay: [fractionDisplay(numerator, denominator, "Ribbon per banner")],
  };
}

function g4MoneyDecimal(): ProblemCore {
  const first = randInt(125, 975);
  const second = randInt(75, 625);
  const taxOrFee = randInt(25, 175);
  const twoStep = Math.random() < 0.45;
  const answer = twoStep ? first + second - taxOrFee : first + second;

  return {
    prompt: twoStep
      ? `A market basket costs ${money(first)} and a lantern costs ${money(second)}. A coupon takes off ${money(taxOrFee)}. What is the total?`
      : `A market basket costs ${money(first)} and a lantern costs ${money(second)}. What is the total?`,
    correctAnswer: money(answer),
    wrongAnswers: [
      money(first + second + taxOrFee),
      money(Math.abs(first - second)),
      money(first + second),
      money(Math.max(0, answer - 100)),
      money(answer + 100),
    ],
    hint: "Line up the dollars and cents. Add or subtract cents with cents.",
    secondHint: twoStep
      ? "Add the two prices first. Then subtract the coupon."
      : "Add the two prices. Keep two digits after the decimal point.",
  };
}

function g4MeasurementConversion(): ProblemCore {
  const conversions = [
    { from: "yards", singularFrom: "yard", to: "feet", factor: 3, category: "length" as const },
    { from: "feet", singularFrom: "foot", to: "inches", factor: 12, category: "length" as const },
    { from: "hours", singularFrom: "hour", to: "minutes", factor: 60, category: "time" as const },
    { from: "quarts", singularFrom: "quart", to: "pints", factor: 2, category: "capacity" as const },
    { from: "pounds", singularFrom: "pound", to: "ounces", factor: 16, category: "weight" as const },
  ];
  const conversion = conversions[randInt(0, conversions.length - 1)];
  const amount = randInt(2, 9);
  const answer = amount * conversion.factor;

  return {
    prompt: `Use the reference table below. A quest supply list shows ${amount} ${conversion.from}. How many ${conversion.to} is that?`,
    correctAnswer: `${answer} ${conversion.to}`,
    wrongAnswers: [
      `${amount + conversion.factor} ${conversion.to}`,
      `${Math.max(1, answer - conversion.factor)} ${conversion.to}`,
      `${answer + conversion.factor} ${conversion.to}`,
      `${amount} ${conversion.to}`,
    ],
    hint: `Convert from ${conversion.from} to ${conversion.to} using the matching unit relationship.`,
    secondHint: `Each ${conversion.singularFrom} has ${conversion.factor} ${conversion.to}, so multiply ${amount} by ${conversion.factor}.`,
    richDisplay: [customaryReferenceTableDisplay(conversion.category, 4)],
  };
}

function g4DataInterpretation(): ProblemCore {
  const values = [randInt(8, 20), randInt(10, 24), randInt(12, 28), randInt(6, 18)];
  const labels = ["crystals", "keys", "scrolls", "coins"];
  const richDisplay = [
    dataTableDisplay(
      "Quest data",
      labels.map((label, index) => [label, values[index]]),
    ),
  ];
  const askRange = Math.random() < 0.5;
  if (askRange) {
    const answer = Math.max(...values) - Math.min(...values);
    return {
      prompt: "Use the quest data table below. What is the range of the data?",
      correctAnswer: unitAnswer(answer, "item", "items"),
      wrongAnswers: [
        Math.max(...values),
        Math.min(...values),
        values.reduce((sum, value) => sum + value, 0),
        answer + 1,
      ].map((value) => unitAnswer(value, "item", "items")),
      hint: "Range tells how spread out the data are.",
      secondHint: "Subtract the smallest value from the largest value.",
      richDisplay,
    };
  }

  const targetA = randInt(0, 3);
  let targetB = randInt(0, 3);
  while (targetB === targetA) targetB = randInt(0, 3);
  const answer = values[targetA] + values[targetB];
  return {
    prompt: `Use the quest data table below. How many ${labels[targetA]} and ${labels[targetB]} are there altogether?`,
    correctAnswer: unitAnswer(answer, "item", "items"),
    wrongAnswers: [
      Math.abs(values[targetA] - values[targetB]),
      Math.max(...values),
      values.reduce((sum, value) => sum + value, 0),
      answer + 2,
    ].map((value) => unitAnswer(value, "item", "items")),
    hint: "Find the two categories named in the question first.",
    secondHint: "Altogether means add only those two values, not every value in the table.",
    richDisplay,
  };
}

function g4DataModeMedianRange(): ProblemCore {
  const values = shuffle([
    randInt(6, 12),
    randInt(13, 18),
    randInt(19, 25),
    randInt(26, 32),
    randInt(13, 18),
  ]);
  const sorted = [...values].sort((a, b) => a - b);
  const mode = values.find((value, index) => values.indexOf(value) !== index) ?? values[0];
  const median = sorted[2];
  const range = Math.max(...values) - Math.min(...values);
  const questionType = ["mode", "median", "range"][randInt(0, 2)] as
    | "mode"
    | "median"
    | "range";
  const answer = questionType === "mode" ? mode : questionType === "median" ? median : range;
  const richDisplay = [
    dataTableDisplay(
      "Rune counts",
      values.map((value, index) => [`Day ${index + 1}`, value]),
    ),
  ];

  return {
    prompt: `Use the rune counts table below. What is the ${questionType} of the data?`,
    correctAnswer: unitAnswer(answer, "item", "items"),
    wrongAnswers: [
      mode,
      median,
      range,
      Math.max(...values),
      values.reduce((sum, value) => sum + value, 0),
    ]
      .filter((value) => value !== answer)
      .map((value) => unitAnswer(value, "item", "items")),
    hint: "Use the meaning of the data word in the question.",
    secondHint:
      questionType === "mode"
        ? "Mode is the value that appears most often."
        : questionType === "median"
          ? "Median is the middle value after the data are ordered."
          : "Range is the greatest value minus the least value.",
    richDisplay,
  };
}

function g4DecimalCompare(): ProblemCore {
  const a = randInt(1, 99) / 100;
  let b = randInt(1, 99) / 100;
  while (a === b) b = randInt(1, 99) / 100;
  const greater = Math.max(a, b);
  const lesser = Math.min(a, b);
  return {
    prompt: `Which decimal is greater: ${a.toFixed(2)} or ${b.toFixed(2)}?`,
    correctAnswer: greater.toFixed(2),
    wrongAnswers: [
      lesser.toFixed(2),
      greater.toFixed(1),
      (Math.max(0.01, greater - 0.01)).toFixed(2),
      (Math.min(0.99, lesser + 0.01)).toFixed(2),
    ],
    hint: "Compare tenths first, then hundredths.",
    secondHint: "Line up the decimal points. The first different digit tells which decimal is greater.",
  };
}

function g4AngleClassification(): ProblemCore {
  const angle = [
    { measure: randInt(15, 85), label: "acute" },
    { measure: 90, label: "right" },
    { measure: randInt(95, 175), label: "obtuse" },
    { measure: 180, label: "straight" },
    { measure: randInt(185, 330), label: "reflex" },
  ][randInt(0, 4)];

  return {
    prompt: `An angle measures ${angle.measure}°. What type of angle is it?`,
    correctAnswer: angle.label,
    wrongAnswers: ["acute", "right", "obtuse", "straight", "reflex"].filter(
      (choice) => choice !== angle.label,
    ),
    hint: "Use the angle-size categories.",
    secondHint: "Acute is less than 90°, right is 90°, obtuse is between 90° and 180°, straight is 180°, and reflex is greater than 180°.",
  };
}

function g4Angles(): ProblemCore {
  const whole = [90, 180, 270, 360][randInt(0, 3)];
  const known = randInt(15, whole - 15);
  const answer = whole - known;
  return {
    prompt: `Two angles make ${whole}°. One angle is ${known}°. What is the other angle?`,
    correctAnswer: degreeAnswer(answer),
    wrongAnswers: degreeDistractors(answer, [
      known,
      whole + known,
      Math.abs(answer - known),
      answer + 5,
      answer - 5,
      answer + 10,
      answer - 10,
    ]),
    hint: "The two angles combine to make the whole angle. Use subtraction to find the missing part.",
    secondHint: "Start with the whole angle, then subtract the angle you already know.",
  };
}

function g4AnglesThreePart(): ProblemCore {
  const whole = [90, 180, 270, 360][randInt(0, 3)];
  const first = randInt(15, Math.min(120, whole - 35));
  const second = randInt(15, Math.min(140, whole - first - 15));
  const knownSum = first + second;
  const answer = whole - knownSum;

  return {
    prompt: `Three angles make ${whole}°. Two angles are ${first}° and ${second}°. What is the missing angle?`,
    correctAnswer: degreeAnswer(answer),
    wrongAnswers: degreeDistractors(answer, [
      knownSum,
      whole - first,
      whole - second,
      answer + 5,
      answer - 5,
      answer + 10,
      answer - 10,
    ]),
    hint: "The three angle parts combine to make the whole angle.",
    secondHint: "Add the two known angles first. Then subtract that sum from the whole angle.",
  };
}

function g5DecimalPlaceValue(): ProblemCore {
  const whole = randInt(12, 98);
  const tenths = randInt(1, 9);
  let hundredths = randInt(1, 9);
  while (hundredths === tenths) hundredths = randInt(1, 9);
  let thousandths = randInt(1, 9);
  while (thousandths === tenths || thousandths === hundredths) {
    thousandths = randInt(1, 9);
  }
  const number = `${whole}.${tenths}${hundredths}${thousandths}`;
  return {
    prompt: `Which expression decomposes ${number} by place value?`,
    correctAnswer: `${whole} + ${tenths}/10 + ${hundredths}/100 + ${thousandths}/1000`,
    wrongAnswers: [
      `${whole} + ${tenths}/100 + ${hundredths}/10 + ${thousandths}/1000`,
      `${whole} + ${tenths}/10 + ${hundredths}/1000 + ${thousandths}/100`,
      `${whole} + ${tenths}/1000 + ${hundredths}/100 + ${thousandths}/10`,
      `${whole + 1} + ${tenths}/10 + ${hundredths}/100 + ${thousandths}/1000`,
    ],
    hint: "Break the number into whole number, tenths, hundredths, and thousandths parts.",
    secondHint: "The first digit after the decimal is tenths, the second is hundredths, and the third is thousandths.",
  };
}

function g5DecimalOperations(): ProblemCore {
  const a = randInt(125, 999) / 100;
  const b = randInt(25, 499) / 100;
  const answer = a + b;
  return {
    prompt: `A robot travels ${a.toFixed(2)} miles, then ${b.toFixed(2)} more miles. How far does it travel in all?`,
    correctAnswer: unitAnswer(answer.toFixed(2), "mile", "miles"),
    wrongAnswers: decimalDistractors(answer, 2, [0.1, 0.2, 1, 0.01]).map(
      (value) => unitAnswer(value, "mile", "miles"),
    ),
    hint: "Line up the decimal points so tenths add to tenths and hundredths add to hundredths.",
    secondHint: "Add as if they are whole numbers, then place the decimal point in the same aligned spot.",
  };
}

function g5DecimalSubtraction(): ProblemCore {
  const minuend = randInt(2500, 9999) / 1000;
  const subtrahend = randInt(250, Math.floor(minuend * 1000) - 100) / 1000;
  const answer = minuend - subtrahend;
  return {
    prompt: `A skyship has ${minuend.toFixed(3)} liters of fuel. It uses ${subtrahend.toFixed(3)} liters. How many liters are left?`,
    correctAnswer: unitAnswer(answer.toFixed(3), "liter", "liters"),
    wrongAnswers: [
      (minuend + subtrahend).toFixed(3),
      Math.abs(minuend - Math.round(subtrahend)).toFixed(3),
      Math.max(0, answer - 0.1).toFixed(3),
      (answer + 0.1).toFixed(3),
      ...decimalDistractors(answer, 3, [0.001, 0.01, 0.1]),
    ].map((value) => unitAnswer(value, "liter", "liters")),
    hint: "Line up the decimal points before subtracting. Thousandths line up with thousandths.",
    secondHint: "Subtract from right to left like whole numbers, then keep the decimal point aligned.",
  };
}

function g5DecimalCompare(): ProblemCore {
  const a = randInt(1000, 9999) / 1000;
  let b = randInt(1000, 9999) / 1000;
  while (a === b) b = randInt(1000, 9999) / 1000;
  const greater = Math.max(a, b);
  const lesser = Math.min(a, b);

  return {
    prompt: `Which decimal is greater: ${a.toFixed(3)} or ${b.toFixed(3)}?`,
    correctAnswer: greater.toFixed(3),
    wrongAnswers: [
      lesser.toFixed(3),
      (greater - 0.001).toFixed(3),
      (lesser + 0.001).toFixed(3),
      greater.toFixed(2),
    ],
    hint: "Compare digits by place value: ones, tenths, hundredths, then thousandths.",
    secondHint: "Line up the decimal points. The first place where the digits differ decides the greater number.",
  };
}

function g5DecimalRounding(): ProblemCore {
  const value = randInt(1000, 99999) / 1000;
  const places = [
    { label: "whole number", decimals: 0 },
    { label: "tenth", decimals: 1 },
    { label: "hundredth", decimals: 2 },
  ];
  const target = places[randInt(0, places.length - 1)];
  const answer = value.toFixed(target.decimals);

  return {
    prompt: `Round ${value.toFixed(3)} to the nearest ${target.label}.`,
    correctAnswer: answer,
    wrongAnswers: [
      value.toFixed(3),
      (value + 0.01).toFixed(target.decimals),
      Math.max(0, value - 0.01).toFixed(target.decimals),
      value.toFixed(Math.min(3, target.decimals + 1)),
    ],
    hint: "Find the place you are rounding to, then look one digit to the right.",
    secondHint: "A digit of 5 or more rounds up. A digit of 4 or less stays the same.",
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
    wrongAnswers: [
      fraction(n1 + n2, d1 + d2),
      fraction(n1 + n2, d1 * d2),
      fraction(Math.abs(n1 * d2 - n2 * d1) || 1, d1 * d2),
      `${n1 + n2}/${Math.max(d1, d2)}`,
    ],
    hint: "For unlike denominators, first make equivalent fractions with a common denominator.",
    secondHint: "Multiply to make matching denominator sizes, then add the numerators only.",
    richDisplay: [
      fractionDisplay(n1, d1, "First fraction"),
      fractionDisplay(n2, d2, "Second fraction"),
    ],
  };
}

function g5FractionSubtractUnlike(): ProblemCore {
  let d1 = [4, 5, 6, 8, 10, 12][randInt(0, 5)];
  let d2 = [3, 4, 5, 6, 8, 10][randInt(0, 5)];
  while (d2 === d1) d2 = [3, 4, 5, 6, 8, 10][randInt(0, 5)];
  let n1 = randInt(1, d1 - 1);
  let n2 = randInt(1, d2 - 1);

  if (n1 / d1 <= n2 / d2) {
    [n1, n2] = [n2, n1];
    [d1, d2] = [d2, d1];
  }

  const answer = fraction(n1 * d2 - n2 * d1, d1 * d2);
  return {
    prompt: `A lantern is filled ${n1}/${d1} full. The hero uses ${n2}/${d2} of the lantern oil. How much of the lantern remains filled?`,
    correctAnswer: answer,
    wrongAnswers: [
      fraction(Math.abs(n1 - n2), Math.max(d1, d2)),
      fraction(Math.abs(n1 - n2) || 1, d1 + d2),
      fraction(n1 * d2 + n2 * d1, d1 * d2),
      `${Math.abs(n1 - n2) || 1}/${d1}`,
      fraction(n1 * d2 - n2 * d1 + 1, d1 * d2),
    ],
    hint: "For unlike denominators, make equivalent fractions with a common denominator before subtracting.",
    secondHint: "Use the common denominator, subtract the numerators, and keep the denominator the same.",
    richDisplay: [
      fractionDisplay(n1, d1, "Amount filled"),
      fractionDisplay(n2, d2, "Amount used"),
    ],
  };
}

function g5FractionTimesWhole(): ProblemCore {
  const whole = randInt(2, 9);
  const denominator = randInt(3, 10);
  const numerator = randInt(1, denominator - 1);
  const answer = fraction(whole * numerator, denominator);
  const answerWithUnit = `${answer} cups`;
  return {
    prompt: `A recipe uses ${numerator}/${denominator} cup of spice for each batch. How much is needed for ${whole} batches?`,
    correctAnswer: answerWithUnit,
    wrongAnswers: [
      fraction(whole + numerator, denominator),
      fraction(whole * denominator, numerator),
      `${whole}/${denominator}`,
      fraction(whole * numerator + 1, denominator),
    ].map((value) => `${value} cups`),
    hint: "A fraction for each batch means repeated groups of that fraction. Multiply the whole number by the numerator.",
    secondHint: "Keep the denominator the same, and multiply the whole number by the top number.",
    richDisplay: [fractionDisplay(numerator, denominator, "Spice per batch")],
  };
}

function g5FractionTimesFraction(): ProblemCore {
  const d1 = [3, 4, 5, 6, 8][randInt(0, 4)];
  const d2 = [4, 5, 6, 8, 10][randInt(0, 4)];
  const n1 = randInt(1, d1 - 1);
  const n2 = randInt(1, d2 - 1);
  const answer = fraction(n1 * n2, d1 * d2);

  return {
    prompt: `What is ${n1}/${d1} × ${n2}/${d2}?`,
    correctAnswer: answer,
    wrongAnswers: [
      fraction(n1 + n2, d1 + d2),
      fraction(n1 * d2, d1 * n2),
      fraction(n1 * n2, d1 + d2),
      fraction(n1 + n2, d1 * d2),
    ],
    hint: "To multiply fractions, multiply the numerators and multiply the denominators.",
    secondHint: "Top times top, bottom times bottom. Simplify the fraction if possible.",
    richDisplay: [
      fractionDisplay(n1, d1, "First factor"),
      fractionDisplay(n2, d2, "Second factor"),
    ],
  };
}

function g5Volume(): ProblemCore {
  const length = randInt(4, 12);
  const width = randInt(3, 10);
  const height = randInt(2, 8);
  const answer = length * width * height;
  return {
    prompt: `A rectangular prism is ${length} units long, ${width} units wide, and ${height} units tall. What is its volume?`,
    correctAnswer: unitAnswer(answer, "cubic unit", "cubic units"),
    wrongAnswers: [
      length * width,
      2 * (length + width + height),
      answer + length * width,
      Math.max(1, answer - width * height),
    ].map((value) => unitAnswer(value, "cubic unit", "cubic units")),
    hint: "Volume tells how much space a rectangular prism takes up. Multiply length × width × height.",
    secondHint: "Find the base area first with length × width, then multiply by the height.",
  };
}

function g5CoordinatePoint(): ProblemCore {
  const x = randInt(1, 9);
  let y = randInt(1, 9);
  while (y === x) y = randInt(1, 9);
  return {
    prompt: `On a quest map, a crystal is ${x} spaces east and ${y} spaces north from camp. Which ordered pair shows the crystal's location?`,
    correctAnswer: `(${x}, ${y})`,
    wrongAnswers: [
      `(${y}, ${x})`,
      `(${x}, ${x})`,
      `(${y}, ${y})`,
      `(${Math.max(0, x - 1)}, ${y})`,
      `(${x}, ${Math.max(0, y - 1)})`,
    ],
    hint: "In an ordered pair, the first number is x and the second number is y.",
    secondHint: "East matches x. North matches y. Write the point as (x, y).",
  };
}

function g5CoordinateAxes(): ProblemCore {
  const x = randInt(1, 10);
  const y = randInt(1, 10);
  const askAxis = Math.random() < 0.35;

  if (askAxis) {
    return {
      prompt: `On a coordinate plane, which axis shows left and right movement?`,
      correctAnswer: "x-axis",
      wrongAnswers: ["y-axis", "origin", "ordered pair", "quadrant"],
      hint: "The x-axis runs side to side.",
      secondHint: "The y-axis runs up and down. The x-axis runs left and right.",
    };
  }

  return {
    prompt: `Plot a point ${x} spaces right and ${y} spaces up from the origin. Which ordered pair names the point?`,
    correctAnswer: `(${x}, ${y})`,
    wrongAnswers: [
      `(${y}, ${x})`,
      `(${x}, 0)`,
      `(0, ${y})`,
      `(${x + 1}, ${y})`,
    ],
    hint: "Start at the origin. Move right for x, then up for y.",
    secondHint: "Ordered pairs are written as (x, y).",
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
    hint: "Use order of operations. Multiplication happens before addition.",
    secondHint: "Do the multiplication part first, then add the final number.",
  };
}

function g5WholeNumberMultiplication(): ProblemCore {
  const a = randInt(123, 864);
  const b = randInt(12, 48);
  const answer = a * b;
  return {
    prompt: `A sky caravan carries ${a} supply boxes on each wagon. There are ${b} wagons. How many supply boxes are there in all?`,
    correctAnswer: answer.toLocaleString(),
    wrongAnswers: [
      a + b,
      a * (b + 1),
      (a + 10) * b,
      answer - a,
      answer + b,
    ].map((value) => value.toLocaleString()),
    hint: "Use multi-digit multiplication. Break one factor into tens and ones if that helps.",
    secondHint: "Multiply each place-value part, then add the partial products.",
  };
}

function g5WholeNumberDivision(): ProblemCore {
  const divisor = randInt(12, 24);
  const quotient = randInt(110, 420);
  const remainder = randInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  return {
    prompt: `${dividend.toLocaleString()} lanterns are packed equally into ${divisor} crates. What is ${dividend.toLocaleString()} ÷ ${divisor} as a mixed number?`,
    correctAnswer: `${quotient} ${remainder}/${divisor}`,
    wrongAnswers: [
      `${quotient} ${divisor - remainder}/${divisor}`,
      `${quotient + 1} ${remainder}/${divisor}`,
      `${quotient - 1} ${remainder}/${divisor}`,
      `${quotient} ${remainder}/${divisor + 1}`,
      quotient.toLocaleString(),
    ],
    hint: "Divide to find the whole-number quotient first.",
    secondHint: "Write the leftover amount as a fraction over the divisor.",
  };
}

function g5GeometryClassification(): ProblemCore {
  const questions = [
    {
      prompt: "Which shape must have exactly one pair of parallel sides?",
      correctAnswer: "trapezoid",
      wrongAnswers: ["rectangle", "rhombus", "square", "equilateral triangle"],
      hint: "Think about the defining attributes of each quadrilateral.",
      secondHint: "A trapezoid has exactly one pair of parallel sides in this classification.",
    },
    {
      prompt: "Which shape has four right angles and four equal sides?",
      correctAnswer: "square",
      wrongAnswers: ["rectangle", "rhombus", "trapezoid", "right triangle"],
      hint: "Look for a shape that has both right angles and equal side lengths.",
      secondHint: "A square is both a rectangle and a rhombus because it has right angles and equal sides.",
    },
    {
      prompt: "Which triangle has all three sides the same length?",
      correctAnswer: "equilateral triangle",
      wrongAnswers: ["right triangle", "isosceles triangle only", "scalene triangle", "obtuse triangle"],
      hint: "The word asks about side lengths, not angle size.",
      secondHint: "Equilateral means all sides are equal.",
    },
  ];
  return questions[randInt(0, questions.length - 1)];
}

function g5DataStatistics(): ProblemCore {
  const askMean = Math.random() < 0.5;
  if (askMean) {
    const values = [randInt(8, 18), randInt(10, 20), randInt(12, 22)];
    const targetMean = randInt(12, 20);
    const finalValue = targetMean * 4 - values.reduce((sum, value) => sum + value, 0);
    if (finalValue < 5 || finalValue > 30) return g5DataStatistics();
    const allValues = shuffle([...values, finalValue]);
    const richDisplay = [
      dataTableDisplay(
        "Team scores",
        allValues.map((value, index) => [`Score ${index + 1}`, value]),
      ),
    ];
    return {
      prompt: "Use the team scores table below. What is the mean score?",
      correctAnswer: unitAnswer(targetMean, "point", "points"),
      wrongAnswers: [
        Math.max(...allValues) - Math.min(...allValues),
        Math.max(...allValues),
        Math.min(...allValues),
        targetMean + 1,
        Math.max(1, targetMean - 1),
      ].map((value) => unitAnswer(value, "point", "points")),
      hint: "Mean is the fair-share average.",
      secondHint: "Add all the values, then divide by how many values there are.",
      richDisplay,
    };
  }

  const values = shuffle([randInt(6, 12), randInt(13, 18), randInt(20, 28), randInt(30, 38)]);
  const answer = Math.max(...values) - Math.min(...values);
  const richDisplay = [
    dataTableDisplay(
      "Distances",
      values.map((value, index) => [`Distance ${index + 1}`, value]),
    ),
  ];
  return {
    prompt: "Use the distances table below. What is the range in miles?",
    correctAnswer: unitAnswer(answer, "mile", "miles"),
    wrongAnswers: [
      Math.max(...values),
      Math.min(...values),
      values.reduce((sum, value) => sum + value, 0),
      answer + 2,
    ].map((value) => unitAnswer(value, "mile", "miles")),
    hint: "Range shows the distance between the greatest and least data values.",
    secondHint: "Subtract the smallest value from the largest value.",
    richDisplay,
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
  const answer = fraction(
    parsed.numerator + add * parsed.denominator,
    parsed.denominator,
  );
  const answerWithUnit = `${answer} crystals`;
  return {
    prompt: `A hero collects ${n1}/${d1} of a crystal, then ${n2}/${d2} of a crystal, then ${add} whole crystal${add === 1 ? "" : "s"}. How much crystal do they have?`,
    correctAnswer: answerWithUnit,
    wrongAnswers: [
      partial,
      fraction(parsed.numerator + add, parsed.denominator),
      fraction(parsed.numerator, parsed.denominator + add),
      `${add}/${parsed.denominator}`,
    ].map((value) => `${value} crystals`),
    hint: "Break this into steps: add the fractions first, then add the whole crystals.",
    secondHint: "Use a common denominator for the fractions. After that, add the whole-number amount.",
    richDisplay: [
      fractionDisplay(n1, d1, "First crystal"),
      fractionDisplay(n2, d2, "Second crystal"),
    ],
  };
}

function g5ExtremeWholeNumberRemainders(): ProblemCore {
  const buses = randInt(6, 12);
  const seats = randInt(18, 36);
  const students = buses * seats + randInt(1, seats - 1);
  const needed = Math.ceil(students / seats);

  return {
    prompt: `${students} students are going on a quest trip. Each wagon holds ${seats} students. How many wagons are needed?`,
    correctAnswer: unitAnswer(needed, "wagon", "wagons"),
    wrongAnswers: [
      Math.floor(students / seats),
      needed + 1,
      seats,
      buses,
    ].map((value) => unitAnswer(value, "wagon", "wagons")),
    hint: "Divide to see how many full wagons are filled, then think about the leftover students.",
    secondHint: "A remainder means another wagon is needed, even if it is not full.",
  };
}

function g5ExtremeDecimalCombo(): ProblemCore {
  const a = randInt(1250, 9999) / 1000;
  const b = randInt(250, 4999) / 1000;
  const c = randInt(50, 999) / 1000;
  const answer = a + b - c;
  return {
    prompt: `A crystal weighs ${a.toFixed(3)} kg. Another weighs ${b.toFixed(3)} kg. ${c.toFixed(3)} kg chips away. What weight remains?`,
    correctAnswer: unitAnswer(answer.toFixed(3), "kg", "kg"),
    wrongAnswers: decimalDistractors(answer, 3, [0.001, 0.01, 0.1, 1]).map(
      (value) => unitAnswer(value, "kg", "kg"),
    ),
    hint: "Line up the decimal points. Add the two weights first, then subtract what chipped away.",
    secondHint: "Track thousandths carefully: each number has three digits after the decimal.",
  };
}

function g5ExtremeVolume(): ProblemCore {
  const width = randInt(4, 10);
  const height = randInt(3, 9);
  const length = randInt(6, 14);
  const volume = width * height * length;
  return {
    prompt: `A prism has volume ${volume} cubic units, width ${width}, and height ${height}. What is its length?`,
    correctAnswer: unitAnswer(length, "unit", "units"),
    wrongAnswers: [
      width * height,
      volume / width,
      volume / height,
      length + width,
      Math.max(1, length - 2),
    ].map((value) => unitAnswer(value, "unit", "units")),
    hint: "Volume equals length × width × height. Here one dimension is missing.",
    secondHint: "Divide the volume by width × height to find the missing length.",
  };
}

function g5ExtremeMeasurementConversion(): ProblemCore {
  const yards = randInt(2, 8);
  const feet = randInt(1, 2);
  const extraFeet = randInt(4, 18);
  const totalFeet = yards * 3 + feet + extraFeet;

  return {
    prompt: `Use the reference table below. A banner uses ${yards} yards ${feet} feet of ribbon, then ${extraFeet} more feet. How many feet of ribbon is that altogether?`,
    correctAnswer: `${totalFeet} feet`,
    wrongAnswers: [
      `${yards + feet + extraFeet} feet`,
      `${yards * 3 + feet} feet`,
      `${yards * 3 + extraFeet} feet`,
      `${totalFeet + 3} feet`,
    ],
    hint: "Convert yards to feet before adding. One yard equals 3 feet.",
    secondHint: "Multiply yards by 3, then add the other feet.",
    richDisplay: [customaryReferenceTableDisplay("length", 5)],
  };
}

function g5ExtremeMoneyDecimal(): ProblemCore {
  const tickets = randInt(3, 8);
  const ticketCost = randInt(125, 475);
  const snackCost = randInt(225, 975);
  const budget = tickets * ticketCost + snackCost + randInt(100, 800);
  const spent = tickets * ticketCost + snackCost;
  const left = budget - spent;

  return {
    prompt: `A team has ${money(budget)}. They buy ${tickets} passes at ${money(ticketCost)} each and supplies for ${money(snackCost)}. How much money is left?`,
    correctAnswer: money(left),
    wrongAnswers: [
      money(spent),
      money(budget - ticketCost - snackCost),
      money(left + ticketCost),
      money(Math.max(0, left - 100)),
    ],
    hint: "Find the total cost first. Multiply the number of passes by the cost of each pass.",
    secondHint: "Add the supplies cost to the pass total, then subtract from the budget.",
  };
}

function g5ExtremeCoordinate(): ProblemCore {
  const week = randInt(2, 9);
  let inches = randInt(6, 24);
  while (inches === week) inches = randInt(6, 24);
  return {
    prompt: `A garden team plots plant growth at (${week}, ${inches}), where x is weeks and y is height in inches. What does ${inches} represent?`,
    correctAnswer: `${inches} inches tall`,
    wrongAnswers: [
      `${week} inches tall`,
      `${inches} weeks`,
      `${week} weeks`,
      `${week + inches} inches tall`,
    ],
    hint: "Read the meaning of each axis. The first coordinate matches x, and the second coordinate matches y.",
    secondHint: "Here y means height in inches, so the second number tells how tall the plant is.",
  };
}

function g5ExtremeExpressions(): ProblemCore {
  const a = randInt(5, 12);
  const b = randInt(2, 8);
  const c = randInt(3, 9);
  const subtotal = (a + b) * c;
  const d = randInt(5, Math.max(6, subtotal - 5));
  const answer = (a + b) * c - d;
  const misconceptionDistractors = [
    a + b * c - d,
    (a + b) * (c - d),
    (a + b) * c + d,
    answer + c,
  ].filter((value) => value >= 0 && value !== answer);
  return {
    prompt: `Evaluate (${a} + ${b}) × ${c} - ${d}.`,
    correctAnswer: String(answer),
    wrongAnswers: [
      ...misconceptionDistractors.map(String),
      ...numberDistractors(answer, 12),
    ],
    hint: "Use order of operations. Parentheses come first, then multiplication, then subtraction.",
    secondHint: "Solve inside the parentheses, multiply that result, then subtract the last number.",
  };
}

function g5ExtremeFractionUnlikeMultiStep(): ProblemCore {
  const d1 = [3, 4, 5, 6][randInt(0, 3)];
  const d2 = [5, 6, 8, 10][randInt(0, 3)];
  const n1 = randInt(1, d1 - 1);
  const n2 = randInt(1, d2 - 1);
  const extraWhole = randInt(1, 2);
  const combined = fraction(n1 * d2 + n2 * d1, d1 * d2);
  const parsed = parseFraction(combined);
  const answer = fraction(
    parsed.numerator + extraWhole * parsed.denominator,
    parsed.denominator,
  );
  const answerWithUnit = `${answer} cups`;

  return {
    prompt: `A recipe uses ${extraWhole} whole cup plus ${n1}/${d1} cup of moon flour and ${n2}/${d2} cup of star sugar. How many cups are used in all?`,
    correctAnswer: answerWithUnit,
    wrongAnswers: [
      fraction(n1 + n2 + extraWhole, d1 + d2),
      fraction(n1 * d2 + n2 * d1, d1 * d2),
      fraction(parsed.numerator + extraWhole, parsed.denominator),
      fraction(parsed.numerator + extraWhole * parsed.denominator + 1, parsed.denominator),
    ].map((value) => `${value} cups`),
    hint: "Combine the unlike-denominator fractions first.",
    secondHint: "Find a common denominator, add the fractions, then include the whole-number cup.",
    richDisplay: [
      fractionDisplay(n1, d1, "Moon flour"),
      fractionDisplay(n2, d2, "Star sugar"),
    ],
  };
}

function g5ExtremeDataRange(): ProblemCore {
  const day1 = randInt(18, 35);
  const day2 = randInt(24, 44);
  const day3 = randInt(30, 55);
  const day4 = randInt(36, 62);
  const values = shuffle([day1, day2, day3, day4]);
  const range = Math.max(...values) - Math.min(...values);
  const afterBonus = range + randInt(3, 9);
  const richDisplay = [
    dataTableDisplay(
      "Crystals found",
      values.map((value, index) => [`Day ${index + 1}`, value]),
    ),
  ];

  return {
    prompt: `Use the crystals-found table below. The final gate number is the range plus ${afterBonus - range}. What is the final gate number?`,
    correctAnswer: String(afterBonus),
    wrongAnswers: [
      String(range),
      String(Math.max(...values)),
      String(values.reduce((sum, value) => sum + value, 0)),
      String(afterBonus + 2),
    ],
    hint: "This is a two-step data problem. Find the range first.",
    secondHint: "Subtract the smallest value from the largest value, then add the bonus number.",
    richDisplay,
  };
}

const GENERATORS: Record<string, ProblemGenerator> = {
  g3PlaceValueDigit,
  g3ExpandedForm,
  g3WholeNumberCompare,
  g3MissingFactorEquation,
  g3Multiples,
  g3AddSub1000,
  g3MultiplicationFacts,
  g3DivisionFacts,
  g3AreaPerimeter,
  g3CompositeArea,
  g3QuadrilateralAttributes,
  g3FractionCompare,
  g3EquivalentFractions,
  g3Rounding,
  g3NumberPatterns,
  g3MeasurementLength,
  g3MeasurementMassVolume,
  g3ElapsedTime,
  g3ElapsedTimeTwoStep,
  g3DataInterpretation,
  g4Rounding,
  g4PlaceValueShift,
  g4ExpandedForm,
  g4WholeNumberCompare,
  g4Multiplication,
  g4TwoDigitMultiplication,
  g4EstimateProduct,
  g4DivisionRemainders,
  g4EquationTrueFalse,
  g4UnknownNumberEquation,
  g4NumberPatternRule,
  g4FactorsPrimeComposite,
  g4AreaPerimeterRectangles,
  g4SamePerimeterArea,
  g4EquivalentFractions,
  g4EquivalentFractionsGreaterThanOne,
  g4FractionCompare,
  g4DecimalsHundredths,
  g4DecimalsTenthsToFraction,
  g4DecimalMoreLess,
  g4DecimalOperations,
  g4FractionAddLikeDenominators,
  g4FractionDecomposition,
  g4FractionTenthsHundredthsAdd,
  g4FractionTimesWhole,
  g4MoneyDecimal,
  g4MeasurementConversion,
  g4DataInterpretation,
  g4DataModeMedianRange,
  g4DecimalCompare,
  g4AngleClassification,
  g4Angles,
  g4AnglesThreePart,
  g5DecimalPlaceValue,
  g5DecimalOperations,
  g5DecimalSubtraction,
  g5DecimalCompare,
  g5DecimalRounding,
  g5FractionAddUnlike,
  g5FractionSubtractUnlike,
  g5FractionTimesWhole,
  g5FractionTimesFraction,
  g5Volume,
  g5CoordinatePoint,
  g5CoordinateAxes,
  g5Expressions,
  g5WholeNumberMultiplication,
  g5WholeNumberDivision,
  g5GeometryClassification,
  g5DataStatistics,
  g5ExtremeFractionCombo,
  g5ExtremeWholeNumberRemainders,
  g5ExtremeDecimalCombo,
  g5ExtremeVolume,
  g5ExtremeMeasurementConversion,
  g5ExtremeMoneyDecimal,
  g5ExtremeCoordinate,
  g5ExtremeExpressions,
  g5ExtremeFractionUnlikeMultiStep,
  g5ExtremeDataRange,
};

function buildProblem(
  difficultyKey: DifficultyKey,
  skill: MathSkill,
): MathProblem {
  const band = FL_BEST_MATH_BANDS[difficultyKey];
  const generator = GENERATORS[skill.generator] ?? g3MultiplicationFacts;
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
  const preferredGroups =
    unusedGroups && unusedGroups.size > 0 ? unusedGroups : undefined;

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
  );
}
