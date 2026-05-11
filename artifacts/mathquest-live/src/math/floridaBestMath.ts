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
  varietyGroup?: string;
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
const NEEDS_VERIFICATION_SOURCE_NOTE =
  "Needs CPALMS/FDOE verification before formal standards reporting.";

const OFFICIAL_BENCHMARK_WORDING: Record<string, string> = {
  "MA.3.AR.1.1":
    "Apply the distributive property to multiply a one-digit number and two-digit number. Apply properties of multiplication to find a product of one-digit whole numbers.",
  "MA.3.NSO.2.1":
    "Add and subtract multi-digit whole numbers including using a standard algorithm with procedural fluency.",
  "MA.3.AR.1.2":
    "Solve one- and two-step real-world problems involving any of four operations with whole numbers.",
  "MA.3.AR.2.1":
    "Restate a division problem as a missing factor problem using the relationship between multiplication and division.",
  "MA.3.AR.2.2":
    "Determine and explain whether an equation involving multiplication or division is true or false.",
  "MA.3.AR.2.3":
    "Determine the unknown whole number in a multiplication or division equation, relating three whole numbers, with the unknown in any position.",
  "MA.3.AR.3.1":
    "Determine and explain whether a whole number from 1 to 1,000 is even or odd.",
  "MA.3.AR.3.2":
    "Determine whether a whole number from 1 to 144 is a multiple of a given one-digit number.",
  "MA.3.AR.3.3": "Identify, create and extend numerical patterns.",
  "MA.3.DP.1.1":
    "Collect and represent numerical and categorical data with whole-number values using tables, scaled pictographs, scaled bar graphs or line plots. Use appropriate titles, labels and units.",
  "MA.3.DP.1.2":
    "Interpret data with whole-number values represented with tables, scaled pictographs, circle graphs, scaled bar graphs or line plots by solving one- and two-step problems.",
  "MA.3.FR.1.1":
    "Represent and interpret unit fractions in the form 1/n as the quantity formed by one part when a whole is partitioned into n equal parts.",
  "MA.3.FR.1.2":
    "Represent and interpret fractions, including fractions greater than one, in the form of m/n as the result of adding the unit fraction 1/n to itself m times.",
  "MA.3.FR.1.3":
    "Read and write fractions, including fractions greater than one, using standard form, numeral-word form and word form.",
  "MA.3.GR.2.3":
    "Solve mathematical and real-world problems involving the perimeter and area of rectangles with whole-number side lengths using a visual model and a formula.",
  "MA.3.FR.2.1":
    "Plot, order and compare fractional numbers with the same numerator or the same denominator.",
  "MA.3.FR.2.2": "Identify equivalent fractions and explain why they are equivalent.",
  "MA.3.GR.1.1":
    "Describe and draw points, lines, line segments, rays, intersecting lines, perpendicular lines and parallel lines. Identify these in two-dimensional figures.",
  "MA.3.GR.1.2":
    "Identify and draw quadrilaterals based on their defining attributes. Quadrilaterals include parallelograms, rhombi, rectangles, squares and trapezoids.",
  "MA.3.GR.1.3":
    "Draw line(s) of symmetry in a two-dimensional figure and identify line-symmetric two-dimensional figures.",
  "MA.3.GR.2.1":
    "Explore area as an attribute of a two-dimensional figure by covering the figure with unit squares without gaps or overlaps. Find areas of rectangles by counting unit squares.",
  "MA.3.GR.2.2":
    "Find the area of a rectangle with whole-number side lengths using a visual model and a multiplication formula.",
  "MA.3.GR.2.4":
    "Solve mathematical and real-world problems involving the perimeter and area of composite figures composed of non-overlapping rectangles with whole-number side lengths.",
  "MA.3.M.1.1":
    "Select and use appropriate tools to measure the length of an object, the volume of liquid within a beaker and temperature.",
  "MA.3.M.1.2":
    "Solve real-world problems involving any of the four operations with whole-number lengths, masses, weights, temperatures or liquid volumes.",
  "MA.3.M.2.1":
    "Using analog and digital clocks tell and write time to the nearest minute using a.m. and p.m. appropriately.",
  "MA.3.M.2.2":
    "Solve one- and two-step real-world problems involving elapsed time.",
  "MA.3.NSO.1.1":
    "Read and write numbers from 0 to 10,000 using standard form, expanded form and word form.",
  "MA.3.NSO.1.2":
    "Compose and decompose four-digit numbers in multiple ways using thousands, hundreds, tens and ones. Demonstrate each composition or decomposition using objects, drawings and expressions or equations.",
  "MA.3.NSO.1.3": "Plot, order and compare whole numbers up to 10,000.",
  "MA.3.NSO.1.4":
    "Round whole numbers from 0 to 1,000 to the nearest 10 or 100.",
  "MA.3.NSO.2.2":
    "Explore multiplication of two whole numbers with products from 0 to 144, and related division facts.",
  "MA.3.NSO.2.3":
    "Multiply a one-digit whole number by a multiple of 10, up to 90, or a multiple of 100, up to 900, with procedural reliability.",
  "MA.3.NSO.2.4":
    "Multiply two whole numbers from 0 to 12 and divide using related facts with procedural reliability.",
  "MA.4.AR.1.1":
    "Solve real-world problems involving multiplication and division of whole numbers including problems in which remainders must be interpreted within the context.",
  "MA.4.AR.1.2":
    "Solve real-world problems involving addition and subtraction of fractions with like denominators, including mixed numbers and fractions greater than one.",
  "MA.4.AR.1.3":
    "Solve real-world problems involving multiplication of a fraction by a whole number or a whole number by a fraction.",
  "MA.4.AR.2.1":
    "Determine and explain whether an equation involving any of the four operations with whole numbers is true or false.",
  "MA.4.AR.2.2":
    "Given a mathematical or real-world context, write an equation involving multiplication or division to determine the unknown whole number with the unknown in any position.",
  "MA.4.AR.3.1":
    "Determine factor pairs for a whole number from 0 to 144. Determine whether a whole number from 0 to 144 is prime, composite or neither.",
  "MA.4.AR.3.2":
    "Generate, describe and extend a numerical pattern that follows a given rule.",
  "MA.4.DP.1.1":
    "Collect and represent numerical data, including fractional values, using tables, stem-and-leaf plots or line plots.",
  "MA.4.DP.1.2":
    "Determine the mode, median or range to interpret numerical data including fractional values, represented with tables, stem-and-leaf plots or line plots.",
  "MA.4.DP.1.3": "Solve real-world problems involving numerical data.",
  "MA.4.FR.1.1":
    "Model and express a fraction, including mixed numbers and fractions greater than one, with the denominator 10 as an equivalent fraction with the denominator 100.",
  "MA.4.FR.1.2":
    "Use decimal notation to represent fractions with denominators of 10 or 100, including mixed numbers and fractions greater than 1, and use fractional notation with denominators of 10 or 100 to represent decimals.",
  "MA.4.FR.1.3":
    "Identify and generate equivalent fractions, including fractions greater than one. Describe how the numerator and denominator are affected when the equivalent fraction is created.",
  "MA.4.FR.1.4":
    "Plot, order and compare fractions, including mixed numbers and fractions greater than one, with different numerators and different denominators.",
  "MA.4.FR.2.1":
    "Decompose a fraction, including mixed numbers and fractions greater than one, into a sum of fractions with the same denominator in multiple ways. Demonstrate each decomposition with objects, drawings and equations.",
  "MA.4.FR.2.2":
    "Add and subtract fractions with like denominators, including mixed numbers and fractions greater than one, with procedural reliability.",
  "MA.4.FR.2.3":
    "Explore the addition of a fraction with denominator of 10 to a fraction with denominator of 100 using equivalent fractions.",
  "MA.4.FR.2.4":
    "Extend previous understanding of multiplication to explore the multiplication of a fraction by a whole number or a whole number by a fraction.",
  "MA.4.GR.1.1":
    "Informally explore angles as an attribute of two-dimensional figures. Identify and classify angles as acute, right, obtuse, straight or reflex.",
  "MA.4.GR.1.2":
    "Estimate angle measures. Using a protractor, measure angles in whole-number degrees and draw angles of specified measure in whole-number degrees. Demonstrate that angle measure is additive.",
  "MA.4.GR.1.3":
    "Solve real-world and mathematical problems involving unknown whole-number angle measures. Write an equation to represent the unknown.",
  "MA.4.GR.2.1":
    "Solve perimeter and area mathematical and real-world problems, including problems with unknown sides, for rectangles with whole-number side lengths.",
  "MA.4.GR.2.2":
    "Solve problems involving rectangles with the same perimeter and different areas or with the same area and different perimeters.",
  "MA.4.M.1.1": "Select and use appropriate tools to measure attributes of objects.",
  "MA.4.M.1.2":
    "Convert within a single system of measurement using the units: yards, feet, inches; kilometers, meters, centimeters, millimeters; pounds, ounces; kilograms, grams; gallons, quarts, pints, cups; liter, milliliter; and hours, minutes, seconds.",
  "MA.4.M.2.1":
    "Solve two-step real-world problems involving distances and intervals of time using any combination of the four operations.",
  "MA.4.M.2.2":
    "Solve one- and two-step addition and subtraction real-world problems involving money using decimal notation.",
  "MA.4.NSO.1.1":
    "Express how the value of a digit in a multi-digit whole number changes if the digit moves one place to the left or right.",
  "MA.4.NSO.1.2":
    "Read and write multi-digit whole numbers from 0 to 1,000,000 using standard form, expanded form and word form.",
  "MA.4.NSO.1.3": "Plot, order and compare multi-digit whole numbers up to 1,000,000.",
  "MA.4.NSO.1.4":
    "Round whole numbers from 0 to 10,000 to the nearest 10, 100 or 1,000.",
  "MA.4.NSO.1.5": "Plot, order and compare decimals up to the hundredths.",
  "MA.4.NSO.2.1":
    "Recall multiplication facts with factors up to 12 and related division facts with automaticity.",
  "MA.4.NSO.2.2":
    "Multiply two whole numbers, up to three digits by up to two digits, with procedural reliability.",
  "MA.4.NSO.2.3":
    "Multiply two whole numbers, each up to two digits, including using a standard algorithm with procedural fluency.",
  "MA.4.NSO.2.4":
    "Divide a whole number up to four digits by a one-digit whole number with procedural reliability. Represent remainders as fractional parts of the divisor.",
  "MA.4.NSO.2.5":
    "Explore the multiplication and division of multi-digit whole numbers using estimation, rounding and place value.",
  "MA.4.NSO.2.6":
    "Identify the number that is one-tenth more, one-tenth less, one-hundredth more and one-hundredth less than a given number.",
  "MA.4.NSO.2.7":
    "Explore the addition and subtraction of multi-digit numbers with decimals to the hundredths.",
  "MA.5.NSO.1.3":
    "Compose and decompose multi-digit numbers with decimals to the thousandths in multiple ways using the values of the digits in each place.",
  "MA.5.AR.1.1":
    "Solve multi-step real-world problems involving any combination of the four operations with whole numbers, including problems in which remainders must be interpreted within the context.",
  "MA.5.AR.1.3":
    "Solve real-world problems involving division of a unit fraction by a whole number and a whole number by a unit fraction.",
  "MA.5.AR.2.1":
    "Translate written real-world and mathematical descriptions into numerical expressions and numerical expressions into written mathematical descriptions.",
  "MA.5.NSO.2.3":
    "Add and subtract multi-digit numbers with decimals to the thousandths, including using a standard algorithm with procedural fluency.",
  "MA.5.AR.2.3":
    "Determine and explain whether an equation involving any of the four operations is true or false.",
  "MA.5.AR.2.4":
    "Given a mathematical or real-world context, write an equation involving any of the four operations to determine the unknown whole number with the unknown in any position.",
  "MA.5.AR.3.1":
    "Given a numerical pattern, identify and write a rule that can describe the pattern as an expression.",
  "MA.5.AR.3.2":
    "Given a rule for a numerical pattern, use a two-column table to record the inputs and outputs.",
  "MA.5.DP.1.1":
    "Collect and represent numerical data, including fractional and decimal values, using tables, line graphs or line plots.",
  "MA.5.DP.1.2":
    "Interpret numerical data, with whole-number values, represented with tables or line plots by determining the mean, mode, median or range.",
  "MA.5.FR.1.1":
    "Given a mathematical or real-world problem, represent the division of two whole numbers as a fraction.",
  "MA.5.FR.2.1":
    "Add and subtract fractions with unlike denominators, including mixed numbers and fractions greater than 1, with procedural reliability.",
  "MA.5.FR.2.2":
    "Extend previous understanding of multiplication to multiply a fraction by a fraction, including mixed numbers and fractions greater than 1, with procedural reliability.",
  "MA.5.FR.2.3":
    "When multiplying a given number by a fraction less than 1 or a fraction greater than 1, predict and explain the relative size of the product to the given number without calculating.",
  "MA.5.FR.2.4":
    "Extend previous understanding of division to explore the division of a unit fraction by a whole number and a whole number by a unit fraction.",
  "MA.5.AR.1.2":
    "Solve real-world problems involving the addition, subtraction or multiplication of fractions, including mixed numbers and fractions greater than 1.",
  "MA.5.GR.1.1":
    "Classify triangles or quadrilaterals into different categories based on shared defining attributes. Explain why a triangle or quadrilateral would or would not belong to a category.",
  "MA.5.GR.1.2":
    "Identify and classify three-dimensional figures into categories based on their defining attributes. Figures are limited to right pyramids, right prisms, right circular cylinders, right circular cones and spheres.",
  "MA.5.GR.2.1":
    "Find the perimeter and area of a rectangle with fractional or decimal side lengths using visual models and formulas.",
  "MA.5.GR.3.1":
    "Explore volume as an attribute of three-dimensional figures by packing them with unit cubes without gaps. Find the volume of a right rectangular prism with whole-number side lengths by counting unit cubes.",
  "MA.5.GR.3.2":
    "Find the volume of a right rectangular prism with whole-number side lengths using a visual model and a formula.",
  "MA.5.AR.2.2":
    "Evaluate multi-step numerical expressions using order of operations.",
  "MA.5.GR.3.3":
    "Solve real-world problems involving the volume of right rectangular prisms, including problems with an unknown edge length, with whole-number edge lengths using a visual model or a formula. Write an equation with a variable for the unknown to represent the problem.",
  "MA.5.GR.4.2":
    "Represent mathematical and real-world problems by plotting points in the first quadrant of the coordinate plane and interpret coordinate values of points in the context of the situation.",
  "MA.5.GR.4.1":
    "Identify the origin and axes in the coordinate system. Plot and label ordered pairs in the first quadrant of the coordinate plane.",
  "MA.5.M.1.1":
    "Solve multi-step real-world problems that involve converting measurement units to equivalent measurements within a single system of measurement.",
  "MA.5.M.2.1": "Solve multi-step real-world problems involving money using decimal notation.",
  "MA.5.NSO.1.1":
    "Express how the value of a digit in a multi-digit number with decimals to the thousandths changes if the digit moves one or more places to the left or right.",
  "MA.5.NSO.1.2":
    "Read and write multi-digit numbers with decimals to the thousandths using standard form, word form and expanded form.",
  "MA.5.NSO.1.4":
    "Plot, order and compare multi-digit numbers with decimals up to the thousandths.",
  "MA.5.NSO.1.5":
    "Round multi-digit numbers with decimals to the thousandths to the nearest hundredth, tenth or whole number.",
  "MA.5.NSO.2.1":
    "Multiply multi-digit whole numbers including using a standard algorithm with procedural fluency.",
  "MA.5.NSO.2.2":
    "Divide multi-digit whole numbers, up to five digits by two digits, including using a standard algorithm with procedural fluency. Represent remainders as fractions.",
  "MA.5.NSO.2.4":
    "Explore the multiplication and division of multi-digit numbers with decimals to the hundredths using estimation, rounding and place value.",
  "MA.5.NSO.2.5":
    "Multiply and divide a multi-digit number with decimals to the tenths by one-tenth and one-hundredth with procedural reliability.",
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
    sourceNote:
      verificationStatus === "verified_from_provided_source"
        ? CPALMS_SOURCE_NOTE
        : NEEDS_VERIFICATION_SOURCE_NOTE,
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
    studentSummary: "Place value, operations, measurement, data, area, simple fractions",
    readingGuidance: "shorter scenes, simpler vocabulary, 60-100 words",
    skills: [
      {
        id: "g3_place_value_digit",
        benchmark: "MA.3.NSO.1.2",
        description:
          "Practice identifying the value of a digit in a multi-digit whole number within Grade 3 expectations.",
        skill: "place value",
        generator: "g3PlaceValueDigit",
        ...benchmarkMetadata("MA.3.NSO.1.2"),
      },
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
        id: "g3_equivalent_fractions",
        benchmark: "MA.3.FR.2.2",
        description:
          "Practice identifying equivalent fractions within Grade 3 expectations.",
        skill: "equivalent fractions",
        generator: "g3EquivalentFractions",
        ...benchmarkMetadata("MA.3.FR.2.2"),
      },
      {
        id: "g3_rounding",
        benchmark: "MA.3.NSO.1.4",
        description:
          "Practice rounding whole numbers from 0 to 1,000 to the nearest 10 or 100.",
        skill: "rounding whole numbers",
        generator: "g3Rounding",
        ...benchmarkMetadata("MA.3.NSO.1.4"),
      },
      {
        id: "g3_measurement_length",
        benchmark: "MA.3.M.1.2",
        description:
          "Practice solving real-world length measurement problems within Grade 3 expectations.",
        skill: "length measurement",
        generator: "g3MeasurementLength",
        ...benchmarkMetadata("MA.3.M.1.2"),
      },
      {
        id: "g3_measurement_mass_volume",
        benchmark: "MA.3.M.1.2",
        description:
          "Practice whole-number measurement operations with mass, weight, temperature, or liquid volume within Grade 3 expectations.",
        skill: "measurement operations",
        generator: "g3MeasurementMassVolume",
        ...benchmarkMetadata("MA.3.M.1.2"),
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
      {
        id: "g3_data_interpretation",
        benchmark: "MA.3.DP.1.2",
        description:
          "Practice reading and comparing values in a simple data table within Grade 3 expectations.",
        skill: "simple data interpretation",
        generator: "g3DataInterpretation",
        ...benchmarkMetadata("MA.3.DP.1.2"),
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
        id: "g4_factors_prime_composite",
        benchmark: "MA.4.AR.3.1",
        description:
          "Practice factor pairs and prime/composite classification within Grade 4 expectations.",
        skill: "factors, prime, and composite numbers",
        generator: "g4FactorsPrimeComposite",
        ...benchmarkMetadata("MA.4.AR.3.1"),
      },
      {
        id: "g4_area_perimeter_rectangles",
        benchmark: "MA.4.GR.2.1",
        description:
          "Practice rectangle area and perimeter problem solving, including unknown sides, within Grade 4 expectations.",
        skill: "area and perimeter problem solving",
        generator: "g4AreaPerimeterRectangles",
        ...benchmarkMetadata("MA.4.GR.2.1"),
      },
      {
        id: "g4_same_perimeter_area",
        benchmark: "MA.4.GR.2.2",
        description:
          "Practice comparing rectangles with the same perimeter or same area within Grade 4 expectations.",
        skill: "same perimeter and same area rectangles",
        generator: "g4SamePerimeterArea",
        ...benchmarkMetadata("MA.4.GR.2.2"),
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
        id: "g4_equivalent_fractions_greater_than_one",
        benchmark: "MA.4.FR.1.3",
        description:
          "Practice equivalent fractions greater than one within Grade 4 expectations.",
        skill: "equivalent fractions greater than one",
        generator: "g4EquivalentFractionsGreaterThanOne",
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
        id: "g4_decimals_tenths_to_fraction",
        benchmark: "MA.4.FR.1.2",
        description:
          "Practice decimal-fraction relationships with tenths within Grade 4 expectations.",
        skill: "tenths as decimals and fractions",
        generator: "g4DecimalsTenthsToFraction",
        ...benchmarkMetadata("MA.4.FR.1.2"),
      },
      {
        id: "g4_fraction_add_like_denominators",
        benchmark: "MA.4.FR.2.2",
        description:
          "Practice adding and subtracting fractions with like denominators within Grade 4 expectations.",
        skill: "like-denominator fraction operations",
        generator: "g4FractionAddLikeDenominators",
        ...benchmarkMetadata("MA.4.FR.2.2"),
      },
      {
        id: "g4_fraction_decomposition",
        benchmark: "MA.4.FR.2.1",
        description:
          "Practice decomposing fractions into sums with the same denominator within Grade 4 expectations.",
        skill: "fraction decomposition",
        generator: "g4FractionDecomposition",
        ...benchmarkMetadata("MA.4.FR.2.1"),
      },
      {
        id: "g4_fraction_tenths_hundredths_add",
        benchmark: "MA.4.FR.2.3",
        description:
          "Practice adding tenths and hundredths using equivalent fractions within Grade 4 expectations.",
        skill: "tenths and hundredths fraction addition",
        generator: "g4FractionTenthsHundredthsAdd",
        ...benchmarkMetadata("MA.4.FR.2.3"),
      },
      {
        id: "g4_fraction_times_whole",
        benchmark: "MA.4.FR.2.4",
        description:
          "Practice multiplying a fraction by a whole number within Grade 4 expectations.",
        skill: "fraction times whole number",
        generator: "g4FractionTimesWhole",
        ...benchmarkMetadata("MA.4.FR.2.4"),
      },
      {
        id: "g4_money_decimal",
        benchmark: "MA.4.M.2.2",
        description:
          "Practice one- and two-step money problems using decimal notation within Grade 4 expectations.",
        skill: "money with decimal notation",
        generator: "g4MoneyDecimal",
        ...benchmarkMetadata("MA.4.M.2.2"),
      },
      {
        id: "g4_measurement_conversion",
        benchmark: "MA.4.M.1.2",
        description:
          "Practice converting measurements within a single system within Grade 4 expectations.",
        skill: "measurement conversion",
        generator: "g4MeasurementConversion",
        ...benchmarkMetadata("MA.4.M.1.2"),
      },
      {
        id: "g4_data_interpretation",
        benchmark: "MA.4.DP.1.3",
        description:
          "Practice solving real-world problems using numerical data within Grade 4 expectations.",
        skill: "data interpretation",
        generator: "g4DataInterpretation",
        ...benchmarkMetadata("MA.4.DP.1.3"),
      },
      {
        id: "g4_decimal_compare",
        benchmark: "MA.4.NSO.1.5",
        description:
          "Practice comparing decimals to hundredths within Grade 4 expectations.",
        skill: "decimal comparison to hundredths",
        generator: "g4DecimalCompare",
        ...benchmarkMetadata("MA.4.NSO.1.5"),
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
      {
        id: "g4_angles_three_part",
        benchmark: "MA.4.GR.1.3",
        description:
          "Practice finding unknown whole-number angle measures in multi-part angles within Grade 4 expectations.",
        skill: "multi-part angle measurement",
        generator: "g4AnglesThreePart",
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
        id: "g5_decimal_subtraction",
        benchmark: "MA.5.NSO.2.3",
        description:
          "Practice decimal subtraction to the thousandths within Grade 5 expectations.",
        skill: "decimal subtraction",
        generator: "g5DecimalSubtraction",
        ...benchmarkMetadata("MA.5.NSO.2.3"),
      },
      {
        id: "g5_decimal_compare",
        benchmark: "MA.5.NSO.1.4",
        description:
          "Practice comparing decimals to the thousandths within Grade 5 expectations.",
        skill: "decimal comparison",
        generator: "g5DecimalCompare",
        ...benchmarkMetadata("MA.5.NSO.1.4"),
      },
      {
        id: "g5_decimal_rounding",
        benchmark: "MA.5.NSO.1.5",
        description:
          "Practice rounding decimals to the nearest hundredth, tenth, or whole number within Grade 5 expectations.",
        skill: "decimal rounding",
        generator: "g5DecimalRounding",
        ...benchmarkMetadata("MA.5.NSO.1.5"),
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
        id: "g5_fraction_subtract_unlike_denominators",
        benchmark: "MA.5.FR.2.1",
        description:
          "Practice subtracting fractions with unlike denominators within Grade 5 expectations.",
        skill: "subtracting fractions with unlike denominators",
        generator: "g5FractionSubtractUnlike",
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
        id: "g5_fraction_times_fraction",
        benchmark: "MA.5.FR.2.2",
        description:
          "Practice multiplying fractions by fractions within Grade 5 expectations.",
        skill: "fraction by fraction multiplication",
        generator: "g5FractionTimesFraction",
        ...benchmarkMetadata("MA.5.FR.2.2"),
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
        id: "g5_coordinate_point",
        benchmark: "MA.5.GR.4.2",
        description:
          "Practice representing first-quadrant locations as ordered pairs in a real-world context.",
        skill: "coordinate plane ordered pairs",
        generator: "g5CoordinatePoint",
        ...benchmarkMetadata("MA.5.GR.4.2"),
      },
      {
        id: "g5_coordinate_axes",
        benchmark: "MA.5.GR.4.1",
        description:
          "Practice identifying coordinate axes and plotting first-quadrant ordered pairs within Grade 5 expectations.",
        skill: "coordinate axes and plotting",
        generator: "g5CoordinateAxes",
        ...benchmarkMetadata("MA.5.GR.4.1"),
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
      {
        id: "g5_whole_number_multiplication",
        benchmark: "MA.5.NSO.2.1",
        description:
          "Practice multi-digit whole-number multiplication within Grade 5 expectations.",
        skill: "multi-digit whole-number multiplication",
        generator: "g5WholeNumberMultiplication",
        ...benchmarkMetadata("MA.5.NSO.2.1"),
      },
      {
        id: "g5_whole_number_division",
        benchmark: "MA.5.NSO.2.2",
        description:
          "Practice multi-digit whole-number division with remainders represented as fractions within Grade 5 expectations.",
        skill: "multi-digit whole-number division",
        generator: "g5WholeNumberDivision",
        ...benchmarkMetadata("MA.5.NSO.2.2"),
      },
      {
        id: "g5_geometry_classification",
        benchmark: "MA.5.GR.1.1",
        description:
          "Practice classifying triangles and quadrilaterals by shared attributes within Grade 5 expectations.",
        skill: "geometry classification",
        generator: "g5GeometryClassification",
        ...benchmarkMetadata("MA.5.GR.1.1"),
      },
      {
        id: "g5_data_statistics",
        benchmark: "MA.5.DP.1.2",
        description:
          "Practice interpreting whole-number data using mean, median, mode, or range within Grade 5 expectations.",
        skill: "data statistics",
        generator: "g5DataStatistics",
        ...benchmarkMetadata("MA.5.DP.1.2"),
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
        id: "g5_extreme_whole_number_remainders",
        benchmark: "MA.5.AR.1.1",
        description:
          "Practice multi-step whole-number word problems with contextual remainders within Grade 5 expectations.",
        skill: "advanced whole-number problem solving",
        generator: "g5ExtremeWholeNumberRemainders",
        ...benchmarkMetadata("MA.5.AR.1.1"),
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
        id: "g5_extreme_measurement_conversion",
        benchmark: "MA.5.M.1.1",
        description:
          "Practice multi-step real-world measurement conversion problems within a single system.",
        skill: "advanced measurement conversion",
        generator: "g5ExtremeMeasurementConversion",
        ...benchmarkMetadata("MA.5.M.1.1"),
      },
      {
        id: "g5_extreme_money_decimal",
        benchmark: "MA.5.M.2.1",
        description:
          "Practice multi-step money problems using decimal notation within Grade 5 expectations.",
        skill: "advanced money problem solving",
        generator: "g5ExtremeMoneyDecimal",
        ...benchmarkMetadata("MA.5.M.2.1"),
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
      {
        id: "g5_extreme_fraction_unlike_multi_step",
        benchmark: "MA.5.FR.2.1",
        description:
          "Practice multi-step unlike-denominator fraction operations within Grade 5 expectations.",
        skill: "advanced unlike-denominator fraction reasoning",
        generator: "g5ExtremeFractionUnlikeMultiStep",
        ...benchmarkMetadata("MA.5.FR.2.1"),
      },
      {
        id: "g5_extreme_data_range",
        benchmark: "MA.5.DP.1.2",
        description:
          "Practice multi-step interpretation of whole-number data using range within Grade 5 expectations.",
        skill: "advanced data interpretation",
        generator: "g5ExtremeDataRange",
        ...benchmarkMetadata("MA.5.DP.1.2"),
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
