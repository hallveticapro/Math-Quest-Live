import {
  customaryReferenceTableDisplay,
  dataTableDisplay,
  decimalDistractors,
  expectedFraction,
  fraction,
  fractionDisplay,
  randInt,
  shuffle,
  unitAnswer,
  type CustomaryReferenceCategory,
  type ProblemCore,
  type ProblemGenerator,
} from '../engineCore';

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

function g5DecimalPlaceValueShift(): ProblemCore {
  const digit = randInt(2, 9);
  const moves = randInt(1, 2);
  const direction = Math.random() < 0.5 ? "left" : "right";
  const factor = 10 ** moves;
  const answer = direction === "left" ? `${factor} times as much` : `1/${factor} as much`;
  return {
    prompt: `In a decimal number, a ${digit} moves ${moves} place${moves === 1 ? "" : "s"} to the ${direction}. How does its value change?`,
    correctAnswer: answer,
    wrongAnswers: [
      direction === "left" ? `1/${factor} as much` : `${factor} times as much`,
      "10 times as much",
      "1/10 as much",
      "it does not change",
    ],
    hint: "Each place-value move changes the value by a factor of 10.",
    secondHint:
      direction === "left"
        ? `Moving ${moves} place${moves === 1 ? "" : "s"} left makes the value ${factor} times as much.`
        : `Moving ${moves} place${moves === 1 ? "" : "s"} right makes the value 1/${factor} as much.`,
  };
}

function g5DecimalExpandedForm(): ProblemCore {
  const whole = randInt(12, 98);
  const tenths = randInt(1, 9);
  const hundredths = randInt(1, 9);
  const thousandths = randInt(1, 9);
  const number = `${whole}.${tenths}${hundredths}${thousandths}`;
  const correct = `${whole} + ${tenths}/10 + ${hundredths}/100 + ${thousandths}/1000`;
  return {
    prompt: `Which expression matches ${number} in expanded form?`,
    correctAnswer: correct,
    wrongAnswers: [
      `${whole} + ${tenths}/100 + ${hundredths}/10 + ${thousandths}/1000`,
      `${whole} + ${tenths}/10 + ${hundredths}/1000 + ${thousandths}/100`,
      `${whole}.${tenths} + ${hundredths}/10 + ${thousandths}/100`,
      `${whole} + ${tenths} + ${hundredths} + ${thousandths}`,
    ],
    hint: "Use the decimal place values: tenths, hundredths, and thousandths.",
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

function g5DecimalEstimateProduct(): ProblemCore {
  const a = randInt(125, 985) / 100;
  const b = randInt(12, 88) / 10;
  const roundedA = Math.round(a);
  const roundedB = Math.round(b);
  const answer = roundedA * roundedB;
  return {
    prompt: `Estimate ${a.toFixed(2)} × ${b.toFixed(1)} by rounding each factor to the nearest whole number first.`,
    correctAnswer: String(answer),
    wrongAnswers: [
      Math.round(a * b),
      roundedA + roundedB,
      answer + roundedA,
      Math.max(0, answer - roundedB),
      roundedA * Math.max(1, roundedB - 1),
    ].map(String),
    hint: "Round the decimal factors first, then multiply.",
    secondHint: `${a.toFixed(2)} rounds to ${roundedA}, and ${b.toFixed(1)} rounds to ${roundedB}.`,
  };
}

function g5DecimalPowerOfTen(): ProblemCore {
  const value = randInt(12, 98) / 10;
  const byHundredth = Math.random() < 0.5;
  const operation = Math.random() < 0.5 ? "multiply" : "divide";
  const factor = byHundredth ? 0.01 : 0.1;
  const answer = operation === "multiply" ? value * factor : value / factor;
  return {
    prompt: `What is ${value.toFixed(1)} ${operation === "multiply" ? "×" : "÷"} ${factor}?`,
    correctAnswer: answer.toFixed(byHundredth && operation === "multiply" ? 3 : 1),
    wrongAnswers: [
      (operation === "multiply" ? value / factor : value * factor).toFixed(1),
      value.toFixed(1),
      (answer * 10).toFixed(1),
      (answer / 10).toFixed(2),
    ],
    hint: "Multiplying or dividing by one-tenth or one-hundredth moves the decimal point.",
    secondHint:
      operation === "multiply"
        ? "Multiplying by a number less than 1 makes the value smaller."
        : "Dividing by a number less than 1 makes the value larger.",
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
  const answer = expectedFraction(n1 * d2 + n2 * d1, d1 * d2);
  return {
    prompt: `What is ${n1}/${d1} + ${n2}/${d2}?`,
    correctAnswer: answer,
    wrongAnswers: [
      expectedFraction(n1 + n2, d1 + d2),
      expectedFraction(n1 + n2, d1 * d2),
      expectedFraction(Math.abs(n1 * d2 - n2 * d1) || 1, d1 * d2),
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

  const answer = expectedFraction(n1 * d2 - n2 * d1, d1 * d2);
  return {
    prompt: `A lantern is filled ${n1}/${d1} full. The hero uses ${n2}/${d2} of the lantern oil. How much of the lantern remains filled?`,
    correctAnswer: answer,
    wrongAnswers: [
      expectedFraction(Math.abs(n1 - n2), Math.max(d1, d2)),
      expectedFraction(Math.abs(n1 - n2) || 1, d1 + d2),
      expectedFraction(n1 * d2 + n2 * d1, d1 * d2),
      `${Math.abs(n1 - n2) || 1}/${d1}`,
      expectedFraction(n1 * d2 - n2 * d1 + 1, d1 * d2),
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
  const answer = expectedFraction(whole * numerator, denominator);
  const answerWithUnit = `${answer} cups`;
  return {
    prompt: `A recipe uses ${numerator}/${denominator} cup of spice for each batch. How much is needed for ${whole} batches?`,
    correctAnswer: answerWithUnit,
    wrongAnswers: [
      expectedFraction(whole + numerator, denominator),
      expectedFraction(whole * denominator, numerator),
      `${whole}/${denominator}`,
      expectedFraction(whole * numerator + 1, denominator),
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
  const answer = expectedFraction(n1 * n2, d1 * d2);

  return {
    prompt: `What is ${n1}/${d1} × ${n2}/${d2}?`,
    correctAnswer: answer,
    wrongAnswers: [
      expectedFraction(n1 + n2, d1 + d2),
      expectedFraction(n1 * d2, d1 * n2),
      expectedFraction(n1 * n2, d1 + d2),
      expectedFraction(n1 + n2, d1 * d2),
    ],
    hint: "To multiply fractions, multiply the numerators and multiply the denominators.",
    secondHint: "Top times top and bottom times bottom. Keep the product in fraction form.",
    richDisplay: [
      fractionDisplay(n1, d1, "First factor"),
      fractionDisplay(n2, d2, "Second factor"),
    ],
  };
}

function g5UnitFractionDivision(): ProblemCore {
  const denominator = randInt(3, 12);
  const groups = randInt(2, 8);
  const askUnitByWhole = Math.random() < 0.5;
  if (askUnitByWhole) {
    const answer = fraction(1, denominator * groups);
    return {
      prompt: `A ${fraction(1, denominator)}-mile trail is split equally among ${groups} teams. What fraction of a mile does each team get?`,
      correctAnswer: answer,
      wrongAnswers: [
        fraction(groups, denominator),
        fraction(1, denominator + groups),
        fraction(groups, denominator * groups),
        fraction(1, Math.max(1, denominator - groups)),
      ],
      hint: "A unit fraction split into equal parts gets smaller.",
      secondHint: `Divide 1/${denominator} by ${groups}. The denominator is multiplied by ${groups}.`,
      richDisplay: [fractionDisplay(1, denominator, "Trail length")],
    };
  }

  const answer = denominator * groups;
  return {
    prompt: `${groups} miles of ribbon are cut into pieces that are 1/${denominator} mile long. How many pieces can be made?`,
    correctAnswer: unitAnswer(answer, "piece", "pieces"),
    wrongAnswers: [
      denominator + groups,
      Math.max(1, denominator - groups),
      denominator,
      groups,
      answer + denominator,
    ].map((value) => unitAnswer(value, "piece", "pieces")),
    hint: "Ask how many unit-fraction pieces fit into the whole-number amount.",
    secondHint: `Each mile has ${denominator} pieces of size 1/${denominator}. Multiply by ${groups} miles.`,
    richDisplay: [fractionDisplay(1, denominator, "Piece size")],
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

function g5VolumeUnitCubes(): ProblemCore {
  const layers = randInt(2, 6);
  const rows = randInt(3, 8);
  const cubesPerRow = randInt(3, 8);
  const answer = layers * rows * cubesPerRow;
  return {
    prompt: `A prism is packed with ${layers} layers. Each layer has ${rows} rows with ${cubesPerRow} unit cubes in each row. What is the volume?`,
    correctAnswer: unitAnswer(answer, "cubic unit", "cubic units"),
    wrongAnswers: [
      rows * cubesPerRow,
      layers + rows + cubesPerRow,
      2 * (layers + rows + cubesPerRow),
      answer + rows,
      Math.max(1, answer - cubesPerRow),
    ].map((value) => unitAnswer(value, "cubic unit", "cubic units")),
    hint: "Count all the unit cubes by multiplying layers, rows, and cubes per row.",
    secondHint: "Find cubes in one layer first, then multiply by the number of layers.",
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

function g5ExpressionTranslation(): ProblemCore {
  const a = randInt(4, 12);
  const b = randInt(3, 9);
  const c = randInt(10, 35);
  const answer = `(${a} + ${b}) × ${c}`;
  return {
    prompt: `Which expression matches: add ${a} and ${b}, then multiply the result by ${c}?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${a} + ${b} × ${c}`,
      `${a} × ${b} + ${c}`,
      `(${a} × ${b}) + ${c}`,
      `${a} + (${b} × ${c})`,
    ],
    hint: "Words like 'then' can tell you what should happen after the first operation.",
    secondHint: "Parentheses show that the addition must happen before the multiplication.",
  };
}

function g5EquationTrueFalse(): ProblemCore {
  const a = randInt(12, 48);
  const b = randInt(3, 12);
  const c = randInt(10, 80);
  const left = a * b + c;
  const makeTrue = Math.random() < 0.5;
  const right = makeTrue ? left : left + [5, -5, b, -b][randInt(0, 3)];
  const answer = makeTrue ? "true" : "false";
  return {
    prompt: `Is this equation true or false: ${a} × ${b} + ${c} = ${right}?`,
    correctAnswer: answer,
    wrongAnswers: ["true", "false", "cannot tell", `${left}`].filter(
      (choice) => choice !== answer,
    ),
    hint: "Evaluate the expression on the left side first.",
    secondHint: "Use order of operations, then compare the left side to the right side.",
  };
}

function g5UnknownNumberEquation(): ProblemCore {
  const unknown = randInt(20, 95);
  const multiplier = randInt(3, 9);
  const addend = randInt(8, 40);
  const result = unknown * multiplier + addend;
  return {
    prompt: `A number is multiplied by ${multiplier}, then ${addend} is added. The result is ${result}. What is the number?`,
    correctAnswer: String(unknown),
    wrongAnswers: [
      result,
      Math.floor(result / multiplier),
      unknown + multiplier,
      Math.max(1, unknown - multiplier),
      unknown + addend,
    ].map(String),
    hint: "Undo the operations in reverse order.",
    secondHint: `Subtract ${addend} first, then divide by ${multiplier}.`,
  };
}

function g5PatternRuleExpression(): ProblemCore {
  const start = randInt(2, 12);
  const multiplier = randInt(2, 6);
  const addend = randInt(1, 12);
  const pattern = Array.from({ length: 4 }, (_, index) => (start + index) * multiplier + addend);
  const answer = `${multiplier}n + ${addend}`;
  return {
    prompt: `For input n, the output pattern is ${pattern.join(", ")} when n starts at ${start}. Which rule describes the pattern?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${addend}n + ${multiplier}`,
      `${multiplier}n - ${addend}`,
      `n + ${multiplier + addend}`,
      `${multiplier + addend}n`,
    ],
    hint: "Look at how much the output changes when the input increases by 1.",
    secondHint: `The output grows by ${multiplier} each time, then has ${addend} added.`,
  };
}

function g5InputOutputTable(): ProblemCore {
  const multiplier = randInt(2, 7);
  const addend = randInt(3, 15);
  const inputs = [1, 2, 3, 4];
  const missingInput = inputs[randInt(0, inputs.length - 1)];
  const answer = missingInput * multiplier + addend;
  const rows = inputs.map((input) => [
    input,
    input === missingInput ? "?" : input * multiplier + addend,
  ]);
  return {
    prompt: `Use the input-output table below. The rule is multiply by ${multiplier}, then add ${addend}. What output is missing?`,
    correctAnswer: String(answer),
    wrongAnswers: [
      missingInput + multiplier + addend,
      missingInput * addend + multiplier,
      answer + multiplier,
      Math.max(1, answer - multiplier),
      multiplier + addend,
    ].map(String),
    hint: "Apply the rule to the input in the missing row.",
    secondHint: `Multiply ${missingInput} by ${multiplier}, then add ${addend}.`,
    richDisplay: [
      {
        type: "table",
        caption: "Input-output table",
        headers: ["Input", "Output"],
        rows,
      },
    ],
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

function g5MeasurementConversion(): ProblemCore {
  const conversions: Array<{
    from: string;
    singularFrom: string;
    to: string;
    factor: number;
    category: CustomaryReferenceCategory;
    steps?: string;
  }> = [
    { from: "yards", singularFrom: "yard", to: "feet", factor: 3, category: "length" },
    { from: "feet", singularFrom: "foot", to: "inches", factor: 12, category: "length" },
    { from: "miles", singularFrom: "mile", to: "feet", factor: 5280, category: "length" },
    { from: "hours", singularFrom: "hour", to: "minutes", factor: 60, category: "time" },
    { from: "days", singularFrom: "day", to: "hours", factor: 24, category: "time" },
    { from: "gallons", singularFrom: "gallon", to: "pints", factor: 8, category: "capacity", steps: "1 gallon = 4 quarts and 1 quart = 2 pints" },
    { from: "yards", singularFrom: "yard", to: "inches", factor: 36, category: "length", steps: "1 yard = 3 feet and 1 foot = 12 inches" },
  ];
  const conversion = conversions[randInt(0, conversions.length - 1)];
  const amount = conversion.factor > 1000 ? randInt(1, 3) : randInt(2, 9);
  const answer = amount * conversion.factor;

  return {
    prompt: `Use the reference table below. The quest record shows ${amount} ${conversion.from}. How many ${conversion.to} is that?`,
    correctAnswer: `${answer.toLocaleString()} ${conversion.to}`,
    wrongAnswers: [
      `${(amount + conversion.factor).toLocaleString()} ${conversion.to}`,
      `${Math.max(1, answer - conversion.factor).toLocaleString()} ${conversion.to}`,
      `${(answer + conversion.factor).toLocaleString()} ${conversion.to}`,
      `${amount.toLocaleString()} ${conversion.to}`,
    ],
    hint: `Convert from ${conversion.from} to ${conversion.to} using the reference table.`,
    secondHint: conversion.steps
      ? `${conversion.steps}. Multiply ${amount} by ${conversion.factor}.`
      : `Each ${conversion.singularFrom} has ${conversion.factor.toLocaleString()} ${conversion.to}, so multiply ${amount} by ${conversion.factor.toLocaleString()}.`,
    richDisplay: [customaryReferenceTableDisplay(conversion.category, 5)],
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

function g5ThreeDClassification(): ProblemCore {
  const questions = [
    {
      prompt: "Which three-dimensional figure has two circular bases?",
      correctAnswer: "right circular cylinder",
      wrongAnswers: ["right rectangular prism", "right circular cone", "sphere", "right square pyramid"],
      hint: "Think about the faces or bases of the solid figure.",
      secondHint: "A cylinder has two circular bases connected by a curved surface.",
    },
    {
      prompt: "Which three-dimensional figure has exactly one circular base and one vertex?",
      correctAnswer: "right circular cone",
      wrongAnswers: ["sphere", "right circular cylinder", "right rectangular prism", "right triangular prism"],
      hint: "Look for one circular base and a point.",
      secondHint: "A cone has one circular base and comes to one point called a vertex.",
    },
    {
      prompt: "Which three-dimensional figure has only curved surface and no edges?",
      correctAnswer: "sphere",
      wrongAnswers: ["right circular cylinder", "right circular cone", "right rectangular prism", "right pyramid"],
      hint: "Think of a solid that is round in every direction.",
      secondHint: "A sphere has no flat faces, edges, or vertices.",
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

export const GRADE5_GENERATORS: Record<string, ProblemGenerator> = {
  g5DecimalPlaceValue,
  g5DecimalPlaceValueShift,
  g5DecimalExpandedForm,
  g5DecimalOperations,
  g5DecimalEstimateProduct,
  g5DecimalPowerOfTen,
  g5DecimalSubtraction,
  g5DecimalCompare,
  g5DecimalRounding,
  g5FractionAddUnlike,
  g5FractionSubtractUnlike,
  g5FractionTimesWhole,
  g5FractionTimesFraction,
  g5UnitFractionDivision,
  g5Volume,
  g5VolumeUnitCubes,
  g5CoordinatePoint,
  g5CoordinateAxes,
  g5Expressions,
  g5ExpressionTranslation,
  g5EquationTrueFalse,
  g5UnknownNumberEquation,
  g5PatternRuleExpression,
  g5InputOutputTable,
  g5WholeNumberMultiplication,
  g5WholeNumberDivision,
  g5MeasurementConversion,
  g5GeometryClassification,
  g5ThreeDClassification,
  g5DataStatistics,
};
