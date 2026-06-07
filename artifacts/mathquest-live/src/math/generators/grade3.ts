import {
  dataTableDisplay,
  fraction,
  fractionDisplay,
  formatExpandedForm,
  numberDistractors,
  randInt,
  shuffle,
  unitAnswer,
  type ProblemCore,
  type ProblemGenerator,
} from '../engineCore';

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

export const GRADE3_GENERATORS: Record<string, ProblemGenerator> = {
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
};
