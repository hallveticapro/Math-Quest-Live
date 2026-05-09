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

export type MathSkill = {
  id: string;
  benchmark: string;
  description: string;
  skill: string;
  generator: string;
};

export type FloridaBestMathBand = DifficultyBand & {
  skills: MathSkill[];
};

export const DIFFICULTY_ORDER: DifficultyKey[] = ["easy", "medium", "hard", "extreme"];

// Benchmark descriptions below are conservative app-facing alignment labels,
// not formal CPALMS reporting text. Verify against CPALMS/FDOE before public
// release, formal standards reports, or commercial standards claims.
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
        description: "Practice multi-digit whole-number addition and subtraction.",
        skill: "addition and subtraction within 1,000",
        generator: "g3AddSub1000",
      },
      {
        id: "g3_multiplication_equal_groups",
        benchmark: "MA.3.AR.1.2",
        description: "Solve one- and two-step whole-number word problems involving multiplication.",
        skill: "multiplication within 100",
        generator: "g3MultiplicationFacts",
      },
      {
        id: "g3_division_equal_groups",
        benchmark: "MA.3.AR.1.2",
        description: "Solve one- and two-step whole-number word problems involving division.",
        skill: "division within 100",
        generator: "g3DivisionFacts",
      },
      {
        id: "g3_area_perimeter",
        benchmark: "MA.3.GR.2.3",
        description: "Solve rectangle area and perimeter problems with whole-number side lengths.",
        skill: "area and perimeter with whole numbers",
        generator: "g3AreaPerimeter",
      },
      {
        id: "g3_simple_fractions",
        benchmark: "MA.3.FR.2.1",
        description: "Compare fractional numbers with common numerators or denominators.",
        skill: "simple fraction comparison",
        generator: "g3FractionCompare",
      },
      {
        id: "g3_time_elapsed",
        benchmark: "MA.3.M.2.2",
        description: "Solve one- and two-step elapsed time problems.",
        skill: "elapsed time",
        generator: "g3ElapsedTime",
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
        description: "Round whole numbers to nearby place values within Grade 4 limits.",
        skill: "rounding multi-digit numbers",
        generator: "g4Rounding",
      },
      {
        id: "g4_multiplication",
        benchmark: "MA.4.NSO.2.2",
        description: "Multiply multi-digit whole numbers within Grade 4 expectations.",
        skill: "multi-digit multiplication",
        generator: "g4Multiplication",
      },
      {
        id: "g4_division_remainders",
        benchmark: "MA.4.NSO.2.4",
        description: "Divide multi-digit whole numbers by one-digit divisors and represent remainders.",
        skill: "division with remainders",
        generator: "g4DivisionRemainders",
      },
      {
        id: "g4_equivalent_fractions",
        benchmark: "MA.4.FR.1.3",
        description: "Identify and generate equivalent fractions.",
        skill: "equivalent fractions",
        generator: "g4EquivalentFractions",
      },
      {
        id: "g4_decimals_hundredths",
        benchmark: "MA.4.FR.1.2",
        description: "Relate fractions with denominators 10 or 100 to decimal notation.",
        skill: "decimals to hundredths",
        generator: "g4DecimalsHundredths",
      },
      {
        id: "g4_angles",
        benchmark: "MA.4.GR.1.3",
        description: "Solve problems involving unknown whole-number angle measures.",
        skill: "angle measurement",
        generator: "g4Angles",
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
        description: "Use decimal place-value understanding to the thousandths.",
        skill: "decimal place value to thousandths",
        generator: "g5DecimalPlaceValue",
      },
      {
        id: "g5_decimal_operations",
        benchmark: "MA.5.NSO.2.3",
        description: "Add and subtract decimals to the thousandths.",
        skill: "decimal operations",
        generator: "g5DecimalOperations",
      },
      {
        id: "g5_fraction_unlike_denominators",
        benchmark: "MA.5.FR.2.1",
        description: "Add and subtract fractions with unlike denominators.",
        skill: "fractions with unlike denominators",
        generator: "g5FractionAddUnlike",
      },
      {
        id: "g5_fraction_whole_number",
        benchmark: "MA.5.AR.1.2",
        description: "Solve real-world problems involving multiplication of fractions.",
        skill: "multiplying fractions by whole numbers",
        generator: "g5FractionTimesWhole",
      },
      {
        id: "g5_volume",
        benchmark: "MA.5.GR.3.2",
        description: "Find volume of right rectangular prisms with whole-number side lengths.",
        skill: "volume of rectangular prisms",
        generator: "g5Volume",
      },
      {
        id: "g5_expressions",
        benchmark: "MA.5.AR.2.2",
        description: "Evaluate multi-step numerical expressions using order of operations.",
        skill: "numerical expressions",
        generator: "g5Expressions",
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
      },
      {
        id: "g5_extreme_decimal_combo",
        benchmark: "MA.5.NSO.2.3",
        description: "Solve multi-step decimal addition and subtraction problems to thousandths.",
        skill: "advanced Grade 5 decimal operations",
        generator: "g5ExtremeDecimalCombo",
      },
      {
        id: "g5_extreme_volume_missing_dimension",
        benchmark: "MA.5.GR.3.3",
        description: "Solve real-world volume problems involving right rectangular prisms.",
        skill: "advanced Grade 5 volume reasoning",
        generator: "g5ExtremeVolume",
      },
      {
        id: "g5_extreme_coordinate_reasoning",
        benchmark: "MA.5.GR.4.2",
        description: "Represent and interpret problems using first-quadrant coordinate values.",
        skill: "coordinate plane reasoning",
        generator: "g5ExtremeCoordinate",
      },
      {
        id: "g5_extreme_expression_reasoning",
        benchmark: "MA.5.AR.2.2",
        description: "Evaluate multi-step numerical expressions within Grade 5 limits.",
        skill: "advanced Grade 5 expression reasoning",
        generator: "g5ExtremeExpressions",
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
