Perform one large MathQuest Live consolidation pass covering setup-flow UI polish, MVP reliability hardening, public deployment protection, session-only gameplay polish, preset expansion, app info/about updates, documentation, and menu sound behavior.

Final Status: COMPLETED

This is intentionally a large multi-part pass. Work carefully, in the order listed below. Before editing, inspect the relevant frontend, backend, math, image, docs, environment, audio, preset-data, and deployment files and explain your implementation plan for the full pass before making changes.

Important workflow:

1. Run git status first and note the starting state.
2. Inspect before editing.
3. Do not rewrite the whole app.
4. Prefer small, surgical changes over broad refactors.
5. Complete the work in the order listed below so foundational reliability changes are in place before later polish.
6. If you discover that one later subtask is much larger or riskier than expected, finish the safe earlier work, clearly report the blocker, and do not make speculative mega-refactors.
7. Keep all student-facing behavior classroom-safe and session-only.
8. After all changes, run the full build and any available validation scripts.
9. At the end, show the diff, summarize all completed work, then git add, git commit, and git push the completed changes.

Project context:
MathQuest Live is a classroom-safe AI math adventure game for upper elementary students.

Students:

1. Move through a Chronicler-style setup flow.
2. Choose preset hero options only.
3. Choose a quest length and challenge level.
4. Pick from AI-generated action choices.
5. Solve app-generated math before the story advances.
6. Finish with an ending and session-only summary/reward.

Architecture:
Frontend:

- React/Vite/TypeScript under artifacts/mathquest-live

Backend:

- Node/Express/TypeScript under artifacts/api-server

Core product rules:

- No student accounts.
- No database.
- No analytics.
- No ads.
- No saved student data.
- No persistent progress.
- No freeform student story input.
- All student story actions must be button/card based.
- Math must be generated and checked by deterministic app code, not AI.
- AI may write story scenes and choices only.
- OpenAI API keys must stay backend-only.
- Keep all settings session-only.
- Keep MVP simple.

Standards model:

- Easy / Adventurer = Grade 3 Florida B.E.S.T.
- Medium / Hero = Grade 4 Florida B.E.S.T.
- Hard / Champion = Grade 5 Florida B.E.S.T.
- Extreme / Legend = advanced Grade 5 Florida B.E.S.T. content still within Grade 5 limits
- Do not add a separate student-facing grade selector.
- Do not let Extreme drift into Grade 6 or middle school content.

Safety model:
AI story output must remain classroom-safe for ages 8–11.
Do not allow:

- gore
- death
- romance
- profanity
- horror
- drugs/alcohol/vaping
- sexual content
- realistic weapons harming people
- bullying
- stereotypes
- real-world politics
- real-world religion
- personal information requests

Allowed:

- cartoon adventure danger
- puzzles
- magical obstacles
- friendly monsters
- storms
- mysteries
- unstable machines

==================================================
PART 1: SETUP-FLOW UI POLISH
==================================================

Status: COMPLETED

Goal:
Tighten the Chronicler setup screen layout so it fits more cleanly on normal laptop-height viewports, remove the oversized uniform panel-height behavior on short-content steps, and fix the selected-state badge so it never overlaps option titles.

Context:
Recent screenshots of the Chronicler setup flow show two UI issues that should be fixed before continuing feature work.

Issue 1: The setup panel is staying much taller than its content needs on short-content steps.
Examples:

- On the challenge-level screen and quest-length screen, the main bordered panel contains the actual option cards near the top, then a very large empty purple area below them.
- This appears to be preserving a large shared/fixed/minimum panel height across setup steps even when the current step does not need that much height.
- That empty space is not helping the design. It makes the layout feel oversized and pushes the Back and Continue buttons partially below the visible viewport even on a normal laptop screen.
- I do NOT want the panel forced to remain the same tall height across every setup step just for visual consistency. On shorter-content steps, the panel should shrink to fit the content more naturally.

Issue 2: The "Selected" badge overlaps card title text.
Example:

- On the quest-length screen, the "Selected" badge covers part of the "Standard Quest" title.
- This appears to be caused by the badge being overlaid/absolutely positioned without reserved layout space.

Required behavior:

- Short-content setup steps should no longer keep a giant mostly-empty panel just to match taller setup steps.
- The setup panel should be allowed to size more naturally to the content of the current step.
- It is acceptable and preferred for the bordered panel to be shorter on steps with less content.
- Do NOT preserve a tall same-height panel across all steps if that is what is causing the blank lower region.
- Some controlled variation in panel height from step to step is better than a large empty panel that pushes important controls below the fold.
- The challenge-level and quest-length screens should look intentionally compact rather than like content is stranded at the top of an oversized container.
- Back and Continue should be visible more comfortably within a typical laptop viewport on short-content steps.
- The design should still feel grand/fantasy-themed, just a little less vertically oversized.
- Do not make everything tiny.

Inspect:

- whether the setup panel has a fixed height, shared min-height, viewport-derived height, or another rule that keeps it much taller than the current step content requires
- whether that rule was added to keep all setup steps visually the same height
- outer setup page spacing
- title block spacing
- title font sizing
- progress indicator spacing
- main setup panel padding
- option-grid/card spacing
- placement of Back/Continue navigation buttons
- desktop, laptop-height, tablet, and mobile breakpoints
- how the selected badge is positioned inside option cards
- whether the badge is absolutely positioned
- card title/header structure
- behavior for both short and long option titles

Preferred implementation:

- Remove or reduce any unnecessary fixed height / excessive min-height / forced shared-height rule on the setup panel if present.
- Prefer content-based height for setup panels where practical.
- If some minimum height is still needed for visual balance, keep it modest and responsive rather than large enough to create a giant empty lower half.
- Slightly reduce vertical spacing in the setup flow:
  - top margin/padding
  - title block gaps
  - progress section spacing
  - panel vertical padding
  - option-card padding/gaps where appropriate
- Use responsive sizing such as clamp() where helpful.
- Add a compact-height adjustment for shorter viewports if useful, such as an @media (max-height: ...) rule, so shorter laptop browser windows get slightly tighter spacing without affecting roomy screens.
- Keep option cards readable and comfortably tappable/clickable.
- Put title and selected badge into a real card-header layout row using flex/grid rather than overlay positioning.
- Reserve space for the badge in normal document flow.
- Use gap and flex-shrink behavior so the badge stays legible.
- Allow clean wrapping when needed on narrower cards rather than overlap.
- If a title wraps, it should wrap naturally without colliding with the badge.

Do not solve this by:

- applying a blanket transform scale()
- making font sizes too small
- hiding navigation
- forcing awkward scrolling just to preserve empty space
- keeping the panel artificially tall solely so every setup step has the same box height
- breaking the already-improved mobile header/transition behavior

Acceptance criteria:

1. On the challenge-level setup screen, the main bordered panel no longer contains a large unnecessary empty lower region when the content does not need it.
2. On the quest-length setup screen, the panel shrinks to a more content-appropriate height instead of preserving the same oversized height as taller steps.
3. The setup flow no longer appears to force all steps to share one tall panel height purely for visual consistency.
4. Back and Continue are visible more comfortably within a typical laptop viewport on short-content steps.
5. The layout is visibly slightly more compact, but not miniature or visually cheapened.
6. The "Selected" badge no longer overlaps "Standard Quest" or any other option title.
7. Selected badges remain readable and visually aligned across all option cards.
8. Mobile/narrow layouts still work correctly.

==================================================
PART 2: MENU SELECTION SOUND BEHAVIOR
==================================================

Status: COMPLETED

Goal:
Fix the existing selection sound effect so it plays consistently whenever the player makes a menu-style selection, rather than only once on the initial "Begin Quest" interaction.

Context:
There is already a sound effect that plays when clicking "Begin Quest" on the first page, but it does not continue to play for later selections. The desired feel is similar to a classic Final Fantasy-style menu, where each confirmed selection gives a small satisfying UI sound.

Inspect:

- existing audio assets
- current sound-effect helper/hook/component if any
- where the Begin Quest sound is triggered
- whether browser autoplay/user-gesture unlocking is involved
- setup option card click handlers
- Continue / Back buttons if relevant
- story action card selection handlers
- any settings/audio controls already present

Required behavior:

- Reuse the existing selection sound if possible.
- Once the user has interacted with the app, the selection sound should play reliably on later valid menu-style selections.
- At minimum, play the selection sound when the user:
  - clicks Begin Quest
  - selects setup choices such as name/pronouns/ancestry/class/theme/color/challenge/quest length
  - confirms or moves through meaningful setup actions where it fits the current UI pattern
  - selects a story action choice
- Do not play sounds for disabled buttons or invalid interactions.
- Do not stack or overlap sounds excessively on rapid repeated clicks.
- Do not add a new settings system unless one already exists and can be used naturally.
- Do not add persistence. Any audio state remains session-only.
- Preserve browser compatibility and avoid breaking the first-interaction audio unlock behavior.

Preferred implementation:

- Centralize the selection sound trigger in a small reusable helper/hook if one does not already exist.
- Ensure audio can be replayed repeatedly by resetting currentTime or using the existing app pattern appropriately.
- If browser gesture restrictions matter, preserve the initial user-gesture unlock, then allow later legitimate selections to replay the sound.
- Use the same subtle menu-selection sound consistently enough to make the UI feel responsive, not noisy.

Acceptance criteria:

1. The existing selection sound still plays on Begin Quest.
2. The same selection sound also plays on later valid setup selections.
3. The selection sound plays when choosing a story action card.
4. The sound can replay across multiple selections in one session.
5. Invalid/disabled interactions do not trigger it.
6. Rapid clicks do not create ugly audio overlap or duplicate advancement.
7. No persistent audio preference is added.

==================================================
PART 3: EXPAND APPROVED HERO PRESETS
==================================================

Status: COMPLETED

Goal:
Add more approved ancestry/species choices and more approved class choices to broaden variety in the Chronicler setup flow while preserving the no-freeform-input safety model.

Inspect:

- current approved ancestry/species preset list
- current approved class preset list
- how preset choices are stored, typed, rendered, randomized, and passed into story generation
- any associated prompt instructions, labels, icons, descriptions, or story flavor metadata
- current visual capacity of the setup cards/grids on desktop and mobile

Implementation guidance:

- Analyze what ancestries/species and classes already exist.
- Add a sensible number of additional options that fit the current fantasy tone, upper-elementary audience, classroom-safety model, existing data structure, and visual layout.
- Choose additions that increase variety without becoming bizarre, dark, violent, or overly niche.
- Keep all options preset-only. Do not add freeform input.
- Use ancestry/species language, not race.
- If randomized Quick Start is implemented later in this pass, include the new options in the same approved preset pools.
- Update any relevant labels, types, data arrays, prompt guidance, tests, or docs that must remain in sync.
- If the option grid becomes visually crowded, adjust the responsive layout cleanly rather than cramming cards.

Acceptance criteria:

1. Additional approved ancestry/species choices are available in setup.
2. Additional approved class choices are available in setup.
3. All new choices are age-appropriate, classroom-safe, and fit the existing fantasy tone.
4. No freeform student input is introduced.
5. Existing setup, rendering, and randomization behavior continue to work.
6. New options are represented wherever the approved preset pools must be kept in sync.

==================================================
PART 4: APP INFO / ABOUT SECTION AND PUBLIC LINKS
==================================================

Status: COMPLETED

Goal:
Update the in-app Info/About section with useful public project information and creator links, styled cleanly within the current MathQuest Live aesthetic.

Inspect:

- existing Info button/modal/panel implementation
- current content inside the Info section
- current icon/button/component system
- current footer/about patterns if any
- responsive behavior on mobile
- README content that should stay consistent with public-facing app info

Required content to add to the in-app Info/About section:

1. A short support callout with a Buy Me a Coffee link:
   - URL: https://buymeacoffee.com/hallveticapro
   - Suggested text: "Enjoying MathQuest Live?" and a button/link such as "Buy Me a Coffee"
2. A social / project-links section with links to:
   - GitHub: https://github.com/hallveticapro/math-quest-live
   - Threads: https://www.threads.net/@hallveticapro
   - Instagram: https://www.instagram.com/hallveticapro
   - TikTok: https://www.tiktok.com/@hallveticapro
3. A creator tagline:
   - "Made for educators with love by Andrew Hall ❤️"
4. A copyright line:
   - Use the current project year if one is already established in the app/docs; otherwise use 2026.
   - Example: "© 2026 MathQuest Live"

Design guidance:

- Use the attached reference screenshots only as style inspiration:
  - a warm support callout/card with a Buy Me a Coffee-style button
  - a compact social-links section
  - a simple tagline/copyright footer
- Adapt the design to MathQuest Live's existing fantasy palette and components rather than copying Yap-O-Meter styling literally.
- Make links open safely in a new tab with appropriate rel attributes.
- Use accessible labels for icon-only links if icons are used.
- Prefer existing icon/component dependencies. Do not add a whole new dependency just to get a Threads icon if a tasteful text link or existing pattern is cleaner.
- Keep it polished but not salesy or distracting. This is an info modal, not Times Square.

README requirements:

- Update the README to include:
  - what MathQuest Live is
  - current core features after this pass
  - the Buy Me a Coffee link
  - the same social/project links where appropriate
  - creator attribution/tagline
  - copyright
  - any new environment variables added in this pass
  - any relevant deployment/rate-limit/image behavior notes added elsewhere in this pass
- Keep README accurate to the current implemented state, not aspirational.

Acceptance criteria:

1. The in-app Info/About section includes the Buy Me a Coffee link.
2. The Info/About section includes GitHub, Threads, Instagram, and TikTok links.
3. The creator tagline and copyright appear cleanly.
4. Links are accessible and safely opened.
5. The Info/About section remains responsive and visually consistent with the app.
6. README is updated to match the actual app after this pass.

==================================================
PART 5: DUPLICATE-CLICK AND REQUEST GUARDS
==================================================

Status: COMPLETED

Goal:
Prevent duplicate requests and double-advances during setup start, story action selection, math answer submission, correct-answer resolution, and play again/restart.

Inspect:

- current frontend request flow
- setup start flow
- story action request flow
- math answer submission and correct-answer resolution
- play again / restart / reset behavior
- any current state flags used for loading
- any race conditions where React state alone may be too slow
- stale response behavior after restart/reset/setup change

Likely files:

- artifacts/mathquest-live/src/App.tsx
- artifacts/mathquest-live/src/pages/GameScreen.tsx
- artifacts/mathquest-live/src/pages/SetupScreen.tsx
- shared API/client files if present

Required behavior:

- Duplicate setup starts are prevented.
- Duplicate story action requests are prevented.
- Duplicate math answer resolutions are prevented.
- Stale responses must not be applied after reset/restart/setup changes.
- Relevant buttons should be disabled while their action is in flight.
- Guards must clear correctly after both success and failure.
- Existing game behavior must remain intact.

Preferred implementation:

- Add synchronous ref-based guards where React state alone is insufficient.
- Use request/version/session tokens or equivalent stale-response protection where needed.
- Clear guards in finally blocks.
- Keep the implementation narrow and understandable.

Acceptance criteria:

1. Rapid double-clicking cannot start multiple duplicate games.
2. Rapid double-clicking a story action cannot create duplicate turns.
3. Rapidly submitting math answers cannot double-resolve a turn.
4. Restarting/resetting cannot allow older async responses to overwrite the new session.
5. Existing game loop still works normally.

==================================================
PART 6: STORY-CALL TIMEOUT AND SAFE FALLBACK HANDLING
==================================================

Status: COMPLETED

Goal:
Wrap AI story generation calls with explicit timeout/fallback behavior so the app always returns safe classroom-friendly content if the model is slow, fails, or returns invalid output.

Inspect:

- backend start story calls
- continuation/turn story calls
- ending story calls
- current validation/safety fallback behavior
- openai client wrapper
- error handling and frontend-visible responses

Likely files:

- artifacts/api-server/src/routes/game/gameRoutes.ts
- artifacts/api-server/src/lib/openaiClient.ts
- artifacts/api-server/src/routes/game/storyPrompt.ts
- artifacts/api-server/src/routes/game/safety.ts
- .env.example
- README.md if appropriate

Tasks:

1. Add or confirm environment variable:
   STORY_TIMEOUT_MS=30000
2. Add it to .env.example and docs if not already present.
3. Implement a timeout helper using AbortController, Promise.race, or another clean approach.
4. Apply timeout handling to start, continue, and ending story generation calls.
5. Preserve existing validation/safety fallback behavior.
6. Students should see friendly safe fallback content, never raw OpenAI errors.
7. Log reason categories server-side only.
8. Make sure later optional image generation work does not reintroduce story blocking.

Acceptance criteria:

1. Story calls cannot hang forever.
2. Timeout returns safe fallback content.
3. Invalid or unsafe AI output still returns safe fallback content.
4. Technical errors are not exposed to students.
5. Backend logs enough server-side reason information for debugging without storing student data.

==================================================
PART 7: PUBLIC DEPLOYMENT COST AND RATE PROTECTION
==================================================

Status: COMPLETED

Goal:
Add simple, portable, MVP-friendly protection for AI-cost endpoints without adding accounts, database, analytics, or student tracking.

Inspect:

- Express app
- API routes
- CORS configuration
- environment variables
- Docker/README docs
- which endpoints incur AI/story/image cost

Likely files:

- artifacts/api-server/src/app.ts
- artifacts/api-server/src/index.ts
- artifacts/api-server/src/routes/game/gameRoutes.ts
- .env.example
- README.md
- docker-compose.yml if needed

Tasks:

1. Add configurable rate limiting to AI-cost endpoints.
2. Use env vars:
   RATE_LIMIT_ENABLED=true
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=60
   IMAGE_RATE_LIMIT_MAX_REQUESTS=20
   CORS_ORIGIN=\*
3. Add a friendly 429 JSON response.
4. Keep it portable and simple.
5. Do not store personal data.
6. Update docs with public deployment and cost protection notes.
7. Preserve local development behavior.
8. If there is an image-specific endpoint or image-generation path, apply a stricter image limit where appropriate.

Acceptance criteria:

1. AI-cost endpoints have configurable rate protection.
2. No accounts/database/analytics/student tracking are added.
3. Local development still works.
4. Public deployment settings are documented.
5. Friendly 429 responses are returned when limits are exceeded.

==================================================
PART 8: NON-BLOCKING OPTIONAL IMAGE GENERATION
==================================================

Status: COMPLETED

Goal:
Make optional AI image generation non-blocking so story text can appear without waiting for image completion.

Inspect:

- current image-generation flow
- pending-turn flow
- API routes
- frontend image component
- current story generation flow
- environment controls for image generation
- temporary/disposable image handling

Likely files:

- artifacts/api-server/src/images/\*
- artifacts/api-server/src/routes/game/gameRoutes.ts
- artifacts/mathquest-live/src/App.tsx
- artifacts/mathquest-live/src/components/SceneImage.tsx

Rules:

- Do not add database or permanent image storage.
- Do not expose API keys to frontend.
- Do not block gameplay on image generation.
- Preserve image environment controls.
- Image generation remains optional and backend-only.
- Failure must never block gameplay.

Desired behavior:

- Story text returns as soon as it is ready.
- Images may appear immediately if already ready, appear later through a safe pending/polling mechanism if practical with the current architecture, or be skipped gracefully if slow/failed.
- The game should remain fully playable with image generation disabled, timing out, or failing.

Implementation guidance:

- Keep this MVP-friendly.
- Prefer the smallest clean mechanism that lets text render without awaiting image generation.
- If the current architecture makes true asynchronous later delivery too large for this pass, at minimum ensure story responses are not delayed by image generation and image failure is fully decoupled from gameplay; clearly document the chosen behavior.

Acceptance criteria:

1. Story text is not blocked by image generation.
2. Image failure never blocks gameplay.
3. Pending or missing images are handled gracefully.
4. Image generation remains optional and backend-only.
5. Existing image environment variables still control behavior.

==================================================
PART 9: SAFE MATH-SKILL METADATA INTO STORY CONTINUATION
==================================================

Status: COMPLETED

Goal:
Pass safe math skill metadata into story continuation so math feels more connected to the adventure without letting AI generate or solve math.

Inspect:

- current flow from math problem generation to story continuation
- math problem metadata structure
- turn continuation payload
- backend story prompt construction

Tasks:

1. Pass optional safe metadata like:
   lastMathSkill: {
   skillLabel,
   problemType,
   difficulty,
   gradeBand,
   storyFlavor
   }
2. Do not send correct answers to the AI.
3. Do not ask AI to generate, solve, or check math.
4. Do not show benchmark codes in student-facing story text.
5. Update backend prompt so AI may lightly and naturally echo the math skill flavor, but only as story flavor.
6. Keep this optional so story flow still works if metadata is absent.

Acceptance criteria:

1. AI receives only safe high-level skill metadata, not answer data.
2. Story prompt explicitly limits math metadata to flavor only.
3. AI still does not generate or validate math.
4. Story continuation still works if metadata is missing.

==================================================
PART 10: END-OF-QUEST SKILL SUMMARY AND REWARD POLISH
==================================================

Status: COMPLETED

Goal:
Add a compact end-of-quest session-only skill summary and improve ending reward polish.

Inspect:

- EndingScreen
- game state
- mathSolved tracking
- skill metadata tracking
- badge/title logic if any
- quest completion flow

Required summary content:

- challenge level
- quest length
- math challenges completed
- skill categories practiced
- optional badge/title earned

Rules:

- Do not save student data.
- Do not add accounts/database/analytics.
- Keep summary session-only.
- Do not show benchmark codes to students by default.
- Keep it compact and celebratory, not like a teacher dashboard.

Preferred behavior:

- Summarize unique skill labels or student-friendly categories practiced during the session.
- Avoid duplicate spam if the same skill appears many times.
- Badge/title should be lightweight and derived from session behavior only.

Acceptance criteria:

1. Ending screen shows a compact session-only summary.
2. Summary includes challenge level, quest length, completed math challenges, and skills practiced.
3. No benchmark codes are shown to students by default.
4. Nothing is saved after refresh/restart.
5. Ending screen still feels like a game reward, not a report card.

==================================================
PART 11: QUICK START / RANDOMIZE HERO
==================================================

Status: COMPLETED

Goal:
Add a Quick Start / Randomize Hero option to speed up classroom launch while preserving the full Chronicler setup flow.

Inspect:

- Chronicler setup flow
- setup state
- random option data
- game start flow
- color scheme system
- updated ancestry/species and class preset pools from Part 3

Preferred flow:

- student chooses Challenge Level
- student chooses Quest Length
- student can click “Randomize Hero and Begin”

Randomize only from approved presets:

- name
- pronouns
- ancestry/species
- class
- adventure theme
- color scheme

Rules:

- Do not remove the existing full Chronicler setup.
- Do not add freeform input.
- Do not randomize from unapproved values.
- Keep all settings session-only.
- Use ancestry/species language, not race.
- Include any new ancestry/species and class presets added in this pass in the approved randomization pools.

Desired behavior:

- Quick Start is clearly optional.
- It should meaningfully reduce setup time for centers or short blocks.
- It should not undermine the fantasy presentation of the app.

Acceptance criteria:

1. Full Chronicler setup still works unchanged.
2. Quick Start provides a faster approved-preset path.
3. Randomized values come only from existing safe preset pools.
4. Randomized color scheme works with the live/session-only color system.
5. No freeform input is introduced.

==================================================
PART 12: STANDARDS DOCUMENTATION INVENTORY ONLY
==================================================

Status: COMPLETED

Goal:
Analyze the current Florida B.E.S.T. benchmark usage in MathQuest Live and create documentation based on the current codebase. This is documentation only, not standards correction or generator expansion.

Do not:

- change app behavior
- modify math generators
- change benchmark mappings
- add new standards
- invent official wording
- claim verification that has not happened

Create:
artifacts/mathquest-live/docs/CURRENT_BEST_BENCHMARK_USAGE.md

Include for every Florida B.E.S.T. benchmark code currently used:

- benchmark code
- current description used by the app
- challenge/difficulty band
- grade band
- skill label
- skill id if present
- problem types
- generator functions
- example problem shape
- usage location in code
- current domain/strand metadata if present
- potential concerns
- next verification steps

Also create:
artifacts/mathquest-live/docs/BEST_DOMAIN_EXPANSION_PLAN.md

Include:

- current coverage
- underrepresented areas
- suggested future expansion order
- guardrails
- implementation prompt groups
- reminder that Extreme remains advanced Grade 5 only
- note that official benchmark wording must be verified separately before formal standards claims

Acceptance criteria:

1. CURRENT_BEST_BENCHMARK_USAGE.md is created from actual current code usage.
2. BEST_DOMAIN_EXPANSION_PLAN.md is created without changing app behavior.
3. No app code or benchmark mapping is changed as part of this documentation task.
4. Documentation is conservative and does not falsely claim official verification.

==================================================
PART 13: FUTURE IMPROVEMENTS BACKLOG
==================================================

Status: COMPLETED

Goal:
Create or update FUTURE_IMPROVEMENTS.md based on the current project state.

Do not:

- implement these features now
- install packages
- turn this into a product roadmap full of overbuilding

Include:

1. Teacher/debug benchmark display
2. Sound on/off setting
3. More fallback scene and ending variants
4. More reward moments
5. Teacher launch presets
6. Skill-focus quest packs
7. Server-side math sessions only if assessment use emerges
8. Teacher dashboards, rosters, or saved progress only after privacy/auth design

For each item, include:

- purpose
- why later
- likely files/areas
- privacy/safety notes
- implementation risks

Acceptance criteria:

1. FUTURE_IMPROVEMENTS.md exists or is updated.
2. It reflects the current MVP guardrails.
3. It does not imply that dashboards/accounts/persistence belong in the current MVP.

==================================================
GLOBAL REQUIREMENTS
==================================================

Throughout all work:

- Preserve classroom safety.
- Preserve session-only behavior.
- Preserve backend-only OpenAI use.
- Preserve deterministic app-generated math.
- Preserve challenge-level-to-grade-band model.
- Preserve mobile responsiveness.
- Preserve existing Chronicler aesthetic.
- Preserve deployment compatibility with Docker/GHCR/Unraid.
- Do not hardcode domains.
- Do not add localStorage.
- Do not add student tracking.
- Do not add analytics.
- Do not add a database.
- Do not create freeform student input.
- Do not move math generation or checking into AI.
- Do not expose secrets to frontend code.
- Do not introduce Grade 6+ content.
- Keep public-facing attribution/link additions appropriate and unobtrusive for a classroom-safe educational app.

==================================================
FINAL VALIDATION
==================================================

After editing:

1. Show the full diff.
2. Run:
   npm run build
3. If available, also run:
   npm run validate:math
4. Run any available backend/frontend tests or validation scripts.
5. Summarize exactly what changed in each numbered part.
6. Explain any part you intentionally did not complete and why.
7. Explain:
   - what caused the oversized blank lower panel area
   - whether a fixed height, min-height, or shared-height rule was removed/reduced
   - what caused the selected-badge overlap and how it was fixed
   - how the selection sound worked before and how repeated selection playback was fixed
   - what ancestries/species and classes were added and why they fit the existing preset system
   - what was added to the Info/About section
   - what README sections were updated
   - which duplicate flows are now guarded
   - how stale responses are prevented after restart/reset
   - how story timeout/fallback works
   - how rate limiting is configured
   - how optional image generation is now decoupled from story text
   - what safe math metadata is passed into story continuation
   - what the ending summary tracks
   - how Quick Start / Randomize Hero works
8. Confirm no prohibited persistence/accounts/analytics/database behavior was added.

Manual test checklist:

1. Open the challenge-level setup screen on a normal laptop viewport.
2. Confirm the bordered panel no longer keeps a giant unnecessary empty lower area.
3. Confirm Back and Continue are visible more comfortably without needing to scroll.
4. Open the quest-length screen on a normal laptop viewport.
5. Confirm its panel height now fits the content more naturally instead of matching an unnecessarily tall shared height.
6. Compare a short-content setup step with a taller-content step and confirm panel height is allowed to vary appropriately.
7. Select Standard Quest.
8. Confirm the "Selected" badge does not cover any part of the title.
9. Select Quick Quest and Full Quest.
10. Confirm their selected badges also look correct.
11. Test Easy, Medium, Hard, and Extreme.
12. Confirm badges do not overlap any difficulty titles.
13. Resize to a shorter viewport height and confirm spacing tightens gracefully.
14. Resize to mobile width and confirm no regressions in wrapping, spacing, tap targets, or existing header control behavior.
15. Click Begin Quest and confirm the existing selection sound plays.
16. Make multiple later setup selections and confirm the selection sound replays each time.
17. Select multiple story action cards across a quest and confirm the selection sound plays each time.
18. Confirm disabled/invalid interactions do not trigger sound.
19. Review the expanded ancestry/species and class choices and confirm they render cleanly on desktop and mobile.
20. Open the Info/About section and confirm:
    - Buy Me a Coffee link is present and works
    - GitHub, Threads, Instagram, and TikTok links are present
    - tagline appears as “Made for educators with love by Andrew Hall ❤️”
    - copyright appears correctly
    - links open safely and remain accessible
21. Rapidly double-click setup start and confirm only one game starts.
22. Rapidly double-click a story action and confirm only one turn begins.
23. Rapidly submit/resolve math and confirm no duplicate advancement occurs.
24. Restart during or after an in-flight request and confirm stale responses do not overwrite the new session.
25. Simulate or configure story timeout and confirm safe fallback content appears.
26. Trigger rate limit in development and confirm friendly 429 JSON response.
27. With image generation enabled, confirm story text appears without waiting on image completion.
28. With image generation disabled or failed, confirm gameplay continues normally.
29. Complete a quest and confirm ending summary shows challenge level, quest length, math challenges completed, skills practiced, and optional badge/title.
30. Use Quick Start / Randomize Hero and confirm all randomized values come from approved presets, including any newly added preset options.
31. Confirm full Chronicler setup still works normally.
32. Confirm no benchmark codes are shown to students by default.
33. Confirm docs files are created/updated correctly.
34. Confirm README accurately reflects the current app after this pass.
35. Run npm run build.
36. Run npm run validate:math if available.

==================================================
GIT FINALIZATION
==================================================

After all validation succeeds:

1. Run git status.
2. Stage all intended changes:
   git add .
3. Commit with a clear message such as:
   git commit -m "Polish setup flow and harden MVP gameplay"
4. Push the branch:
   git push
5. Report the final commit hash and branch name.
