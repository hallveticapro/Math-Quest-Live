# Florida B.E.S.T. Domain Expansion Plan

This document records future expansion ideas for MathQuest Live's Florida B.E.S.T.-aligned math content. It does not change current app behavior.

Official benchmark wording and exact standard-fit claims must be verified against CPALMS/FDOE before formal standards reporting or public/commercial standards claims.

## Current Coverage

- Easy / Grade 3: addition/subtraction within 1,000, multiplication/division facts, area/perimeter, simple fraction comparison, elapsed time.
- Medium / Grade 4: rounding, multiplication, division with remainders, equivalent fractions, decimals to hundredths, angles.
- Hard / Grade 5: decimal place value, decimal operations, unlike-denominator fraction addition, multiplying fractions by whole numbers, volume, expressions.
- Extreme / Advanced Grade 5: multi-step Grade 5 fraction, decimal, volume, coordinate, and expression reasoning.

## Underrepresented Areas

- Grade 3 place value and rounding.
- Grade 3 data interpretation and measurement beyond elapsed time.
- Grade 4 factors/multiples and area/perimeter problem solving.
- Grade 4 fraction decomposition and fraction operations.
- Grade 5 coordinate-plane basics in non-Extreme mode.
- Grade 5 multi-digit whole-number division and decimal comparison/rounding.

## Suggested Future Expansion Order

1. Add more Grade 3 place-value, rounding, measurement, money, and data problems.
2. Add Grade 4 factors/multiples, fraction decomposition, and area/perimeter multi-step problems.
3. Add Grade 5 coordinate-plane basics and decimal comparison/rounding to Hard mode.
4. Add more Grade 5 whole-number and decimal operation variety.
5. Add optional teacher-selectable skill-focus quest packs after the generator pool is broader.

## Guardrails

- Math remains generated and checked by app code, never AI.
- Every problem must include difficulty, gradeBand, benchmark, skill label, skill id, problem type, and signature metadata.
- Every new generator needs duplicate-signature support.
- Every new generator needs skill-specific hints.
- Extreme stays advanced Grade 5 only.
- Do not introduce negative numbers, slope, linear equations, middle-school ratios/proportions, probability beyond elementary expectations, or Grade 6 content.

## Implementation Prompt Groups

- Prompt group 1: Add Grade 3 place-value and data generators with validation samples.
- Prompt group 2: Add Grade 4 factors/multiples and fraction decomposition generators.
- Prompt group 3: Add Grade 5 coordinate basics and decimal comparison/rounding generators.
- Prompt group 4: Add teacher/debug benchmark display after CPALMS wording verification.
- Prompt group 5: Add skill-focus quest packs after the generator set is broad enough.

## Verification Reminder

Before presenting benchmark wording as official, verify each code and description against CPALMS/FDOE. Until then, keep README and internal docs clear that benchmark descriptions are conservative app-facing alignment labels.
