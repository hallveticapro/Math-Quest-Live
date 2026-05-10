# Florida B.E.S.T. Reference Used By MathQuest Live

## Purpose

This file maps the Florida B.E.S.T. Mathematics benchmarks currently used by MathQuest Live to the user-provided Grade 3, Grade 4, and Grade 5 standards PDFs.

This is a reference file only. It does not change app code, math generation, benchmark mappings, student-facing labels, or runtime behavior.

## Sources Used

The source material used for this pass was provided by the user:

- `/Users/andrew/Downloads/3rd BEST Standards.pdf`
  - CPALMS course export for Grade Three Mathematics, course `#5012050`
  - Exported/generated on 2026-05-10
  - Source URL printed in PDF: `https://www.cpalms.org//PreviewCourse/Preview/22943`
- `/Users/andrew/Downloads/4th BEST Standards.pdf`
  - CPALMS course export for Grade Four Mathematics, course `#5012060`
  - Exported/generated on 2026-05-10
  - Source URL printed in PDF: `https://www.cpalms.org//PreviewCourse/Preview/22945`
- `/Users/andrew/Downloads/5th BEST Standards.pdf`
  - CPALMS course export for Grade Five Mathematics, course `#5012070`
  - Exported/generated on 2026-05-10
  - Source URL printed in PDF: `https://www.cpalms.org//PreviewCourse/Preview/22947`

## Important Notes

- This file includes every benchmark code currently used by the app, based on `CURRENT_BEST_BENCHMARK_USAGE.md` and `artifacts/mathquest-live/src/math/floridaBestMath.ts`.
- Official wording below is taken from the provided PDFs only.
- Domain/strand/reporting category fields are included only when supported by the provided source. The provided PDF text did not expose a separate domain, strand, or reporting-category label beyond benchmark code prefixes and course organization.
- Conservative app-safe descriptions are intentionally shorter than official wording and are meant to describe the app's current generated problem types cautiously.
- This file should be rechecked against live CPALMS/FDOE pages before public release, commercial use, or formal standards reporting.

## Verification Status System

- Verified from provided official source
- Verified from provided reference, but wording paraphrased conservatively
- Not found in provided source
- Needs CPALMS/FDOE verification
- Possible mismatch with current app usage

## Summary

- Unique benchmark codes currently used by the app: 22
- Benchmarks found in provided PDFs: 19
- Benchmarks not yet verified from provided PDFs in this reference file: 3
- Benchmarks with possible current app usage mismatch: 4 priority items

## Reference Table

| Benchmark Code | Grade Level | Official Benchmark Wording From Provided Source | Conservative App-Safe Description | Domain / Strand | Reporting Category | Source Used | Verification Status | Notes |
|---|---:|---|---|---|---|---|---|---|
| MA.3.NSO.1.2 | 3 | Not verified from provided source. | Practice identifying the value of a digit in a multi-digit whole number within Grade 3 expectations. | Not verified from provided source. | Not verified from provided source. | Pending CPALMS/FDOE review | Needs CPALMS/FDOE verification | Added for Easy place-value variety after user approval; official wording should be verified before formal standards reporting. |
| MA.3.NSO.2.1 | 3 | Add and subtract multi-digit whole numbers including using a standard algorithm with procedural fluency. | Practice multi-digit whole-number addition and subtraction within Grade 3 expectations. | Not verified from provided source. | Not verified from provided source. | 3rd BEST Standards.pdf | Verified from provided official source | Current generator uses addition/subtraction word problems within 1,000. |
| MA.3.AR.1.2 | 3 | Solve one- and two-step real-world problems involving any of four operations with whole numbers. | Practice one- and two-step whole-number word problems, including multiplication and division within Grade 3 limits. | Not verified from provided source. | Not verified from provided source. | 3rd BEST Standards.pdf | Verified from provided official source | Current app maps both multiplication and division generators to this benchmark. This appears plausible because the benchmark covers any of four operations, but exact reporting use should be verified. |
| MA.3.GR.2.3 | 3 | Solve mathematical and real-world problems involving the perimeter and area of rectangles with whole-number side lengths using a visual model and a formula. | Practice rectangle area and perimeter with whole-number side lengths within Grade 3 expectations. | Not verified from provided source. | Not verified from provided source. | 3rd BEST Standards.pdf | Verified from provided official source | Current generator asks for area or perimeter from length and width. The provided source says not to find unknown side lengths; current generator does not ask for unknown side lengths. |
| MA.3.FR.2.1 | 3 | Plot, order and compare fractional numbers with the same numerator or the same denominator. | Practice comparing fractions with the same numerator or denominator within Grade 3 expectations. | Not verified from provided source. | Not verified from provided source. | 3rd BEST Standards.pdf | Verified from provided official source | Current generator only compares same-denominator fractions. This is narrower than the benchmark but appears aligned. |
| MA.3.M.1.1 | 3 | Not verified from provided source. | Practice solving simple length measurement problems within Grade 3 expectations. | Not verified from provided source. | Not verified from provided source. | Pending CPALMS/FDOE review | Needs CPALMS/FDOE verification | Added for Easy measurement variety after user approval; official wording should be verified before formal standards reporting. |
| MA.3.M.2.2 | 3 | Solve one- and two-step real-world problems involving elapsed time. | Practice elapsed-time problem solving within Grade 3 expectations. | Not verified from provided source. | Not verified from provided source. | 3rd BEST Standards.pdf | Verified from provided official source | Current generators include same-hour elapsed time and two-step elapsed-time problems with a missing activity duration. Provided source notes the expectation does not include crossing between a.m. and p.m. |
| MA.3.DP.1.1 | 3 | Not verified from provided source. | Practice reading and comparing values in a simple data table within Grade 3 expectations. | Not verified from provided source. | Not verified from provided source. | Pending CPALMS/FDOE review | Needs CPALMS/FDOE verification | Added for Easy data variety after user approval; official wording should be verified before formal standards reporting. |
| MA.4.NSO.1.4 | 4 | Round whole numbers from 0 to 10,000 to the nearest 10, 100 or 1,000. | Practice rounding whole numbers from 0 to 10,000 to the nearest 10, 100, or 1,000. | Not verified from provided source. | Not verified from provided source. | 4th BEST Standards.pdf | Verified from provided official source | Current generator is constrained to the provided benchmark range and place values. |
| MA.4.NSO.2.2 | 4 | Multiply two whole numbers, up to three digits by up to two digits, with procedural reliability. | Practice multi-digit whole-number multiplication within Grade 4 expectations. | Not verified from provided source. | Not verified from provided source. | 4th BEST Standards.pdf | Verified from provided official source | Current generator uses two-digit by one-digit multiplication, which is narrower than the benchmark. |
| MA.4.NSO.2.4 | 4 | Divide a whole number up to four digits by a one-digit whole number with procedural reliability. Represent remainders as fractional parts of the divisor. | Practice division of multi-digit whole numbers by one-digit divisors with fractional remainders. | Not verified from provided source. | Not verified from provided source. | 4th BEST Standards.pdf | Verified from provided official source | Current generator represents remainders as fractional parts of the divisor. |
| MA.4.FR.1.3 | 4 | Identify and generate equivalent fractions, including fractions greater than one. Describe how the numerator and denominator are affected when the equivalent fraction is created. | Practice identifying and generating equivalent fractions within Grade 4 expectations. | Not verified from provided source. | Not verified from provided source. | 4th BEST Standards.pdf | Verified from provided official source | Current generators ask students to identify equivalent fractions, including fractions greater than one. |
| MA.4.FR.1.2 | 4 | Use decimal notation to represent fractions with denominators of 10 or 100, including mixed numbers and fractions greater than 1, and use fractional notation with denominators of 10 or 100 to represent decimals. | Practice fraction-decimal relationships with tenths and hundredths within Grade 4 expectations. | Not verified from provided source. | Not verified from provided source. | 4th BEST Standards.pdf | Verified from provided official source | Current generators convert denominator-100 fractions to decimals and one-decimal-place tenths to fractions. This remains narrower than the full benchmark. |
| MA.4.GR.1.3 | 4 | Solve real-world and mathematical problems involving unknown whole-number angle measures. Write an equation to represent the unknown. | Practice finding unknown whole-number angle measures within Grade 4 expectations. | Not verified from provided source. | Not verified from provided source. | 4th BEST Standards.pdf | Verified from provided official source | Current generators find missing angles in two-part and three-part angle situations. They do not require students to write an equation. |
| MA.5.NSO.1.3 | 5 | Compose and decompose multi-digit numbers with decimals to the thousandths in multiple ways using the values of the digits in each place. | Practice composing and decomposing decimals to the thousandths by place value. | Not verified from provided source. | Not verified from provided source. | 5th BEST Standards.pdf | Verified from provided official source | Current generator asks students to decompose decimals into whole-number, tenths, hundredths, and thousandths parts. |
| MA.5.NSO.2.3 | 5 | Add and subtract multi-digit numbers with decimals to the thousandths, including using a standard algorithm with procedural fluency. | Practice decimal addition and subtraction to the thousandths within Grade 5 expectations. | Not verified from provided source. | Not verified from provided source. | 5th BEST Standards.pdf | Verified from provided official source | Current Hard generators use one-step decimal addition and subtraction. Extreme generator uses multi-step decimal addition/subtraction to thousandths. Both are within the benchmark direction, but Hard stays lighter. |
| MA.5.FR.2.1 | 5 | Add and subtract fractions with unlike denominators, including mixed numbers and fractions greater than 1, with procedural reliability. | Practice adding and subtracting fractions with unlike denominators within Grade 5 expectations. | Not verified from provided source. | Not verified from provided source. | 5th BEST Standards.pdf | Verified from provided official source | Current Hard generators add and subtract proper fractions with unlike denominators. This is narrower than the full benchmark. |
| MA.5.AR.1.2 | 5 | Solve real-world problems involving the addition, subtraction or multiplication of fractions, including mixed numbers and fractions greater than 1. | Practice real-world fraction addition, subtraction, or multiplication within Grade 5 expectations. | Not verified from provided source. | Not verified from provided source. | 5th BEST Standards.pdf | Verified from provided official source | Current Hard generator multiplies a fraction by a whole number in a context. Extreme generator combines fractional amounts and whole numbers. Both appear directionally aligned, but exact reporting fit should be checked. |
| MA.5.GR.3.2 | 5 | Find the volume of a right rectangular prism with whole-number side lengths using a visual model and a formula. | Practice finding volume of right rectangular prisms with whole-number side lengths. | Not verified from provided source. | Not verified from provided source. | 5th BEST Standards.pdf | Verified from provided official source | Current generator uses length, width, and height to find volume. |
| MA.5.AR.2.2 | 5 | Evaluate multi-step numerical expressions using order of operations. | Practice evaluating multi-step numerical expressions within Grade 5 expectations. | Not verified from provided source. | Not verified from provided source. | 5th BEST Standards.pdf | Verified from provided official source | Current generators use expressions with whole numbers and parentheses. Provided source excludes exponents and nested grouping symbols; current generators do not use those. |
| MA.5.GR.3.3 | 5 | Solve real-world problems involving the volume of right rectangular prisms, including problems with an unknown edge length, with whole-number edge lengths using a visual model or a formula. Write an equation with a variable for the unknown to represent the problem. | Practice multi-step volume reasoning with right rectangular prisms and whole-number edge lengths. | Not verified from provided source. | Not verified from provided source. | 5th BEST Standards.pdf | Verified from provided official source | Current Extreme generator asks students to find a missing length from volume, width, and height. It does not require students to write an equation with a variable. |
| MA.5.GR.4.2 | 5 | Represent mathematical and real-world problems by plotting points in the first quadrant of the coordinate plane and interpret coordinate values of points in the context of the situation. | Practice first-quadrant coordinate values and ordered pairs in real-world contexts. | Not verified from provided source. | Not verified from provided source. | 5th BEST Standards.pdf | Verified from provided official source | Current Hard generator asks students to represent a contextual location as an ordered pair. Current Extreme generator asks students to interpret the meaning of a coordinate value in context. |

## App Usage Crosswalk

| Difficulty | Grade Band | Benchmark Code | Current Skill ID(s) | Current Generator(s) | Reference Status |
|---|---:|---|---|---|---|
| Easy | 3 | MA.3.NSO.1.2 | `g3_place_value_digit` | `g3PlaceValueDigit` | Needs CPALMS/FDOE verification |
| Easy | 3 | MA.3.NSO.2.1 | `g3_add_sub_1000` | `g3AddSub1000` | Verified from provided official source |
| Easy | 3 | MA.3.AR.1.2 | `g3_multiplication_equal_groups`, `g3_division_equal_groups` | `g3MultiplicationFacts`, `g3DivisionFacts` | Verified from provided official source |
| Easy | 3 | MA.3.GR.2.3 | `g3_area_perimeter` | `g3AreaPerimeter` | Verified from provided official source |
| Easy | 3 | MA.3.FR.2.1 | `g3_simple_fractions` | `g3FractionCompare` | Verified from provided official source |
| Easy | 3 | MA.3.M.1.1 | `g3_measurement_length` | `g3MeasurementLength` | Needs CPALMS/FDOE verification |
| Easy | 3 | MA.3.M.2.2 | `g3_time_elapsed`, `g3_time_elapsed_two_step` | `g3ElapsedTime`, `g3ElapsedTimeTwoStep` | Verified from provided official source |
| Easy | 3 | MA.3.DP.1.1 | `g3_data_interpretation` | `g3DataInterpretation` | Needs CPALMS/FDOE verification |
| Medium | 4 | MA.4.NSO.1.4 | `g4_rounding` | `g4Rounding` | Verified from provided official source |
| Medium | 4 | MA.4.NSO.2.2 | `g4_multiplication` | `g4Multiplication` | Verified from provided official source |
| Medium | 4 | MA.4.NSO.2.4 | `g4_division_remainders` | `g4DivisionRemainders` | Verified from provided official source |
| Medium | 4 | MA.4.FR.1.3 | `g4_equivalent_fractions`, `g4_equivalent_fractions_greater_than_one` | `g4EquivalentFractions`, `g4EquivalentFractionsGreaterThanOne` | Verified from provided official source |
| Medium | 4 | MA.4.FR.1.2 | `g4_decimals_hundredths`, `g4_decimals_tenths_to_fraction` | `g4DecimalsHundredths`, `g4DecimalsTenthsToFraction` | Verified from provided official source |
| Medium | 4 | MA.4.GR.1.3 | `g4_angles`, `g4_angles_three_part` | `g4Angles`, `g4AnglesThreePart` | Verified from provided official source |
| Hard | 5 | MA.5.NSO.1.3 | `g5_decimal_place_value` | `g5DecimalPlaceValue` | Verified from provided official source |
| Hard / Extreme | 5 | MA.5.NSO.2.3 | `g5_decimal_operations`, `g5_decimal_subtraction`, `g5_extreme_decimal_combo` | `g5DecimalOperations`, `g5DecimalSubtraction`, `g5ExtremeDecimalCombo` | Verified from provided official source |
| Hard | 5 | MA.5.FR.2.1 | `g5_fraction_unlike_denominators`, `g5_fraction_subtract_unlike_denominators` | `g5FractionAddUnlike`, `g5FractionSubtractUnlike` | Verified from provided official source |
| Hard / Extreme | 5 | MA.5.AR.1.2 | `g5_fraction_whole_number`, `g5_extreme_fraction_combo` | `g5FractionTimesWhole`, `g5ExtremeFractionCombo` | Verified from provided official source |
| Hard | 5 | MA.5.GR.3.2 | `g5_volume` | `g5Volume` | Verified from provided official source |
| Hard / Extreme | 5 | MA.5.AR.2.2 | `g5_expressions`, `g5_extreme_expression_reasoning` | `g5Expressions`, `g5ExtremeExpressions` | Verified from provided official source |
| Extreme | 5 | MA.5.GR.3.3 | `g5_extreme_volume_missing_dimension` | `g5ExtremeVolume` | Verified from provided official source |
| Hard / Extreme | 5 | MA.5.GR.4.2 | `g5_coordinate_point`, `g5_extreme_coordinate_reasoning` | `g5CoordinatePoint`, `g5ExtremeCoordinate` | Verified from provided official source |

## Possible Mismatches or Concerns

The previously flagged Grade 4 and Grade 5 generator mismatches have been manually reviewed and corrected in the app:

- `g4Rounding` now uses whole numbers from 0 to 10,000 and rounds to the nearest 10, 100, or 1,000.
- `g4DivisionRemainders` now represents remainders as fractional parts of the divisor.
- `g5DecimalPlaceValue` now asks students to decompose decimals to the thousandths by place value.
- `g5ExtremeCoordinate` now asks students to interpret first-quadrant coordinate values in a real-world context.

No previously used benchmark appears to be in the wrong grade band based on the provided PDFs. The newly added Easy place-value, measurement, and data benchmarks are provisional and still need CPALMS/FDOE verification.

### Newly Added Provisional Easy Mappings

- `MA.3.NSO.1.2` / `g3PlaceValueDigit`: verify official wording and exact fit for digit-value place-value questions.
- `MA.3.M.1.1` / `g3MeasurementLength`: verify official wording and exact fit for simple length total/comparison questions.
- `MA.3.DP.1.1` / `g3DataInterpretation`: verify official wording and exact fit for simple table total/comparison questions.

### Narrow Coverage Notes

These app generators appear aligned with a verified benchmark but currently cover only a narrow part of the benchmark:

- `g4Multiplication` under `MA.4.NSO.2.2`: two-digit by one-digit only, while benchmark allows up to three digits by up to two digits.
- `g4DecimalsHundredths` under `MA.4.FR.1.2`: denominator 100 to decimal only, while benchmark includes denominators 10 or 100 and both decimal/fraction notation directions.
- `g4Angles` under `MA.4.GR.1.3`: finds missing angle but does not ask students to write an equation.
- `g5FractionAddUnlike` and `g5FractionSubtractUnlike` under `MA.5.FR.2.1`: add/subtract proper fractions only, while benchmark includes mixed numbers and fractions greater than 1.
- `g5Volume` under `MA.5.GR.3.2`: formula-based calculation only; benchmark includes visual model language.
- `g5ExtremeVolume` under `MA.5.GR.3.3`: missing edge-length calculation only; benchmark includes writing an equation with a variable.

Narrow coverage is not automatically a problem for classroom practice, but the app should not claim exhaustive coverage of these benchmarks.

## Not Found In Provided Source

The following newly added provisional benchmark codes have not yet been verified from the provided Grade 3, Grade 4, and Grade 5 PDFs in this reference file:

- `MA.3.NSO.1.2`
- `MA.3.M.1.1`
- `MA.3.DP.1.1`

## Domain / Strand Metadata

The provided PDF text did not expose separate official domain, strand, or reporting-category labels in a way that can be safely copied into app metadata.

For this pass:

- Domain / Strand: `Not verified from provided source.`
- Reporting Category: `Not verified from provided source.`

A future pass may add official domain/strand metadata if the user provides a standards table that includes those fields or if CPALMS/FDOE pages are reviewed directly for that metadata.

## Recommended Next Pass

1. Continue reviewing narrow-coverage generators before making formal standards-reporting claims.
2. Add official domain, strand, or reporting-category metadata only after that wording is verified from CPALMS/FDOE or a source that exposes those fields.
3. Run `npm run validate:math` after any future mapping or generator changes.
