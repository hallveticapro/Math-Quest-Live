# MathQuest Live Playability Review

## Review Date

May 9, 2026

## App Summary

MathQuest Live is a classroom-safe AI math adventure game for upper elementary students. Students move through a Chronicler-style setup flow, choose preset hero options, select a quest length and challenge level, then play a short AI-generated fantasy adventure.

The app keeps student interaction button-based: students do not type freeform story actions. The AI writes story scenes and exactly three safe action choices, while math problems are generated and checked by app code. Challenge levels map to Florida B.E.S.T. Mathematics standards bands. The MVP does not use student accounts, a database, analytics, ads, saved student data, or persistent progress.

## Current Architecture Overview

The frontend entry point is `artifacts/mathquest-live/src/main.tsx`, with root app state coordinated in `artifacts/mathquest-live/src/App.tsx`. Main screens live under `artifacts/mathquest-live/src/pages`, including `TitleScreen.tsx`, `SetupScreen.tsx`, `GameScreen.tsx`, and `EndingScreen.tsx`.

The backend entry point is `artifacts/api-server/src/index.ts`, with the Express app defined in `artifacts/api-server/src/app.ts`. API routes are mounted under `/api`; game routes live in `artifacts/api-server/src/routes/game/gameRoutes.ts`, and temporary generated images are served through the image route.

Math generation happens in `artifacts/mathquest-live/src/mathEngine.ts`. Standards-band metadata lives in `artifacts/mathquest-live/src/math/floridaBestMath.ts`. Math is deterministic app code, not AI-generated.

AI story generation happens only on the backend through `artifacts/api-server/src/lib/openaiClient.ts` and prompt builders in `artifacts/api-server/src/routes/game/storyPrompt.ts`. Safety validation and fallback behavior are handled in `artifacts/api-server/src/routes/game/safety.ts` and `gameRoutes.ts`.

Optional AI image generation exists under `artifacts/api-server/src/images`. It is backend-only, environment controlled, provider-based, and uses temporary memory storage.

Color schemes are centralized in `artifacts/mathquest-live/src/colorSchemes.ts` and applied through CSS custom properties. This is the right direction because theme values are not scattered through the app.

Game state is currently browser-session state in `App.tsx`. Setup state is local to `SetupScreen.tsx`. Used math problem signatures are tracked in memory during a quest and reset when a new quest starts or the page refreshes.

Deployment setup includes a Dockerfile, docker-compose file, `.env.example`, GHCR-oriented GitHub Actions workflow, and README deployment notes for Docker/Unraid/NGINX Proxy Manager.

## Student Experience Findings

Strengths:

- The app now feels much more like a real game than a form-driven prototype.
- The Chronicler setup, static intro image, color schemes, action choices, progress indicator, and fantasy writing tone create a clear identity.
- Students interact through preset buttons/cards only.
- The action -> math -> story loop is easy to understand.
- Hints and recovery support reduce frustration after wrong answers.
- Quest length choices give teachers some control over classroom timing.

Weaknesses:

- The setup flow may still be long for centers or quick review, especially if students want to start playing immediately.
- Story choices are safe, but they may not always feel deeply consequential because the core structure is still linear.
- Rewards are limited. There is not yet a strong sense of achievement beyond reaching the ending.
- Replayability depends mostly on AI variation, adventure seeds, and hero setup choices.

Recommendations:

- Add a compact “Quick Start” or “Randomize Hero” path for classrooms that need fast launch.
- Add end-of-quest badges, titles, or a “skills practiced” summary.
- Add small milestone rewards after a few successful math challenges.
- Keep future reward systems session-only unless a privacy design is added later.

## Chronicler Setup Flow Findings

Strengths:

- The setup flow is now one decision at a time instead of a large setup form.
- The intro image appears in the public asset folder and strengthens the first impression.
- Confirmation moments after choices make the setup feel more intentional.
- Back navigation exists and is important for student correction.
- Color scheme preview applies live during setup.
- The setup uses “ancestry/species” framing instead of “race,” which is better for classroom use.

Weaknesses:

- The app currently optimizes pacing by beginning story preparation before the setup flow is completely finished. This helps loading time, but stale prepared requests can still finish in the background if students go back and change backend-relevant choices.
- Removing the final summary improved speed, but it also removed a final “are these my choices?” checkpoint.
- Layout smoothness should still be manually checked on narrow Chromebook/tablet widths.

Recommendations:

- Keep the current faster setup path, but guard against stale prepared starts.
- Consider a compact writing-screen summary instead of a full extra confirmation screen.
- Add a synchronous “starting” lock so double clicks cannot start duplicate story requests.

## Color Scheme and Settings Findings

Strengths:

- Color schemes are centralized and session-only.
- Live preview during setup works with the intended MVP privacy model.
- In-game settings allow color scheme changes without resetting the quest.
- In-game settings allow challenge level changes during an active adventure.
- Difficulty changes preserve progress and should affect future math problems rather than already-solved ones.

Weaknesses:

- If difficulty is changed while a story turn is already being prepared, the prepared story may use the previous reading guidance for that one beat.
- Settings are currently simple, which is appropriate, but the app should make clear that challenge changes apply after the current math question.
- Solar Kingdom and Rose Crystal should be manually contrast-tested on actual screens because lighter schemes can be easier to get wrong.

Recommendations:

- Keep color and challenge settings session-only.
- Add or confirm clear “changes apply after this question” messaging during active math.
- Add a future teacher/debug setting for benchmark display, but keep it hidden from students by default.
- Manually test all color schemes for contrast, focus rings, and selected states.

## Florida B.E.S.T. Standards Alignment Findings

Current mapping:

- Easy / Adventurer maps to Grade 3 Florida B.E.S.T. math content.
- Medium / Hero maps to Grade 4 Florida B.E.S.T. math content.
- Hard / Champion maps to Grade 5 Florida B.E.S.T. math content.
- Extreme / Legend maps to advanced Grade 5 Florida B.E.S.T. content and should not move into middle school standards.

Strengths:

- The difficulty-band model is appropriate. The app does not need a separate student-facing “What grade are you?” selector.
- Generated problems include difficulty, grade band, standards system, benchmark code, benchmark description, skill metadata, problem type, and signature.
- README wording is conservative and does not claim exhaustive standards coverage.
- Benchmark metadata is not cluttering the student experience.

Weaknesses:

- Benchmark descriptions are intentionally conservative but still need CPALMS/FDOE verification before public release, formal standards reporting, or commercial standards claims.
- Current generator coverage is useful but not exhaustive. Each band needs more problem types to feel like a fuller review set.

Recommendations:

- Complete a CPALMS/FDOE benchmark verification pass before public standards claims.
- Keep benchmark descriptions cautious and teacher-readable.
- Expand generator coverage inside each grade band without changing the challenge-level model.

## Math Generation and Playability Findings

Strengths:

- Math is generated by code, not AI.
- Correct answers are calculated deterministically.
- Answer choices are shuffled and unique.
- Correct answers are included in the choices.
- Repeated-question prevention now uses stable signatures and ignores answer choice order.
- Used signatures are tracked in memory for the current quest and reset on a new quest/session.
- Recovery problems use deterministic generation and stay within an appropriate standards band.

Weaknesses:

- If generator variety is exhausted, the app can eventually fall back to a previously generated problem rather than crash. That is acceptable as a fail-safe, but it means generator variety still matters.
- Some standards-band areas are underrepresented.
- Difficulty changes during an active math question preserve the current problem, which is correct, but the prepared story tone may lag one turn.

Generator gaps to prioritize:

- Easy: more time, measurement, money, data, place value, and rounding.
- Medium: more area/perimeter, factors/multiples, fraction operations, and geometry.
- Hard: more coordinate plane, multi-digit operation, and decimal/fraction mixed reasoning.
- Extreme: more advanced Grade 5 multi-step problems that remain clearly below Grade 6.

## Hints and Feedback Findings

Strengths:

- Incorrect answers are handled supportively.
- Hints are skill-specific rather than one generic message.
- Hints are deterministic and not AI-generated.
- The recovery path can provide an easier problem after repeated difficulty.
- Feedback language has moved away from harsh “wrong/failed” phrasing.

Weaknesses:

- Feedback should be verified with keyboard and screen-reader behavior.
- The hint/feedback area should use live-region behavior where practical so assistive technology announces changes.
- Some hint types may still need refinement as more generators are added.

Recommendations:

- Add or confirm `aria-live="polite"` on the feedback/hint region.
- Keep hint text short and strategy-based.
- Add second hints for any new generator types as they are introduced.

## Story and Math Integration Findings

Strengths:

- The AI is instructed not to generate math.
- Difficulty influences story reading complexity and scene length.
- Story choices remain preset buttons.
- Benchmark codes are not shown in story text.

Weaknesses:

- The current story continuation flow does not appear to receive detailed math skill metadata in a strong way. It mostly receives action/story context and generic math-result language.
- Because of that, math can still feel somewhat bolted onto the adventure.

Recommendations:

- Pass safe, non-sensitive math metadata such as `skillLabel` or `problemType` into story continuation after math is solved.
- Do not pass benchmark codes into student-facing story prompts unless there is a specific teacher/debug mode.
- Use math metadata as light scene flavor only. The AI should never generate, check, or explain the math answer.

## AI Safety and Reliability Findings

Strengths:

- The system prompt includes strong classroom-safety rules.
- The AI is told not to request personal information.
- The AI is told not to generate math.
- Backend validation checks JSON shape, text lengths, safety rating, HTML tags, banned words, and exactly three choices.
- Invalid, unsafe, or failed AI output returns safe fallback content.
- Student story input remains button-only.

Weaknesses:

- Story-generation calls should have an explicit timeout/fallback wrapper, similar in spirit to image generation.
- Static banned-word validation is useful but imperfect. It can miss nuanced unsafe content and can also falsely reject safe text.
- Fallback scenes are safe but could become repetitive.

Recommendations:

- Add explicit timeouts for OpenAI story calls.
- Add more fallback scene variants by quest phase or adventure seed.
- Log invalid response reasons server-side only for debugging.

## Optional Image Generation Findings

Image generation exists and is optional.

Strengths:

- Image generation is off by default unless `ENABLE_IMAGE_GENERATION=true`.
- Image mode, provider, model, quality, size, style, timeout, and storage mode are environment-configurable.
- The provider abstraction is in place, with OpenAI as the current provider.
- The default image style is cartoon fantasy/storybook.
- Images are generated only on the backend.
- Generated images are stored temporarily in memory and served through backend image routes.
- Image prompts are built from controlled metadata and include kid-safe visual constraints.
- Image failure does not intentionally stop gameplay.

Weaknesses:

- Eligible image generation can still delay scene reveal because image generation is awaited before the response completes.
- Even though preparing scenes while students solve math hides some latency, fast students or slow image requests can still wait.
- `every_scene` mode could become expensive and slow if enabled.

Recommendations:

- Make image generation non-blocking after story text is ready.
- Add lightweight polling or return the scene first and attach images if ready.
- Keep `milestones` as the recommended mode.
- Document that public deployments should monitor image cost and latency.

## Game Pacing and Quest Length Findings

Current quest length labels:

- Quick Quest: 5 successful math challenges.
- Standard Quest: 8 successful math challenges.
- Full Quest: 10 successful math challenges.

Strengths:

- Quest length labels are classroom-friendly.
- Progress is visible during gameplay.
- Progress is based on successful math challenges, not setup screens or intro text.
- Standard Quest should fit typical 10-15 minute classroom use better than longer modes.

Weaknesses:

- AI and image latency can still stretch total activity time.
- Setup time can be significant if every student customizes carefully.
- Loading states are improved but should remain readable long enough for students.

Recommendations:

- Keep Quick/Standard/Full as the core model.
- Consider a fast “randomize and begin” option for centers.
- Add non-blocking images and story timeouts to protect pacing.

## Classroom Usability Findings

Strengths:

- No accounts, rosters, analytics, database, or saved progress.
- Students can use the app independently after minimal explanation.
- Preset choices keep the experience safe and fast.
- The app is appropriate for centers, early finishers, enrichment, intervention, or whole-class display.
- Reset/play-again behavior is session-only and classroom-safe.

Weaknesses:

- Public deployment can expose AI-cost endpoints unless protected by reverse proxy controls.
- If many students use the app at once, backend OpenAI/image latency and cost can rise quickly.
- There is not yet a teacher-facing skill focus option.

Recommendations:

- Add basic API cost/rate protection before exposing publicly.
- Add optional skill-focus controls later, still session-only.
- Keep all teacher controls stateless for MVP.

## Accessibility and Readability Findings

Strengths:

- Buttons and cards are generally large enough for upper elementary students.
- Focus and selected states have been improved.
- The app uses actual text for key feedback.
- The static intro image is a real asset and should use meaningful alt text.
- Dialog components provide a better accessibility baseline.

Weaknesses:

- Contrast should be manually checked across every color scheme.
- Feedback/hints should be announced clearly without relying only on color.
- Reduced-motion behavior should be checked for setup transitions and story fades.
- Easy scenes may still occasionally be too long if the model drifts.

Recommendations:

- Test keyboard-only setup and gameplay.
- Add or verify visible focus rings on every interactive card/button.
- Add `aria-live` where feedback changes dynamically.
- Keep Easy story scenes short and paragraph-broken.

## Technical Reliability Findings

Strengths:

- Game state is session-only and resets on refresh.
- Used math signatures reset on new quests.
- The math gate remains required before story progression.
- Backend fallback behavior prevents many AI failure modes from reaching students.

Risks:

- Rapid double-clicks on action choices or math answers could trigger duplicate requests because React state changes are not a synchronous lock.
- Prepared start/turn requests can become stale if choices or settings change while generation is in flight.
- Story OpenAI calls need explicit timeout handling.
- Image generation can still hold scene responses until image completion or timeout.
- `App.tsx` is doing a lot of orchestration and may become harder to maintain.
- Backend pending turns are in memory, which is fine for one Docker container but not for load-balanced multi-instance deployment.
- Math is client-side, which is fine for practice but not for graded assessment.

Recommendations:

- Add synchronous request guards with refs for action selection, math resolution, and setup start preparation.
- Add story-call timeout/fallback handling.
- Keep single-container deployment assumptions clear in README.
- Avoid moving math server-side unless the app later becomes assessment-oriented.

## Deployment Readiness Findings

Strengths:

- Dockerfile uses a production build flow.
- Express serves the built frontend in production.
- Docker Compose loads environment variables from `.env`.
- `.env.example` documents story and image configuration.
- `.env` is ignored.
- GitHub Actions workflow is configured for GHCR publishing.
- README includes Docker, GHCR, Unraid, and NGINX Proxy Manager guidance.
- OpenAI API key usage remains backend-only.

Weaknesses:

- The backend currently requires `OPENAI_API_KEY` at startup. That is acceptable for this AI-first MVP, but it prevents fallback-only startup without a key.
- Global CORS is enabled. This is not a major privacy problem for the current MVP, but it is broader than necessary for production.
- Public deployments need reverse-proxy/rate-limit protection to control AI cost.

Recommendations:

- Keep Docker/Unraid setup as-is for MVP.
- Add deployment notes about reverse proxy/rate limiting if publicly exposed.
- Consider fallback-only startup later if offline/demo mode matters.

## Prioritized Improvement List

### Critical Fixes

#### 1. Add request guards for duplicate clicks and duplicate AI calls

- Recommendation: Add synchronous ref-based guards around setup start, story action selection, and correct-answer resolution.
- Why it matters: Prevents duplicate OpenAI/image calls, duplicate pending turns, and race conditions during classroom use.
- Estimated difficulty: Medium.
- Target: MVP.
- Likely files: `artifacts/mathquest-live/src/App.tsx`, `artifacts/mathquest-live/src/pages/GameScreen.tsx`, `artifacts/mathquest-live/src/pages/SetupScreen.tsx`.
- Suggested implementation prompt grouping: Implement alone as a technical reliability fix.

#### 2. Add explicit timeout/fallback handling for AI story calls

- Recommendation: Wrap OpenAI story generation so slow requests return safe fallback content instead of hanging.
- Why it matters: A slow model response should not trap students or derail a lesson.
- Estimated difficulty: Medium.
- Target: MVP.
- Likely files: `artifacts/api-server/src/routes/game/gameRoutes.ts`, `artifacts/api-server/src/lib/openaiClient.ts`, `artifacts/api-server/src/routes/game/storyPrompt.ts`.
- Suggested implementation prompt grouping: Can be grouped with fallback scene improvements.

#### 3. Add public-deployment cost/rate protection

- Recommendation: Add basic rate limiting or document reverse-proxy limits for AI endpoints before broad public exposure.
- Why it matters: Unauthenticated AI and image endpoints can create real cost risk.
- Estimated difficulty: Medium.
- Target: MVP if deployed publicly; Later if private LAN only.
- Likely files: `artifacts/api-server/src/app.ts`, README, Unraid/NGINX notes.
- Suggested implementation prompt grouping: Implement alone because it touches deployment/security behavior.

#### 4. Complete CPALMS/FDOE verification for benchmark metadata

- Recommendation: Verify benchmark codes and descriptions against official Florida sources before public/formal standards claims.
- Why it matters: Teacher trust depends on accurate, conservative standards alignment.
- Estimated difficulty: Medium.
- Target: MVP before public release.
- Likely files: `artifacts/mathquest-live/src/math/floridaBestMath.ts`, `README.md`.
- Suggested implementation prompt grouping: Implement alone as a standards/documentation pass.

### High-Impact MVP Improvements

#### 1. Make optional image generation non-blocking

- Recommendation: Return story text as soon as it is ready, then attach image metadata if ready or poll briefly for images.
- Why it matters: Keeps the quest moving even when image generation is slow.
- Estimated difficulty: Medium/High.
- Target: MVP if images are enabled.
- Likely files: `artifacts/api-server/src/images/*`, `artifacts/api-server/src/routes/game/gameRoutes.ts`, `artifacts/mathquest-live/src/App.tsx`, `artifacts/mathquest-live/src/components/SceneImage.tsx`.
- Suggested implementation prompt grouping: Implement alone due to async flow complexity.

#### 2. Expand math generator variety by standards band

- Recommendation: Add more code-generated problem types for underrepresented Grade 3, Grade 4, Grade 5, and advanced Grade 5 skills.
- Why it matters: Reduces repetition and improves classroom review value.
- Estimated difficulty: Medium.
- Target: MVP.
- Likely files: `artifacts/mathquest-live/src/mathEngine.ts`, `artifacts/mathquest-live/src/math/floridaBestMath.ts`, `artifacts/mathquest-live/src/validateMath.ts`.
- Suggested implementation prompt grouping: Implement one standards band at a time.

#### 3. Pass safe math skill metadata into story continuation

- Recommendation: Send `skillLabel` or `problemType` after solved math so the next scene can lightly echo the math context.
- Why it matters: Makes math feel more connected to the adventure without letting AI generate math.
- Estimated difficulty: Medium.
- Target: MVP.
- Likely files: `artifacts/mathquest-live/src/App.tsx`, API schemas/routes, `artifacts/api-server/src/routes/game/storyPrompt.ts`.
- Suggested implementation prompt grouping: Can be grouped with a story prompt refinement, but not with math generator expansion.

#### 4. Add compact end-of-quest skill summary

- Recommendation: Show a session-only summary of challenge level, math challenges completed, and skill categories practiced.
- Why it matters: Gives students a satisfying finish and gives teachers quick visibility.
- Estimated difficulty: Low/Medium.
- Target: MVP.
- Likely files: `artifacts/mathquest-live/src/pages/EndingScreen.tsx`, `artifacts/mathquest-live/src/App.tsx`.
- Suggested implementation prompt grouping: Can be grouped with badge/title polish.

#### 5. Add Quick Start or Randomize Hero option

- Recommendation: Let students skip detailed setup with safe randomized defaults.
- Why it matters: Helps centers and short classroom blocks start faster.
- Estimated difficulty: Low/Medium.
- Target: MVP.
- Likely files: `artifacts/mathquest-live/src/pages/SetupScreen.tsx`, setup option/config files.
- Suggested implementation prompt grouping: Implement alone as setup UX work.

### Nice-To-Have Polish

#### 1. Add teacher/debug benchmark display

- Recommendation: Add a session-only toggle to show benchmark metadata for teachers.
- Why it matters: Helps teachers verify alignment without cluttering student UI.
- Estimated difficulty: Medium.
- Target: Later.
- Likely files: `QuestSettingsDialog.tsx`, `GameScreen.tsx`, `mathEngine.ts`.
- Suggested implementation prompt grouping: Can be grouped with teacher-control improvements.

#### 2. Add sound on/off setting

- Recommendation: If sound remains part of the app, add a clear session-only toggle.
- Why it matters: Classroom devices often need silent operation.
- Estimated difficulty: Low.
- Target: Later.
- Likely files: `App.tsx`, `QuestSettingsDialog.tsx`.
- Suggested implementation prompt grouping: Can be grouped with settings polish.

#### 3. Add more fallback scene and ending variants

- Recommendation: Create safe fallback variants by quest phase or adventure seed.
- Why it matters: Fallback mode should still feel like a game, not an error.
- Estimated difficulty: Low/Medium.
- Target: Later.
- Likely files: `gameRoutes.ts`, possibly a new fallback content module.
- Suggested implementation prompt grouping: Can be grouped with AI reliability work.

#### 4. Add more reward moments

- Recommendation: Add milestone messages, badges, or quest titles after key progress points.
- Why it matters: Keeps students motivated during repeated math gates.
- Estimated difficulty: Low/Medium.
- Target: Later.
- Likely files: `GameScreen.tsx`, `EndingScreen.tsx`, `App.tsx`.
- Suggested implementation prompt grouping: Can be grouped with end-of-quest summary.

### Future Version Ideas

#### 1. Teacher launch presets

- Recommendation: Support URL query presets or a teacher launch screen for quest length, difficulty, theme, and skill focus.
- Why it matters: Helps classroom setup without accounts or rosters.
- Estimated difficulty: Medium.
- Target: Later.
- Likely files: `App.tsx`, `SetupScreen.tsx`, README.
- Suggested implementation prompt grouping: Implement after MVP is stable.

#### 2. Skill-focus quest packs

- Recommendation: Let teachers choose a skill focus within the selected standards band.
- Why it matters: Improves intervention and standards review.
- Estimated difficulty: Medium/High.
- Target: Later.
- Likely files: `floridaBestMath.ts`, `mathEngine.ts`, `SetupScreen.tsx`, `QuestSettingsDialog.tsx`.
- Suggested implementation prompt grouping: Implement after generator variety is expanded.

#### 3. Server-side math sessions for assessment use

- Recommendation: If the app becomes assessment-oriented, move math generation/checking server-side.
- Why it matters: Client-side math is fine for practice but not secure for grading.
- Estimated difficulty: High.
- Target: Later.
- Likely files: frontend state, API routes, math engine packaging.
- Suggested implementation prompt grouping: Only after a clear assessment/privacy design exists.

#### 4. Teacher dashboards, rosters, or saved progress

- Recommendation: Defer until privacy, authentication, and data retention are designed carefully.
- Why it matters: These features change the app’s compliance and maintenance profile.
- Estimated difficulty: High.
- Target: Later.
- Likely files: new backend storage/auth architecture.
- Suggested implementation prompt grouping: Not part of MVP.

## Suggested Implementation Order

1. Add duplicate-click/request guards.
2. Add story-call timeout/fallback handling.
3. Decide whether the first deployment is private LAN only or public; add rate/cost protection if public.
4. Complete CPALMS/FDOE benchmark verification.
5. Make optional image generation non-blocking.
6. Expand math generator variety one standards band at a time.
7. Pass safe math skill metadata into story continuation.
8. Add compact end-of-quest skill summary.
9. Add Quick Start or Randomize Hero.
10. Add teacher/debug benchmark display and other settings polish later.

## Notes / Open Questions

- Will the first Unraid deployment be private LAN only, or exposed publicly through NGINX Proxy Manager/Cloudflare?
- Should image generation remain enabled for normal classroom use, or be a teacher-controlled special mode because of latency/cost?
- Should the setup flow keep the faster no-summary path, or should a compact final review return?
- Which standards band should be expanded first: Easy, Medium, Hard, or Extreme?
- Do you want teacher/debug benchmark display in the MVP, or should benchmark metadata remain internal for now?
