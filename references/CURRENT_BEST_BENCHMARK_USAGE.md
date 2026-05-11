# Current Florida B.E.S.T. Benchmark Usage

## Purpose

This file inventories the Florida B.E.S.T. Mathematics benchmark metadata currently used by MathQuest Live. It documents the app's current internal alignment data, generated problem types, and places where benchmark-related wording appears.

This reference does not verify official benchmark wording. It is an implementation inventory only.

## Important Note

This file documents the benchmarks currently used by MathQuest Live. Benchmark descriptions should be verified against CPALMS/FDOE before public release, commercial use, or formal standards reporting.

## Inventory Source Files

- `artifacts/mathquest-live/src/math/floridaBestMath.ts`: difficulty bands, skill ids, benchmark codes, app descriptions, skill labels, and generator names.
- `artifacts/mathquest-live/src/mathEngine.ts`: deterministic problem generators, problem metadata shape, hints, signatures, answer choices, and recovery problem generation.
- `artifacts/mathquest-live/src/validateMath.ts`: developer validation of benchmark metadata on generated problems.
- `README.md`: public documentation and one sample metadata object.
- `artifacts/mathquest-live/src/components/AppInfoDialog.tsx`: general information modal explaining safety, privacy, and AI story versus app-generated math.
- `artifacts/mathquest-live/src/components/QuestSettingsDialog.tsx`: in-game challenge-level descriptions.
- `artifacts/mathquest-live/src/pages/SetupScreen.tsx`: Chronicler setup challenge-level descriptions.

## Summary

- Unique benchmark codes currently used: 47
- Total skill entries currently mapped to benchmarks: 61
- Grade 3 / Easy skill entries: 14
- Grade 4 / Medium skill entries: 20
- Grade 5 / Hard skill entries: 17
- Advanced Grade 5 / Extreme skill entries: 10

Benchmark codes and descriptions are currently internal metadata on generated math problems. Student-facing setup, settings, and app-info UI show difficulty-level descriptions and skill summaries, but they do not show individual benchmark codes. The README includes a sample metadata object that shows one benchmark code and description.

## Current Metadata Shape

Generated math problems currently include:

```ts
{
  prompt,
  choices,
  correctAnswer,
  difficulty,
  gradeBand,
  standardsSystem,
  benchmark,
  benchmarkDescription,
  skill,
  skillLabel,
  skillId,
  problemType,
  signature,
  hint,
  secondHint
  varietyGroup
}
```

## Latest Variety Expansion

The current engine now includes a session-only `varietyGroup` on each generated problem. Gameplay uses this field to prefer unused skill families within a quest before repeating a group, while exact duplicate prevention still relies on stable problem signatures that ignore answer-choice order.

Newly added or expanded generator coverage:

- Easy / Grade 3: `g3MeasurementMassVolume` under `MA.3.M.1.2`.
- Easy / Grade 3: `g3NumberPatterns` under `MA.3.AR.3.3`.
- Medium / Grade 4: `g4SamePerimeterArea`, `g4FractionDecomposition`, `g4FractionTenthsHundredthsAdd`, `g4FractionTimesWhole`, `g4MeasurementConversion`, `g4DataInterpretation`, and `g4DecimalCompare`.
- Hard / Grade 5: `g5WholeNumberMultiplication`, `g5WholeNumberDivision`, `g5GeometryClassification`, and `g5DataStatistics`.
- Extreme / Advanced Grade 5: `g5ExtremeFractionUnlikeMultiStep` and `g5ExtremeDataRange`.

All new items use benchmark codes already present in the Grade 3, Grade 4, or Grade 5 reference files under `references/`.

## Current Domains / Strands

The generated problem metadata includes `domain`, `strand`, and `reportingCategory` fields. Domain and strand are now populated from verified Florida B.E.S.T. benchmark-code families where available, such as `NSO`, `AR`, `FR`, `M`, `GR`, and `DP`. Reporting category remains conservative placeholder text unless a later official source provides the exact reporting-category wording.

The app currently implies broad content areas through:

- Benchmark code prefixes, such as `NSO`, `AR`, `FR`, `M`, and `GR`.
- Skill labels, such as `decimal operations`, `elapsed time`, and `volume of rectangular prisms`.
- Difficulty-level summaries in `floridaBestMath.ts`.

This file does not invent official domain names. A future verification pass should decide whether to add explicit domain/strand metadata from official CPALMS/FDOE source material.

## Summary Table

The summary table is the current authoritative inventory after the Grade 3, Grade 4, and Grade 5 standards-reference expansion passes. Some narrative detail sections below preserve extra notes from earlier audits and should be treated as explanatory, not as a replacement for this table.

| Difficulty | Grade Band | Benchmark Code | Current App Description | Skill Label | Problem Type | Generator(s) | Internal/Student/Teacher/README Use | Verification Status |
|---|---:|---|---|---|---|---|---|---|
| Easy | 3 | MA.3.NSO.1.2 | Practice identifying the value of a digit in a multi-digit whole number within Grade 3 expectations. | place value | digit value in a multi-digit number | g3PlaceValueDigit | Internal metadata; developer validation | Verified from provided source |
| Easy | 3 | MA.3.NSO.2.1 | Practice multi-digit whole-number addition and subtraction. | addition and subtraction within 1,000 | addition/subtraction word problem | g3AddSub1000 | Internal metadata; developer validation | Verified from provided source |
| Easy | 3 | MA.3.AR.1.2 | Solve one- and two-step whole-number word problems involving multiplication. | multiplication within 100 | equal groups/array multiplication | g3MultiplicationFacts | Internal metadata; README sample uses this code/description | Verified from provided source |
| Easy | 3 | MA.3.AR.1.2 | Solve one- and two-step whole-number word problems involving division. | division within 100 | equal sharing division | g3DivisionFacts | Internal metadata | Verified from provided source |
| Easy | 3 | MA.3.GR.2.3 | Solve rectangle area and perimeter problems with whole-number side lengths. | area and perimeter with whole numbers | rectangle area or perimeter | g3AreaPerimeter | Internal metadata | Verified from provided source |
| Easy | 3 | MA.3.FR.2.1 | Compare fractional numbers with common numerators or denominators. | simple fraction comparison | same-denominator fraction comparison | g3FractionCompare | Internal metadata | Verified from provided source |
| Easy | 3 | MA.3.FR.2.2 | Practice identifying equivalent fractions within Grade 3 expectations. | equivalent fractions | equivalent fractions | g3EquivalentFractions | Internal metadata; developer validation | Verified from provided source |
| Easy | 3 | MA.3.NSO.1.4 | Practice rounding whole numbers from 0 to 1,000 to the nearest 10 or 100. | rounding whole numbers | whole-number rounding | g3Rounding | Internal metadata; developer validation | Verified from provided source |
| Easy | 3 | MA.3.AR.3.3 | Practice extending numerical patterns within Grade 3 expectations. | number patterns | extend numerical pattern | g3NumberPatterns | Internal metadata; developer validation | Verified from provided source |
| Easy | 3 | MA.3.M.1.2 | Practice solving real-world length measurement problems within Grade 3 expectations. | length measurement | length total or comparison | g3MeasurementLength | Internal metadata; developer validation | Verified from provided source |
| Easy | 3 | MA.3.M.2.2 | Practice elapsed-time problem solving within Grade 3 expectations. | elapsed time | elapsed time in minutes | g3ElapsedTime | Internal metadata | Verified from provided source |
| Easy | 3 | MA.3.M.2.2 | Practice two-step elapsed-time problem solving within Grade 3 expectations. | two-step elapsed time | two-step elapsed time with a missing part | g3ElapsedTimeTwoStep | Internal metadata | Verified from provided source |
| Easy | 3 | MA.3.DP.1.2 | Practice reading and comparing values in a simple data table within Grade 3 expectations. | simple data interpretation | table total or comparison | g3DataInterpretation | Internal metadata; developer validation | Verified from provided source |
| Medium | 4 | MA.4.NSO.1.4 | Round whole numbers from 0 to 10,000 to the nearest 10, 100, or 1,000. | rounding multi-digit numbers | whole-number rounding within verified Grade 4 range | g4Rounding | Internal metadata | Verified from provided source |
| Medium | 4 | MA.4.NSO.2.2 | Multiply multi-digit whole numbers within Grade 4 expectations. | multi-digit multiplication | two-digit by one-digit multiplication | g4Multiplication | Internal metadata | Verified from provided source |
| Medium | 4 | MA.4.NSO.2.4 | Divide multi-digit whole numbers by one-digit divisors and express remainders as fractional parts of the divisor. | division with fractional remainders | division with fractional remainder notation | g4DivisionRemainders | Internal metadata | Verified from provided source |
| Medium | 4 | MA.4.AR.3.1 | Practice factor pairs and prime/composite classification within Grade 4 expectations. | factors, prime, and composite numbers | factor pairs or prime/composite classification | g4FactorsPrimeComposite | Internal metadata; developer validation | Verified from provided source |
| Medium | 4 | MA.4.GR.2.1 | Practice rectangle area and perimeter problem solving, including unknown sides, within Grade 4 expectations. | area and perimeter problem solving | rectangle area/perimeter or missing side | g4AreaPerimeterRectangles | Internal metadata; developer validation | Verified from provided source |
| Medium | 4 | MA.4.FR.1.3 | Identify and generate equivalent fractions. | equivalent fractions | equivalent fractions | g4EquivalentFractions | Internal metadata | Verified from provided source |
| Medium | 4 | MA.4.FR.1.3 | Practice equivalent fractions greater than one within Grade 4 expectations. | equivalent fractions greater than one | equivalent fractions greater than one | g4EquivalentFractionsGreaterThanOne | Internal metadata; developer validation | Verified from provided source |
| Medium | 4 | MA.4.FR.1.2 | Relate fractions with denominators 10 or 100 to decimal notation. | decimals to hundredths | fraction-to-decimal conversion | g4DecimalsHundredths | Internal metadata | Verified from provided source |
| Medium | 4 | MA.4.FR.1.2 | Practice decimal-fraction relationships with tenths within Grade 4 expectations. | tenths as decimals and fractions | decimal-to-fraction tenths conversion | g4DecimalsTenthsToFraction | Internal metadata; developer validation | Verified from provided source |
| Medium | 4 | MA.4.FR.2.2 | Practice adding and subtracting fractions with like denominators within Grade 4 expectations. | like-denominator fraction operations | like-denominator fraction addition/subtraction | g4FractionAddLikeDenominators | Internal metadata; developer validation | Verified from provided source |
| Medium | 4 | MA.4.M.2.2 | Practice one- and two-step money problems using decimal notation within Grade 4 expectations. | money with decimal notation | decimal money addition/subtraction | g4MoneyDecimal | Internal metadata; developer validation | Verified from provided source |
| Medium | 4 | MA.4.GR.1.3 | Solve problems involving unknown whole-number angle measures. | angle measurement | missing angle measure | g4Angles | Internal metadata | Verified from provided source |
| Medium | 4 | MA.4.GR.1.3 | Practice finding unknown whole-number angle measures in multi-part angles within Grade 4 expectations. | multi-part angle measurement | missing angle in a three-part angle | g4AnglesThreePart | Internal metadata; developer validation | Verified from provided source |
| Hard | 5 | MA.5.NSO.1.3 | Compose and decompose multi-digit numbers with decimals to the thousandths. | decimal place-value decomposition | decimal decomposition by place value | g5DecimalPlaceValue | Internal metadata | Verified from provided source |
| Hard | 5 | MA.5.NSO.2.3 | Add and subtract decimals to the thousandths. | decimal operations | decimal addition | g5DecimalOperations | Internal metadata | Verified from provided source |
| Hard | 5 | MA.5.NSO.2.3 | Practice decimal subtraction to the thousandths within Grade 5 expectations. | decimal subtraction | decimal subtraction to thousandths | g5DecimalSubtraction | Internal metadata; developer validation | Verified from provided source |
| Hard | 5 | MA.5.NSO.1.4 | Practice comparing decimals to the thousandths within Grade 5 expectations. | decimal comparison | decimal comparison to thousandths | g5DecimalCompare | Internal metadata; developer validation | Verified from provided source |
| Hard | 5 | MA.5.NSO.1.5 | Practice rounding decimals to the nearest hundredth, tenth, or whole number within Grade 5 expectations. | decimal rounding | decimal rounding | g5DecimalRounding | Internal metadata; developer validation | Verified from provided source |
| Hard | 5 | MA.5.FR.2.1 | Add and subtract fractions with unlike denominators. | fractions with unlike denominators | fraction addition | g5FractionAddUnlike | Internal metadata | Verified from provided source |
| Hard | 5 | MA.5.FR.2.1 | Practice subtracting fractions with unlike denominators within Grade 5 expectations. | subtracting fractions with unlike denominators | fraction subtraction | g5FractionSubtractUnlike | Internal metadata; developer validation | Verified from provided source |
| Hard | 5 | MA.5.AR.1.2 | Solve real-world problems involving multiplication of fractions. | multiplying fractions by whole numbers | fraction times whole number | g5FractionTimesWhole | Internal metadata | Verified from provided source |
| Hard | 5 | MA.5.FR.2.2 | Practice multiplying fractions by fractions within Grade 5 expectations. | fraction by fraction multiplication | fraction multiplication | g5FractionTimesFraction | Internal metadata; developer validation | Verified from provided source |
| Hard | 5 | MA.5.GR.3.2 | Find volume of right rectangular prisms with whole-number side lengths. | volume of rectangular prisms | rectangular prism volume | g5Volume | Internal metadata | Verified from provided source |
| Hard | 5 | MA.5.GR.4.2 | Practice representing first-quadrant locations as ordered pairs in a real-world context. | coordinate plane ordered pairs | first-quadrant ordered pair | g5CoordinatePoint | Internal metadata; developer validation | Verified from provided source |
| Hard | 5 | MA.5.GR.4.1 | Practice identifying coordinate axes and plotting first-quadrant ordered pairs within Grade 5 expectations. | coordinate axes and plotting | coordinate axes or ordered pair plotting | g5CoordinateAxes | Internal metadata; developer validation | Verified from provided source |
| Hard | 5 | MA.5.AR.2.2 | Evaluate multi-step numerical expressions using order of operations. | numerical expressions | expression evaluation | g5Expressions | Internal metadata | Verified from provided source |
| Extreme | 5 | MA.5.AR.1.2 | Solve multi-step real-world problems involving fraction operations. | advanced Grade 5 fraction reasoning | fraction addition plus whole number | g5ExtremeFractionCombo | Internal metadata | Verified from provided source |
| Extreme | 5 | MA.5.AR.1.1 | Practice multi-step whole-number word problems with contextual remainders within Grade 5 expectations. | advanced whole-number problem solving | contextual remainder interpretation | g5ExtremeWholeNumberRemainders | Internal metadata; developer validation | Verified from provided source |
| Extreme | 5 | MA.5.NSO.2.3 | Solve multi-step decimal addition and subtraction problems to thousandths. | advanced Grade 5 decimal operations | decimal addition/subtraction to thousandths | g5ExtremeDecimalCombo | Internal metadata | Verified from provided source |
| Extreme | 5 | MA.5.GR.3.3 | Solve real-world volume problems involving right rectangular prisms. | advanced Grade 5 volume reasoning | missing dimension from volume | g5ExtremeVolume | Internal metadata | Verified from provided source |
| Extreme | 5 | MA.5.M.1.1 | Practice multi-step real-world measurement conversion problems within a single system. | advanced measurement conversion | measurement conversion and addition | g5ExtremeMeasurementConversion | Internal metadata; developer validation | Verified from provided source |
| Extreme | 5 | MA.5.M.2.1 | Practice multi-step money problems using decimal notation within Grade 5 expectations. | advanced money problem solving | multi-step decimal money | g5ExtremeMoneyDecimal | Internal metadata; developer validation | Verified from provided source |
| Extreme | 5 | MA.5.GR.4.2 | Represent and interpret real-world problems using first-quadrant coordinate values. | coordinate plane interpretation | coordinate-value interpretation in context | g5ExtremeCoordinate | Internal metadata | Verified from provided source |
| Extreme | 5 | MA.5.AR.2.2 | Evaluate multi-step numerical expressions within Grade 5 limits. | advanced Grade 5 expression reasoning | expression evaluation with parentheses | g5ExtremeExpressions | Internal metadata | Verified from provided source |

## Easy / Grade 3 Current Usage

### MA.3.NSO.1.2

- Current app description: Practice identifying the value of a digit in a multi-digit whole number within Grade 3 expectations.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_place_value_digit`
- Skill label: place value
- Generator: `g3PlaceValueDigit`
- Problem type: digit value in a multi-digit number
- Example problem shape: Students identify the value of a named digit in a four-digit treasure-map number.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.3.NSO.2.1

- Current app description: Practice multi-digit whole-number addition and subtraction.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_add_sub_1000`
- Skill label: addition and subtraction within 1,000
- Generator: `g3AddSub1000`
- Problem type: addition/subtraction word problem
- Example problem shape: A map or treasure scenario combines or removes whole-number amounts, then asks how many steps/gems there are in all or left.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.3.AR.1.2

- Current app description: Solve one- and two-step whole-number word problems involving multiplication.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_multiplication_equal_groups`
- Skill label: multiplication within 100
- Generator: `g3MultiplicationFacts`
- Problem type: equal groups/array multiplication
- Example problem shape: A garden has a number of rows with a number of flowers in each row; students find the total.
- Current use: internal problem metadata, developer validation, and README sample metadata.
- Verification status: Verified from provided source.

### MA.3.AR.1.2

- Current app description: Solve one- and two-step whole-number word problems involving division.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_division_equal_groups`
- Skill label: division within 100
- Generator: `g3DivisionFacts`
- Problem type: equal sharing division
- Example problem shape: A total number of glowing stones is shared equally into bags; students find how many go in each bag.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.3.GR.2.3

- Current app description: Solve rectangle area and perimeter problems with whole-number side lengths.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_area_perimeter`
- Skill label: area and perimeter with whole numbers
- Generator: `g3AreaPerimeter`
- Problem type: rectangle area or perimeter
- Example problem shape: A rectangle has a length and width; students find either area or perimeter.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.3.FR.2.1

- Current app description: Compare fractional numbers with common numerators or denominators.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_simple_fractions`
- Skill label: simple fraction comparison
- Generator: `g3FractionCompare`
- Problem type: same-denominator fraction comparison
- Example problem shape: Students choose which of two fractions with the same denominator is greater.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.3.AR.3.3

- Current app description: Practice extending numerical patterns within Grade 3 expectations.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_number_patterns`
- Skill label: number patterns
- Generator: `g3NumberPatterns`
- Problem type: extend numerical pattern
- Example problem shape: Students identify the next number in a pattern that adds or subtracts a fixed amount.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.3.M.1.2

- Current app description: Practice solving real-world length measurement problems within Grade 3 expectations.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_measurement_length`
- Skill label: length measurement
- Generator: `g3MeasurementLength`
- Problem type: length total or comparison
- Example problem shape: Students add two path lengths or compare two measured lengths.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.3.M.2.2

- Current app description: Practice elapsed-time problem solving within Grade 3 expectations.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_time_elapsed`
- Skill label: elapsed time
- Generator: `g3ElapsedTime`
- Problem type: elapsed time in minutes
- Example problem shape: A puzzle starts at an hour and ends later in the same hour; students find elapsed minutes.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.3.DP.1.2

- Current app description: Practice reading and comparing values in a simple data table within Grade 3 expectations.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_data_interpretation`
- Skill label: simple data interpretation
- Generator: `g3DataInterpretation`
- Problem type: table total or comparison
- Example problem shape: Students read a simple quest table and either compare two categories or add two requested categories.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.3.M.2.2

- Current app description: Practice two-step elapsed-time problem solving within Grade 3 expectations.
- Difficulty band: Easy / Adventurer
- Grade band: 3
- Skill id: `g3_time_elapsed_two_step`
- Skill label: two-step elapsed time
- Generator: `g3ElapsedTimeTwoStep`
- Problem type: two-step elapsed time with a missing part
- Example problem shape: A hero starts at a clock time, completes one timed activity, and finishes the whole trip at a later clock time; students find the missing activity duration.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

## Easy Expansion Notes

Implemented in Easy expansion passes:

- `g3ElapsedTimeTwoStep` under verified benchmark `MA.3.M.2.2`.
- `g3PlaceValueDigit` under verified benchmark `MA.3.NSO.1.2`.
- `g3MeasurementLength` under verified benchmark `MA.3.M.1.2`.
- `g3DataInterpretation` under verified benchmark `MA.3.DP.1.2`.

The Grade 3 source reference now lives in `references/3RD_GRADE_BEST_STANDARDS_REFERENCE.md`.

## Medium / Grade 4 Current Usage

### MA.4.NSO.1.4

- Current app description: Round whole numbers from 0 to 10,000 to the nearest 10, 100, or 1,000.
- Difficulty band: Medium / Hero
- Grade band: 4
- Skill id: `g4_rounding`
- Skill label: rounding multi-digit numbers
- Generator: `g4Rounding`
- Problem type: whole-number rounding within verified Grade 4 range
- Example problem shape: Students round a whole number from 100 to 10,000 to the nearest 10, 100, or 1,000.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.4.NSO.2.2

- Current app description: Multiply multi-digit whole numbers within Grade 4 expectations.
- Difficulty band: Medium / Hero
- Grade band: 4
- Skill id: `g4_multiplication`
- Skill label: multi-digit multiplication
- Generator: `g4Multiplication`
- Problem type: two-digit by one-digit multiplication
- Example problem shape: A shelf has a two-digit number of books in each stack and a one-digit number of stacks; students find the total.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.4.NSO.2.4

- Current app description: Divide multi-digit whole numbers by one-digit divisors and express remainders as fractional parts of the divisor.
- Difficulty band: Medium / Hero
- Grade band: 4
- Skill id: `g4_division_remainders`
- Skill label: division with fractional remainders
- Generator: `g4DivisionRemainders`
- Problem type: division with fractional remainder notation
- Example problem shape: A number of lanterns is packed into boxes; students answer as a mixed number with the remainder over the divisor.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.4.FR.1.3

- Current app description: Identify and generate equivalent fractions.
- Difficulty band: Medium / Hero
- Grade band: 4
- Skill id: `g4_equivalent_fractions`
- Skill label: equivalent fractions
- Generator: `g4EquivalentFractions`
- Problem type: equivalent fractions
- Example problem shape: Students choose a fraction equivalent to a given fraction.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.4.FR.1.3

- Current app description: Practice equivalent fractions greater than one within Grade 4 expectations.
- Difficulty band: Medium / Hero
- Grade band: 4
- Skill id: `g4_equivalent_fractions_greater_than_one`
- Skill label: equivalent fractions greater than one
- Generator: `g4EquivalentFractionsGreaterThanOne`
- Problem type: equivalent fractions greater than one
- Example problem shape: Students choose an equivalent fraction for a fraction greater than one.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.4.FR.1.2

- Current app description: Relate fractions with denominators 10 or 100 to decimal notation.
- Difficulty band: Medium / Hero
- Grade band: 4
- Skill id: `g4_decimals_hundredths`
- Skill label: decimals to hundredths
- Generator: `g4DecimalsHundredths`
- Problem type: fraction-to-decimal conversion
- Example problem shape: Students choose the decimal equivalent of a fraction with denominator 100.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.4.FR.1.2

- Current app description: Practice decimal-fraction relationships with tenths within Grade 4 expectations.
- Difficulty band: Medium / Hero
- Grade band: 4
- Skill id: `g4_decimals_tenths_to_fraction`
- Skill label: tenths as decimals and fractions
- Generator: `g4DecimalsTenthsToFraction`
- Problem type: decimal-to-fraction tenths conversion
- Example problem shape: Students choose the fraction with denominator 10 that matches a one-decimal-place number.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.4.GR.1.3

- Current app description: Solve problems involving unknown whole-number angle measures.
- Difficulty band: Medium / Hero
- Grade band: 4
- Skill id: `g4_angles`
- Skill label: angle measurement
- Generator: `g4Angles`
- Problem type: missing angle measure
- Example problem shape: Two angles combine to make 90, 120, or 180 degrees; students find the missing angle.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.4.GR.1.3

- Current app description: Practice finding unknown whole-number angle measures in multi-part angles within Grade 4 expectations.
- Difficulty band: Medium / Hero
- Grade band: 4
- Skill id: `g4_angles_three_part`
- Skill label: multi-part angle measurement
- Generator: `g4AnglesThreePart`
- Problem type: missing angle in a three-part angle
- Example problem shape: Three angles make a whole angle; two are known and students find the missing angle.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

## Medium Expansion Notes

Implemented in the first Medium expansion pass:

- `g4EquivalentFractionsGreaterThanOne` under verified benchmark `MA.4.FR.1.3`.
- `g4DecimalsTenthsToFraction` under verified benchmark `MA.4.FR.1.2`.
- `g4AnglesThreePart` under verified benchmark `MA.4.GR.1.3`.

Now verified from the provided Grade 4 CPALMS export and ready for future implementation:

- Grade 4 factors, factor pairs, prime, and composite: `MA.4.AR.3.1`
- Grade 4 area/perimeter and missing rectangle side lengths: `MA.4.GR.2.1`
- Grade 4 like-denominator fraction operations: `MA.4.FR.2.2`
- Grade 4 fraction decomposition: `MA.4.FR.2.1`

## Hard / Grade 5 Current Usage

### MA.5.NSO.1.3

- Current app description: Compose and decompose multi-digit numbers with decimals to the thousandths.
- Difficulty band: Hard / Champion
- Grade band: 5
- Skill id: `g5_decimal_place_value`
- Skill label: decimal place-value decomposition
- Generator: `g5DecimalPlaceValue`
- Problem type: decimal decomposition by place value
- Example problem shape: Students choose the expression that decomposes a decimal into whole-number, tenths, hundredths, and thousandths parts.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.NSO.2.3

- Current app description: Add and subtract decimals to the thousandths.
- Difficulty band: Hard / Champion
- Grade band: 5
- Skill id: `g5_decimal_operations`
- Skill label: decimal operations
- Generator: `g5DecimalOperations`
- Problem type: decimal addition
- Example problem shape: A robot travels two decimal distances; students add the distances.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.NSO.2.3

- Current app description: Practice decimal subtraction to the thousandths within Grade 5 expectations.
- Difficulty band: Hard / Champion
- Grade band: 5
- Skill id: `g5_decimal_subtraction`
- Skill label: decimal subtraction
- Generator: `g5DecimalSubtraction`
- Problem type: decimal subtraction to thousandths
- Example problem shape: A skyship has a decimal amount of fuel and uses a decimal amount; students subtract to find what remains.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.FR.2.1

- Current app description: Add and subtract fractions with unlike denominators.
- Difficulty band: Hard / Champion
- Grade band: 5
- Skill id: `g5_fraction_unlike_denominators`
- Skill label: fractions with unlike denominators
- Generator: `g5FractionAddUnlike`
- Problem type: fraction addition
- Example problem shape: Students add two fractions with unlike denominators.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.FR.2.1

- Current app description: Practice subtracting fractions with unlike denominators within Grade 5 expectations.
- Difficulty band: Hard / Champion
- Grade band: 5
- Skill id: `g5_fraction_subtract_unlike_denominators`
- Skill label: subtracting fractions with unlike denominators
- Generator: `g5FractionSubtractUnlike`
- Problem type: fraction subtraction
- Example problem shape: A lantern starts with one fractional amount and students subtract another fraction with a different denominator.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.AR.1.2

- Current app description: Solve real-world problems involving multiplication of fractions.
- Difficulty band: Hard / Champion
- Grade band: 5
- Skill id: `g5_fraction_whole_number`
- Skill label: multiplying fractions by whole numbers
- Generator: `g5FractionTimesWhole`
- Problem type: fraction times whole number
- Example problem shape: A recipe uses a fraction of a cup per batch; students find the amount for multiple batches.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.GR.3.2

- Current app description: Find volume of right rectangular prisms with whole-number side lengths.
- Difficulty band: Hard / Champion
- Grade band: 5
- Skill id: `g5_volume`
- Skill label: volume of rectangular prisms
- Generator: `g5Volume`
- Problem type: rectangular prism volume
- Example problem shape: A rectangular prism has length, width, and height; students calculate volume.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.GR.4.2

- Current app description: Practice representing first-quadrant locations as ordered pairs in a real-world context.
- Difficulty band: Hard / Champion
- Grade band: 5
- Skill id: `g5_coordinate_point`
- Skill label: coordinate plane ordered pairs
- Generator: `g5CoordinatePoint`
- Problem type: first-quadrant ordered pair
- Example problem shape: A quest-map location is described as spaces east and spaces north; students choose the matching ordered pair.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.AR.2.2

- Current app description: Evaluate multi-step numerical expressions using order of operations.
- Difficulty band: Hard / Champion
- Grade band: 5
- Skill id: `g5_expressions`
- Skill label: numerical expressions
- Generator: `g5Expressions`
- Problem type: expression evaluation
- Example problem shape: Students evaluate a multiplication-plus-addition expression.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

## Hard Expansion Notes

Implemented in the first Hard expansion pass:

- `g5CoordinatePoint` under verified benchmark `MA.5.GR.4.2`.
- `g5DecimalSubtraction` under verified benchmark `MA.5.NSO.2.3`.
- `g5FractionSubtractUnlike` under verified benchmark `MA.5.FR.2.1`.

Skipped pending stronger verification before implementation:

- Broader Grade 5 multi-digit whole-number operations.
- Decimal/fraction mixed-representation problems without a clear verified benchmark fit.

## Extreme / Advanced Grade 5 Current Usage

### MA.5.AR.1.2

- Current app description: Solve multi-step real-world problems involving fraction operations.
- Difficulty band: Extreme / Legend
- Grade band: 5
- Skill id: `g5_extreme_fraction_combo`
- Skill label: advanced Grade 5 fraction reasoning
- Generator: `g5ExtremeFractionCombo`
- Problem type: fraction addition plus whole number
- Example problem shape: A hero collects two fractional crystal amounts and then whole crystals; students add the total amount.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.NSO.2.3

- Current app description: Solve multi-step decimal addition and subtraction problems to thousandths.
- Difficulty band: Extreme / Legend
- Grade band: 5
- Skill id: `g5_extreme_decimal_combo`
- Skill label: advanced Grade 5 decimal operations
- Generator: `g5ExtremeDecimalCombo`
- Problem type: decimal addition/subtraction to thousandths
- Example problem shape: Two decimal weights are added and a decimal amount chips away; students find the remaining weight.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.GR.3.3

- Current app description: Solve real-world volume problems involving right rectangular prisms.
- Difficulty band: Extreme / Legend
- Grade band: 5
- Skill id: `g5_extreme_volume_missing_dimension`
- Skill label: advanced Grade 5 volume reasoning
- Generator: `g5ExtremeVolume`
- Problem type: missing dimension from volume
- Example problem shape: A prism has volume, width, and height; students divide to find length.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.GR.4.2

- Current app description: Represent and interpret real-world problems using first-quadrant coordinate values.
- Difficulty band: Extreme / Legend
- Grade band: 5
- Skill id: `g5_extreme_coordinate_reasoning`
- Skill label: coordinate plane interpretation
- Generator: `g5ExtremeCoordinate`
- Problem type: coordinate-value interpretation in context
- Example problem shape: Students interpret what the y-value of a first-quadrant coordinate point represents in a real-world context.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

### MA.5.AR.2.2

- Current app description: Evaluate multi-step numerical expressions within Grade 5 limits.
- Difficulty band: Extreme / Legend
- Grade band: 5
- Skill id: `g5_extreme_expression_reasoning`
- Skill label: advanced Grade 5 expression reasoning
- Generator: `g5ExtremeExpressions`
- Problem type: expression evaluation with parentheses
- Example problem shape: Students evaluate an expression with parentheses, multiplication, and subtraction.
- Current use: internal problem metadata and developer validation.
- Verification status: Verified from provided source.

## Potential Concerns

- The app now has local Grade 3, Grade 4, and Grade 5 CPALMS-export reference files, but formal public reporting should still recheck benchmark wording against live CPALMS/FDOE pages.
- Explicit `domain`, `strand`, and `reportingCategory` metadata fields exist on generated problems, but their values are conservative placeholders until an official source for those labels is added.
- `MA.3.AR.1.2` is used for both multiplication and division word problems. This may be reasonable, but the exact benchmark scope should be checked.
- `MA.3.GR.2.3` is used for both rectangle area and perimeter and is verified from the provided Grade 3 source for that combined scope.
- `MA.5.AR.1.2` is used for both Hard fraction-times-whole-number problems and Extreme multi-step fraction reasoning. Both remain Grade 5, but the app should not claim exhaustive benchmark coverage.
- `MA.5.NSO.2.3` appears in both Hard and Extreme. Extreme uses the same Grade 5 code with higher complexity, which matches the app's design goal.
- `MA.5.AR.2.2` appears in both Hard and Extreme expression generators. Extreme stays within Grade 5-style numerical expressions.
- Extreme now uses first-quadrant coordinate-value interpretation under `MA.5.GR.4.2` after manual review.
- Recovery problems use easier difficulty bands through `generateUniqueRecoveryProblem`. This means a Hard recovery problem can use Medium metadata and an Extreme recovery problem can use Hard metadata. That is intentional for support, but teacher-facing reporting should explain recovery metadata if it is ever displayed.
- README currently includes one sample benchmark description for `MA.3.AR.1.2`; keep public wording conservative and avoid claiming exhaustive coverage.
- Student-facing UI currently shows challenge-level descriptions and summaries, not individual benchmark codes. This keeps the student experience clean.

## Next Verification Steps

1. Compare every benchmark code and app description in this file against official CPALMS/FDOE source material or a user-provided standards reference file.
2. Decide whether to keep, replace, or broaden any benchmark descriptions that are too specific.
3. Add explicit domain/strand metadata only after official wording is verified.
4. Review remaining potential mismatches first:
   - `MA.3.AR.1.2`
   - `MA.5.AR.1.2`
5. After verification, update `floridaBestMath.ts`, this reference file, README wording, and any teacher/debug display consistently.
6. Re-run `npm run validate:math` after any future benchmark mapping changes to confirm every generated problem still includes complete metadata.
