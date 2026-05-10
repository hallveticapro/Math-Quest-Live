# Current Florida B.E.S.T. Benchmark Usage

This inventory documents the benchmark metadata currently used by MathQuest Live. It is generated from the current code structure, especially `src/math/floridaBestMath.ts` and `src/mathEngine.ts`.

Important: benchmark descriptions in the app are conservative alignment labels, not formal CPALMS/FDOE wording. Official benchmark wording and exact reporting claims should be verified against CPALMS before public release, commercial release, or formal standards reporting.

## Usage Locations

- Standards map: `artifacts/mathquest-live/src/math/floridaBestMath.ts`
- Math generation: `artifacts/mathquest-live/src/mathEngine.ts`
- Math validation: `artifacts/mathquest-live/src/validateMath.ts`
- Student UI: benchmark codes are not shown by default.

## Current Benchmark Inventory

| Benchmark | App Description | Challenge Band | Grade Band | Skill Label | Skill ID | Problem Type / Generator | Example Problem Shape | Potential Concerns | Next Verification Step |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MA.3.NSO.2.1 | Practice multi-digit whole-number addition and subtraction. | Easy | 3 | addition and subtraction within 1,000 | g3_add_sub_1000 | g3AddSub1000 | Word problems combining or removing whole-number quantities within 1,000. | Confirm exact benchmark code/description match. | Verify wording and scope in CPALMS. |
| MA.3.AR.1.2 | Solve one- and two-step whole-number word problems involving multiplication. | Easy | 3 | multiplication within 100 | g3_multiplication_equal_groups | g3MultiplicationFacts | Equal rows/groups multiplication facts. | Same benchmark also supports division label in app; verify whether split labels are appropriate. | Verify multiplication/division wording in CPALMS. |
| MA.3.AR.1.2 | Solve one- and two-step whole-number word problems involving division. | Easy | 3 | division within 100 | g3_division_equal_groups | g3DivisionFacts | Equal sharing division facts. | Same benchmark also supports multiplication label in app; verify exact wording. | Verify multiplication/division wording in CPALMS. |
| MA.3.GR.2.3 | Solve rectangle area and perimeter problems with whole-number side lengths. | Easy | 3 | area and perimeter with whole numbers | g3_area_perimeter | g3AreaPerimeter | Rectangle area or perimeter from length and width. | Confirm Grade 3 code and perimeter/area pairing. | Verify geometry benchmark details in CPALMS. |
| MA.3.FR.2.1 | Compare fractional numbers with common numerators or denominators. | Easy | 3 | simple fraction comparison | g3_simple_fractions | g3FractionCompare | Compare same-denominator fractions. | App currently uses same-denominator comparisons only. | Verify benchmark wording and examples in CPALMS. |
| MA.3.M.2.2 | Solve one- and two-step elapsed time problems. | Easy | 3 | elapsed time | g3_time_elapsed | g3ElapsedTime | Start/end time elapsed-minute problems. | Confirm code and Grade 3 time scope. | Verify measurement benchmark in CPALMS. |
| MA.4.NSO.1.4 | Round whole numbers to nearby place values within Grade 4 limits. | Medium | 4 | rounding multi-digit numbers | g4_rounding | g4Rounding | Round whole numbers up to six digits. | Confirm place-value range. | Verify benchmark wording in CPALMS. |
| MA.4.NSO.2.2 | Multiply multi-digit whole numbers within Grade 4 expectations. | Medium | 4 | multi-digit multiplication | g4_multiplication | g4Multiplication | Two-digit by one-digit multiplication word problems. | App scope is narrower than full possible standard. | Verify Grade 4 multiplication scope in CPALMS. |
| MA.4.NSO.2.4 | Divide multi-digit whole numbers by one-digit divisors and represent remainders. | Medium | 4 | division with remainders | g4_division_remainders | g4DivisionRemainders | Division expressions with quotient and remainder. | Confirm benchmark code. | Verify division/remainder benchmark in CPALMS. |
| MA.4.FR.1.3 | Identify and generate equivalent fractions. | Medium | 4 | equivalent fractions | g4_equivalent_fractions | g4EquivalentFractions | Equivalent fraction selection. | Confirm code and terminology. | Verify fraction benchmark in CPALMS. |
| MA.4.FR.1.2 | Relate fractions with denominators 10 or 100 to decimal notation. | Medium | 4 | decimals to hundredths | g4_decimals_hundredths | g4DecimalsHundredths | Convert hundredths to decimal notation. | Confirm decimal/fraction code. | Verify fraction-decimal benchmark in CPALMS. |
| MA.4.GR.1.3 | Solve problems involving unknown whole-number angle measures. | Medium | 4 | angle measurement | g4_angles | g4Angles | Missing angle from a total angle measure. | Confirm angle benchmark code. | Verify geometry benchmark in CPALMS. |
| MA.5.NSO.1.3 | Use decimal place-value understanding to the thousandths. | Hard | 5 | decimal place value to thousandths | g5_decimal_place_value | g5DecimalPlaceValue | Identify a digit in a decimal place. | Confirm exact code and place-value description. | Verify number-sense benchmark in CPALMS. |
| MA.5.NSO.2.3 | Add and subtract decimals to the thousandths. | Hard | 5 | decimal operations | g5_decimal_operations | g5DecimalOperations | Decimal addition/subtraction to thousandths. | Confirm decimal operation scope. | Verify number operations benchmark in CPALMS. |
| MA.5.FR.2.1 | Add and subtract fractions with unlike denominators. | Hard | 5 | fractions with unlike denominators | g5_fraction_unlike_denominators | g5FractionAddUnlike | Add unlike-denominator fractions. | Confirm benchmark code and app simplification behavior. | Verify fraction benchmark in CPALMS. |
| MA.5.AR.1.2 | Solve real-world problems involving multiplication of fractions. | Hard | 5 | multiplying fractions by whole numbers | g5_fraction_whole_number | g5FractionTimesWhole | Multiply a fraction by a whole number. | Confirm whether this code is the best fit. | Verify algebraic reasoning/fraction context in CPALMS. |
| MA.5.GR.3.2 | Find volume of right rectangular prisms with whole-number side lengths. | Hard | 5 | volume of rectangular prisms | g5_volume | g5Volume | Length × width × height volume problems. | Confirm geometry benchmark code. | Verify volume benchmark in CPALMS. |
| MA.5.AR.2.2 | Evaluate multi-step numerical expressions using order of operations. | Hard | 5 | numerical expressions | g5_expressions | g5Expressions | Parentheses and multiplication/addition expressions. | Confirm expression benchmark code. | Verify algebraic reasoning benchmark in CPALMS. |
| MA.5.AR.1.2 | Solve multi-step real-world problems involving fraction operations. | Extreme | 5 | advanced Grade 5 fraction reasoning | g5_extreme_fraction_combo | g5ExtremeFractionCombo | Multi-step fraction addition/subtraction contexts. | Extreme remains Grade 5; verify benchmark fit. | Verify against CPALMS before formal claims. |
| MA.5.NSO.2.3 | Solve multi-step decimal addition and subtraction problems to thousandths. | Extreme | 5 | advanced Grade 5 decimal operations | g5_extreme_decimal_combo | g5ExtremeDecimalCombo | Multi-step decimal operations. | Scope should remain Grade 5 only. | Verify against CPALMS. |
| MA.5.GR.3.3 | Solve real-world volume problems involving right rectangular prisms. | Extreme | 5 | advanced Grade 5 volume reasoning | g5_extreme_volume_missing_dimension | g5ExtremeVolume | Missing dimension from volume and two dimensions. | Confirm missing-dimension volume benchmark code. | Verify geometry benchmark in CPALMS. |
| MA.5.GR.4.2 | Represent and interpret problems using first-quadrant coordinate values. | Extreme | 5 | coordinate plane reasoning | g5_extreme_coordinate_reasoning | g5ExtremeCoordinate | First-quadrant coordinate movement and distance. | Ensure no slope/negative coordinates. | Verify coordinate benchmark in CPALMS. |
| MA.5.AR.2.2 | Evaluate multi-step numerical expressions within Grade 5 limits. | Extreme | 5 | advanced Grade 5 expression reasoning | g5_extreme_expression_reasoning | g5ExtremeExpressions | Multi-step numerical expression evaluation. | Ensure no middle-school algebra. | Verify benchmark in CPALMS. |

## Current Domain / Strand Metadata

The app currently stores benchmark code, grade band, skill id, skill label, generator name, and conservative description. It does not currently store a separate official domain/strand field beyond the code prefix.

## General Concerns

- Some descriptions are intentionally simplified and should not be presented as official CPALMS wording.
- Some benchmarks are reused for multiple related problem types. That may be appropriate, but it needs official verification.
- The app currently covers a useful practice sample, not exhaustive benchmark coverage.
- Extreme mode must remain advanced Grade 5 and should continue to avoid Grade 6/middle-school content such as slope, negative numbers, ratios/proportions beyond elementary expectations, and linear equations.

## Verification Steps

1. Check every benchmark code against CPALMS/FDOE.
2. Replace app descriptions with verified wording or keep them clearly labeled as conservative internal labels.
3. Add a teacher/debug display only after benchmark wording is verified.
4. Keep student-facing UI free of benchmark codes by default.
