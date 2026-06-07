import {
  customaryReferenceTableDisplay,
  dataTableDisplay,
  decimalDistractors,
  expectedFraction,
  fraction,
  fractionDisplay,
  money,
  numberDistractors,
  parseFraction,
  randInt,
  shuffle,
  unitAnswer,
  type ProblemCore,
  type ProblemGenerator,
} from '../engineCore';

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
      expectedFraction(add, parsed.denominator),
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

function g5ExtremeUnitFractionDivision(): ProblemCore {
  const denominator = randInt(3, 12);
  const stations = randInt(2, 6);
  const batches = randInt(2, 5);
  const piecesPerBatch = denominator * batches;
  const totalPieces = piecesPerBatch * stations;
  return {
    prompt: `${stations} quest stations each have ${batches} miles of ribbon. The ribbon is cut into pieces that are 1/${denominator} mile long. How many pieces are made in all?`,
    correctAnswer: unitAnswer(totalPieces, "piece", "pieces"),
    wrongAnswers: [
      piecesPerBatch,
      denominator * stations,
      stations + batches + denominator,
      totalPieces + denominator,
      Math.max(1, totalPieces - piecesPerBatch),
    ].map((value) => unitAnswer(value, "piece", "pieces")),
    hint: "Find how many unit-fraction pieces are in one station first.",
    secondHint: `Each mile has ${denominator} pieces of size 1/${denominator}. Multiply by miles, then by stations.`,
    richDisplay: [fractionDisplay(1, denominator, "Piece size")],
  };
}

function g5ExtremeDecimalPowerOfTen(): ProblemCore {
  const value = randInt(125, 985) / 100;
  const first = Math.random() < 0.5 ? 0.1 : 0.01;
  const second = first === 0.1 ? 0.01 : 0.1;
  const answer = value / first + value * second;
  return {
    prompt: `A spell starts with ${value.toFixed(2)} energy. It divides that amount by ${first}, then adds ${value.toFixed(2)} × ${second}. What is the total energy?`,
    correctAnswer: answer.toFixed(3),
    wrongAnswers: decimalDistractors(answer, 3, [0.01, 0.1, 1, 10]),
    hint: "Work in two parts and pay attention to multiplying or dividing by a number less than 1.",
    secondHint: "Dividing by one-tenth or one-hundredth makes the value larger. Multiplying by them makes it smaller.",
  };
}

function g5ExtremeExpressionTranslationEvaluate(): ProblemCore {
  const a = randInt(5, 14);
  const b = randInt(3, 9);
  const c = randInt(2, 6);
  const d = randInt(8, 30);
  const answer = (a + b) * c - d;
  return {
    prompt: `Translate and evaluate: add ${a} and ${b}, multiply the result by ${c}, then subtract ${d}.`,
    correctAnswer: String(answer),
    wrongAnswers: [
      a + b * c - d,
      (a + b) * (c - d),
      (a * b + c) - d,
      answer + d,
      answer + c,
    ]
      .filter((value) => value >= 0 && value !== answer)
      .map(String),
    hint: "Translate the words into an expression before evaluating.",
    secondHint: `The expression is (${a} + ${b}) × ${c} - ${d}. Parentheses happen first.`,
  };
}

function g5ExtremeInputOutputTable(): ProblemCore {
  const multiplier = randInt(3, 8);
  const addend = randInt(5, 20);
  const inputs = [2, 4, 6, 8];
  const missingIndex = randInt(0, inputs.length - 1);
  const answer = inputs[missingIndex] * multiplier + addend;
  const rows = inputs.map((input, index) => [
    input,
    index === missingIndex ? "?" : input * multiplier + addend,
  ]);
  return {
    prompt: `Use the input-output table below. The rule is ${multiplier}n + ${addend}. What output is missing?`,
    correctAnswer: String(answer),
    wrongAnswers: [
      inputs[missingIndex] + multiplier + addend,
      inputs[missingIndex] * addend + multiplier,
      answer + multiplier,
      Math.max(1, answer - multiplier),
      multiplier + addend,
    ].map(String),
    hint: "Substitute the missing row's input into the rule.",
    secondHint: `Multiply the input by ${multiplier}, then add ${addend}.`,
    richDisplay: [
      {
        type: "table",
        caption: "Advanced input-output table",
        headers: ["Input n", "Output"],
        rows,
      },
    ],
  };
}

function g5ExtremeProductSizeReasoning(): ProblemCore {
  const whole = randInt(12, 48);
  const lessThanOne = Math.random() < 0.5;
  const numerator = lessThanOne ? randInt(1, 4) : randInt(6, 11);
  const denominator = lessThanOne ? randInt(numerator + 1, 9) : randInt(2, numerator - 1);
  const answer = lessThanOne
    ? "less than the starting number"
    : "greater than the starting number";
  return {
    prompt: `Without calculating exactly, ${whole} is multiplied by ${numerator}/${denominator}. What will happen to the product?`,
    correctAnswer: answer,
    wrongAnswers: [
      lessThanOne ? "greater than the starting number" : "less than the starting number",
      "equal to the starting number",
      "always a whole number",
      "always zero",
    ],
    hint: "Think about whether the fraction factor is less than 1, equal to 1, or greater than 1.",
    secondHint:
      lessThanOne
        ? "Multiplying by a fraction less than 1 makes the product smaller."
        : "Multiplying by a fraction greater than 1 makes the product larger.",
    richDisplay: [fractionDisplay(numerator, denominator, "Multiplier")],
  };
}

function g5ExtremeVolumeTwoPrisms(): ProblemCore {
  const first = { l: randInt(4, 10), w: randInt(3, 8), h: randInt(2, 6) };
  const second = { l: randInt(3, 8), w: randInt(3, 7), h: randInt(2, 5) };
  const firstVolume = first.l * first.w * first.h;
  const secondVolume = second.l * second.w * second.h;
  const answer = firstVolume + secondVolume;
  return {
    prompt: `Two rectangular treasure boxes are filled. Box A is ${first.l} by ${first.w} by ${first.h}. Box B is ${second.l} by ${second.w} by ${second.h}. What is their total volume?`,
    correctAnswer: unitAnswer(answer, "cubic unit", "cubic units"),
    wrongAnswers: [
      firstVolume,
      secondVolume,
      firstVolume - secondVolume,
      answer + first.h,
      Math.max(1, answer - second.h),
    ].map((value) => unitAnswer(Math.abs(value), "cubic unit", "cubic units")),
    hint: "Find the volume of each prism, then combine the volumes.",
    secondHint: "Use length × width × height for each box. Then add both results.",
  };
}

function g5ExtremeMeasurementCapacityWeight(): ProblemCore {
  const useCapacity = Math.random() < 0.5;
  if (useCapacity) {
    const gallons = randInt(2, 6);
    const quarts = randInt(1, 3);
    const extraPints = randInt(2, 8);
    const totalPints = gallons * 8 + quarts * 2 + extraPints;
    return {
      prompt: `Use the reference table below. A potion barrel has ${gallons} gallons ${quarts} quarts, then ${extraPints} more pints are added. How many pints is that?`,
      correctAnswer: `${totalPints} pints`,
      wrongAnswers: [
        `${gallons + quarts + extraPints} pints`,
        `${gallons * 4 + quarts * 2 + extraPints} pints`,
        `${gallons * 8 + quarts} pints`,
        `${totalPints + 2} pints`,
      ],
      hint: "Convert gallons and quarts to pints before adding.",
      secondHint: "One gallon is 8 pints and one quart is 2 pints.",
      richDisplay: [customaryReferenceTableDisplay("capacity", 5)],
    };
  }

  const pounds = randInt(3, 12);
  const ounces = randInt(1, 15);
  const extraOunces = randInt(8, 48);
  const totalOunces = pounds * 16 + ounces + extraOunces;
  return {
    prompt: `Use the reference table below. A supply pack weighs ${pounds} pounds ${ounces} ounces, then gains ${extraOunces} ounces. How many ounces is it now?`,
    correctAnswer: `${totalOunces} ounces`,
    wrongAnswers: [
      `${pounds + ounces + extraOunces} ounces`,
      `${pounds * 12 + ounces + extraOunces} ounces`,
      `${pounds * 16 + ounces} ounces`,
      `${totalOunces + 16} ounces`,
    ],
    hint: "Convert pounds to ounces before adding.",
    secondHint: "One pound is 16 ounces. Multiply pounds by 16, then add the ounces.",
    richDisplay: [customaryReferenceTableDisplay("weight", 5)],
  };
}

export const GRADE5_EXTREME_GENERATORS: Record<string, ProblemGenerator> = {
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
  g5ExtremeUnitFractionDivision,
  g5ExtremeDecimalPowerOfTen,
  g5ExtremeExpressionTranslationEvaluate,
  g5ExtremeInputOutputTable,
  g5ExtremeProductSizeReasoning,
  g5ExtremeVolumeTwoPrisms,
  g5ExtremeMeasurementCapacityWeight,
};
