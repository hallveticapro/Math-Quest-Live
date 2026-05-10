# Florida B.E.S.T. Alignment Change Plan

## Summary

MathQuest Live already uses a clear challenge-band model:

- Easy / Adventurer = Grade 3 Florida B.E.S.T. practice
- Medium / Hero = Grade 4 Florida B.E.S.T. practice
- Hard / Champion = Grade 5 Florida B.E.S.T. practice
- Extreme / Legend = advanced Grade 5 practice that should remain within Grade 5 limits

The current benchmark codes were compared against:

- `CURRENT_BEST_BENCHMARK_USAGE.md`
- `FL_BEST_REFERENCE_USED_BY_APP.md`
- `artifacts/mathquest-live/src/math/floridaBestMath.ts`

The reference pass found all 19 unique benchmark codes in the provided Grade 3, Grade 4, and Grade 5 CPALMS-export PDFs. Most mappings are directionally reasonable. Several descriptions were made more conservative, and the originally flagged Grade 4 and Grade 5 generator/benchmark pairings were manually reviewed and corrected in a follow-up implementation pass.

Resolved alignment risks:

- `MA.4.NSO.1.4` / `g4Rounding`: constrained to whole numbers from 0 to 10,000 and nearest 10, 100, or 1,000.
- `MA.4.NSO.2.4` / `g4DivisionRemainders`: updated to represent remainders as fractional parts of the divisor.
- `MA.5.GR.4.2` / `g5ExtremeCoordinate`: updated to interpret first-quadrant coordinate values in context.
- `MA.5.NSO.1.3` / `g5DecimalPlaceValue`: updated to compose/decompose decimals to the thousandths.

This plan now records both the safe metadata pass and the approved manual generator fixes.

## Safe Updates

These updates are straightforward metadata/documentation changes and can be implemented without changing math behavior.

### Conservative Description Updates

Replace current app descriptions with conservative app-safe descriptions from `FL_BEST_REFERENCE_USED_BY_APP.md` where the benchmark/generator match is not in dispute.

Safe description replacements:

| Skill ID | Benchmark | Current Description | Proposed Conservative Description |
|---|---|---|---|
| `g3_add_sub_1000` | `MA.3.NSO.2.1` | Practice multi-digit whole-number addition and subtraction. | Practice multi-digit whole-number addition and subtraction within Grade 3 expectations. |
| `g3_multiplication_equal_groups` | `MA.3.AR.1.2` | Solve one- and two-step whole-number word problems involving multiplication. | Practice one- and two-step whole-number word problems involving multiplication within Grade 3 limits. |
| `g3_division_equal_groups` | `MA.3.AR.1.2` | Solve one- and two-step whole-number word problems involving division. | Practice one- and two-step whole-number word problems involving division within Grade 3 limits. |
| `g3_area_perimeter` | `MA.3.GR.2.3` | Solve rectangle area and perimeter problems with whole-number side lengths. | Practice rectangle area and perimeter with whole-number side lengths within Grade 3 expectations. |
| `g3_simple_fractions` | `MA.3.FR.2.1` | Compare fractional numbers with common numerators or denominators. | Practice comparing fractions with the same numerator or denominator within Grade 3 expectations. |
| `g3_time_elapsed` | `MA.3.M.2.2` | Solve one- and two-step elapsed time problems. | Practice elapsed-time problem solving within Grade 3 expectations. |
| `g4_multiplication` | `MA.4.NSO.2.2` | Multiply multi-digit whole numbers within Grade 4 expectations. | Practice multi-digit whole-number multiplication within Grade 4 expectations. |
| `g4_equivalent_fractions` | `MA.4.FR.1.3` | Identify and generate equivalent fractions. | Practice identifying and generating equivalent fractions within Grade 4 expectations. |
| `g4_decimals_hundredths` | `MA.4.FR.1.2` | Relate fractions with denominators 10 or 100 to decimal notation. | Practice fraction-decimal relationships with tenths and hundredths within Grade 4 expectations. |
| `g4_angles` | `MA.4.GR.1.3` | Solve problems involving unknown whole-number angle measures. | Practice finding unknown whole-number angle measures within Grade 4 expectations. |
| `g5_decimal_operations` | `MA.5.NSO.2.3` | Add and subtract decimals to the thousandths. | Practice decimal addition and subtraction to the thousandths within Grade 5 expectations. |
| `g5_fraction_unlike_denominators` | `MA.5.FR.2.1` | Add and subtract fractions with unlike denominators. | Practice adding and subtracting fractions with unlike denominators within Grade 5 expectations. |
| `g5_fraction_whole_number` | `MA.5.AR.1.2` | Solve real-world problems involving multiplication of fractions. | Practice real-world fraction multiplication within Grade 5 expectations. |
| `g5_volume` | `MA.5.GR.3.2` | Find volume of right rectangular prisms with whole-number side lengths. | Practice finding volume of right rectangular prisms with whole-number side lengths. |
| `g5_expressions` | `MA.5.AR.2.2` | Evaluate multi-step numerical expressions using order of operations. | Practice evaluating multi-step numerical expressions within Grade 5 expectations. |
| `g5_extreme_decimal_combo` | `MA.5.NSO.2.3` | Solve multi-step decimal addition and subtraction problems to thousandths. | Practice multi-step decimal addition and subtraction to the thousandths within Grade 5 expectations. |
| `g5_extreme_volume_missing_dimension` | `MA.5.GR.3.3` | Solve real-world volume problems involving right rectangular prisms. | Practice multi-step volume reasoning with right rectangular prisms and whole-number edge lengths. |
| `g5_extreme_expression_reasoning` | `MA.5.AR.2.2` | Evaluate multi-step numerical expressions within Grade 5 limits. | Practice evaluating multi-step numerical expressions within Grade 5 limits. |

### Add Verification Metadata

Add conservative verification metadata to skill objects in `floridaBestMath.ts`.

Suggested fields:

```ts
type BenchmarkVerificationStatus =
  | "verified_from_provided_source"
  | "possible_mismatch_with_current_app_usage"
  | "needs_cpalms_fdoe_verification";

type MathSkill = {
  id: string;
  benchmark: string;
  description: string;
  skill: string;
  generator: string;
  officialBenchmark?: string;
  domain?: string;
  reportingCategory?: string;
  verificationStatus?: BenchmarkVerificationStatus;
  sourceNote?: string;
};
```

Safe default values:

- `domain: "Not verified from provided source"`
- `reportingCategory: "Not verified from provided source"`
- `sourceNote: "Verified against user-provided CPALMS course export PDF; recheck CPALMS/FDOE before formal standards reporting."`

### Add Metadata Propagation

After adding fields to `MathSkill`, propagate them through `MathProblem` in `mathEngine.ts`.

Suggested `MathProblem` fields:

```ts
officialBenchmark?: string;
domain?: string;
reportingCategory?: string;
verificationStatus?: BenchmarkVerificationStatus;
sourceNote?: string;
```

These should remain internal/teacher-debug metadata. Do not display them to students.

### Validate Metadata Presence

Update `validateMath.ts` to check new metadata fields without making claims about public accuracy.

Safe validation additions:

- `problem.verificationStatus` exists.
- `problem.sourceNote` exists.
- `problem.domain` exists, even if set to `Not verified from provided source`.
- `problem.reportingCategory` exists, even if set to `Not verified from provided source`.

## Manual Review Items Approved And Implemented

These items were originally held for manual review because generator behavior needed to change, not just wording. They have since been approved and implemented.

### `MA.4.NSO.1.4` / `g4Rounding`

Current app description after fix:

- Round whole numbers from 0 to 10,000 to the nearest 10, 100, or 1,000.

Verified wording:

- Round whole numbers from 0 to 10,000 to the nearest 10, 100 or 1,000.

Current generator after fix:

- `g4Rounding`
- Uses values from 100 to 10,000.
- Rounds to nearest 10, 100, or 1,000.
- Metadata status: `verified_from_provided_source`.

### `MA.4.NSO.2.4` / `g4DivisionRemainders`

Current app description after fix:

- Divide multi-digit whole numbers by one-digit divisors and express remainders as fractional parts of the divisor.

Verified wording:

- Divide a whole number up to four digits by a one-digit whole number with procedural reliability. Represent remainders as fractional parts of the divisor.

Current generator after fix:

- `g4DivisionRemainders`
- Answers use mixed-number notation with the remainder over the divisor, such as `17 7/8`.
- Metadata status: `verified_from_provided_source`.

### `MA.5.GR.4.2` / `g5ExtremeCoordinate`

Current app description after fix:

- Represent and interpret real-world problems using first-quadrant coordinate values.

Verified wording:

- Represent mathematical and real-world problems by plotting points in the first quadrant of the coordinate plane and interpret coordinate values of points in the context of the situation.

Current generator after fix:

- `g5ExtremeCoordinate`
- Gives a contextual coordinate point and asks students to interpret the y-value in context.
- Metadata status: `verified_from_provided_source`.

### `MA.5.NSO.1.3` / `g5DecimalPlaceValue`

Current app description after fix:

- Compose and decompose multi-digit numbers with decimals to the thousandths.

Verified wording:

- Compose and decompose multi-digit numbers with decimals to the thousandths in multiple ways using the values of the digits in each place.

Current generator after fix:

- `g5DecimalPlaceValue`
- Asks students to choose the expression that decomposes a decimal into whole-number, tenths, hundredths, and thousandths parts.
- Metadata status: `verified_from_provided_source`.

### `MA.5.AR.1.2` / `g5ExtremeFractionCombo`

Current generator:

- Adds two fractional amounts and a whole-number amount.

Verified wording:

- Real-world problems involving addition, subtraction, or multiplication of fractions, including mixed numbers and fractions greater than 1.

Concern:

- This appears directionally aligned, but the generated output may produce improper fractions rather than mixed numbers. That is not necessarily wrong, but formal reporting should verify representation expectations.

Recommended later implementation:

- Keep as Grade 5 only.
- Consider returning mixed-number representations if teacher-facing expectations require them.

## Proposed Code Changes

### `artifacts/mathquest-live/src/math/floridaBestMath.ts`

Proposed changes:

- Add metadata fields to `MathSkill`:
  - `officialBenchmark`
  - `domain`
  - `reportingCategory`
  - `verificationStatus`
  - `sourceNote`
- Replace safe descriptions with conservative app-safe descriptions from the reference file.
- Add official wording from `FL_BEST_REFERENCE_USED_BY_APP.md` only for verified codes.
- Previously possible mismatch items were corrected after manual review and now use `verificationStatus: "verified_from_provided_source"`.
- Do not add separate student grade labels.
- Do not add benchmark codes to student-facing setup cards.

Recommended status assignments:

| Skill ID | Verification Status |
|---|---|
| `g3_add_sub_1000` | `verified_from_provided_source` |
| `g3_multiplication_equal_groups` | `verified_from_provided_source` |
| `g3_division_equal_groups` | `verified_from_provided_source` |
| `g3_area_perimeter` | `verified_from_provided_source` |
| `g3_simple_fractions` | `verified_from_provided_source` |
| `g3_time_elapsed` | `verified_from_provided_source` |
| `g4_rounding` | `verified_from_provided_source` |
| `g4_multiplication` | `verified_from_provided_source` |
| `g4_division_remainders` | `verified_from_provided_source` |
| `g4_equivalent_fractions` | `verified_from_provided_source` |
| `g4_decimals_hundredths` | `verified_from_provided_source` |
| `g4_angles` | `verified_from_provided_source` |
| `g5_decimal_place_value` | `verified_from_provided_source` |
| `g5_decimal_operations` | `verified_from_provided_source` |
| `g5_fraction_unlike_denominators` | `verified_from_provided_source` |
| `g5_fraction_whole_number` | `verified_from_provided_source` |
| `g5_volume` | `verified_from_provided_source` |
| `g5_expressions` | `verified_from_provided_source` |
| `g5_extreme_fraction_combo` | `verified_from_provided_source` |
| `g5_extreme_decimal_combo` | `verified_from_provided_source` |
| `g5_extreme_volume_missing_dimension` | `verified_from_provided_source` |
| `g5_extreme_coordinate_reasoning` | `verified_from_provided_source` |
| `g5_extreme_expression_reasoning` | `verified_from_provided_source` |

### `artifacts/mathquest-live/src/mathEngine.ts`

Proposed changes:

- Extend `MathProblem` type with the new metadata fields.
- In `buildProblem`, copy metadata from `MathSkill` into each generated problem.
- Do not change generator logic in the metadata-only implementation pass.
- Do not show the new metadata to students.

Approved generator changes completed after manual review:

- Constrain `g4Rounding`.
- Rework `g4DivisionRemainders`.
- Rework `g5ExtremeCoordinate`.
- Improve `g5DecimalPlaceValue`.

### `artifacts/mathquest-live/src/validateMath.ts`

Proposed changes:

- Assert that every generated problem includes:
  - `verificationStatus`
  - `sourceNote`
  - `domain`
  - `reportingCategory`
- Optionally log possible mismatch items during validation without failing the script.
- Keep existing validation for benchmark, grade band, difficulty, choices, signatures, and hints.

### `README.md`

Proposed changes:

- Clarify that benchmark metadata is based on user-provided CPALMS course exports.
- State that app practice is aligned to standards bands but does not claim exhaustive benchmark coverage.
- State that some generators cover only a focused part of a benchmark.
- Mention that formal reporting should be verified against CPALMS/FDOE before public or commercial claims.
- Keep student-facing explanation simple: challenge level maps to standards band.

### Documentation Files

Proposed changes:

- Update `CURRENT_BEST_BENCHMARK_USAGE.md` after code metadata changes.
- Keep `FL_BEST_REFERENCE_USED_BY_APP.md` as the source reference snapshot.
- Add a note to any future teacher/debug docs that benchmark metadata is for transparency, not grading or formal reporting.

## Proposed README Changes

Replace broad wording like:

> It defines each difficulty band, grade band, benchmark codes, conservative teacher-readable benchmark descriptions, skill labels, and allowed generators.

With more cautious wording:

> It defines each difficulty band, grade band, benchmark codes, conservative teacher-readable benchmark descriptions, skill labels, and allowed generators. These labels are intended to support classroom practice and teacher transparency. They do not claim exhaustive coverage of each benchmark.

Add:

> Current benchmark metadata has been cross-checked against user-provided CPALMS course-export PDFs for Grades 3-5. Some app generators intentionally cover a focused subset of a benchmark, and a few generator/benchmark pairings are marked for review before formal standards reporting.

Keep:

> The AI does not generate, solve, or validate math problems.

## Do Not Change

- Do not change the difficulty band model.
- Do not add a separate student-facing grade selector.
- Do not clutter student UI with benchmark codes.
- Do not make math depend on AI.
- Do not move Extreme beyond Grade 5.
- Do not add accounts, rosters, analytics, saved progress, or a database.
- Do not change the core game loop.
- Do not change the current Chronicler setup flow as part of standards metadata work.
- Do not treat focused practice as exhaustive benchmark coverage.

## Suggested Implementation Order

1. Metadata-only pass:
   - Add metadata fields to `MathSkill`.
   - Add conservative descriptions and verification statuses.
   - Propagate fields through `MathProblem`.
   - Update validator.
   - Update README wording.
   - Do not change generator behavior.

2. Generator alignment pass:
   - Fix `g4Rounding`.
   - Fix `g4DivisionRemainders`.
   - Rewrite `g5ExtremeCoordinate`.
   - Rewrite `g5DecimalPlaceValue`.
   - Status: completed after manual review.

3. Documentation sync pass:
   - Update `CURRENT_BEST_BENCHMARK_USAGE.md`.
   - Update any teacher/debug docs.
   - Run `npm run validate:math`.
   - Run `npm run build`.

## Open Questions Before Implementation

- Should `domain` and `reportingCategory` be added now as explicit fields with `Not verified from provided source`, or should they wait until official domain/reporting metadata is available?
- Should possible mismatch items be allowed in generated problem metadata with a warning status, or should they be fixed before public use?
- Continue checking whether narrow-coverage generators need broader variety before formal standards reporting.
