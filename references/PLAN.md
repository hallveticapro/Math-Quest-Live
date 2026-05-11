# MathQuest Live Implementation Plan: End-State Polish, Rich Math Display, and Rich Embeds

## Purpose

This plan covers the next major batch of MathQuest Live improvements:

1. Make the outro screen use the same reliable mobile control layout as the rest of the app.
2. Lower default background music volume from 10% to 5%.
3. Add clear outro loading/writing verbiage while the ending is being generated.
4. Slow rotating Chronicle flavor text so students can comfortably read each line.
5. Keep the Exit confirmation control the same height as the normal Exit button.
6. Remove the redundant standalone pre-quest “Chronicler is writing” screen and transition directly into the quest-page loading state.
7. Add a lightweight rich-display layer for stacked fractions and simple data tables in math prompts.
8. Move the new `rich_embed.png` asset into the correct public location, add social/rich-embed metadata, and improve the app tagline.
9. Create an `references/UPDATES.md` log and begin maintaining it with timestamped entries for this batch and future changes.
10. Update `AGENTS.md` with durable new project knowledge learned during this batch, including the ongoing requirement to maintain `references/UPDATES.md`, so future coding sessions inherit the latest conventions and workflow rules.
11. Create a ChatGPT-oriented reference handoff in `references/` that captures the current state of the application for future planning sessions.
12. Add more student-facing ending variety and session-only rewards so completed quests feel more distinct.
13. Add a small action-consequence recap in story transitions so selected actions feel more meaningfully connected to the next scene.
14. Expand genre-specific fallback variety for scenes and endings.
15. Add a focused increment of math prompt variety within already verified benchmark coverage.

The goal is to improve clarity, polish, readability, and shareability without changing the product model, overbuilding the app, or weakening the deterministic math system.

---

# Global Instructions

Before editing, inspect the relevant existing components, state flow, styling, math data model, public assets, document metadata, and shared utilities, then explain your implementation plan.

## Non-Negotiable Rules

- Do not rewrite the whole app.
- Do not change the core game loop.
- Do not move math generation or answer checking to AI.
- Do not change standards alignment.
- Do not add accounts, login, database, analytics, ads, saved progress, localStorage, or persistent student data.
- Keep all settings session-only unless they are already explicitly designed otherwise.
- Do not expose secrets to the frontend.
- Do not add freeform student story input.
- Keep AI story output classroom-safe for ages 8–11.
- Preserve the existing Florida B.E.S.T. challenge-band model:
  - Easy / Adventurer = Grade 3
  - Medium / Hero = Grade 4
  - Hard / Champion = Grade 5
  - Extreme / Legend = advanced Grade 5 only, not Grade 6+

- Keep MVP simple.
- Prefer reusing existing shared components and patterns over adding one-off special cases.
- Preserve accessible labels, keyboard support, focus visibility, and reasonable mobile tap targets.
- Do not break Docker/production build.

## Required Git Workflow

Work through this plan section by section.

After completing each numbered part below:

1. Review the diff for that part.
2. Run whatever targeted validation is appropriate for that part.
3. Update `references/UPDATES.md` with a concise timestamped entry describing the completed change.
4. Create a git commit with a clear, part-specific message.
5. Do **not** push yet.

Only after **all** parts are complete, all required validation passes, and the final summary is ready:

1. Run the final full validation commands.
2. Push all accumulated commits once at the very end.

Do not collapse the entire batch into one commit. Do not push after each section.

Suggested commit messages are included under each part. They may be improved if a more accurate concise message is better.

## Required Validation After All Edits

Run:

```bash
npm run build
```

If any math code, math rendering, math generators, or math models change, also run the math validation script if available:

```bash
npm run validate:math
```

Show the final diff, summarize exactly what changed, and explain any important implementation decisions.

At the very end, after all section commits exist and validation passes:

```bash
git push
```

---

# Part 1: Make Outro Info/Settings Controls Consistent on Mobile

## Current Problem

On the outro/ending screen:

- The info button overlaps content on mobile like it previously did elsewhere.
- The settings icon disappears entirely.
- The ending screen does not feel consistent with the shared control treatment used on the rest of the app.

## Inspect First

Inspect:

- `EndingScreen`
- setup screen control layout
- game screen control layout
- any reusable responsive top-control/header utility created during earlier mobile fixes
- relevant CSS and mobile breakpoints
- how the info and settings buttons are currently rendered on each major screen

## Required Changes

1. Reuse the existing shared responsive control/header pattern if one already exists.
2. Make the ending screen use the same visual and layout treatment as the rest of the app.
3. Ensure both info and settings controls are visible on the outro screen.
4. Ensure neither control overlaps:
   - ending card
   - title
   - ending image
   - reward/summary content
   - buttons

5. Ensure controls remain tappable, aligned, and not clipped on narrow screens.
6. If the ending screen currently uses bespoke floating placement, replace that one-off approach with the shared layout pattern instead of adding another special case.

## Acceptance Criteria

- On mobile widths, both info and settings controls are visible on the outro screen.
- Neither control overlaps ending content.
- Outro controls visually match the shared pattern used elsewhere in the app.
- Desktop layout remains polished.
- Accessibility labels and keyboard usability remain intact.

## Section Commit

Suggested commit message:

```bash
git commit -m "Fix outro controls on mobile"
```

---

# Part 2: Lower Default Background Music Volume to 5%

## Current Problem

Background music currently starts at 10%, which is still slightly too loud for classroom use.

## Inspect First

Inspect:

- music/audio state defaults
- settings UI defaults
- any shared audio config or music controller
- whether music and navigation sound effects are truly separate settings

## Required Changes

1. Change the fresh-session default background music volume from 10% to 5%.
2. Preserve the user’s ability to adjust music volume during the current session.
3. If music and navigation sound effects are separate, change only music.
4. Do not add persistence.

## Acceptance Criteria

- Fresh sessions start with background music at 5%.
- Existing session-only music controls still work correctly.
- Navigation sound effects are not unintentionally changed if they use a separate setting.
- No persistent storage is added.

## Section Commit

Suggested commit message:

```bash
git commit -m "Lower default music volume"
```

---

# Part 3: Add Clear Outro Loading/Writing Messaging

## Current Problem

The intro/start flow already explains that the Chronicle is writing the story and that it may take a few seconds. The ending flow can also require waiting, but it does not communicate that as clearly.

## Inspect First

Inspect:

- intro loading/writing state
- outro/ending generation flow
- ending image blocking behavior
- current loading copy and rotating flavor text system

## Required Changes

1. Add student-facing loading/writing verbiage to the ending generation flow.
2. Match the tone and visual style of the existing intro loading state.
3. Make it clear that the Chronicle is writing the ending and it may take a few seconds.
4. Keep the text short, thematic, classroom-safe, and student-friendly.
5. Show this state while the ending story is pending, before the finished ending appears.
6. If ending image generation intentionally blocks until ready, preserve that behavior and make the wait feel intentional.

## Suggested Tone Examples

These are examples only. Reuse or improve them if a better existing pattern already exists:

- “The Chronicle is writing your ending…”
- “Every great quest needs a final page. This may take a few seconds.”

## Acceptance Criteria

- Students see a clear ending-generation message while waiting.
- The message feels consistent with the intro/start flow.
- No confusing blank or half-loaded ending state remains.
- The final ending still appears normally once ready.

## Section Commit

Suggested commit message:

```bash
git commit -m "Add outro loading messaging"
```

---

# Part 4: Slow the Rotating Chronicle Flavor Text

## Current Problem

The rotating Chronicle flavor text during writing/loading states changes too quickly. Students do not have quite enough time to comfortably read each line before it switches.

## Inspect First

Inspect:

- the rotating flavor text component or hook
- where the cycle interval is defined
- fade/transition timing
- whether intro and outro share the same implementation

## Required Changes

1. Slow the text rotation to a calmer, more readable pace.
2. Target roughly 4–5 seconds per line unless the current animation structure suggests a nearby equivalent that better preserves the existing transition timing.
3. Keep existing fade/transition polish if already present.
4. Avoid abrupt snapping between lines.
5. Apply the improved pacing consistently anywhere the same Chronicle loading/flavor-text system is used, including intro and outro if shared.

## Acceptance Criteria

- Each flavor line remains visible long enough for an upper-elementary student to read comfortably.
- The cycle feels calmer and more intentional than before.
- Fade/transition behavior still looks smooth.
- Shared intro/outro flavor text uses consistent timing if both rely on the same system.

## Section Commit

Suggested commit message:

```bash
git commit -m "Slow Chronicle flavor text rotation"
```

---

# Part 5: Keep Exit Confirmation the Same Height as the Normal Exit Button

## Current Problem

The normal Exit button looks fine. When clicked, it changes into the inline confirmation state:

`Exit? Yes | No`

That confirmation version becomes taller than the original Exit button, which causes a small layout jump and looks visually awkward.

## Inspect First

Inspect:

- the existing Exit button component
- the inline confirmation markup/state
- button sizing, padding, line-height, min-height, display mode, and mobile styles

## Required Changes

1. Preserve the current inline confirmation behavior exactly.
2. Make the confirmation state occupy the same overall height as the normal Exit button.
3. Preserve good mobile tap targets for Yes and No.
4. Avoid layout shift when toggling between the normal and confirmation states.
5. Prefer a shared fixed/min-height or layout solution that keeps both states visually aligned rather than hand-tuning one state in isolation.

## Acceptance Criteria

- Clicking Exit still reveals the inline `Exit? Yes | No` confirmation.
- The control remains the same height before and after it is clicked.
- Nearby layout does not jump when the confirmation state appears.
- Yes and No remain easy to tap on mobile.

## Section Commit

Suggested commit message:

```bash
git commit -m "Stabilize exit confirmation height"
```

---

# Part 6: Remove the Redundant Pre-Quest Writing Screen

## Current Problem

After the student finishes all setup selections:

1. The app briefly shows a standalone screen saying the Chronicler is writing the story.
2. It fades away.
3. The app transitions to the quest page.
4. The quest page immediately shows another “Chronicler is writing the story” loading state.

Now that the quest-page loading state includes clearer wait messaging, the standalone intermediary screen is redundant and makes the flow feel repetitive.

## Inspect First

Inspect:

- the final setup submission flow
- the transition from setup into quest/game view
- any dedicated pre-quest loading screen component/state
- where story generation begins
- cover-image waiting behavior
- transition/fade logic

## Required Changes

1. Remove the separate intermediary pre-quest writing/loading screen.
2. After the final setup selection is confirmed, transition directly into the quest page’s existing loading state.
3. Keep the improved quest-page loading message and rotating Chronicle flavor text there.
4. Preserve story-generation kickoff logic.
5. Preserve cover-image waiting behavior.
6. Preserve transition polish where practical.
7. Ensure there is no flash of blank content, no duplicate writing message, and no broken animation during the transition.

## Acceptance Criteria

- After the final setup choice, the student goes directly into the quest page loading state.
- The standalone duplicate pre-quest writing screen no longer appears.
- The quest page still clearly communicates that the story is being written and may take a few seconds.
- Story generation, cover image behavior, and the first playable scene still work correctly.
- The transition feels simpler and less repetitive than before.

## Section Commit

Suggested commit message:

```bash
git commit -m "Remove duplicate pre-quest loading screen"
```

---

# Part 7: Add a Lightweight Rich Math Display Layer

## Purpose

Improve math readability without changing deterministic math generation or building an overpowered formatting engine.

This pass should support:

1. Visually stacked fractions instead of only inline slash text such as `2/6`.
2. Simple readable tables for small datasets instead of dense prose such as “the gem table has keys: 6, stars: 5...”.

## Design Principle

Prefer structured display metadata from deterministic app code over fragile string guessing.

Do not try to globally parse arbitrary math text with broad regex replacements if the app can instead provide a small typed display model for the visual aid each problem needs.

## Inspect First

Inspect:

- `mathEngine`
- `src/math/floridaBestMath.ts`
- math problem type definitions
- question rendering components
- answer-choice rendering
- generators that currently output slash-style fractions
- generators that currently describe compact datasets in prose
- existing benchmark metadata, skill labels, problem types, signatures, and validation logic

## Required Architecture

Add a minimal optional rich-display model to the math problem shape. The exact naming is flexible, but it should remain small, typed, and intentional.

A concept like this is acceptable if it fits the current architecture:

```ts
richDisplay?: Array<
  | { type: "fraction"; numerator: number | string; denominator: number | string; ariaLabel?: string }
  | { type: "table"; headers: string[]; rows: Array<Array<string | number>>; caption?: string }
>
```

or another similarly small typed approach.

Requirements:

- Keep the existing plain-text prompt available as a fallback/debug representation.
- Do not add a generic markdown renderer.
- Do not add a heavy math-typesetting library unless absolutely necessary.
- Do not make AI responsible for math formatting.
- Do not attempt to convert every generator in one broad sweep if only some currently benefit.

---

## Part 7A: Stacked Fraction Rendering

### Current Problem

Fractions currently appear as inline slash text such as `2/6`. This works, but stacked notation is easier for students to scan and more closely matches classroom presentation.

### Required Changes

1. Create a small reusable React/CSS fraction display component.
2. Render numerator over denominator with a clear horizontal bar.
3. Preserve an accessible text equivalent such as “2 over 6” or another meaningful aria label.
4. Use structured fraction display metadata from generators/problem data rather than blindly replacing every slash expression in arbitrary strings.
5. Convert the problem types that clearly benefit in this pass.
6. Consider mixed numbers if they already exist in current generators. If unsupported in this pass, preserve their current text rendering rather than breaking them.

### Acceptance Criteria

- Supported fraction problems show visually stacked fractions in the student-facing prompt.
- Stacked fractions remain clear on mobile and desktop.
- Screen readers receive meaningful fraction text.
- Existing deterministic answer checking is unchanged.
- Problems without rich fraction metadata still render normally.

---

## Part 7B: Simple Table Rendering

### Current Problem

Some data questions currently describe a table in prose, such as:

- “The gem table has keys: 6, stars: 5...”

When the student is meant to interpret a small dataset, an actual table would be clearer.

### Required Changes

1. Create a small reusable math table display component.
2. Support simple compact tables generated by app code, such as two-column row tables or other small datasets already present in the generators.
3. Use structured table metadata from deterministic generators rather than parsing prose.
4. Render accessible table markup with headers where appropriate.
5. Update only the current problem types that clearly benefit from table rendering in this pass.
6. Avoid showing the exact same data redundantly in both sentence form and table form unless needed for clarity or accessibility.

### Acceptance Criteria

- Supported table-based problems display as actual tables.
- Tables are responsive and readable on mobile.
- Tables use accessible headers or labels.
- Existing deterministic math logic remains unchanged.
- Problems without table metadata continue to render normally.

---

## Part 7C: Preserve Math Metadata and Validation

For every updated generator/problem type:

- preserve difficulty
- preserve `gradeBand`
- preserve `standardsSystem`
- preserve benchmark code and description
- preserve `skillLabel`
- preserve `problemType`
- preserve stable `signature` behavior
- preserve unique answer choices
- preserve correct answer generation and checking
- preserve hint/recovery behavior if already present

Do not change the educational target of a problem just to make the display prettier.

## Acceptance Criteria

- Math validation still passes.
- Rich display is a display improvement only, not a content drift.
- No generator loses standards metadata or deterministic checking behavior.

## Section Commit

Suggested commit message:

```bash
git commit -m "Add rich math display support"
```

---

# Part 8: Add Rich Embed Metadata and Improve Public Tagline

## Current Problem

A new file named `rich_embed.png` has been added to the project root, but it still needs to be moved into the correct production-served asset location and wired into metadata so shared links look good in platforms such as:

- Discord
- Facebook
- Threads
- X / Twitter
- other apps that consume Open Graph or Twitter Card metadata

The current public-facing tagline should also be rewritten to be more memorable and compelling.

## Inspect First

Inspect:

- the new root-level `rich_embed.png`
- `index.html`
- any existing `<title>`, description, Open Graph, Twitter Card, canonical, or social metadata
- current public-facing tagline/description copy in the app, info modal, README, or metadata
- Vite/public asset structure
- production deployment notes or existing canonical URL config before choosing absolute metadata URLs

## Required Changes

1. Move `rich_embed.png` out of the project root into the appropriate public/static asset location so it is served correctly in production.

2. Remove the root-level copy after moving it.

3. Add complete, sensible rich-embed metadata for social previews using the moved image, including at minimum:
   - standard description metadata
   - Open Graph title
   - Open Graph description
   - Open Graph type
   - Open Graph image
   - Open Graph image width and height if known from the asset
   - Twitter card type
   - Twitter title
   - Twitter description
   - Twitter image

4. Include canonical URL metadata if the project already has a reliable production URL documented or configured.

5. Use absolute URLs for share-preview images if the project already has a known production URL available in repo/config/docs. Do not invent a domain if none is established.

6. Make sure the embed image path works with the actual deployed base path, especially if the app is served from a subpath.

7. Rewrite the current tagline to a stronger, catchier line and use it consistently wherever that tagline appears.

8. Use this tagline unless a better existing project voice clearly suggests an even stronger equivalent:

   **“Where math practice becomes an adventure.”**

9. For richer metadata descriptions, use concise copy that clearly explains the product, such as:

   **“A classroom-safe AI math adventure where students solve real problems to move the story forward.”**

10. Keep all public-facing copy educator-friendly, student-safe, and free of overclaiming.

## Acceptance Criteria

- `rich_embed.png` is no longer stranded in the project root.
- The app serves the rich embed image correctly from its production asset path.
- Shared links have appropriate Open Graph metadata for Discord/Facebook/Threads-style previews.
- Shared links have appropriate Twitter Card metadata for X/Twitter-style previews.
- Metadata does not use broken or obviously incorrect asset URLs.
- The updated tagline is catchier, clear, and used consistently where appropriate.
- Existing app behavior is otherwise unchanged.

## Section Commit

Suggested commit message:

```bash
git commit -m "Add rich embed metadata and update tagline"
```

---

# Part 9: Create and Begin Maintaining `references/UPDATES.md`

## Purpose

Create a lightweight running project log so future work has a clear chronological record of what changed, when it changed, and why. This should become a durable repo habit going forward, not a one-time batch note.

## Required Changes

1. Create a new file named `references/UPDATES.md` if it does not already exist.
2. Use it as a concise chronological update log for meaningful project changes.
3. Add an entry for every numbered part completed in this batch.
4. Going forward, every meaningful future change should add a new entry before the related commit is created.
5. Each entry must include:
   - a timestamp
   - a concise summary of what changed
   - enough detail to be useful later without becoming a full changelog essay

6. Prefer newest entries first unless the existing repo style strongly suggests the opposite.
7. Use a consistent, unambiguous timestamp format. Prefer ISO 8601 with timezone offset, for example:

```md
## 2026-05-10T21:14:00-04:00

- Fixed outro controls on mobile so info/settings match the shared layout.
```

8. Do not duplicate every line of a git diff. `references/UPDATES.md` should be a readable project journal, not a second commit log.

## Acceptance Criteria

- `references/UPDATES.md` exists.
- It contains a timestamped entry for each completed part of this batch.
- Entries are concise, chronological, and useful for future reference.
- The file establishes a clear format that can be continued after this batch.

## Section Commit

Suggested commit message:

```bash
git commit -m "Add project update log"
```

---

# Part 10: Update `AGENTS.md` With New Durable Project Knowledge

## Purpose

`AGENTS.md` should remain the best concise source of truth for future coding agents working in the repo. After completing the implementation work above, update it with any new **durable** information learned during this batch that would help future sessions work correctly and avoid rediscovering the same details.

## Inspect First

Inspect:

- the current `AGENTS.md`
- any adjacent repo docs that define project conventions or architecture
- the actual implementation completed in Parts 1–9
- any newly introduced shared components, display models, asset locations, metadata patterns, and UI/loading-flow conventions

## Required Changes

1. Update `AGENTS.md` only with information that is likely to remain useful in future sessions.
2. Add or revise guidance for any newly established conventions from this batch, such as:
   - the shared responsive treatment for info/settings controls, if this batch confirms or extends it
   - the session-only default background music volume if that is useful repo context
   - the intended loading-flow behavior after setup and during outro generation
   - the shared Chronicle flavor-text timing behavior if it now has a defined convention
   - the existence and intended use of any new rich math display model/components for stacked fractions and tables
   - where rich embed/social preview assets live and how metadata should be handled
   - the requirement to update `references/UPDATES.md` after every meaningful future change before committing
   - the expected `references/UPDATES.md` entry style and timestamp convention
   - any other durable architectural or workflow details that future agents should know

3. Do **not** dump temporary implementation notes, one-off debugging history, or verbose change logs into `AGENTS.md`.
4. Keep the file concise, practical, and easy to scan.
5. Preserve existing important guardrails and project rules unless the implementation shows that an update is genuinely required.

## Acceptance Criteria

- `AGENTS.md` reflects the important new stable conventions learned from this batch.
- The additions are concise and useful for future coding agents.
- The file does not become a changelog or duplicate the full README.
- Existing project guardrails remain intact.

## Section Commit

Suggested commit message:

```bash
git commit -m "Update agent guidance for latest conventions"
```

---

# Part 11: Create ChatGPT Planning Reference Documentation in `references/`

## Purpose

Create repo-based reference documentation that can be uploaded back into ChatGPT later so future planning sessions have an accurate, current picture of MathQuest Live without needing to reconstruct the app from scattered commits or stale memory.

This documentation is **not** the same thing as `AGENTS.md`:

- `AGENTS.md` should stay concise, repo-local, and focused on instructions for coding agents working inside the repository.
- The new `references/` documentation should be more explanatory and handoff-oriented, written for ChatGPT to understand the application well enough to help plan future edits, audits, prompts, and roadmap decisions.
- `references/UPDATES.md` remains the chronological change log. The new ChatGPT reference docs should describe the current state, architecture, decisions, and conventions rather than duplicate every timestamped change.

## Inspect First

Inspect the repo after all prior parts are complete, including:

- `AGENTS.md`
- `references/UPDATES.md`
- existing files under `references/`
- README and any existing docs
- frontend and backend folder structure
- current setup flow, game flow, outro flow, audio behavior, image-generation behavior, and math engine
- current generator coverage and standards model
- deployment/config files
- any important shared components or newly added display models from this batch

## Required Changes

1. Create a new ChatGPT-oriented handoff/reference document in `references/` if an equivalent file does not already exist.
2. Prefer one clear, comprehensive primary file that is easy for the user to upload into ChatGPT later, such as:

```txt
references/CHATGPT_PROJECT_HANDOFF.md
```

3. If a similarly purposed file already exists, update it instead of creating a redundant duplicate.
4. Write the document so a future ChatGPT session can quickly understand the current app well enough to help plan future changes accurately.
5. Include concise but useful sections covering at least:
   - what MathQuest Live is
   - the current product boundaries and non-negotiables
   - the actual current tech stack and repo structure
   - the end-to-end student flow
   - what AI does vs. what deterministic app code does
   - challenge levels and Florida B.E.S.T. standards-band model
   - current math system architecture and any rich-display support now present
   - current story/image/audio behavior
   - important UX conventions and shared UI patterns
   - key files/directories a future planner should know
   - deployment/runtime assumptions
   - current known limitations, sharp edges, or recently resolved issues that matter for planning
   - how `AGENTS.md`, `references/UPDATES.md`, and `references/` docs differ in purpose

6. Base the document on the **actual current repo state** after this batch, not on memory or outdated assumptions.
7. Keep it practical and specific. The goal is not marketing copy; it is to help future ChatGPT planning be accurate.
8. Avoid turning it into a duplicate README, a full changelog, or a dump of every file in the repo.
9. If existing docs in `references/` are stale, contradictory, or now incomplete because of this batch, update them where appropriate or note the newer source of truth in the new handoff doc.

## Acceptance Criteria

- A clear ChatGPT-oriented handoff/reference document exists in `references/`.
- The document accurately reflects the application after this batch of work.
- It is specific enough that a future ChatGPT session can use it to plan edits without having to rediscover the basics.
- It distinguishes current-state reference documentation from `AGENTS.md` and `references/UPDATES.md`.
- It does not merely copy README text or list commit messages.

## Section Commit

Suggested commit message:

```bash
git commit -m "Add ChatGPT project handoff reference"
```

---

# Part 12: Add More Student-Facing Ending Variety and Session-Only Rewards

## Purpose

Make completed quests feel more distinct and replayable by strengthening the ending/reward presentation with session-only details drawn from the quest the student just completed.

This is a student-facing polish enhancement only. It must not create reports, saved progress, teacher-facing views, analytics, or any persistent student data.

## Inspect First

Inspect:

- current ending generation flow
- current badge/reward logic and copy
- session-only story history available at the end of play
- practiced skill data available during the current session
- selected genre data
- any existing summary/reward components
- current outro image and ending copy behavior

## Required Changes

1. Make endings feel more distinct by strengthening badge/reward language.
2. Use data already available in the current session, such as:
   - story history
   - practiced skills
   - earned badge
   - selected genre

3. Add a few non-persistent, student-facing “quest moments” from the completed session if the current data model supports it cleanly.
4. Keep those moments concise and celebratory rather than report-like.
5. Prefer wording that feels like part of the adventure, not a classroom score report.
6. Keep all reward/summary content session-only.
7. Do not add saved progress, analytics, reports, dashboards, teacher views, accounts, or databases.
8. Do not expose benchmark codes or internal metadata in student-facing ending copy.

## Acceptance Criteria

- Endings feel more varied and tailored to the quest just completed.
- Badge/reward language is stronger and more satisfying than before.
- Any displayed quest moments are drawn only from the completed current session.
- The ending remains student-facing, celebratory, and not report-like.
- No persistent storage, teacher UI, analytics, or saved progress is added.

## Section Commit

Suggested commit message:

```bash
git commit -m "Add richer session-only ending rewards"
```

---

# Part 13: Add Small Action-Consequence Recaps in Story Transitions

## Purpose

Make math gating feel more integrated with the adventure by subtly reinforcing how the student’s selected action affected the story when the next scene appears after a correct answer.

## Inspect First

Inspect:

- current action-choice selection flow
- current scene-generation prompt/schema
- transition from a correct math answer into the next scene
- available selected-action and prior-scene data
- any current bridge text, recap text, or transition copy

## Required Changes

1. Add a small, student-facing action-consequence recap during or immediately before the next scene reveal after a correct answer.
2. Use the selected action and next scene context to reinforce cause and effect in a natural story way.
3. Prefer prompt/schema and display polish over building a new subsystem.
4. Keep the recap subtle and brief. It should connect the choice to the story, not interrupt the story.
5. Keep benchmark codes, generator IDs, and internal math metadata out of student-facing story text.
6. Preserve the existing action-choice model: all student actions remain button/card based, with no freeform input.
7. Keep classroom-safe tone and grade-appropriate readability.

## Acceptance Criteria

- After a correct answer advances the story, the student receives a brief natural reminder of how their chosen action mattered.
- The transition feels more connected and less like math was bolted onto the story afterward.
- The recap does not expose benchmark codes or internal metadata.
- No new freeform input, analytics, reports, or persistent storage is added.

## Section Commit

Suggested commit message:

```bash
git commit -m "Add action consequence story recaps"
```

---

# Part 14: Expand Genre-Specific Fallback Variety

## Purpose

Improve reliability polish so AI fallback moments feel less repetitive and more genre-aware when fallback content is needed.

## Inspect First

Inspect:

- current fallback scene logic
- current fallback ending logic
- current genre model/options
- current safety filters and fallback content constraints
- whether fallback text is centralized or split across frontend/backend paths

## Required Changes

1. Replace or supplement single generic fallback templates with small controlled pools of genre-specific fallback scene lines and ending lines.
2. Cover each currently supported genre with appropriate, age-safe fallback variety.
3. Keep all fallback text:
   - classroom-safe
   - age-appropriate
   - nonviolent beyond cartoon adventure danger
   - button/card based where actions are involved
   - free of real-world politics, religion, romance, gore, profanity, drugs/alcohol/vaping, sexual content, bullying, stereotypes, and personal-data requests

4. Keep fallback content deterministic and app-controlled.
5. Avoid creating so many variants that the system becomes hard to maintain. Small thoughtful pools are enough.
6. Preserve existing recovery behavior and ensure fallback content remains usable if AI generation fails.

## Acceptance Criteria

- Fallback scenes and endings have noticeable genre-aware variety instead of feeling like the same template every time.
- All fallback text remains tightly controlled and classroom-safe.
- Fallback behavior remains reliable and button-based.
- No new AI dependency or unreviewed freeform fallback generation is introduced.

## Section Commit

Suggested commit message:

```bash
git commit -m "Expand genre-specific fallback variety"
```

---

# Part 15: Add a Focused Increment of Math Prompt Variety Within Verified Benchmarks

## Purpose

Continue improving replayability by adding more deterministic math prompt variation only where benchmark fit is already verified.

This section must stay intentionally focused. Add one coherent slice of new variety at a time rather than expanding every grade band or domain in one batch.

## Inspect First

Inspect:

- current generator coverage
- existing verified benchmark mappings and descriptors
- `BEST_DOMAIN_EXPANSION_PLAN.md` or the current equivalent verified planning reference if present
- recent audit findings and existing generator gaps
- math validation tooling
- current signature behavior and duplicate-avoidance logic

## Required Changes

1. Choose one focused target for this batch based on current verified gaps and highest usefulness, such as:
   - one grade band
   - one domain
   - or one tightly related set of already verified benchmarks

2. Add additional prompt/generator variations only where benchmark fit is already verified.
3. Keep every new generator:
   - deterministic
   - metadata-complete
   - signature-stable
   - standards-aligned
   - validated

4. Preserve the existing no-repeat/variety behavior so students do not receive repetitive near-duplicate questions when other domains are available.
5. Do not drift outside the current Florida B.E.S.T. challenge-band model.
6. Do not add unverified standards claims.
7. Do not add Grade 6+ content to Extreme / Legend.
8. If the best next increment is not obvious, use the existing verified planning docs and current coverage to select the smallest high-value expansion rather than broadening scope.

## Acceptance Criteria

- This batch adds a meaningful but bounded increment of math variety.
- Every new generator remains deterministic and benchmark-appropriate.
- Metadata, signatures, correct answers, distractors, and validation all remain intact.
- No standards drift or broad uncontrolled expansion occurs.
- `npm run validate:math` passes if available.

## Section Commit

Suggested commit message:

```bash
git commit -m "Add focused verified math prompt variety"
```

---

# Final Required Summary

After implementation, provide a concise report that explains:

1. How the outro info/settings layout was made consistent.
2. Where the music default lives and what changed.
3. When the new outro loading message appears.
4. Where flavor-text timing is defined and what it changed from/to.
5. How the Exit confirmation height was stabilized.
6. How the redundant pre-quest loading screen was removed without breaking generation flow.
7. What rich-display structure was added for math.
8. Which problem types now render stacked fractions.
9. Which problem types now render tables.
10. How plain-text fallback still works.
11. Why the rich-display approach avoids fragile string parsing.
12. Where `rich_embed.png` was moved.
13. Which metadata tags were added or updated for rich embeds.
14. What tagline changed from/to.
15. How `references/UPDATES.md` was structured and which batch entries were added.
16. What durable guidance was added or updated in `AGENTS.md`, including the ongoing `references/UPDATES.md` requirement.
17. What ChatGPT-oriented reference documentation was created or updated in `references/` and what it covers.
18. How ending variety/reward language was improved and what session-only data it uses.
19. How action-consequence recaps were added to story transitions.
20. What genre-specific fallback variety was added.
21. Which focused verified math-variety slice was chosen and why.
22. The list of section commits created.
23. Results of `npm run build` and `npm run validate:math` if available.
24. Confirmation that all commits were pushed only once at the very end.

---

# Manual Test Checklist

## Outro, Controls, and Audio

1. Open the app on desktop width and complete a quest.
2. Confirm the outro screen shows both info and settings controls correctly.
3. Open the app on a mobile/narrow width and complete a quest.
4. Confirm the info button does not overlap ending content.
5. Confirm the settings icon is visible and usable on the outro screen.
6. Confirm outro controls match the rest of the app visually.
7. Start a fresh session and confirm background music begins at 5% volume.
8. Adjust music volume manually and confirm the control still works.

## Loading and Transition Flow

9. Reach the ending flow and confirm a clear “story is being written” style message appears while the ending is pending.
10. Confirm rotating Chronicle flavor text is slower and comfortably readable.
11. Confirm flavor-text transitions still look smooth rather than abrupt.
12. Confirm intro and outro loading states use consistent flavor-text timing if they share the same implementation.
13. Complete all setup selections and confirm the app transitions directly into the quest page loading state.
14. Confirm the old standalone intermediary pre-quest “Chronicler is writing” screen no longer appears.
15. Confirm the quest-page loading state still shows the clearer wait messaging and rotating flavor text before the first scene loads.
16. Confirm the finished ending and ending image still render correctly.
17. Confirm there is no flash of blank content or duplicate loading state during setup-to-quest transition.

## Exit Control

18. Click the Exit button and confirm the inline `Exit? Yes | No` state stays the same height as the original button with no layout jump.
19. Confirm Yes and No remain easy to tap on mobile.

## Rich Math Display

20. Start or force a session that reaches supported fraction problems.
21. Confirm supported fractions render as visually stacked fractions in the prompt.
22. Confirm stacked fractions are clear on desktop.
23. Confirm stacked fractions are clear on mobile/narrow widths.
24. Inspect accessibility output or use a screen reader and confirm fractions remain understandable.
25. Start or force a session that reaches supported table/data problems.
26. Confirm supported prompts show a real table instead of only a dense text list.
27. Confirm tables are readable on desktop.
28. Confirm tables are readable on mobile without breaking layout.
29. Answer supported fraction questions correctly and incorrectly and confirm answer checking still works.
30. Answer supported table questions correctly and incorrectly and confirm answer checking still works.
31. Confirm unrelated problem types still render as expected.
32. Run math validation and confirm no generator/signature/answer regressions.

## Rich Embeds and Copy

33. Confirm `rich_embed.png` was moved out of the project root into the intended public/static asset location.
34. Confirm the moved image is reachable from the built app at the expected deployed path.
35. Inspect the rendered page metadata and confirm the intended description, Open Graph, and Twitter Card tags are present.
36. Confirm Open Graph image metadata points to the correct served image path.
37. Confirm Twitter image metadata points to the correct served image path.
38. Confirm the updated tagline appears correctly wherever the app intentionally surfaces it.
39. If practical, inspect a social preview or local metadata-preview tool output to confirm the embed tags are coherent.

## Documentation and Agent Guidance

40. Confirm `references/UPDATES.md` exists.
41. Confirm `references/UPDATES.md` includes a timestamped entry for every completed part of this batch.
42. Confirm the `references/UPDATES.md` format is concise, chronological, and easy to continue later.
43. Inspect `AGENTS.md` and confirm it includes any new durable conventions introduced by this batch.
44. Confirm `AGENTS.md` explicitly tells future agents to update `references/UPDATES.md` after every meaningful future change before committing.
45. Confirm the `AGENTS.md` updates are concise and do not read like a temporary changelog.
46. Confirm existing guardrails in `AGENTS.md` remain intact.
47. Confirm a ChatGPT-oriented handoff/reference document now exists in `references/`.
48. Confirm that document reflects the final post-batch repo state rather than stale assumptions.
49. Confirm the document clearly distinguishes its purpose from `AGENTS.md` and `references/UPDATES.md`.
50. Confirm the document is useful as a future planning handoff rather than a duplicate README or raw changelog.

## Ending, Story, and Fallback Enhancements

51. Complete at least two different sessions and confirm the ending/reward language feels more varied and tailored to the completed quest.
52. Confirm any quest moments shown on the ending screen are session-only, concise, and not report-like.
53. Confirm no teacher-facing UI, reports, analytics, saved progress, or persistent data were added with ending enhancements.
54. After a correct answer advances the story, confirm the next scene or transition includes a brief natural action-consequence recap.
55. Confirm action-consequence recap text does not expose benchmark codes or internal math metadata.
56. Trigger or inspect fallback content for multiple genres and confirm genre-specific fallback variety exists for scenes and endings.
57. Confirm fallback content remains classroom-safe, controlled, and button-based.
58. Confirm the focused math-variety work stayed within one bounded verified slice rather than sprawling across unrelated standards.
59. Confirm all newly added math generators are deterministic, metadata-complete, signature-stable, and validated.

## Regression Checks

60. Confirm info/settings controls still work correctly on setup and game screens after the outro fix.
61. Confirm mobile layout has no horizontal clipping or overlapping controls.
62. Confirm Back still works during setup if applicable.
63. Confirm story generation, cover image behavior, milestone images, and ending images still work as intended.
64. Confirm there are no console errors during setup, loading, gameplay, or outro.
65. Confirm `npm run build` succeeds.
66. Confirm `npm run validate:math` succeeds if available.
67. Confirm each numbered part has its own commit.
68. Confirm `references/UPDATES.md` was updated before each related commit.
69. Confirm no pushes occurred until the final end-of-batch push.

---

# Completion Standard

This batch is complete only when:

- all required changes above are implemented,
- each numbered part has its own clear commit,
- build and relevant validation pass,
- the diff has been reviewed,
- the final summary is provided,
- and all accumulated commits have been pushed once at the very end.
