# MathQuest Live PLAN.md

## Purpose

This plan captures the next focused batch of MathQuest Live MVP polish updates. The app is already near MVP-complete, so these changes should prioritize bug fixes, student-facing clarity, visual consistency, and lightweight replay variety.

Do not turn this into a larger platform. Do not add teacher-facing UI, dashboards, classroom mode, rosters, reports, analytics, accounts, databases, ads, saved student data, or persistent progress. Keep all settings and gameplay state session-only.

## Source-of-truth expectations for Codex

- Before editing, inspect the relevant files and explain the implementation plan.
- Refer back to this PLAN.md often while working.
- Do not skip any section unless it is genuinely impossible, and state the blocker clearly.
- Do not rewrite the whole app.
- Preserve existing architecture and style.
- Keep AI usage backend-only.
- Keep math generation and checking deterministic in app code.
- Keep all student choices button/card based.
- Keep benchmark codes out of normal student-facing story text.
- Add timestamped entries to `references/UPDATES.md` for meaningful changes.
- Make focused commits as checkpoints after logical sections if requested by the user in the Codex session.
- Run validation at the end, including `npm run build`.

---

# Update Batch

## 1. Normalize whole-number fraction answers

### Problem

Some fraction questions produce whole-number answers but display them as improper fractions with denominator 1, such as `2/1`. This is confusing for students and should display as `2` instead.

### Required behavior

When a fraction value simplifies to a whole number:

- Display it as a whole number everywhere student-facing.
- Do not display denominator `1` in prompts, answer choices, feedback, explanations, summaries, or rich displays.
- Example: `8/4`, `6/3`, and `2/1` should display as `2`.
- Non-whole fractions should continue to display as fractions.
- Mixed numbers, if currently supported, should remain consistent with existing intended behavior.

### Implementation notes

Inspect all fraction helpers/renderers before editing. Likely areas include:

- `artifacts/mathquest-live/src/mathEngine.ts`
- `artifacts/mathquest-live/src/components/MathRichDisplay.tsx`
- Any shared fraction formatting/simplification helper files if present
- Any answer-choice rendering code that bypasses the rich fraction renderer

Prefer a centralized helper so the app does not have multiple competing fraction-formatting rules.

### Acceptance criteria

- A simplified fraction with denominator 1 renders as a whole number.
- Correct answer choices do not show `2/1`, `3/1`, etc.
- Incorrect answer choices also do not show denominator 1 if they simplify to whole numbers.
- Deterministic answer checking still works.
- Existing stacked fraction visuals for true fractions are not broken.

### Manual test checklist

- Generate or force a fraction problem where the correct answer simplifies to a whole number.
- Confirm the prompt, answer choices, correct feedback, and any summary text display the answer as a whole number.
- Confirm no student-facing `n/1` appears.

---

## 2. Validate stacked fraction formatting everywhere without the old fraction card wrapper

### Problem

Fractions are not visually consistent. Some appear stacked, while others appear inline, including in answer choices. Because the goal is now for all student-facing fractions to be stacked everywhere, the app should no longer need the separate table/box style element currently known as `math-fraction-card` for ordinary fraction display.

### Required behavior

All student-facing true fractions should use the stacked fraction format wherever they appear, including:

- Problem prompts
- Answer choices
- Feedback
- Reference/help content
- Hints, if they include fractions
- Decimal-to-fraction conversion problems
- Equivalent fraction problems
- Any rich math display surfaces

Whole numbers must not be forced into stacked fraction form. For example, `2` should stay `2`, not `2/1`.

Do not rely on the old `math-fraction-card` table/box wrapper for normal fraction rendering. The goal is not to put every fraction inside a special card. The goal is for the fraction itself to render stacked inline wherever it appears.

### Specific student-reported cases to validate

These question types must be checked specifically because they have already appeared with unstacked fractions:

- Decimal conversion: `Which fraction is equal to 0.6?`
- Equivalent fractions: `Which fraction is equivalent to 2/6?`
- Fraction prompts and fraction answer choices across all supported challenge bands

### Implementation notes

Inspect all places fractions are rendered. Identify any path where text such as `1/2`, `3/4`, or `5/6` is rendered directly instead of going through the app's stacked fraction renderer.

Likely areas include:

- `artifacts/mathquest-live/src/components/MathRichDisplay.tsx`
- `artifacts/mathquest-live/src/pages/GameScreen.tsx`
- `artifacts/mathquest-live/src/mathEngine.ts`
- Any answer card or choice component files
- Any decimal conversion or equivalent fraction generator logic

Prefer a centralized rendering helper so every prompt/choice path uses the same stacked fraction behavior. Do not make a fragile one-off regex-only fix if a safer rendering helper can be reused.

### Acceptance criteria

- Student-facing proper fractions render in stacked format consistently.
- Fractions in answer choices render in stacked format consistently.
- Decimal-to-fraction conversion answer choices render stacked fractions.
- Equivalent fraction prompts and choices render stacked fractions.
- Whole-number fraction results render as whole numbers.
- Ordinary fractions are not wrapped in the old `math-fraction-card` table/box presentation.
- No benchmark or developer-only formatting leaks into student-facing UI.

### Manual test checklist

- Generate multiple fraction problems across Easy, Medium/Hero, Hard, and Extreme/Legend if fraction problems exist there.
- Generate decimal conversion problems such as `Which fraction is equal to 0.6?` and confirm all fraction choices are stacked.
- Generate equivalent fraction problems such as `Which fraction is equivalent to 2/6?` and confirm both prompt fractions and choices are stacked.
- Check prompt text, answer choices, feedback, and reference displays.
- Confirm all true fractions are stacked and all whole-number results are whole numbers.
- Confirm ordinary fractions are not displayed inside the old `math-fraction-card` box/table wrapper.

---

## 2B. Prevent fraction problems from requiring simplification

### Problem

A fraction problem displayed `1/10 + 42/100`. The expected grade-level strategy is to convert tenths to hundredths:

```text
1/10 = 10/100
10/100 + 42/100 = 52/100
```

The app marked `13/25` as the correct answer because it simplified `52/100`. That is not appropriate for the current grade-band model. Simplification should not be required for 4th grade/Hero or 5th grade/Champion/Legend unless the official benchmark clarification in the repo explicitly supports it for that band.

### Required behavior

- Do not generate fraction questions where the only correct answer requires simplification.
- Do not mark a simplified equivalent fraction as the intended correct answer when the grade-level expected answer is an unsimplified fraction.
- For problems involving tenths/hundredths, decimal equivalence, or fraction addition, preserve the grade-appropriate expected form.
- Example: `1/10 + 42/100` should use `52/100` as the intended correct answer, not `13/25`.
- Equivalent simplified fractions may be mathematically true, but they should not be the required student answer unless that problem type is explicitly designed and benchmark-supported for simplification.
- If an equivalent fraction problem is asking students to identify an equivalent fraction, that is allowed, but it must not silently require simplifying as a hidden extra step outside the intended benchmark.

### Implementation notes

Inspect fraction generation, answer choice generation, and answer normalization carefully. There may be a helper that automatically simplifies fractions for display or correct answer generation. That helper should not be used blindly for student-facing intended answers.

Likely areas include:

- `artifacts/mathquest-live/src/mathEngine.ts`
- Any fraction helper/normalization functions
- Any answer-choice generation code for fraction addition, decimal conversion, equivalent fractions, and tenths/hundredths problems
- `references/` files containing official Florida B.E.S.T. benchmark descriptions/clarifications

Codex should verify the grade-band expectation against the official benchmark reference files available in the repo. If a benchmark permits equivalent fractions but not simplification as a required computation, keep the required answer in the expected grade-level form.

### Acceptance criteria

- Fraction problems do not require simplification unless explicitly benchmark-supported for that challenge band and problem type.
- `1/10 + 42/100` style problems use `52/100` as the intended answer, not `13/25`.
- The app does not auto-simplify the intended correct answer in student-facing prompts, choices, feedback, or rich displays when simplification is not intended.
- Equivalent fraction problems remain valid, but the task wording must make the equivalence goal clear.
- Validation catches fraction problems where the generated intended answer was simplified inappropriately.

### Manual test checklist

- Generate fraction addition problems involving tenths and hundredths.
- Confirm expected answers preserve the grade-level denominator/form instead of simplifying.
- Confirm `52/100`-style answers render as stacked fractions, not inline text.
- Confirm no answer choice is marked correct solely because the generator simplified the expected answer.
- Confirm equivalent-fraction problems still work when equivalence is the explicit task.

---

## 2C. Increase decimal less-than/more-than complexity using word or fraction form

### Problem

Decimal prompts such as `What number is 0.10 less than 4.19?` are mathematically valid, but they are too direct for some Hero/4th grade practice. Students should sometimes need to connect decimal, word, and fraction forms.

### Required behavior

For decimal “less than” or “more than” problems involving tenths/hundredths:

- Do not always write the change amount in decimal form.
- Sometimes use word form.
  - Example: `What number is one-tenth less than 4.19?`

- Sometimes use fraction form.
  - Example: `What number is 1/10 less than 4.19?`

- Answer choices should still be in decimal form.
- Fraction form such as `1/10` must render as a stacked fraction in the student-facing prompt.
- Keep the math deterministic and app-checked.
- Keep the problem aligned to the selected Florida B.E.S.T. challenge band.

### Implementation notes

Inspect decimal/place-value generators first. Likely areas include:

- `artifacts/mathquest-live/src/mathEngine.ts`
- Any prompt rendering helper that must support stacked fractions inside text
- Any validation logic for decimal problem types

This should increase variety and complexity without adding a new student-facing setting.

### Acceptance criteria

- Hero decimal less-than/more-than problems can use word form such as `one-tenth`.
- Hero decimal less-than/more-than problems can use stacked fraction form such as `1/10`.
- Answer choices remain decimal numbers.
- Correct answers are computed accurately.
- Fraction notation in these prompts follows the global stacked-fraction rule.

### Manual test checklist

- Generate Hero decimal less-than/more-than problems repeatedly.
- Confirm some prompts use word form.
- Confirm some prompts use fraction form.
- Confirm fraction-form prompts render stacked fractions.
- Confirm all answer choices remain decimals.

---

## 2D. Add 4th grade mixed-number subtraction with regrouping

### Problem

The Hero/4th grade path should include some mixed-number subtraction problems that require regrouping, such as `5 5/8 - 2 6/8`. This is grade-appropriate fraction work when denominators are like denominators and the task does not require simplification as a hidden extra step.

### Required behavior

Add or verify mixed-number subtraction problems for the Hero/4th grade band where:

- Fractions use like denominators.
- Some problems require regrouping from the whole number.
- Answers are in mixed-number form when appropriate.
- True fractions render stacked everywhere, including inside mixed numbers and answer choices.
- Whole-number results render as whole numbers, not `n/1`.
- Problems do not require simplification unless explicitly supported by the benchmark and intended problem type.

Example:

```text
5 5/8 - 2 6/8
```

Expected reasoning:

```text
Regroup 5 5/8 as 4 13/8.
4 13/8 - 2 6/8 = 2 7/8.
```

Student-facing answers should remain clean and grade-appropriate, with stacked fractions in the mixed numbers.

### Implementation notes

Inspect current fraction generator coverage first. Likely areas include:

- `artifacts/mathquest-live/src/mathEngine.ts`
- Fraction formatting/rendering helpers
- Math validation scripts
- Florida B.E.S.T. reference files in `references/`

This should be added as a focused generator/subtype, not a broad rewrite of the math engine.

### Acceptance criteria

- Hero/4th grade can generate mixed-number subtraction with regrouping.
- Like denominators are used.
- Correct answers are deterministic and in mixed-number form when appropriate.
- Fraction parts are stacked in prompts, answer choices, feedback, and hints.
- Problems avoid requiring simplification as a hidden extra step.
- Validation covers at least basic correctness for this generator.

### Manual test checklist

- Generate several Hero mixed-number subtraction problems.
- Confirm some require regrouping.
- Confirm answer choices are mixed numbers when appropriate.
- Confirm all fraction parts are stacked.
- Confirm no problem requires simplification to get the intended answer.

---

## 2E. Add 4th grade multi-digit addition and subtraction with and without regrouping

### Problem

The Hero/4th grade path should include more multi-digit whole-number addition and subtraction practice. Students should see both non-regrouping and regrouping cases, with regrouping appearing more often.

### Required behavior

Add or verify Hero/4th grade multi-digit addition and subtraction problems where:

- Numbers are within the appropriate 4th grade whole-number range.
- Both addition and subtraction appear.
- Both regrouping and non-regrouping cases appear.
- Regrouping cases are more common than non-regrouping cases.
- Problems stay deterministic and app-checked.
- Prompts and answers remain readable on mobile.

### Implementation notes

Inspect existing whole-number computation generators first to avoid duplicates. Likely file:

- `artifacts/mathquest-live/src/mathEngine.ts`

If existing generators already cover this, adjust frequency/variety rather than creating duplicate problem types. Use stable signatures so duplicate prevention still works correctly.

### Acceptance criteria

- Hero/4th grade can generate multi-digit addition problems.
- Hero/4th grade can generate multi-digit subtraction problems.
- Regrouping and non-regrouping examples both occur.
- Regrouping is weighted more heavily than non-regrouping.
- Answer choices are accurate and plausible.
- The problems do not overflow on mobile.

### Manual test checklist

- Generate multiple Hero whole-number addition problems.
- Generate multiple Hero whole-number subtraction problems.
- Confirm both regrouping and non-regrouping appear.
- Confirm regrouping appears more often across repeated generation.
- Confirm answer choices are deterministic and correct.

---

## 3. Center the gender/pronoun selector

### Problem

The gender/pronoun selection currently has only two options, `She/Her` and `He/Him`, but the layout appears unbalanced.

### Required behavior

- Center the two pronoun selection cards/buttons visually.
- Keep the UI responsive on mobile, tablet, and desktop.
- Do not add more pronoun choices in this pass.
- Do not add freeform student input.

### Implementation notes

Inspect setup flow layout before editing. Likely file:

- `artifacts/mathquest-live/src/pages/SetupScreen.tsx`

Prefer CSS/grid/flex layout changes over restructuring the setup flow.

### Acceptance criteria

- `She/Her` and `He/Him` are centered as a pair.
- The selector does not look left-heavy or awkward on mobile.
- Touch target sizing remains comfortable for students.

### Manual test checklist

- Open setup on desktop width.
- Open setup on mobile width.
- Confirm the two options are centered and do not stretch strangely.

---

## 4. Add short descriptions for ancestry and class choices

### Problem

Students asked what terms like Sprite, Fae, and similar ancestry/class options mean. When students click or select an ancestry or class, the app should briefly explain it.

### Required behavior

When a student selects or focuses an ancestry or class option:

- Show a short, student-friendly description.
- Keep descriptions classroom-safe and age-appropriate.
- Keep descriptions brief, roughly one sentence each.
- Avoid real-world religion, stereotypes, romance, horror, gore, or anything too intense.
- Keep the descriptions flavor-based, not mechanical RPG stat blocks.

### Examples of desired tone

- Sprite: “A tiny, quick adventurer who notices details others miss.”
- Fae: “A mysterious forest-born hero who solves problems with cleverness and wonder.”
- Knight: “A brave protector who helps the team stay calm when danger appears.”

### Implementation notes

Inspect where ancestry and class options are defined. Likely areas include:

- `artifacts/mathquest-live/src/pages/SetupScreen.tsx`
- Data/constants files if options have been separated out
- Story prompt context if ancestry/class labels are passed to backend

The descriptions should appear in the setup UI only. They may also be useful as metadata passed to prompts if already natural, but do not let descriptions bloat the story prompt unnecessarily.

### Acceptance criteria

- Every ancestry option has a short description.
- Every class option has a short description.
- Description appears when selected/clicked/focused.
- Description works on mobile.
- No freeform input is added.

### Manual test checklist

- Select each ancestry and confirm a description appears.
- Select each class and confirm a description appears.
- Check that descriptions do not cause layout jumpiness or overflow.

---

## 5. Add more genre options and story paths

### Problem

The game needs more variety so repeat sessions feel fresh. Add approximately 10 more genre options and/or story path variants while keeping the MVP simple.

### Required behavior

- Add about 10 new student-facing genre choices or genre path variants.
- Keep choices classroom-safe for ages 8–11.
- Keep choices broad enough for replay value.
- Make sure the backend story prompt and fallback logic can handle the new genres.
- Do not add real-world politics, real-world religion, romance, horror, gore, profanity, drugs/alcohol/vaping, bullying, stereotypes, or personal information requests.
- Do not add teacher-facing configuration.

### Suggested genre additions

Codex may adjust these after inspecting existing options to avoid duplicates:

1. Sky Islands
2. Crystal Caverns
3. Clockwork City
4. Jungle Ruins
5. Undersea Kingdom
6. Moon Base Mystery
7. Enchanted Library
8. Candy Kingdom
9. Dinosaur Valley
10. Miniature Backyard Quest

### Implementation notes

Inspect existing genre definitions and story prompt handling first. Likely areas include:

- `artifacts/mathquest-live/src/pages/SetupScreen.tsx`
- `artifacts/api-server/src/routes/game/storyPrompt.ts`
- Any fallback story/ending pools
- Any image prompt genre mapping if present

Add lightweight genre-specific flavor, not a large new system.

### Acceptance criteria

- Approximately 10 new safe genre options or variants are available.
- New genres appear in setup and look balanced visually.
- New genres are passed through to story generation correctly.
- Fallback scenes/endings remain safe and make sense for the new genres.
- Optional image prompts, if genre-aware, do not break.

### Manual test checklist

- Start at least three quests with new genres.
- Confirm choices make sense with the selected genre.
- Confirm fallback behavior still works if AI fails.

---

## 6. Add new hero name choices and rebalance name selector

### Problem

Add a new name choice: `Lunamandia`. To keep the selector visually balanced, add two additional name choices as well.

### Required behavior

- Add `Lunamandia` as a preset name choice.
- Add two more preset name choices for visual balance.
- Keep names classroom-safe, whimsical, and easy enough for upper elementary students to read.
- Do not add freeform name input.
- Keep visual layout balanced after adding the names.

### Suggested additional names

Codex may adjust if these conflict with existing names:

- Solara
- Bramble

### Acceptance criteria

- `Lunamandia` appears as a selectable name.
- Two additional names appear as selectable names.
- Name selector remains visually balanced on mobile and desktop.
- Selected names flow into story generation correctly.

### Manual test checklist

- Select `Lunamandia` and start a quest.
- Confirm the story uses the selected name correctly.
- Check the name selection grid on mobile.

---

## 7. Rename `Mango Person` to `Mango`

### Problem

The current label `Mango Person` should be simplified to `Mango`.

### Required behavior

- Rename the visible student-facing option from `Mango Person` to `Mango`.
- Preserve any internal ID if changing it would break saved assumptions or story routing.
- Since there is no saved student data, internal cleanup is allowed if safe, but do not create unnecessary churn.

### Acceptance criteria

- Student-facing UI shows `Mango`.
- Story generation uses `Mango` naturally.
- No `Mango Person` appears in student-facing UI.

### Manual test checklist

- Open the relevant selector.
- Confirm the visible label says `Mango`.
- Start a quest with `Mango` if applicable and confirm story text reads naturally.

---

## 8. Add two more ancestry choices to balance the selection list visually

### Problem

The ancestry selection list needs two additional choices to balance the grid visually.

### Required behavior

- Add two new ancestry choices.
- Keep them classroom-safe, fantasy/adventure-friendly, and easy to understand.
- Add short descriptions for the new ancestry choices as part of Section 4.
- Ensure story prompt/fallback logic can handle them safely.
- Do not use real-world race/ethnicity framing.

### Suggested ancestry additions

Codex may adjust after inspecting existing ancestry choices:

1. Starling: “A bright, curious hero who follows clues like constellations.”
2. Pebblekin: “A sturdy little hero who stays steady when the path gets tricky.”

### Acceptance criteria

- Two new ancestry choices appear in setup.
- Each has a short description.
- The grid/list looks visually balanced.
- The choices pass into story generation without errors.

### Manual test checklist

- Select each new ancestry.
- Confirm the description appears.
- Start a quest with each and confirm no story or prompt errors occur.

---

## 9. Fix mode questions so the data set actually has a mode or supports “There is no mode”

### Problem

A data problem asked for the mode of a set where no value repeated, such as `18, 24, 35, 26, 17`. The generated answer was `18`, which is incorrect. If asking for mode, the data must either have a valid mode or include a correct “There is no mode” answer path.

### Required behavior

Choose one of these two valid approaches after inspecting the current generator:

Preferred simple approach:

- When generating a mode question, ensure at least one value repeats and is the unique intended mode.
- Avoid multimodal sets unless the app explicitly teaches/supports that.

Alternative acceptable approach:

- Allow no-mode data sets only if `There is no mode` is available as an answer choice and is correctly marked as the answer.

Do not let a no-mode set choose a random value as the mode.

### Implementation notes

Inspect the data/statistics generator logic in:

- `artifacts/mathquest-live/src/mathEngine.ts`
- Any math validation script that checks generated questions

Also update or add validation so this does not regress.

### Acceptance criteria

- Mode questions never mark a non-repeated value as the mode.
- If there is no mode, the correct answer is explicitly “There is no mode.”
- If the app does not teach no-mode cases, all mode questions generate a clear repeated mode.
- `npm run validate:math` catches invalid mode questions if possible.

### Manual test checklist

- Generate multiple data/mode questions.
- Confirm every mode data set either has a repeated value or includes “There is no mode” as the correct answer.
- Confirm answer choices do not include misleading random single-occurrence values as the correct answer.

---

## 10. Shrink answer choice font for large Hero expanded form answers

### Problem

In the Hero path, expanded form answer choices can contain large numbers and push outside the bounds of the answer choice box.

### Required behavior

- Make long expanded-form answer choices fit inside their cards/buttons.
- Prefer slightly smaller font, wrapping, and/or better responsive styling.
- Do not shrink all answer choices unnecessarily if a targeted class/condition is cleaner.
- Keep text readable for students.

### Implementation notes

Inspect answer choice components and the expanded-form generator. Likely areas:

- `artifacts/mathquest-live/src/pages/GameScreen.tsx`
- `artifacts/mathquest-live/src/mathEngine.ts`
- Any CSS/Tailwind class names attached to answer cards

A good implementation may add a conditional style for long answer strings or allow answer choice text to wrap more gracefully.

### Acceptance criteria

- Large Hero expanded-form answer choices stay inside their boxes.
- Mobile and desktop layouts remain readable.
- Normal short answer choices are not made awkwardly tiny.

### Manual test checklist

- Force or generate Hero expanded-form problems with large answer choices.
- Check mobile width and desktop width.
- Confirm no text overflows outside the card/button.

---

## 11. Fix reference table title font hierarchy

### Problem

Reference table title styling is reversed. Titles like `Customary length reference` appear smaller than column headers such as `Unit` and `Equivalent measure`.

### Required behavior

- Reference table titles should be larger than or at least equal to column header text.
- The title should visually read as the title.
- Keep table styling clean and readable on mobile.

### Implementation notes

Inspect reference table rendering. Likely areas include:

- `artifacts/mathquest-live/src/components/MathRichDisplay.tsx`
- Any reference table component or rich display helper

### Acceptance criteria

- Reference table titles are not smaller than column headers.
- Table remains readable and responsive.
- The change applies to all reference table types, not only one hardcoded table.

### Manual test checklist

- Generate/view customary length reference.
- Generate/view any other reference table type.
- Confirm title hierarchy is visually correct.

---

## 12. Add or verify two pattern problem types

### Problem

Pattern problems should support two distinct student thinking tasks, not only one pattern format.

### Required behavior

Ensure both of these pattern problem types exist. If one or both already exist, verify and polish them instead of duplicating logic:

1. Finish the pattern based on a provided rule.
   - Example task shape: `Rule: Add 6. Pattern: 12, 18, 24, ___. What comes next?`

2. Identify the rule based on the provided pattern.
   - Example task shape: `Pattern: 4, 9, 14, 19. What is the rule?`

Keep all pattern questions aligned to the appropriate Florida B.E.S.T. challenge band. Do not drift into middle-school algebra or function notation.

### Implementation notes

Inspect existing pattern generators first. Likely file:

- `artifacts/mathquest-live/src/mathEngine.ts`

If pattern generation is already present, extend it cleanly with a subtype or problem type field so variety tracking can distinguish the two forms.

### Acceptance criteria

- The app can generate a pattern-completion problem with the rule provided.
- The app can generate a rule-identification problem with the pattern provided.
- Answer choices are clear, age-appropriate, and deterministic.
- Pattern problems stay within the selected challenge band.
- Problem signatures distinguish meaningfully different pattern tasks.

### Manual test checklist

- Generate several pattern-completion problems.
- Generate several rule-identification problems.
- Confirm answer choices are plausible but not ambiguous.
- Confirm the validation script still passes.

---

## 13. Improve readability for multi-line geometry comparison prompts

### Problem

Some geometry comparison prompts are technically correct but hard to read when all details are placed in one long line.

Example current style:

`Rectangle A is 16 by 10. Rectangle B is 17 by 9. They have the same perimeter. Which rectangle has the greater area?`

Desired student-facing layout:

```text
Rectangle A is 16 by 10.
Rectangle B is 17 by 9.
They have the same perimeter. Which rectangle has the greater area?
```

### Required behavior

For rectangle/geometry comparison problems with multiple given figures or measurements:

- Use intentional line breaks between figure statements.
- Keep the final question readable and connected to the context.
- Avoid adding awkward line breaks to every math problem globally.
- Preserve accessibility and mobile responsiveness.

### Implementation notes

Inspect how math prompts are stored and rendered. If prompts currently include plain strings, support safe newline rendering in the game question display. Do not use unsafe HTML injection.

Likely areas include:

- `artifacts/mathquest-live/src/mathEngine.ts`
- `artifacts/mathquest-live/src/pages/GameScreen.tsx`
- `artifacts/mathquest-live/src/components/MathRichDisplay.tsx`

### Acceptance criteria

- Rectangle comparison prompts display with readable line breaks.
- Newline rendering does not break other problem types.
- Mobile display remains clean.

### Manual test checklist

- Generate rectangle comparison problems.
- Confirm Rectangle A and Rectangle B details appear on separate lines.
- Confirm answer choices and feedback still work normally.

---

## 14. Improve the visual size of unknown boxes in equations

### Problem

In equations like `88 ÷ □ = 11. What number belongs in the box?`, the unknown box looks too small and visually out of place in the question display.

### Required behavior

- Make the unknown box larger and easier for students to see.
- Keep the equation readable and balanced with surrounding numbers/operators.
- Prefer a reusable inline math placeholder style rather than manually enlarging one character everywhere.
- Do not make it look like an editable input field unless it actually is one.

### Possible approaches

Codex should inspect the current rendering and choose the cleanest implementation. Acceptable approaches include:

- A styled inline placeholder box with border and fixed minimum size.
- A tiny one-cell table-like box with borders if that looks better.
- A math display helper that replaces the unknown square symbol with a consistent styled element.

### Implementation notes

Likely areas include:

- `artifacts/mathquest-live/src/mathEngine.ts`
- `artifacts/mathquest-live/src/pages/GameScreen.tsx`
- `artifacts/mathquest-live/src/components/MathRichDisplay.tsx`

Avoid unsafe HTML injection. Keep the style responsive and readable on mobile.

### Acceptance criteria

- Unknown box equations display with a larger, clearer placeholder.
- The placeholder aligns naturally with numbers and operators.
- It does not break answer checking.
- It does not create layout overflow.

### Manual test checklist

- Generate equations like `88 ÷ □ = 11`.
- Check desktop and mobile display.
- Confirm the unknown box looks intentional and student-friendly.

---

## 15. Add more non-repeating rotating flavor text for intro/outro waiting screens

### Problem

The intro and outro waiting screens currently rotate through a small set of flavor text lines such as `The Illustrator is adding the final touches…` or `The Chronicler is opening to the page of your story`. These lines can repeat while the student is still waiting, which makes the loading state feel less polished.

### Required behavior

- Add a much larger pool of classroom-safe rotating flavor text for the intro/cover waiting screen.
- Add a much larger pool of classroom-safe rotating flavor text for the outro/ending waiting screen.
- Do not show a repeated line during a single waiting-screen cycle until every available line for that screen has been shown.
- If the wait lasts long enough to exhaust the full pool, reshuffle or restart only after the full pool has been used.
- Keep the tone magical, adventure-themed, and age-appropriate.
- Keep lines short enough to read comfortably before rotation.
- Do not include anything scary, romantic, religious, political, violent, or too intense.
- Do not add analytics or persistence. The non-repeat behavior only needs to apply during the current waiting-screen session.

### Implementation notes

Inspect the current loading/waiting screen flavor text logic first. Likely areas include:

- `artifacts/mathquest-live/src/App.tsx`
- `artifacts/mathquest-live/src/pages/GameScreen.tsx`
- `artifacts/mathquest-live/src/pages/EndingScreen.tsx`
- Any loading, cover, intro, outro, image, or story preparation components/constants

Prefer a small helper that creates a shuffled queue for each waiting screen rather than random selection with replacement.

### Example intro/cover flavor tone

- `The Chronicler is choosing the perfect opening line…`
- `The Illustrator is sketching the first spark of adventure…`
- `The map is unfolding at the edge of the page…`
- `A bookmark is sliding into place…`
- `The first clue is glowing softly…`

### Example outro/ending flavor tone

- `The Chronicler is polishing the final sentence…`
- `The Illustrator is adding a shine to your reward…`
- `The last page is settling into the book…`
- `Your quest badge is getting its final sparkle…`
- `The story is tying its ribbon around the ending…`

Codex should add many more than these examples.

### Acceptance criteria

- Intro/cover waiting screen has a noticeably larger flavor text pool.
- Outro/ending waiting screen has a noticeably larger flavor text pool.
- Lines do not repeat during a single waiting-screen cycle until the pool is exhausted.
- Rotation still works at a readable pace.
- The implementation remains session-only and does not save data.

### Manual test checklist

- Start a quest and watch the intro/cover waiting screen rotate through several lines.
- Confirm no line repeats before the pool is exhausted.
- Finish a quest or force the ending/outro waiting state and check the same behavior.
- Confirm flavor lines are readable, safe, and not too long.

---

## 16. Add multi-step unit conversions for 4th and 5th grade

### Problem

Conversion problems can be more rigorous while still staying grade-appropriate. For 4th and 5th grade bands, include some multi-step conversions within the same measurement system, such as gallons to pints or yards to inches.

### Required behavior

Add or verify multi-step conversion problems for Hero/4th grade and Champion/Legend/5th grade where appropriate.

Examples:

- Gallons to pints
  - Students may need to know `1 gallon = 4 quarts` and `1 quart = 2 pints`, so `1 gallon = 8 pints`.

- Yards to inches
  - Students may need to know `1 yard = 3 feet` and `1 foot = 12 inches`, so `1 yard = 36 inches`.

Requirements:

- Keep conversions within grade-level Florida B.E.S.T. expectations.
- Use deterministic app-generated math only.
- Include both one-step and multi-step conversions, not only multi-step.
- Multi-step conversions should appear sometimes for 4th and 5th grade, not every time.
- Use reference tables when appropriate, especially if that is already part of the app’s support model.
- Make sure reference table styling follows Section 11.
- Keep numbers reasonable for mental math or scratch-paper math by upper elementary students.
- Avoid middle-school ratio/proportion framing.
- Avoid requiring students to set up algebraic proportions.

### Implementation notes

Inspect existing measurement conversion generators and reference table logic first. Likely areas include:

- `artifacts/mathquest-live/src/mathEngine.ts`
- `artifacts/mathquest-live/src/components/MathRichDisplay.tsx`
- Florida B.E.S.T. benchmark reference files in `references/`
- Any validation script covering measurement conversions

If existing conversion generators already support direct conversions only, extend them carefully with a small multi-step subtype or metadata field so variety tracking can distinguish direct and multi-step conversion tasks.

### Acceptance criteria

- Hero/4th grade can generate some multi-step customary conversion problems such as gallons to pints and yards to inches.
- Champion/Legend/5th grade can generate appropriate multi-step conversion problems within Grade 5 limits.
- One-step conversions still appear.
- Problems remain deterministic and accurately checked.
- Reference tables, if shown, are readable and use the corrected title hierarchy.
- Problem wording does not use middle-school ratio/proportion framing.

### Manual test checklist

- Generate Hero conversion problems repeatedly and confirm both one-step and multi-step examples appear.
- Generate 5th grade conversion problems repeatedly and confirm multi-step examples stay within Grade 5 expectations.
- Confirm examples like gallons to pints and yards to inches calculate correctly.
- Confirm reference tables display cleanly on mobile.
- Confirm `npm run validate:math` covers conversion correctness if practical.

---

# Additional MVP polish recommendations

These are recommended based on recent student use and the current MVP state. Implement them only if they remain small and aligned with the sections above. Do not let these become a new mega-project.

## A. Add math regression validation for the exact bugs found by students

Student feedback has already uncovered issues that are ideal for automated validation:

- No student-facing `n/1` fraction display.
- Mode questions must have a real mode or a correct `There is no mode` answer.
- Expanded-form answer choices should not produce extreme unbroken text that overflows.

If there is already a math validator, extend it. If not, add the smallest practical validation checks without building a full test framework.

## B. Add a short “What does this mean?” pattern for setup choices

The ancestry/class description feature will likely reduce student confusion. Consider using the same small helper pattern for any future setup option that uses fantasy vocabulary. Keep it lightweight.

## C. Do a final mobile overflow pass after these changes

Several updates affect setup grids, answer cards, and math displays. After implementing this batch, do one focused mobile pass looking for:

- Horizontal overflow
- Buttons touching screen edges
- Answer text escaping cards
- Reference tables exceeding viewport width
- Setup grids feeling unbalanced

Fix only obvious polish issues in files already touched.

## D. Freeze feature growth after this batch unless student feedback reveals a clear problem

The MVP sounds close. After this update batch, prioritize:

- Student-discovered bugs
- Readability
- Mobile layout polish
- Math correctness
- Story coherence

Avoid adding new systems, dashboards, reports, accounts, persistence, or teacher modes.

---

# Required final validation

Run the relevant checks before finishing. Be sure the math validation covers the specific student-reported issues in this plan, especially stacked fractions in decimal conversion/equivalent fraction problems, fraction answers that should not require simplification, and correctness of mode questions.

```sh
npm run build
npm run validate:math
npm run validate:images
pnpm --filter @workspace/mathquest-live run typecheck
pnpm --filter @workspace/api-server run typecheck
```

If a command fails because of an unrelated pre-existing issue, document that clearly and include the exact failure summary.

---

# Final response expected from Codex

When finished, report:

1. What changed by section.
2. Any files touched.
3. Validation commands run and their results.
4. Any known limitations or follow-up bugs.
5. Commit hashes if commits were made.
