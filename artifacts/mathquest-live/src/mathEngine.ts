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
  problemType: string;
  signature: string;
  hint: string;
  secondHint: string;
};

type ProblemCore = {
  prompt: string;
  correctAnswer: string;
  wrongAnswers: string[];
  hint: string;
  secondHint: string;
};

type ProblemGenerator = () => ProblemCore;

const DEFAULT_UNIQUE_RETRY_COUNT = 50;

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function shuffle(array: string[]) {
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

function parseFraction(value: string) {
  const [n, d] = value.split("/").map(Number);
  return { numerator: n, denominator: d };
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
  return {
    prompt: `A rectangle is ${length} units long and ${width} units wide. What is its ${area ? "area" : "perimeter"}?`,
    correctAnswer: String(answer),
    wrongAnswers: [
      length + width,
      length * width,
      2 * (length + width),
      answer + length,
      Math.max(1, answer - width),
    ].map(String),
    hint: area
      ? "Area covers the inside of a rectangle. Multiply length by width."
      : "Perimeter is the distance around the rectangle. Add all four sides.",
    secondHint: area
      ? "Use length × width. Do not add the sides when the question asks for area."
      : "Use length + width + length + width, or 2 × (length + width).",
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
    wrongAnswers: [
      other,
      "They are equal",
      `${a + b}/${denominator}`,
      `1/${denominator}`,
    ],
    hint: "These fractions have the same denominator, so the pieces are the same size. Compare the numerators.",
    secondHint: "With the same denominator, the fraction with the larger numerator is greater.",
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
      correctAnswer: String(answer),
      wrongAnswers: [
        longer + shorter,
        shorter,
        longer,
        Math.max(1, answer - 1),
        answer + 1,
      ].map(String),
      hint: "A comparison question asks how much more or less. Subtract the shorter length from the longer length.",
      secondHint: "Line up the two lengths and find the difference between them.",
    };
  }

  const answer = first + second;
  return {
    prompt: `A trail has one path that is ${first} yards long and another path that is ${second} yards long. How many yards are the paths in all?`,
    correctAnswer: String(answer),
    wrongAnswers: [
      Math.abs(first - second),
      first,
      second,
      answer + 5,
      Math.max(1, answer - 5),
    ].map(String),
    hint: "The question asks for the total length. Add the two path lengths together.",
    secondHint: "Check that your answer is longer than either path by itself.",
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
    correctAnswer: String(secondPart),
    wrongAnswers: [
      total,
      firstPart,
      Math.max(5, secondPart - 5),
      secondPart + 5,
      Math.max(5, total - 5),
    ].map(String),
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

  if (compare) {
    const largerCategory = valueA > valueB ? categoryA : categoryB;
    const smallerCategory = valueA > valueB ? categoryB : categoryA;
    const largerValue = Math.max(valueA, valueB);
    const smallerValue = Math.min(valueA, valueB);
    const answer = largerValue - smallerValue;
    return {
      prompt: `The quest table shows ${categoryA}: ${valueA}, ${categoryB}: ${valueB}, and ${categoryC}: ${valueC}. How many more ${largerCategory} than ${smallerCategory} are there?`,
      correctAnswer: String(answer),
      wrongAnswers: [
        largerValue + smallerValue,
        largerValue,
        smallerValue,
        Math.max(1, answer - 1),
        answer + 1,
      ].map(String),
      hint: "Find the two categories named in the question first. 'How many more' means compare them.",
      secondHint: "Subtract the smaller data value from the larger data value.",
    };
  }

  const answer = valueA + valueB;
  return {
    prompt: `The quest table shows ${categoryA}: ${valueA}, ${categoryB}: ${valueB}, and ${categoryC}: ${valueC}. How many ${categoryA} and ${categoryB} are there altogether?`,
    correctAnswer: String(answer),
    wrongAnswers: [
      Math.abs(valueA - valueB),
      valueA + valueC,
      valueB + valueC,
      valueA,
      answer + 1,
    ].map(String),
    hint: "Find the categories named in the question. 'Altogether' means add those values.",
    secondHint: `Add the ${categoryA} value and the ${categoryB} value. Do not include categories the question did not ask for.`,
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

function g4Angles(): ProblemCore {
  const whole = [90, 120, 180][randInt(0, 2)];
  const known = randInt(2, whole / 10 - 2) * 10;
  const answer = whole - known;
  return {
    prompt: `Two angles make ${whole}°. One angle is ${known}°. What is the other angle?`,
    correctAnswer: `${answer}°`,
    wrongAnswers: [
      `${known}°`,
      `${whole + known}°`,
      `${Math.max(10, answer - 10)}°`,
      `${answer + 10}°`,
    ],
    hint: "The two angles combine to make the whole angle. Use subtraction to find the missing part.",
    secondHint: "Start with the whole angle, then subtract the angle you already know.",
  };
}

function g4AnglesThreePart(): ProblemCore {
  const whole = [120, 180, 240, 270][randInt(0, 3)];
  const first = randInt(2, 8) * 10;
  const second = randInt(2, 8) * 10;
  const knownSum = first + second;
  const minimumMissing = 20;
  if (knownSum >= whole - minimumMissing) {
    return g4AnglesThreePart();
  }
  const answer = whole - knownSum;

  return {
    prompt: `Three angles make ${whole}°. Two angles are ${first}° and ${second}°. What is the missing angle?`,
    correctAnswer: `${answer}°`,
    wrongAnswers: [
      `${knownSum}°`,
      `${whole - first}°`,
      `${whole - second}°`,
      `${Math.max(10, answer - 10)}°`,
      `${answer + 10}°`,
    ],
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
    correctAnswer: answer.toFixed(2),
    wrongAnswers: decimalDistractors(answer, 2, [0.1, 0.2, 1, 0.01]),
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
    correctAnswer: answer.toFixed(3),
    wrongAnswers: [
      (minuend + subtrahend).toFixed(3),
      Math.abs(minuend - Math.round(subtrahend)).toFixed(3),
      Math.max(0, answer - 0.1).toFixed(3),
      (answer + 0.1).toFixed(3),
      ...decimalDistractors(answer, 3, [0.001, 0.01, 0.1]),
    ],
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
    wrongAnswers: [
      fraction(whole + numerator, denominator),
      fraction(whole * denominator, numerator),
      `${whole}/${denominator}`,
      fraction(whole * numerator + 1, denominator),
    ],
    hint: "A fraction for each batch means repeated groups of that fraction. Multiply the whole number by the numerator.",
    secondHint: "Keep the denominator the same, and multiply the whole number by the top number.",
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
    wrongAnswers: [
      length * width,
      2 * (length + width + height),
      answer + length * width,
      Math.max(1, answer - width * height),
    ].map(String),
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
  return {
    prompt: `A hero collects ${n1}/${d1} of a crystal, then ${n2}/${d2} of a crystal, then ${add} whole crystal${add === 1 ? "" : "s"}. How much crystal do they have?`,
    correctAnswer: answer,
    wrongAnswers: [
      partial,
      fraction(parsed.numerator + add, parsed.denominator),
      fraction(parsed.numerator, parsed.denominator + add),
      `${add}/${parsed.denominator}`,
    ],
    hint: "Break this into steps: add the fractions first, then add the whole crystals.",
    secondHint: "Use a common denominator for the fractions. After that, add the whole-number amount.",
  };
}

function g5ExtremeWholeNumberRemainders(): ProblemCore {
  const buses = randInt(6, 12);
  const seats = randInt(18, 36);
  const students = buses * seats + randInt(1, seats - 1);
  const needed = Math.ceil(students / seats);

  return {
    prompt: `${students} students are going on a quest trip. Each wagon holds ${seats} students. How many wagons are needed?`,
    correctAnswer: String(needed),
    wrongAnswers: [
      String(Math.floor(students / seats)),
      String(needed + 1),
      String(seats),
      String(buses),
    ],
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
    correctAnswer: answer.toFixed(3),
    wrongAnswers: decimalDistractors(answer, 3, [0.001, 0.01, 0.1, 1]),
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
    correctAnswer: String(length),
    wrongAnswers: [
      width * height,
      volume / width,
      volume / height,
      length + width,
      Math.max(1, length - 2),
    ].map(String),
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
    prompt: `A banner uses ${yards} yards ${feet} feet of ribbon, then ${extraFeet} more feet. How many feet of ribbon is that altogether?`,
    correctAnswer: `${totalFeet} feet`,
    wrongAnswers: [
      `${yards + feet + extraFeet} feet`,
      `${yards * 3 + feet} feet`,
      `${yards * 3 + extraFeet} feet`,
      `${totalFeet + 3} feet`,
    ],
    hint: "Convert yards to feet before adding. One yard equals 3 feet.",
    secondHint: "Multiply yards by 3, then add the other feet.",
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
  const inches = randInt(6, 24);
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

const GENERATORS: Record<string, ProblemGenerator> = {
  g3PlaceValueDigit,
  g3AddSub1000,
  g3MultiplicationFacts,
  g3DivisionFacts,
  g3AreaPerimeter,
  g3FractionCompare,
  g3EquivalentFractions,
  g3Rounding,
  g3MeasurementLength,
  g3ElapsedTime,
  g3ElapsedTimeTwoStep,
  g3DataInterpretation,
  g4Rounding,
  g4Multiplication,
  g4DivisionRemainders,
  g4FactorsPrimeComposite,
  g4AreaPerimeterRectangles,
  g4EquivalentFractions,
  g4EquivalentFractionsGreaterThanOne,
  g4DecimalsHundredths,
  g4DecimalsTenthsToFraction,
  g4FractionAddLikeDenominators,
  g4MoneyDecimal,
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
  g5ExtremeFractionCombo,
  g5ExtremeWholeNumberRemainders,
  g5ExtremeDecimalCombo,
  g5ExtremeVolume,
  g5ExtremeMeasurementConversion,
  g5ExtremeMoneyDecimal,
  g5ExtremeCoordinate,
  g5ExtremeExpressions,
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
    problemType: skill.generator,
    signature,
    hint: core.hint,
    secondHint: core.secondHint,
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

export function generateUniqueMathProblem(
  difficulty: string,
  usedSignatures: ReadonlySet<string>,
  maxRetries = DEFAULT_UNIQUE_RETRY_COUNT,
): MathProblem {
  let lastProblem: MathProblem | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    const problem = generateMathProblem(difficulty);
    lastProblem = problem;

    if (!usedSignatures.has(problem.signature)) {
      return problem;
    }
  }

  console.warn(
    `Unable to find a unique ${difficulty} math problem after ${maxRetries} attempts. Reusing the last generated problem.`,
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
    maxRetries,
  );
}
