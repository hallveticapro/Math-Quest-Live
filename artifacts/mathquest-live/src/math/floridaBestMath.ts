export type DifficultyKey = "easy" | "medium" | "hard" | "extreme";

export type DifficultyBand = {
  label: string;
  displayName: string;
  gradeBand: 3 | 4 | 5;
  standardsSystem: "Florida B.E.S.T. Mathematics";
  description: string;
  studentSummary: string;
  readingGuidance: string;
};

export type BenchmarkVerificationStatus =
  | "verified_from_provided_source"
  | "possible_mismatch_with_current_app_usage"
  | "needs_cpalms_fdoe_verification";

export type MathSkill = {
  id: string;
  benchmark: string;
  description: string;
  skill: string;
  generator: string;
  officialBenchmark: string;
  domain: string;
  strand: string;
  reportingCategory: string;
  verificationStatus: BenchmarkVerificationStatus;
  sourceNote: string;
};

export type FloridaBestMathBand = DifficultyBand & {
  skills: MathSkill[];
};

export const DIFFICULTY_ORDER: DifficultyKey[] = ["easy", "medium", "hard", "extreme"];

const NOT_VERIFIED_FROM_SOURCE = "Not verified from provided source";
const CPALMS_SOURCE_NOTE =
  "Verified against user-provided CPALMS course export PDF; recheck CPALMS/FDOE before formal standards reporting.";

const OFFICIAL_BENCHMARK_WORDING: Record<string, string> = {
  "MA.3.NSO.2.1":
    "Add and subtract multi-digit whole numbers including using a standard algorithm with procedural fluency.",
  "MA.3.AR.1.2":
    "Solve one- and two-step real-world problems involving any of four operations with whole numbers.",
  "MA.3.GR.2.3":
    "Solve mathematical and real-world problems involving the perimeter and area of rectangles with whole-number side lengths using a visual model and a formula.",
  "MA.3.FR.2.1":
    "Plot, order and compare fractional numbers with the same numerator or the same denominator.",
  "MA.3.M.2.2":
    "Solve one- and two-step real-world problems involving elapsed time.",
  "MA.4.NSO.1.4":
    "Round whole numbers from 0 to 10,000 to the nearest 10, 100 or 1,000.",
  "MA.4.NSO.2.2":
    "Multiply two whole numbers, up to three digits by up to two digits, with procedural reliability.",
  "MA.4.NSO.2.4":
    "Divide a whole number up to four digits by a one-digit whole number with procedural reliability. Represent remainders as fractional parts of the divisor.",
  "MA.4.FR.1.3":
    "Identify and generate equivalent fractions, including fractions greater than one. Describe how the numerator and denominator are affected when the equivalent fraction is created.",
  "MA.4.FR.1.2":
    "Use decimal notation to represent fractions with denominators of 10 or 100, including mixed numbers and fractions greater than 1, and use fractional notation with denominators of 10 or 100 to represent decimals.",
  "MA.4.GR.1.3":
    "Solve real-world and mathematical problems involving unknown whole-number angle measures. Write an equation to represent the unknown.",
  "MA.5.NSO.1.3":
    "Compose and decompose multi-digit numbers with decimals to the thousandths in multiple ways using the values of the digits in each place.",
  "MA.5.NSO.2.3":
    "Add and subtract multi-digit numbers with decimals to the thousandths, including using a standard algorithm with procedural fluency.",
  "MA.5.FR.2.1":
    "Add and subtract fractions with unlike denominators, including mixed numbers and fractions greater than 1, with procedural reliability.",
  "MA.5.AR.1.2":
    "Solve real-world problems involving the addition, subtraction or multiplication of fractions, including mixed numbers and fractions greater than 1.",
  "MA.5.GR.3.2":
    "Find the volume of a right rectangular prism with whole-number side lengths using a visual model and a formula.",
  "MA.5.AR.2.2":
    "Evaluate multi-step numerical expressions using order of operations.",
  "MA.5.GR.3.3":
    "Solve real-world problems involving the volume of right rectangular prisms, including problems with an unknown edge length, with whole-number edge lengths using a visual model or a formula. Write an equation with a variable for the unknown to represent the problem.",
  "MA.5.GR.4.2":
    "Represent mathematical and real-world problems by plotting points in the first quadrant of the coordinate plane and interpret coordinate values of points in the context of the situation.",
};

function benchmarkMetadata(
  benchmark: string,
  verificationStatus: BenchmarkVerificationStatus = "verified_from_provided_source",
) {
  return {
    officialBenchmark:
      OFFICIAL_BENCHMARK_WORDING[benchmark] ?? NOT_VERIFIED_FROM_SOURCE,
    domain: NOT_VERIFIED_FROM_SOURCE,
    strand: NOT_VERIFIED_FROM_SOURCE,
    reportingCategory: NOT_VERIFIED_FROM_SOURCE,
    verificationStatus,
    sourceNote: CPALMS_SOURCE_NOTE,
  };
}

// Benchmark descriptions below are conservative app-facing alignment labels,
// not exhaustive coverage or formal reporting text. Official benchmark wording
// is stored separately for transparency and should still be rechecked against
// CPALMS/FDOE before public standards reporting or commercial claims.
export const FL_BEST_MATH_BANDS: Record<DifficultyKey, FloridaBestMathBand> = {
  easy: {
    label: "Easy",
    displayName: "Adventurer",
    gradeBand: 3,
    standardsSystem: "Florida B.E.S.T. Mathematics",
    description: "Grade 3 Florida B.E.S.T. math skills",
    studentSummary: "Multiplication facts, place value, area, simple fractions",
    readingGuidance: "shorter scenes, simpler vocabulary, 60-100 words",
    skills: [
      {
        id: "g3_add_sub_1000",
        benchmark: "MA.3.NSO.2.1",
        description:
          "Practice multi-digit whole-number addition and subtraction within Grade 3 expectations.",
        skill: "addition and subtraction within 1,000",
        generator: "g3AddSub1000",
        ...benchmarkMetadata("MA.3.NSO.2.1"),
      },
      {
        id: "g3_multiplication_equal_groups",
        benchmark: "MA.3.AR.1.2",
        description:
          "Practice one- and two-step whole-number word problems involving multiplication within Grade 3 limits.",
        skill: "multiplication within 100",
        generator: "g3MultiplicationFacts",
        ...benchmarkMetadata("MA.3.AR.1.2"),
      },
      {
        id: "g3_division_equal_groups",
        benchmark: "MA.3.AR.1.2",
        description:
          "Practice one- and two-step whole-number word problems involving division within Grade 3 limits.",
        skill: "division within 100",
        generator: "g3DivisionFacts",
        ...benchmarkMetadata("MA.3.AR.1.2"),
      },
      {
        id: "g3_area_perimeter",
        benchmark: "MA.3.GR.2.3",
        description:
          "Practice rectangle area and perimeter with whole-number side lengths within Grade 3 expectations.",
        skill: "area and perimeter with whole numbers",
        generator: "g3AreaPerimeter",
        ...benchmarkMetadata("MA.3.GR.2.3"),
      },
      {
        id: "g3_simple_fractions",
        benchmark: "MA.3.FR.2.1",
        description:
          "Practice comparing fractions with the same numerator or denominator within Grade 3 expectations.",
        skill: "simple fraction comparison",
        generator: "g3FractionCompare",
        ...benchmarkMetadata("MA.3.FR.2.1"),
      },
      {
        id: "g3_time_elapsed",
        benchmark: "MA.3.M.2.2",
        description: "Practice elapsed-time problem solving within Grade 3 expectations.",
        skill: "elapsed time",
        generator: "g3ElapsedTime",
        ...benchmarkMetadata("MA.3.M.2.2"),
      },
      {
        id: "g3_time_elapsed_two_step",
        benchmark: "MA.3.M.2.2",
        description: "Practice two-step elapsed-time problem solving within Grade 3 expectations.",
        skill: "two-step elapsed time",
        generator: "g3ElapsedTimeTwoStep",
        ...benchmarkMetadata("MA.3.M.2.2"),
      },
    ],
  },
  medium: {
    label: "Medium",
    displayName: "Hero",
    gradeBand: 4,
    standardsSystem: "Florida B.E.S.T. Mathematics",
    description: "Grade 4 Florida B.E.S.T. math skills",
    studentSummary: "Multi-digit operations, fractions, decimals, angles, area/perimeter",
    readingGuidance: "moderate scenes, 90-140 words",
    skills: [
      {
        id: "g4_rounding",
        benchmark: "MA.4.NSO.1.4",
        description:
          "Round whole numbers from 0 to 10,000 to the nearest 10, 100, or 1,000.",
        skill: "rounding multi-digit numbers",
        generator: "g4Rounding",
        ...benchmarkMetadata("MA.4.NSO.1.4"),
      },
      {
        id: "g4_multiplication",
        benchmark: "MA.4.NSO.2.2",
        description:
          "Practice multi-digit whole-number multiplication within Grade 4 expectations.",
        skill: "multi-digit multiplication",
        generator: "g4Multiplication",
        ...benchmarkMetadata("MA.4.NSO.2.2"),
      },
      {
        id: "g4_division_remainders",
        benchmark: "MA.4.NSO.2.4",
        description:
          "Divide multi-digit whole numbers by one-digit divisors and express remainders as fractional parts of the divisor.",
        skill: "division with fractional remainders",
        generator: "g4DivisionRemainders",
        ...benchmarkMetadata("MA.4.NSO.2.4"),
      },
      {
        id: "g4_equivalent_fractions",
        benchmark: "MA.4.FR.1.3",
        description:
          "Practice identifying and generating equivalent fractions within Grade 4 expectations.",
        skill: "equivalent fractions",
        generator: "g4EquivalentFractions",
        ...benchmarkMetadata("MA.4.FR.1.3"),
      },
      {
        id: "g4_decimals_hundredths",
        benchmark: "MA.4.FR.1.2",
        description:
          "Practice fraction-decimal relationships with tenths and hundredths within Grade 4 expectations.",
        skill: "decimals to hundredths",
        generator: "g4DecimalsHundredths",
        ...benchmarkMetadata("MA.4.FR.1.2"),
      },
      {
        id: "g4_angles",
        benchmark: "MA.4.GR.1.3",
        description:
          "Practice finding unknown whole-number angle measures within Grade 4 expectations.",
        skill: "angle measurement",
        generator: "g4Angles",
        ...benchmarkMetadata("MA.4.GR.1.3"),
      },
    ],
  },
  hard: {
    label: "Hard",
    displayName: "Champion",
    gradeBand: 5,
    standardsSystem: "Florida B.E.S.T. Mathematics",
    description: "Grade 5 Florida B.E.S.T. math skills",
    studentSummary: "Fractions, decimals, volume, coordinate plane, multi-step problems",
    readingGuidance: "richer scenes, 120-180 words",
    skills: [
      {
        id: "g5_decimal_place_value",
        benchmark: "MA.5.NSO.1.3",
        description:
          "Compose and decompose multi-digit numbers with decimals to the thousandths.",
        skill: "decimal place-value decomposition",
        generator: "g5DecimalPlaceValue",
        ...benchmarkMetadata("MA.5.NSO.1.3"),
      },
      {
        id: "g5_decimal_operations",
        benchmark: "MA.5.NSO.2.3",
        description:
          "Practice decimal addition and subtraction to the thousandths within Grade 5 expectations.",
        skill: "decimal operations",
        generator: "g5DecimalOperations",
        ...benchmarkMetadata("MA.5.NSO.2.3"),
      },
      {
        id: "g5_fraction_unlike_denominators",
        benchmark: "MA.5.FR.2.1",
        description:
          "Practice adding and subtracting fractions with unlike denominators within Grade 5 expectations.",
        skill: "fractions with unlike denominators",
        generator: "g5FractionAddUnlike",
        ...benchmarkMetadata("MA.5.FR.2.1"),
      },
      {
        id: "g5_fraction_whole_number",
        benchmark: "MA.5.AR.1.2",
        description: "Practice real-world fraction multiplication within Grade 5 expectations.",
        skill: "multiplying fractions by whole numbers",
        generator: "g5FractionTimesWhole",
        ...benchmarkMetadata("MA.5.AR.1.2"),
      },
      {
        id: "g5_volume",
        benchmark: "MA.5.GR.3.2",
        description:
          "Practice finding volume of right rectangular prisms with whole-number side lengths.",
        skill: "volume of rectangular prisms",
        generator: "g5Volume",
        ...benchmarkMetadata("MA.5.GR.3.2"),
      },
      {
        id: "g5_expressions",
        benchmark: "MA.5.AR.2.2",
        description:
          "Practice evaluating multi-step numerical expressions within Grade 5 expectations.",
        skill: "numerical expressions",
        generator: "g5Expressions",
        ...benchmarkMetadata("MA.5.AR.2.2"),
      },
    ],
  },
  extreme: {
    label: "Extreme",
    displayName: "Legend",
    gradeBand: 5,
    standardsSystem: "Florida B.E.S.T. Mathematics",
    description: "Advanced Grade 5 Florida B.E.S.T. math challenge",
    studentSummary: "Complex multi-step Grade 5 B.E.S.T. challenges",
    readingGuidance: "120-180 words, still kid-friendly, slightly more complex vocabulary",
    skills: [
      {
        id: "g5_extreme_fraction_combo",
        benchmark: "MA.5.AR.1.2",
        description: "Solve multi-step real-world problems involving fraction operations.",
        skill: "advanced Grade 5 fraction reasoning",
        generator: "g5ExtremeFractionCombo",
        ...benchmarkMetadata("MA.5.AR.1.2"),
      },
      {
        id: "g5_extreme_decimal_combo",
        benchmark: "MA.5.NSO.2.3",
        description:
          "Practice multi-step decimal addition and subtraction to the thousandths within Grade 5 expectations.",
        skill: "advanced Grade 5 decimal operations",
        generator: "g5ExtremeDecimalCombo",
        ...benchmarkMetadata("MA.5.NSO.2.3"),
      },
      {
        id: "g5_extreme_volume_missing_dimension",
        benchmark: "MA.5.GR.3.3",
        description:
          "Practice multi-step volume reasoning with right rectangular prisms and whole-number edge lengths.",
        skill: "advanced Grade 5 volume reasoning",
        generator: "g5ExtremeVolume",
        ...benchmarkMetadata("MA.5.GR.3.3"),
      },
      {
        id: "g5_extreme_coordinate_reasoning",
        benchmark: "MA.5.GR.4.2",
        description:
          "Represent and interpret real-world problems using first-quadrant coordinate values.",
        skill: "coordinate plane interpretation",
        generator: "g5ExtremeCoordinate",
        ...benchmarkMetadata("MA.5.GR.4.2"),
      },
      {
        id: "g5_extreme_expression_reasoning",
        benchmark: "MA.5.AR.2.2",
        description: "Practice evaluating multi-step numerical expressions within Grade 5 limits.",
        skill: "advanced Grade 5 expression reasoning",
        generator: "g5ExtremeExpressions",
        ...benchmarkMetadata("MA.5.AR.2.2"),
      },
    ],
  },
};

export function normalizeDifficulty(difficulty: string): DifficultyKey {
  const key = difficulty.trim().toLowerCase();
  if (key === "easy" || key === "medium" || key === "hard" || key === "extreme") {
    return key;
  }
  return "medium";
}

export function getDifficultyBand(difficulty: string): FloridaBestMathBand {
  return FL_BEST_MATH_BANDS[normalizeDifficulty(difficulty)];
}

export const DIFFICULTY_OPTIONS = DIFFICULTY_ORDER.map((key) => ({
  key,
  value: FL_BEST_MATH_BANDS[key].label,
  ...FL_BEST_MATH_BANDS[key],
}));
