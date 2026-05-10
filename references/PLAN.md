Below is a list of prompts that you need to follow, one by one, to complete the task. Please make sure to follow the instructions carefully and provide detailed responses.

Prompt 1:
Improve MathQuest Live’s story system so each quest feels like one coherent self-contained episode with better pacing, stronger continuity, scene-supported choices, challenge-level-appropriate reading complexity, and slightly more readable story text.

Before editing, inspect:

- the backend story generation flow
- how the opening scene, continuation scenes, and ending are prompted
- what story context is currently sent to each continuation request
- how the selected student action is passed into the next story call
- how the 3 next action choices are generated
- how challenge level is currently passed into story generation, if at all
- where quest length values are currently defined and used
- where quest length labels/copy appear in the setup flow, game UI, summaries, docs, and tests
- where student-facing story text typography is styled in the frontend

Explain your implementation plan before making changes.

Goal:
Make each MathQuest adventure feel like one complete installment of a kid-friendly cartoon, anime, comic, or TV episode:

- one clear central problem introduced near the beginning
- logical development from chapter to chapter
- the student’s chosen action visibly affecting the next scene
- action choices that make sense based only on what the story has actually established
- story pacing that adapts to quest length
- reading complexity that adapts to challenge level
- a satisfying ending that resolves the episode’s central problem

Current problems to fix:

1. Story scenes can feel loosely connected instead of like one continuous adventure.
2. The student’s chosen action does not always clearly drive the next scene.
3. The next action choices sometimes do not match what is actually happening in the scene.
   - Example problem: the game may offer “Follow this character” even though the story never said the character was going anywhere, walking away, or inviting the hero to come along.
   - Choices must not rely on unstated offscreen assumptions.
4. Current quest lengths are too short for stories to develop naturally.
5. Challenge level currently needs to influence story reading complexity, not only math difficulty.
6. Story text is slightly too small for comfortable reading.

Important rules:

- Do not rewrite the whole app.
- Do not change the core game loop.
- Do not change deterministic math generation or answer checking.
- Do not let AI generate, solve, or check math.
- Do not add student accounts, persistence, analytics, databases, or saved progress.
- Do not add freeform student story input.
- Keep the existing three-choice button/card interaction model.
- Keep all story/session data session-only.
- Keep all existing classroom-safety rules intact.
- Keep content safe for ages 8–11.
- Keep MVP simple.
- Do not overbuild a branching RPG engine, lore database, persistent memory system, or hidden simulation layer.

PART 1: Update quest lengths so stories have more room to breathe

Current quest lengths:

- Quick = 5 challenges
- Standard = 8 challenges
- Full = 10 challenges

Change them to:

- Quick = 8 chapters
- Standard = 12 chapters
- Full = 16 chapters

Important terminology/pacing rule:
For story structure, treat a “chapter” as one math-gated story progression beat:

1. student sees a story scene
2. student chooses an action
3. student solves one deterministic app-generated math challenge
4. the story advances

The opening cover/intro scene and the final ending scene should not count as chapters unless the current code architecture absolutely requires a different internal implementation. Preserve the existing gameplay loop, but make the actual progression and visible user-facing quest lengths align with 8 / 12 / 16 math-gated chapters.

Find and update all relevant uses:

- frontend quest length option definitions
- backend assumptions
- progression logic
- ending trigger logic
- any prompts that mention quest length or total scene count
- setup flow copy
- game UI labels and counters
- summary/reward text
- README/docs
- tests
- hardcoded examples such as “Math Challenges: 0 / 5”

Use consistent wording:

- Student-facing mode names may remain Quick / Standard / Full.
- If appropriate in story-length UI, use “chapters” for the adventure length.
- Do not casually rename all math challenge language if it would create confusion.
- Keep the concepts clear:
  - quest length = story chapters
  - math challenges completed = math problems solved

PART 2: Make challenge level control story reading complexity as well as math difficulty

The app already uses challenge level as the standards band:

- Easy / Adventurer = Grade 3 Florida B.E.S.T. math content
- Medium / Hero = Grade 4 Florida B.E.S.T. math content
- Hard / Champion = Grade 5 Florida B.E.S.T. math content
- Extreme / Legend = advanced Grade 5 Florida B.E.S.T. content, still within Grade 5 limits

Keep that standards model intact.

Also use the selected challenge level to guide the story’s reading complexity, vocabulary, sentence structure, scene length, and narrative sophistication.

The story reading level should roughly match the selected grade band or be only slightly above it:

- Easy / Adventurer:
  - write for roughly Grade 3 readability
  - use shorter scenes
  - use clear, concrete vocabulary
  - prefer shorter sentences and straightforward sentence structure
  - keep plot beats easy to follow
  - avoid dense description, abstract language, uncommon words, or complicated figurative phrasing
- Medium / Hero:
  - write for roughly Grade 4 readability
  - use moderately richer vocabulary and slightly more varied sentences
  - allow a little more detail and atmosphere while keeping the plot clear
- Hard / Champion:
  - write for roughly Grade 5 readability
  - use fuller scenes, stronger vocabulary, and more layered developments
  - still remain readable and appropriate for upper elementary students
- Extreme / Legend:
  - write at the upper end of Grade 5 readability, not middle school level
  - allow the richest vocabulary, most developed scenes, and most nuanced episode structure
  - still stay within upper elementary readability and classroom-safe tone
  - do not drift into Grade 6 or older-student prose

Important reading-complexity rule:
Quest length and reading complexity are separate controls.

- A Quick, Standard, or Full quest may have more or fewer chapters.
- Easy mode should still use accessible Grade 3-level prose even in a Full 16-chapter quest.
- Extreme mode may use richer prose even in a Quick 8-chapter quest.
- Longer quests should create more story breathing room, not automatically denser or harder text.

Add or improve story prompt instructions so the model receives:

- selected challenge level
- corresponding grade band
- corresponding reading-complexity guidance

Use direct prompt language along the lines of:

- “Match the story’s reading complexity to the selected challenge level.”
- “Easy / Adventurer should read like roughly Grade 3 prose: clear, concrete, and not overly long.”
- “Medium / Hero should read like roughly Grade 4 prose.”
- “Hard / Champion should read like roughly Grade 5 prose.”
- “Extreme / Legend may use the richest upper-elementary prose, but must remain within Grade 5 readability and must not drift into middle-school vocabulary or sentence complexity.”
- “Do not make lower challenge levels read like harder modes simply because the quest is longer.”

If there is an existing centralized challenge-level config, prefer adding reading-complexity metadata there rather than scattering duplicate prompt text across files.

PART 3: Add an internal episode-level story plan at quest start

Improve the story system so each quest is not just a sequence of scenes, but one coherent self-contained episode with a single central problem that is introduced, developed, and resolved.

At quest start, generate or define a backend-only, session-only episode plan before scene-by-scene continuation begins.

The episode plan should include enough information to keep later chapters focused, such as:

- episodeTitle
- centralProblem
- heroGoal
- stakes
- keyStoryElements / important established details
- intendedResolution
- pacing beats appropriate to the selected quest length
- readingComplexity guidance based on the selected challenge level

The plan should establish:

1. One clear central problem for the entire quest.
2. What the hero is trying to accomplish by the end.
3. Why it matters in kid-friendly, classroom-safe terms.
4. A broad beginning / middle / end arc appropriate to the selected quest length.
5. A target resolution the story should work toward, while still allowing student choices to shape the route there.
6. The expected reading complexity for the selected challenge level.

This episode plan is for backend AI guidance only:

- keep it session-only
- do not persist it
- do not expose raw planning metadata to students
- do not add a database or saved story state

PART 4: Use the new quest lengths to shape narrative pacing

Use the selected quest length to guide the episode structure.

QUICK MODE: 8 chapters

- Should feel like a tight, complete single episode.
- Chapter 1: strong hook and central problem clearly introduced.
- Chapters 2–3: hero begins responding, investigating, or making first progress.
- Chapter 4: meaningful complication, obstacle, or discovery.
- Chapters 5–6: escalation and movement toward the solution.
- Chapter 7: final push / decisive setup.
- Chapter 8: central problem resolved, leading naturally into the ending scene.

STANDARD MODE: 12 chapters

- Should feel like a fuller standard episode with more development.
- Chapters 1–2: hook, setup, and central problem established.
- Chapters 3–5: exploration, development, and first meaningful progress.
- Chapter 6: midpoint complication, twist, or major discovery.
- Chapters 7–9: consequences, escalation, and deeper movement toward the goal.
- Chapters 10–11: final push toward solving the problem.
- Chapter 12: central problem resolved, leading naturally into the ending scene.

FULL MODE: 16 chapters

- Should feel like a longer special episode, not an aimless saga.
- Chapters 1–2: strong opening and central problem established.
- Chapters 3–6: deeper development, investigation, obstacles, and a little more room for character/world flavor.
- Chapters 7–8: midpoint turn, major discovery, or significant complication.
- Chapters 9–12: escalating attempts, setbacks, and clearer movement toward the solution.
- Chapters 13–15: final sequence / decisive push.
- Chapter 16: central problem resolved, leading naturally into the ending scene.

Use the extra chapters to let the story breathe:

- allow setup, discovery, complication, and resolution to happen in logical order
- do not rush from problem introduction to solution
- do not pad with filler or unrelated side quests
- do not introduce a brand-new main problem halfway through
- do not turn Full mode into a multi-episode arc
- every quest should still feel like one complete installment with one main problem resolved by the end

PART 5: Pass stronger context into every continuation request

Inspect the current request/response shape for story continuation.

Update the continuation flow so the backend sends enough context for the AI to continue the actual existing episode rather than generating a loosely related next scene.

Preferred simple MVP approach:

- send the full story-so-far for the current session into each continuation prompt
- send the internal episode plan
- send the exact action the student selected
- send the current chapter number and total chapter count
- send the selected challenge level and its reading-complexity guidance
- reuse any existing in-session story history structure if one already exists
- do not persist story history beyond the current session

Each continuation prompt should explicitly require the model to:

1. Continue the same existing episode, not start a new mini-story.
2. Show the hero carrying out or attempting the exact action the student selected.
3. Make the new scene a direct, logical consequence of:
   - the immediately previous scene
   - the selected student action
   - the ongoing episode plan
4. Preserve established details such as:
   - location
   - goal
   - companions
   - objects
   - obstacles
   - tone
     unless the story itself naturally changes them.
5. Keep advancing the same central problem.
6. Respect the current chapter’s place in the overall pacing.
7. Match the selected challenge level’s reading complexity.
8. Avoid abrupt jumps, contradictions, unexplained resets, or unrelated new conflicts.
9. Advance the story by one clear beat at a time, not several major developments at once.
10. End in a situation that naturally supports exactly 3 next choices.

Add or improve continuation instructions along the lines of:

- “Continue the same episode below.”
- “The hero chose: [ACTION]. The next scene must visibly show the hero following through on or attempting that exact action.”
- “The episode’s central problem is: [CENTRAL_PROBLEM]. Keep the story moving toward resolving that same problem.”
- “This is chapter [CURRENT_CHAPTER] of [TOTAL_CHAPTERS]. Match the pacing for this point in the episode.”
- “The selected challenge level is [CHALLENGE_LEVEL]. Match the story’s reading complexity to its grade-band guidance.”
- “Do not introduce a new unrelated main problem.”
- “Do not reset the setting, stakes, or goal unless the story has naturally changed them.”
- “Use the story-so-far as binding continuity, not loose inspiration.”

PART 6: Make every student action choice explicitly supported by the scene text

This is especially important.

The next 3 action choices must not merely be vaguely related to the story. They must be actions that make sense based on what the current scene has actually told the student.

A choice is only valid if the current scene text explicitly establishes the information needed for that action.

Examples:

- Do not offer “Follow the fox” unless the scene says the fox is leaving, beckoning, moving toward somewhere, or otherwise gives the hero a reason to follow.
- Do not offer “Open the silver door” unless the scene has actually mentioned a silver door.
- Do not offer “Ask Mira about the map” unless Mira and the map are both present or were clearly established in the scene.
- Do not offer “Climb onto the wagon” unless a wagon is present.
- Do not offer “Hide behind the statue” unless a statue is present.
- Do not offer “Use the key” unless the hero actually has a key and there is a lock or other relevant use for it.

The next 3 choices must:

- be grounded in the immediate situation at the end of the new scene
- be possible using only people, places, objects, and information that the story has already established
- be actions the hero can logically take right now
- clearly relate to the current obstacle, opportunity, or decision
- plausibly help address the episode’s central problem
- be meaningfully different from one another
- remain safe, age-appropriate, and button-friendly
- never depend on missing stage directions or unstated assumptions
- use wording appropriate to the selected challenge level’s reading complexity

Add strong prompt instructions such as:

- “Every choice must be justified by explicit facts already present in the scene text.”
- “Do not generate a choice unless the scene has already established the character, object, location, movement, or opportunity required for that choice.”
- “If a desired choice would require information the scene has not established, either revise the scene to establish it first or choose a different action.”
- “The student should never have to assume an offscreen action or missing fact in order for a choice to make sense.”
- “Before finalizing the choices, check each one against the scene text. If the scene does not support it, replace it.”

PART 7: Tighten output discipline for scenes and choices

Review the structured output requirements for generated scenes and choices.

If useful, tighten the schema and/or prompt so the model is reminded that:

- `sceneText` must be a continuation of the prior story
- `sceneText` must visibly follow through on the selected prior action
- `sceneText` must continue advancing the same central episode problem
- `sceneText` must match the selected challenge level’s reading complexity
- `choices` must be derived from the immediate end state of `sceneText`
- `choices` must be explicitly supported by facts stated in `sceneText`
- `choices` must be worded at an appropriate reading level for the selected challenge level
- the selected prior action should visibly matter in the resulting scene

If there is a practical low-complexity way to add a backend validation or retry instruction for unsupported choices, consider it, but keep MVP simple.
Do not create a heavy rules engine or overengineered semantic validator.

PART 8: Slightly increase story text readability

Find the student-facing story text styling in the frontend and increase it modestly.

Target:

- The story body should read more like roughly 12–14 pt instead of feeling like 10–11 pt.
- Use responsive web sizing rather than literal print points if appropriate.
- Increase only enough to improve comfort without making the layout feel oversized.
- Preserve or slightly improve line-height for readability.

Inspect:

- GameScreen story text
- Ending story text if it uses the same prose styling
- any shared story/prose classes
- mobile/narrow-screen presentation

Preferred result:

- slightly larger body text
- comfortable line spacing
- still clean on mobile and desktop
- no giant jump in card height

Acceptance criteria:

1. Quest lengths are updated consistently from 5 / 8 / 10 to 8 / 12 / 16.
2. The updated lengths drive actual game progression and ending logic, not only display copy.
3. Any visible copy, examples, docs, and tests referencing old quest lengths are updated.
4. Each quest has one backend-only episode plan with a central problem, hero goal, stakes, intended resolution, pacing beats, and reading-complexity guidance.
5. Episode pacing adapts to the selected length:
   - Quick = 8 chapters
   - Standard = 12 chapters
   - Full = 16 chapters
6. Challenge level controls story reading complexity:
   - Easy / Adventurer = roughly Grade 3 prose
   - Medium / Hero = roughly Grade 4 prose
   - Hard / Champion = roughly Grade 5 prose
   - Extreme / Legend = upper Grade 5 prose only, not middle school prose
7. Longer quests add more breathing room without automatically increasing reading difficulty.
8. Each continuation request includes:
   - full story-so-far
   - episode plan
   - selected student action
   - current chapter number
   - total chapter count
   - selected challenge level and reading-complexity guidance
9. The next scene visibly follows through on the exact action the student selected.
10. The story remains focused on the same central problem from beginning to end.
11. Every generated choice is supported by explicit facts already present in the current scene text.
12. No choice depends on unstated offscreen assumptions.
13. The generated choices match the immediate situation at the end of the scene.
14. Scenes and choices use reading complexity appropriate to the selected challenge level.
15. Story generation remains backend-only.
16. Story content remains classroom-safe and session-only.
17. The story body font is visibly but modestly larger and more comfortable to read.
18. Layout remains clean on desktop and mobile/narrow screens.
19. No unrelated game systems are changed.

Manual test checklist:

1. Start a Quick quest and confirm it now runs 8 chapters before the ending.
2. Start a Standard quest and confirm it now runs 12 chapters before the ending.
3. Start a Full quest and confirm it now runs 16 chapters before the ending.
4. Confirm progress counters, labels, setup copy, summaries, docs, and any examples reflect the new lengths.
5. Start a new quest and confirm the opening establishes one clear central problem.
6. Choose an action and confirm the next scene visibly shows the hero attempting or completing that exact action.
7. Continue through a full Quick quest and confirm it feels like one complete short episode:
   - hook
   - development
   - complication
   - final push
   - resolution
8. Continue through portions of Standard and Full quests and confirm they have more breathing room without becoming aimless.
9. Run the same or similar quest setup across Easy, Medium, Hard, and Extreme and compare the prose:
   - Easy should be shorter, clearer, and more concrete
   - Medium should be slightly richer but still very accessible
   - Hard should be fuller and more developed
   - Extreme should be the richest but still upper-elementary, not middle-school level
10. Confirm Easy mode does not produce long dense scenes or overly complex vocabulary simply because the quest length is Standard or Full.
11. At every scene, inspect all 3 choices and confirm each one is explicitly supported by what the scene actually says.
12. Specifically look for invalid choices such as:

- “follow” when nobody has gone anywhere
- “use” an object that was never introduced
- “ask” a character who is not present
- “enter” a place that was never mentioned

13. Confirm later chapters keep advancing the same central problem rather than introducing unrelated main plots.
14. Confirm the final chapter resolves the central problem before the ending scene.
15. Test multiple quest themes and hero types to make sure improvements are not theme-specific.
16. Confirm story text is slightly larger and easier to read on desktop.
17. Confirm story text remains readable and layout-safe on mobile/narrow width.
18. Confirm math is still generated and checked only by deterministic app code.
19. Confirm a full quest can still reach a coherent ending.

After editing:

- Show the diff.
- Run npm run build.
- Run any available tests/validation scripts.
- Summarize exactly what changed in:
  - quest length definitions
  - challenge-level reading-complexity handling
  - episode planning
  - pacing rules
  - story continuation context
  - action-choice grounding rules
  - font sizing
- Explain what context is now sent to later story prompts.
- Explain how the selected action is enforced in the next scene.
- Explain how the system prevents scene choices from relying on unstated details.
- Explain how story reading complexity differs between Easy, Medium, Hard, and Extreme.
- Explain how pacing differs between Quick, Standard, and Full.

Prompt 2:
Implement the remaining Florida B.E.S.T. math generator expansions across all four MathQuest Live challenge bands, and improve in-quest math variety so students do not keep seeing the same kind of question when other eligible skills are available.

Before editing, inspect the current math generator system, the expansion plan, the grade-level reference docs, the problem-selection flow, duplicate-prevention logic, recovery-problem flow, metadata validation, and the current documentation. Explain your implementation plan before making changes.

Do not rewrite the whole app.

Primary source of truth:

- artifacts/mathquest-live/docs/BEST_DOMAIN_EXPANSION_PLAN.md

Also inspect:

- artifacts/mathquest-live/docs/references/CURRENT_BEST_BENCHMARK_USAGE.md
- artifacts/mathquest-live/docs/references/3RD_GRADE_BEST_STANDARDS_REFERENCE.md
- artifacts/mathquest-live/docs/references/4TH_GRADE_BEST_STANDARDS_REFERENCE.md
- artifacts/mathquest-live/docs/references/5TH_GRADE_BEST_STANDARDS_REFERENCE.md
- artifacts/mathquest-live/src/math/floridaBestMath.ts
- artifacts/mathquest-live/src/mathEngine.ts
- artifacts/mathquest-live/src/validateMath.ts
- any existing question history, duplicate-prevention, selector, or recovery-problem logic
- README.md only if public-facing wording truly needs updating

Important context:
MathQuest Live uses challenge level as the standards band:

- Easy / Adventurer = Grade 3 Florida B.E.S.T.
- Medium / Hero = Grade 4 Florida B.E.S.T.
- Hard / Champion = Grade 5 Florida B.E.S.T.
- Extreme / Legend = advanced Grade 5 Florida B.E.S.T., still inside Grade 5 limits

Non-negotiable rules:

- Math must be generated and checked by deterministic app code, never by AI.
- Do not move Easy beyond Grade 3.
- Do not move Medium beyond Grade 4.
- Do not move Hard beyond Grade 5.
- Extreme must remain advanced Grade 5 only, not Grade 6.
- Do not add negative numbers, slope, linear equations, ratios/proportional reasoning beyond Grade 5 expectations, middle-school algebra, exponents beyond verified Grade 5 expression expectations, or probability/middle-school statistics content.
- Every generated problem must include correct benchmark metadata.
- Every generated problem must include a stable signature.
- Duplicate detection must continue to ignore shuffled answer-choice order.
- Every generated problem must provide a skill-specific first hint and second hint.
- Every answer set must contain exactly four unique choices.
- The correct answer must appear in the choices.
- Distractors should reflect common student misconceptions without being unfair.
- Recovery problems should also participate in repeat prevention and variety selection when possible.
- Student-facing UI should not display benchmark codes by default.
- Do not add accounts, databases, analytics, saved student data, or persistent progress.
- Do not expose secrets to the frontend.
- Keep the MVP simple.

FIRST: Audit before adding

1. Read BEST_DOMAIN_EXPANSION_PLAN.md fully.
2. Compare the plan against the current generator code and current benchmark-usage docs.
3. Identify:
   - generators already implemented
   - remaining verified generator gaps
   - plan items that should still be skipped because there is not a clear verified benchmark fit
   - any duplicate or overlapping generators that should not be added again
4. Use the current grade-level standards reference docs as the verified benchmark source.
5. If the plan and current code disagree because work has already been completed, trust the current code plus current reference docs and do not duplicate generators.
6. Do not implement any generator whose exact task shape is not supported by the verified reference docs. Instead, leave it out and list it in the final “Skipped / still needs verification” summary.

PART 1: Complete the remaining verified expansions by challenge band

EASY / ADVENTURER / GRADE 3
Use only verified Grade 3 benchmark mappings already available in the Grade 3 reference docs.

Review current Easy coverage first, then add only the remaining useful verified gaps from the plan, such as:

- rounding within Grade 3 expectations, using MA.3.NSO.1.4 if supported by the current reference docs
- broader measurement operations beyond the already-added length-only examples, using MA.3.M.1.2 where the task shape is verified
- any additional Grade 3 elapsed-time variety still supported by MA.3.M.2.2 and not already present
- any other Easy gap from BEST_DOMAIN_EXPANSION_PLAN.md that is verified, useful, and not already implemented

Keep Easy:

- mostly one-step
- lightly two-step only where already verified
- clear, concrete, and appropriate for Grade 3 students

MEDIUM / HERO / GRADE 4
Use only verified Grade 4 benchmark mappings already available in the Grade 4 reference docs.

Review current Medium coverage first, then add the remaining verified gaps from the plan where not already implemented:

- factors / prime / composite using MA.4.AR.3.1
- area and perimeter problem solving, including missing rectangle sides where appropriate, using MA.4.GR.2.1
- same-area / same-perimeter comparison problems if supported and useful, using MA.4.GR.2.2
- like-denominator fraction operations using MA.4.FR.2.2
- fraction decomposition or related Grade 4 fraction variety where useful and distinct, using MA.4.FR.2.1
- tenths and hundredths addition using equivalent fractions if the current references support the exact shape, using MA.4.FR.2.3
- fraction times whole number exploration if appropriate for Medium and verified, using MA.4.FR.2.4
- money with decimal notation using MA.4.M.2.2
- measurement conversion using MA.4.M.1.2
- data interpretation using MA.4.DP.1.2 and/or MA.4.DP.1.3
- decimal comparison/order to hundredths using MA.4.NSO.1.5
- any additional angle-reasoning variation still within MA.4.GR.1.3, without inventing new geometry categories under that benchmark

Keep Medium:

- within Grade 4 expectations
- varied, but not overloaded with Grade 5-style fraction complexity

HARD / CHAMPION / GRADE 5
Use only verified Grade 5 benchmark mappings already available in the Grade 5 reference docs.

Review current Hard coverage first, then add only remaining verified gaps from the plan where not already implemented:

- coordinate-plane basics using MA.5.GR.4.1 and MA.5.GR.4.2 if any useful lighter-weight gaps remain
- decimal comparison and rounding variety using MA.5.NSO.1.4 and MA.5.NSO.1.5 where not already covered
- fraction multiplication variety using MA.5.FR.2.2 where not already covered
- broader multi-digit whole-number operation problems using MA.5.NSO.2.1 and/or MA.5.NSO.2.2 only if the current reference docs clearly verify the exact task shapes
- geometry classification using MA.5.GR.1.1 and/or MA.5.GR.1.2 if verified and not already represented
- any other Hard gap from the expansion plan that is clearly Grade 5, verified, and distinct from Extreme

Keep Hard:

- Grade 5 appropriate
- generally one-step or lighter reasoning than Extreme
- not a dumping ground for multi-step Legend-style problems

EXTREME / LEGEND / ADVANCED GRADE 5
Deepen advanced Grade 5 reasoning while staying fully inside verified Grade 5 limits.

Review current Extreme coverage first, then add remaining verified gaps from the plan where not already implemented:

- advanced unlike-denominator fraction reasoning using MA.5.FR.2.1 and/or MA.5.AR.1.2 where the exact task shape fits
- decimal-to-thousandths multi-step reasoning using MA.5.NSO.2.3
- contextual remainder problems using MA.5.AR.1.1
- volume with missing dimension and simple equation language using MA.5.GR.3.3
- measurement conversion using MA.5.M.1.1
- money with decimal notation using MA.5.M.2.1
- coordinate-plane interpretation in context using MA.5.GR.4.2
- expressions / order of operations within Grade 5 limits using MA.5.AR.2.2

Keep Extreme:

- richer and more multi-step than Hard
- still Grade 5
- no exponents beyond verified expectations
- no nested grouping symbols if the reference excludes them
- no negative coordinates, slope, ratios, equations, or middle-school content

PART 2: Improve in-quest math variety, not just exact duplicate prevention

Goal:
When a student plays a quest, the app should prefer a broad rotation of math skills instead of repeatedly pulling the same kind of question while other eligible skills are still available.

Example:
If Easy currently has eligible skills such as subtraction within 1,000, multiplication word problems, division word problems, area/perimeter, fractions, elapsed time, place value, measurement, and data interpretation, the quest should not give two subtraction-within-1,000 problems before giving students a chance to see other available skill types.

Important design decision:
Do not use official Florida B.E.S.T. “domain” metadata as the gameplay rotation key. It is too broad for this purpose.

Use a gameplay-facing variety key instead:

- Prefer reusing an existing stable `skillId` if it already cleanly represents a student-visible problem family.
- If current `skillId` values are too granular or too broad for fair rotation, add a separate stable internal field such as `varietyGroup` or `rotationGroup`.
- This field is for selector behavior only and should not clutter the student UI.
- Examples of useful gameplay variety groups:
  - additionWithin1000
  - subtractionWithin1000
  - multiplicationWordProblem
  - divisionWordProblem
  - areaPerimeter
  - elapsedTime
  - placeValue
  - rounding
  - measurement
  - dataInterpretation
  - equivalentFractions
  - fractionOperations
  - decimalComparison
  - factorsPrimeComposite
  - coordinatePlane
  - volume
  - expressions

Implement session-only variety rotation logic:

1. Track which eligible variety groups have already appeared in the current quest.
2. When selecting the next problem, prefer unused eligible variety groups before reusing a previously used group.
3. Once all eligible groups for that difficulty have been used, begin a new cycle and allow groups to repeat.
4. Continue to avoid exact duplicate signatures within the quest when possible.
5. Recovery problems should also respect both signature prevention and variety rotation when possible.
6. If the pool is constrained and the selector cannot satisfy both rules, fail gracefully:
   - prioritize generating a valid question
   - avoid exact signature repeats when possible
   - allow group reuse only after reasonable attempts or after all eligible groups are exhausted
7. Do not let variety rotation make generation fragile or create infinite retry loops.
8. Keep all state session-only.

Implementation guidance:

- Inspect the existing question-selection and duplicate-prevention logic before changing it.
- Reuse existing history structures if practical rather than creating parallel systems.
- If helpful, create a small selector helper that accepts:
  - candidate problems or generators
  - used signatures
  - used variety groups in the current cycle
  - difficulty
    and returns a valid next choice with graceful fallback behavior.
- If there is already a clean central selection path, keep the logic centralized there.
- Do not scatter rotation logic across every generator.

PART 3: Metadata, validation, and docs

For every new generator:

- add benchmark metadata
- add stable signature fields
- add skill-specific first and second hints
- ensure exactly four unique choices
- ensure the correct answer is included
- ensure distractors match likely misconceptions
- ensure signatures remain stable regardless of shuffled choice order

Update documentation after implementation:

- artifacts/mathquest-live/docs/references/CURRENT_BEST_BENCHMARK_USAGE.md
- artifacts/mathquest-live/docs/BEST_DOMAIN_EXPANSION_PLAN.md
  - update implementation status for newly completed items
  - mark already-completed items accurately
  - list any skipped/unverified items that remain future work
- relevant grade-level reference docs only if a genuinely new verified benchmark needs to be added
- artifacts/mathquest-live/src/validateMath.ts only if new metadata or validation rules are required
- README.md only if public-facing standards wording actually changes

Do not inflate public standards claims. Keep wording conservative.

If the repo already has a validation or test pattern:

- add the smallest useful coverage for new generator invariants
- add focused coverage for the new variety-rotation behavior if practical
- do not introduce a large new testing framework just for this pass

PART 4: Required workflow

Before editing:

1. Run `git status`.
2. Inspect the files listed above.
3. Explain:
   - which generators are already present
   - which verified additions you plan to implement
   - which plan items you will skip because they are already done or still lack a clean verified benchmark fit
   - how you will implement variety rotation without confusing it with official benchmark domains

After editing:

1. Show the diff.
2. Run:
   - `npm run validate:math`
   - `npm run build`
3. If any available existing tests apply, run them too.
4. Summarize:
   - new generators added by difficulty
   - any already-complete items you intentionally did not duplicate
   - skipped / still-needs-verification items
   - how variety rotation works
   - what key is used for gameplay variety rotation
   - how exact duplicate prevention still works
   - how recovery problems participate
   - which docs changed
5. Commit all completed changes with a clear commit message.
6. Push the commit to the current branch to create a checkpoint.
7. If push fails, report the exact reason instead of claiming success.

Acceptance criteria:

- The app gains meaningful verified generator variety across Easy, Medium, Hard, and Extreme based on BEST_DOMAIN_EXPANSION_PLAN.md.
- No generator is duplicated if it already exists.
- No unverified benchmark/task-shape combination is invented just to fill a gap.
- Easy remains Grade 3.
- Medium remains Grade 4.
- Hard remains Grade 5.
- Extreme remains advanced Grade 5 only.
- Every new problem includes benchmark metadata, stable signature, skill metadata, skill-specific hints, exactly four unique choices, and the correct answer.
- Exact duplicate signatures are still avoided within a quest when possible.
- During a quest, the selector prefers unused gameplay variety groups before repeating a group when other eligible groups remain.
- The selector does not give two of the same gameplay problem family back-to-back early in a quest if there are still unused eligible families available.
- Once all eligible variety groups are exhausted, the selector may begin a new cycle while still avoiding exact signature repeats when possible.
- Recovery questions participate in repeat prevention and variety rotation where possible.
- Variety rotation is session-only and does not require saved data, accounts, or persistence.
- Student-facing UI remains uncluttered by benchmark codes.
- `npm run validate:math` succeeds.
- `npm run build` succeeds.
- Documentation reflects the new current state accurately.
- Changes are committed and pushed as a checkpoint.

Manual test checklist:

1. Run the app and start an Easy quest long enough to sample several math questions.
2. Confirm Easy questions rotate across different gameplay skill families before repeating one when alternatives are available.
3. Confirm Easy questions remain Grade 3 appropriate.
4. Repeat the same check for Medium, Hard, and Extreme.
5. For each difficulty, verify newly added generators appear in normal play.
6. For each difficulty, answer several questions correctly and confirm story progression still works.
7. Intentionally answer a question incorrectly and verify hints and recovery behavior still work.
8. Confirm recovery questions avoid exact repeats and prefer a different available variety group when possible.
9. Confirm no quest repeats the exact same problem signature when alternatives exist.
10. Confirm answer-choice shuffling does not bypass duplicate detection.
11. Confirm every rendered problem has four unique answer choices and includes the correct answer.
12. Confirm new hints are specific to the skill rather than generic filler.
13. Confirm Extreme problems feel harder than Hard through richer Grade 5 reasoning, not through Grade 6 content.
14. Confirm student-facing screens do not suddenly show benchmark codes.
15. Confirm `npm run validate:math` passes.
16. Confirm `npm run build` passes.
17. Confirm updated docs match the actual implemented state.

Prompt 3:
Before editing, inspect the entire MathQuest Live repository and all existing project documentation, then explain your audit plan before making any changes.

Read these project docs first if they exist:

- README.md
- MATHQUEST_CONTEXT.md
- DECISIONS_AND_GUARDRAILS.md
- CURRENT_ROADMAP.md
- CODEX_WORKFLOW.md
- STANDARDS_ALIGNMENT_NOTES.md
- any existing audit, plan, or handoff markdown files

Then inspect the actual codebase, including at minimum:

- frontend React/Vite/TypeScript app
- backend Node/Express/TypeScript API
- AI story prompt and safety logic
- math generation/checking code
- optional image generation flow
- environment variable handling
- Docker/deployment files
- README and user-facing info/settings content
- any tests, validation scripts, and package.json scripts

This is an audit pass, not a feature implementation pass.

Do not rewrite the whole app.
Do not make broad refactors.
Do not add accounts, databases, analytics, saved progress, or persistent student data.
Do not move math generation or answer-checking into AI.
Do not add freeform student story input.
Do not expose API keys or secrets to the frontend.
Keep Extreme / Legend within advanced Grade 5 Florida B.E.S.T. limits, not Grade 6+.

Your job is to perform a fresh, honest audit of the current state of the project and create a prioritized report of what is:

1. already solid
2. risky or broken
3. worth improving before public release
4. nice to have later

Audit the app across these areas:

## 1. Security, privacy, and abuse resistance

Review:

- whether secrets stay backend-only
- frontend/backend environment variable exposure
- CORS configuration
- request validation and trust boundaries
- API input limits
- duplicate request protection
- rate limiting / public cost-abuse protection
- timeout and fallback handling for AI calls
- unsafe error leakage
- dependency vulnerabilities
- security headers / Express production hardening
- whether generated AI content is safely constrained
- whether any student data is stored, logged, or unnecessarily exposed
- whether optional image generation is controlled from safe metadata only
- any prompt injection or output-trust issues in the AI story flow

Run and report:

- npm audit, if available/appropriate
- any existing lint/test/build/validation commands
- npm run build

Do not install new packages just to complete the audit unless absolutely necessary.

## 2. Classroom safety and product guardrails

Check whether the code and prompts actually enforce the stated product rules:

- classroom-safe ages 8–11
- no gore, death, romance, profanity, horror, drugs/alcohol/vaping, sexual content, real-world politics, real-world religion, bullying, stereotypes, or personal information requests
- danger remains cartoon-adventure danger only
- all student actions remain button/card based
- no freeform story input
- fallback content is safe and usable
- fantasy identity language uses ancestry/species/class appropriately and avoids harmful implications

Identify:

- places where safety is enforced in code
- places where safety is only implied by wording
- any gaps between the docs and actual implementation

## 3. Playability and game loop quality

Play through the app mentally from title screen to ending and inspect the code for:

- whether the setup flow is clear and complete
- whether the core loop can dead-end
- whether incorrect math answers recover cleanly
- whether quest length, challenge level, and story progression work together logically
- whether story choices feel meaningful enough
- whether the player is ever blocked by AI failure, duplicate clicks, stale responses, missing state, or image generation
- whether repeated math questions are prevented in-session
- whether the ending and reward loop feel satisfying enough for MVP
- whether the app is realistically usable in a classroom center, whole-class display, or early-finisher context

Flag:

- any gameplay dead ends
- any confusing or fragile states
- any cases where the app technically works but would feel bad to a student

## 4. Math correctness and standards alignment

Inspect:

- math generation logic
- answer checking
- hints/recovery
- metadata on generated problems
- challenge-level mapping to grade bands
- benchmark usage
- Extreme / Legend content boundaries

Verify whether:

- math is deterministic and app-generated
- benchmark metadata is present and internally consistent
- challenge levels match the intended Florida B.E.S.T. bands
- Extreme stays advanced Grade 5 only
- any problem types seem mislabeled, duplicated, too narrow, or outside the intended band
- there are obvious content gaps that hurt playability or variety

If the repo already contains validation scripts, run them and report the result.
Do not invent or change benchmark mappings in this pass unless you are documenting a clear discrepancy.

## 5. Reliability and failure handling

Review:

- duplicate-click/request protection
- stale async response handling after restart/reset
- story API timeout handling
- fallback scenes/choices
- optional image generation failure behavior
- loading states
- error states
- restart/replay flow
- session-only state reset behavior

Identify which reliability issues are:

- already solved
- partly solved
- still missing
- especially important before public deployment

## 6. UX, mobile, and accessibility

Review:

- mobile layout
- info/settings placement
- scroll/transition behavior
- tap target size
- keyboard accessibility
- visible focus states
- aria labels
- reduced-motion handling
- clarity of setup copy
- readability of story/math screens
- whether important buttons are easy to find
- whether any screen feels visually crowded, jumpy, or overly tall

Note any issues that would especially affect:

- a student on a Chromebook
- a student on a phone/tablet
- a teacher projecting the game to a class

## 7. Deployment and operational readiness

Review:

- Dockerfile
- docker-compose
- .env.example
- production build flow
- GHCR/deployment assumptions
- whether config is environment-driven
- whether README gives enough accurate deployment guidance
- whether the app is safe enough to expose publicly behind NGINX Proxy Manager / Cloudflare
- any missing production checks before public release

## 8. Code quality and maintainability

Review:

- duplicated logic
- oversized components/files
- unclear boundaries between frontend/backend
- naming consistency
- whether the code is easy to extend safely
- whether current architecture still fits MVP
- places where the project is getting brittle
- any technical debt that should be fixed soon versus later

## Required output

Create a new markdown file in the repo root named:

`PROJECT_AUDIT_YYYY-MM-DD.md`

Use today’s actual date in the filename.

The report should include these sections:

1. Executive Summary
2. Overall Readiness Verdict
   - Classroom demo readiness
   - Private/home deployment readiness
   - Public internet deployment readiness
3. What Is Already Strong
4. Critical Issues
5. High-Priority Recommended Changes
6. Medium-Priority Recommended Changes
7. Low-Priority / Later Ideas
8. Security and Privacy Audit
9. Classroom Safety Audit
10. Playability Audit
11. Math and Standards Audit
12. Reliability Audit
13. UX / Mobile / Accessibility Audit
14. Deployment Audit
15. Code Quality / Maintainability Audit
16. Recommended Next Prompt Order
17. Commands Run and Results
18. Final Conclusion

For every finding, include:

- severity: Critical / High / Medium / Low / Note
- evidence: exact file paths and relevant functions/components when possible
- why it matters
- recommended fix
- whether it should happen before public release, before wider classroom use, or later

Also include:

- a concise scorecard table for each major area
- a prioritized “do these next” list of no more than 10 items
- a section called “Things I would not change yet” to prevent overbuilding
- a section called “Docs vs. Code Mismatches” if any exist

## Important audit behavior

Be skeptical.
Do not assume earlier recommendations were implemented correctly just because docs mention them.
Verify the current code.
If a prior issue is now fixed, explicitly say so.
If a recommendation from the docs no longer makes sense, say so.
If something is subjective, label it as judgment rather than fact.
Prefer concrete evidence over vague impressions.

Do not make code changes during this pass except:

- creating the audit markdown file
- fixing obvious typos in the audit file itself

After creating the audit:

- show the diff
- run npm run build
- run any existing relevant test or validation scripts
- run npm audit if appropriate
- summarize the most important findings in chat
- state the exact path of the audit file
- list the top 5 next changes you recommend in priority order

Acceptance criteria:

1. You inspect both code and documentation before writing conclusions.
2. You create exactly one new audit report file named `PROJECT_AUDIT_YYYY-MM-DD.md`.
3. The audit is evidence-based and cites specific files/functions/components where possible.
4. The audit covers security, privacy, classroom safety, playability, math/standards, reliability, UX/mobile/accessibility, deployment, and maintainability.
5. The audit clearly distinguishes critical issues from later polish.
6. The audit identifies any mismatches between existing docs and current code.
7. No unrelated code changes are made.
8. `npm run build` is executed and the result is reported.
9. Existing relevant validation scripts are executed if available and the result is reported.
10. The final chat summary includes the top 5 recommended next changes.

Manual test checklist:

1. Start the app from the title screen and complete the full setup flow.
2. Begin a short quest and advance through multiple story/math cycles.
3. Intentionally answer at least one math problem incorrectly and confirm recovery is supportive.
4. Restart/reset mid-session and confirm stale responses do not affect the new session.
5. Simulate or inspect behavior for story API failure/timeout.
6. Inspect the app at mobile width and desktop width.
7. Confirm info/settings controls do not block core UI.
8. Confirm no freeform student story input exists.
9. Confirm challenge levels map to the intended grade bands.
10. Confirm Extreme / Legend does not drift into Grade 6 content.
11. Confirm AI-generated story text is not trusted to generate or solve math.
12. Confirm optional image generation failure would not block gameplay.
13. Confirm build succeeds with `npm run build`.

When finished, do not immediately implement the recommended fixes. Stop after the audit and let me decide which prompt to run next.
DO make sure to git commit and push all changes.
