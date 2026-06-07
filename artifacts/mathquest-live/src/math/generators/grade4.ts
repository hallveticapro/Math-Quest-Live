import {
  customaryReferenceTableDisplay,
  dataTableDisplay,
  degreeAnswer,
  degreeDistractors,
  expectedFraction,
  fraction,
  fractionDisplay,
  formatExpandedForm,
  money,
  mixedNumber,
  randInt,
  shuffle,
  unitAnswer,
  type CustomaryReferenceCategory,
  type ProblemCore,
  type ProblemGenerator,
} from '../engineCore';

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

function hasAdditionRegrouping(a: number, b: number) {
  let left = a;
  let right = b;
  while (left > 0 || right > 0) {
    if ((left % 10) + (right % 10) >= 10) return true;
    left = Math.floor(left / 10);
    right = Math.floor(right / 10);
  }
  return false;
}

function hasSubtractionRegrouping(minuend: number, subtrahend: number) {
  let left = minuend;
  let right = subtrahend;
  let borrow = 0;
  while (left > 0 || right > 0) {
    const topDigit = (left % 10) - borrow;
    const bottomDigit = right % 10;
    if (topDigit < bottomDigit) return true;
    borrow = topDigit < bottomDigit ? 1 : 0;
    left = Math.floor(left / 10);
    right = Math.floor(right / 10);
  }
  return false;
}

function g4MultiDigitAddSubtract(): ProblemCore {
  const add = Math.random() < 0.52;
  const wantsRegrouping = Math.random() < 0.75;
  let first = 0;
  let second = 0;
  let regrouping = false;

  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (add) {
      first = randInt(12_000, 649_999);
      second = randInt(8_000, 329_999);
      regrouping = hasAdditionRegrouping(first, second);
    } else {
      first = randInt(25_000, 999_999);
      second = randInt(8_000, first - 1_000);
      regrouping = hasSubtractionRegrouping(first, second);
    }

    if (regrouping === wantsRegrouping) break;
  }

  const answer = add ? first + second : first - second;
  const operationLabel = add ? "total" : "left";

  return {
    prompt: add
      ? `A library shelf has ${first.toLocaleString()} story cards and ${second.toLocaleString()} puzzle cards. How many cards are there in all?`
      : `A sky archive has ${first.toLocaleString()} map pages. The wind sorts away ${second.toLocaleString()} pages. How many pages are left?`,
    correctAnswer: answer.toLocaleString(),
    wrongAnswers: [
      add ? Math.abs(first - second) : first + second,
      answer + 100,
      Math.max(0, answer - 100),
      answer + (regrouping ? 1_000 : 10),
      Math.max(0, answer - (regrouping ? 1_000 : 10)),
    ].map((value) => value.toLocaleString()),
    hint: add
      ? "Line up the place values before adding."
      : "Line up the place values before subtracting.",
    secondHint: regrouping
      ? `This problem uses regrouping. Work from ones to larger places and track each regroup carefully to find the ${operationLabel}.`
      : `This problem does not need regrouping, but place value still matters to find the ${operationLabel}.`,
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

function g4NumberPatternIdentifyRule(): ProblemCore {
  const start = randInt(3, 45);
  const step = [3, 4, 5, 6, 8, 10, 12][randInt(0, 6)];
  const increasing = Math.random() < 0.75;
  const pattern = Array.from({ length: 5 }, (_, index) =>
    increasing ? start + index * step : start + (4 - index) * step,
  );
  const answer = `${increasing ? "Add" : "Subtract"} ${step}`;

  return {
    prompt: `Pattern: ${pattern.join(", ")}. What rule describes the pattern?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${increasing ? "Add" : "Subtract"} ${step + 1}`,
      `${increasing ? "Subtract" : "Add"} ${step}`,
      `Multiply by ${step}`,
      `${increasing ? "Add" : "Subtract"} ${Math.max(1, step - 1)}`,
      "Add 1",
    ],
    hint: "Compare each number to the one right before it.",
    secondHint: `The numbers change by ${step} each time, and the pattern ${increasing ? "goes up" : "goes down"}.`,
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
    prompt: `Rectangle A is ${lengthA} by ${widthA}.\nRectangle B is ${lengthB} by ${widthB}.\nThey have the same perimeter. Which rectangle has the greater area?`,
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
      `${tenths + 10}/10`,
      `${10}/${tenths + 1}`,
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
  const changeForm = ["decimal", "word", "fraction"][randInt(0, 2)] as
    | "decimal"
    | "word"
    | "fraction";
  const changeText =
    changeForm === "word"
      ? change === 0.1
        ? "one-tenth"
        : "one-hundredth"
      : changeForm === "fraction"
        ? change === 0.1
          ? "1/10"
          : "1/100"
        : change.toFixed(2);
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
    prompt: `What number is ${changeText} ${more ? "more" : "less"} than ${base.toFixed(2)}?`,
    correctAnswer: answer.toFixed(2),
    wrongAnswers: [...wrongs],
    hint: "Tenths and hundredths are different place values.",
    secondHint: `${changeText} changes the ${change === 0.1 ? "tenths" : "hundredths"} place.`,
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
    const answer = expectedFraction(n1 - n2, denominator);
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
  const answer = expectedFraction(n1 + n2, denominator);
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

function g4MixedNumberSubtraction(): ProblemCore {
  const denominator = [4, 5, 6, 8, 10, 12][randInt(0, 5)];
  const regroup = Math.random() < 0.7;
  const minuendWhole = randInt(3, 9);
  const subtrahendWhole = randInt(1, minuendWhole - 1);
  let minuendNumerator = randInt(1, denominator - 1);
  let subtrahendNumerator = randInt(1, denominator - 1);

  if (regroup) {
    while (subtrahendNumerator <= minuendNumerator) {
      subtrahendNumerator = randInt(1, denominator - 1);
      minuendNumerator = randInt(1, denominator - 1);
    }
  } else {
    while (minuendNumerator <= subtrahendNumerator) {
      subtrahendNumerator = randInt(1, denominator - 1);
      minuendNumerator = randInt(1, denominator - 1);
    }
  }

  const answerWhole = regroup
    ? minuendWhole - subtrahendWhole - 1
    : minuendWhole - subtrahendWhole;
  const answerNumerator = regroup
    ? minuendNumerator + denominator - subtrahendNumerator
    : minuendNumerator - subtrahendNumerator;
  const correctAnswer = mixedNumber(answerWhole, answerNumerator, denominator);
  const minuend = mixedNumber(minuendWhole, minuendNumerator, denominator);
  const subtrahend = mixedNumber(
    subtrahendWhole,
    subtrahendNumerator,
    denominator,
  );

  return {
    prompt: `What is ${minuend} - ${subtrahend}?`,
    correctAnswer,
    wrongAnswers: [
      mixedNumber(
        Math.max(0, minuendWhole - subtrahendWhole),
        Math.abs(minuendNumerator - subtrahendNumerator),
        denominator,
      ),
      mixedNumber(answerWhole + 1, answerNumerator, denominator),
      mixedNumber(Math.max(0, answerWhole - 1), answerNumerator, denominator),
      mixedNumber(answerWhole, Math.min(denominator - 1, answerNumerator + 1), denominator),
      mixedNumber(answerWhole, Math.max(1, answerNumerator - 1), denominator),
    ],
    hint: regroup
      ? "The first fraction is smaller, so regroup one whole into fraction pieces before subtracting."
      : "The denominators match, so subtract the whole numbers and subtract the numerators.",
    secondHint: regroup
      ? `Regroup 1 whole as ${denominator}/${denominator}, then subtract the fraction parts.`
      : "Keep the denominator the same. Subtract only the top numbers in the fraction parts.",
    richDisplay: [
      fractionDisplay(minuendNumerator, denominator, "First fraction part"),
      fractionDisplay(subtrahendNumerator, denominator, "Second fraction part"),
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
  const answer = expectedFraction(answerHundredths, 100);

  return {
    prompt: `What is ${tenths}/10 + ${hundredths}/100?`,
    correctAnswer: answer,
    wrongAnswers: [
      `${tenths + hundredths}/110`,
      `${tenths + hundredths}/100`,
      `${answerHundredths}/10`,
      expectedFraction(Math.max(1, answerHundredths - 10), 100),
      expectedFraction(answerHundredths + 10, 100),
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
  const answer = expectedFraction(whole * numerator, denominator);
  const answerWithUnit = `${answer} yards`;

  return {
    prompt: `A banner uses ${numerator}/${denominator} yard of ribbon. How much ribbon is needed for ${whole} banners?`,
    correctAnswer: answerWithUnit,
    wrongAnswers: [
      expectedFraction(whole + numerator, denominator),
      `${whole}/${denominator}`,
      expectedFraction(whole * numerator, denominator + whole),
      expectedFraction(whole * numerator + 1, denominator),
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
    { from: "hours", singularFrom: "hour", to: "minutes", factor: 60, category: "time" },
    { from: "quarts", singularFrom: "quart", to: "pints", factor: 2, category: "capacity" },
    { from: "pounds", singularFrom: "pound", to: "ounces", factor: 16, category: "weight" },
    {
      from: "yards",
      singularFrom: "yard",
      to: "inches",
      factor: 36,
      category: "length",
      steps: "1 yard = 3 feet and 1 foot = 12 inches",
    },
    {
      from: "gallons",
      singularFrom: "gallon",
      to: "pints",
      factor: 8,
      category: "capacity",
      steps: "1 gallon = 4 quarts and 1 quart = 2 pints",
    },
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
    secondHint: conversion.steps
      ? `${conversion.steps}, so each ${conversion.singularFrom} has ${conversion.factor} ${conversion.to}.`
      : `Each ${conversion.singularFrom} has ${conversion.factor} ${conversion.to}, so multiply ${amount} by ${conversion.factor}.`,
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
  const modeValue = randInt(13, 18);
  const otherValues = new Set<number>();
  while (otherValues.size < 3) {
    const candidate = randInt(6, 32);
    if (candidate !== modeValue) otherValues.add(candidate);
  }
  const values = shuffle([modeValue, modeValue, ...otherValues]);
  const sorted = [...values].sort((a, b) => a - b);
  const mode = modeValue;
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

export const GRADE4_GENERATORS: Record<string, ProblemGenerator> = {
  g4Rounding,
  g4PlaceValueShift,
  g4ExpandedForm,
  g4WholeNumberCompare,
  g4MultiDigitAddSubtract,
  g4Multiplication,
  g4TwoDigitMultiplication,
  g4EstimateProduct,
  g4DivisionRemainders,
  g4EquationTrueFalse,
  g4UnknownNumberEquation,
  g4NumberPatternRule,
  g4NumberPatternIdentifyRule,
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
  g4MixedNumberSubtraction,
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
};
