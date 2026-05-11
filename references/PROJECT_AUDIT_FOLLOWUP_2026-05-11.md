# MathQuest Live Follow-Up Audit

## Executive Summary

MathQuest Live is in a much stronger MVP position than it was at the previous audit. The app still preserves the core product guardrails: no accounts, no database-backed student state, no analytics, no freeform student story input, backend-only AI calls, and deterministic app-generated math. Recent work materially improved story variety, genre continuity, challenge labeling, image timing, frontend audio, validation coverage, documentation structure, and browser smoke coverage.

The biggest remaining risks are not core gameplay bugs. They are release-hardening and maintainability risks: unresolved dependency advisories, public-deployment cost-control details, still-placeholder reporting-category metadata, and limited browser coverage beyond one main smoke path.

The most promising next improvements are focused and small: harden public deployment defaults, resolve dependency audit findings, expand browser smoke scenarios, clean up remaining standards-reporting placeholders, and add more student-facing polish around endings and story consequence without adding any teacher-side product surface.

## What Changed Since the Previous Audit

The previous audit was added in commit `de2bfd3` and later moved into `references/` in `ab821a4`. The relevant commits after the audit are:

- `cd62ac2 Implement genre quest flow and core UI validations`
  - Replaced exact start-location selection with genre-based quest selection.
  - Added `Surprise Me!` genre behavior and a controlled opening generator with 3072 validated combinations.
  - Added genre-aware episode planning, fallbacks, prompt context, and image context.
  - Added Playwright smoke-test infrastructure and a main-flow smoke test.
  - Improved challenge labels, loading states, story sizing, and frontend validation.
  - Extended math validation to per-generator samples and duplicate-choice stress checks.
- `ae39cdb Update documentation and ending challenge labels`
  - Reorganized README wording around quest lengths, genres, standards bands, image settings, audio, deployment, and developer notes.
  - Updated ending screen challenge labels and benchmark reference notes.
- `e499816 Stabilize browser smoke flow`
  - Made the smoke test more resilient when clicking through randomized math answers.
- `ab821a4 Finalize planning references`
  - Moved the previous audit into `references/`.
  - Reworked `references/PLAN.md` to emphasize the current user-facing, no-teacher-dashboard product direction.

Other current-state work visible in the codebase includes:

- Frontend background music with session-only audio settings, Vite auto-discovered MP3 assets, shuffled rotation, fades, and adjustable session volume.
- Session-only color schemes and settings across setup/game/ending screens.
- Cover/outro image mode as the documented default, with milestone/every-scene modes still available.
- Expanded Grade 3-5 standards reference files under `references/`.
- Broader math generators across all four challenge bands.
- In-memory duplicate problem tracking and variety-cycle logic during a quest.

## Previous Audit Findings Review

| Previous finding | Status | Evidence from current code or git history | Notes |
|---|---|---|---|
| Core safety/privacy constraints were preserved. | Resolved | `AGENTS.md`, `README.md`, and current code still keep no accounts, no database-backed student progress, no analytics, preset choices only, and backend-only AI. | This remains a strength. |
| AI calls must stay backend-only and secrets must not reach frontend code. | Resolved | OpenAI client use remains in `artifacts/api-server`; frontend calls relative API routes via generated client functions. | No frontend OpenAI API key exposure found. |
| Dependency audit reported high/moderate advisories. | Still Open | `pnpm audit --audit-level high` still fails with 13 vulnerabilities: 6 high and 7 moderate. | This is the clearest release-hardening item. |
| Browser smoke coverage was missing. | Partially Resolved | `artifacts/mathquest-live/tests/main-flow.smoke.spec.ts` now covers Quick Start to story, settings during math, and advancing after one math gate. | Good first coverage, but not yet broad enough for full setup, ending, image failure, or mobile paths. |
| Math validation should cover each generator, not just broad samples. | Resolved | `artifacts/mathquest-live/src/validateMath.ts` now samples each generator and stress-tests duplicate choices. | `npm run validate:math` passed. |
| Benchmark metadata needed fuller verification and documentation. | Partially Resolved | `floridaBestMath.ts` has official wording, domain/strand fields, verification status, and source notes; `references/` has Grade 3-5 standards references. | `reportingCategory` still uses placeholder text. Formal public reporting still needs careful review. |
| Domain/strand/reporting-category placeholders needed cleanup. | Partially Resolved | `domain` and `strand` now derive from benchmark code families, but `reportingCategory` remains `Not verified from provided source`. | Keep this open until exact official reporting categories are imported or intentionally dropped. |
| Story starts and fallbacks felt too generic. | Resolved | `storyPrompt.ts` now has genre profiles, episode plans, and genre-aware fallback scenes/endings. `validate:quest-starts` reports 3072 safe combinations. | Remaining work is optional variety polish, not a blocking issue. |
| Action choices needed stronger grounding in current scene details. | Partially Resolved | `SYSTEM_PROMPT` now requires choices grounded in specific scene details and chosen actions to visibly change the next scene. | AI output validation still cannot prove semantic grounding. More smoke/mock tests could help. |
| Image prompt should avoid generated text/numbers. | Resolved | `imagePrompt.ts` strongly bans readable text, letters, words, numbers, labels, logos, captions, signs, UI, and math symbols. | `npm run validate:images` passed. |
| Intro/outro image timing should be intentional. | Resolved | `maybeGenerateSceneImage` is awaited for intro and ending; normal turn images use non-blocking `requestSceneImage`. | Failure falls back without freezing gameplay. |
| Milestone images were too sparse. | Resolved | Milestone logic now triggers every second turn. | Default image mode is `cover_outro`, so milestones only apply when that mode is selected. |
| Quick Start needed safer, faster launch behavior. | Resolved | Title screen has Quick Start with challenge and quest length choices; randomized hero/session values reuse normal `handleStart`. | Smoke test covers Quick Start. |
| Info/settings controls needed responsive placement. | Resolved | Setup/game/ending pass inline top controls; game header reserves space for settings/info. | No current code-level blocker found. |
| Student-facing Easy/Medium/Hard/Extreme labels should be friendlier. | Resolved | `DIFFICULTY_OPTIONS` maps internal keys to Adventurer/Hero/Champion/Legend display names. | Internal labels remain Easy/Medium/Hard/Extreme, which is fine. |
| Feedback and hints needed to be supportive. | Resolved | Math problems include `hint` and `secondHint`; wrong-answer feedback says “Almost. Check the strategy and try again.” | More hint variety can still be added later. |
| README had accumulated stale implementation notes. | Resolved | README now has a clear table of contents and current sections for quest lengths, genres, audio, standards, images, deployment, and developer notes. | One low-priority future-auth caveat remains; see findings. |
| Teacher-facing summaries, timing notes, or class mode ideas could be future work. | Superseded | Current `references/PLAN.md` and this audit’s product direction explicitly prohibit teacher-facing UI/workflows. | Do not carry those prior recommendations forward. |
| High-readability/simple-text mode might help intervention use. | Superseded | Current plan explicitly says not to add high-readability/simple-text mode in this pass, and the user direction asks to avoid overbuilding. | Do not prioritize this unless the product direction changes. |

## Current Audit Findings

### High Priority

#### Dependency advisories remain unresolved

`pnpm audit --audit-level high` still fails with 13 reported vulnerabilities: 6 high and 7 moderate. The affected paths include `picomatch`, `path-to-regexp`, `lodash`, and `fast-uri` through dependencies such as Vite/Tailwind tooling, Express router internals, Recharts, and Orval/OpenAPI tooling.

Why it matters: This does not mean the game is currently unsafe to run locally, but it is the main blocker for a confident public deployment posture. It also makes future dependency work harder if left to drift.

Where it appears: dependency graph / `pnpm-lock.yaml`; current audit command output.

Recommendation: Handle dependency remediation as its own focused maintenance prompt. Update direct dependencies where patches are available, use pnpm overrides only where appropriate, rerun build/validators/smoke, and avoid changing app behavior during that pass.

#### Public deployment cost-control hardening is only partial

The API now has simple in-memory rate limiting on `/api/game` and image status routes, but public deployment still deserves one hardening pass. `CORS_ORIGIN` defaults to `*` in `artifacts/api-server/src/app.ts` and `.env.example`, and rate-limiting keys use `req.ip` directly in `artifacts/api-server/src/lib/rateLimit.ts`. Behind NGINX Proxy Manager or another reverse proxy, this can either bucket all users together or fail to represent actual client identity unless proxy behavior is configured carefully.

Why it matters: AI routes create real cost. The app should remain portable, but public deployments need clear, conservative defaults and proxy notes.

Where it appears:

- `artifacts/api-server/src/app.ts`
- `artifacts/api-server/src/lib/rateLimit.ts`
- `.env.example`
- `README.md`

Recommendation: Add a focused public-deploy hardening pass: document non-wildcard `CORS_ORIGIN` for public domains, decide whether to configure Express `trust proxy`, and make rate-limit behavior explicit for reverse-proxy deployments. Keep it account-free and analytics-free.

### Medium Priority

#### Reporting-category metadata is still placeholder text

The standards metadata model includes `reportingCategory`, and the validator requires it to be present. However, `benchmarkMetadata()` still sets it to `Not verified from provided source`.

Why it matters: The app’s standards alignment is useful and much stronger than before, but placeholder reporting-category metadata should not look equivalent to verified official metadata.

Where it appears:

- `artifacts/mathquest-live/src/math/floridaBestMath.ts`
- `artifacts/mathquest-live/src/validateMath.ts`
- `references/CURRENT_BEST_BENCHMARK_USAGE.md`

Recommendation: Either import official reporting categories from a trusted source or rename/drop the field so it does not imply verified reporting-category alignment. This is a metadata cleanup, not a generator rewrite.

#### Browser smoke coverage is useful but narrow

The new smoke test proves that Quick Start can reach a story, settings can open during math, and a mocked next scene can appear after a math gate. It does not yet cover the full Chronicler setup, back navigation, ending flow, image failure behavior, mobile viewport layout, or setup color selection.

Why it matters: Recent UI features are animation/state heavy. A single smoke path is a good start, but it will miss regressions in the slower setup flow and ending screen.

Where it appears:

- `artifacts/mathquest-live/tests/main-flow.smoke.spec.ts`
- `artifacts/mathquest-live/playwright.config.ts`

Recommendation: Add 2-3 small smoke tests: full setup path with back/change behavior, ending after a short mocked quest, and a mobile viewport test that confirms top controls and math answers stay inside their panels.

#### AI story validation is structurally safe but not schema-centralized

The backend checks title/text lengths, HTML tags, banned words, exact choice count, exact IDs, and `safetyRating`. That is good for MVP. The output shape is still validated through custom functions rather than a shared Zod schema, so prompt contract and runtime validation can drift.

Why it matters: AI JSON responses are one of the most failure-prone parts of the app. Central schema validation would make invalid output handling easier to test and extend.

Where it appears:

- `artifacts/api-server/src/routes/game/safety.ts`
- `artifacts/api-server/src/routes/game/gameRoutes.ts`

Recommendation: Create explicit backend Zod schemas for AI story turn and ending output, then keep the current safety checks layered on top. This should be a focused reliability pass.

#### Pending story and image job memory is bounded by TTL but not by count

`pendingTurns`, `episodePlans`, and image jobs are in-memory maps with TTL cleanup. This matches the no-database/session-only model, but there is no max-count guard.

Why it matters: Under accidental or abusive traffic, in-memory queues could grow until TTL cleanup catches up.

Where it appears:

- `artifacts/api-server/src/routes/game/gameRoutes.ts`
- `artifacts/api-server/src/images/imageService.ts`

Recommendation: Add conservative maximum map sizes and oldest-entry eviction for pending turns, episode plans, and image jobs. Keep this simple and account-free.

### Low Priority / Polish

#### README still includes one future-auth caveat

The README security notes say to “Consider authentication later only if adding saved progress, rosters, admin settings, or other persistent management features.” The current product direction explicitly rejects accounts, rosters, admin panels, and teacher-side workflows.

Why it matters: It is not app behavior, but it can confuse future planning.

Where it appears: `README.md` Security Notes.

Recommendation: Replace that line with a firmer statement that the current product direction avoids accounts, rosters, admin settings, analytics, and persistent management features.

#### Current smoke test clicks randomized math answers instead of a known correct answer

The smoke test loops through answer buttons until the next mocked scene appears. This is pragmatic, but it can obscure whether the correct-answer path itself is deterministic in the test.

Why it matters: The test works, but future failures may be slightly harder to diagnose.

Where it appears: `artifacts/mathquest-live/tests/main-flow.smoke.spec.ts`.

Recommendation: Add a test-only helper or route mock that can identify the current correct answer without exposing it in production UI, or keep this as-is until more smoke tests are added.

#### Some old reference documents contain superseded recommendations

The previous audit remains in `references/PROJECT_AUDIT_2026-05-10.md` for historical context and includes now-superseded teacher-facing recommendations.

Why it matters: Future sessions may read it without also reading the current product direction.

Where it appears: `references/PROJECT_AUDIT_2026-05-10.md`.

Recommendation: Treat this follow-up audit as the newer source for recommendation direction. Optionally add a one-line note at the top of the old audit pointing to this file.

#### Audio asset bundle is large

The app now includes many local MP3 files. Vite emits them as separate assets, and playback only starts after user interaction, but the production build includes a substantial media footprint.

Why it matters: This is acceptable for the current experience, but public/mobile loading could benefit from keeping file sizes in mind.

Where it appears:

- `artifacts/mathquest-live/src/assets/music/`
- `artifacts/mathquest-live/src/lib/musicLibrary.ts`

Recommendation: Keep future tracks compressed and short. Consider a later asset-budget note or lightweight check, not a new UI.

## Recommended Next Work

### Best Next Fixes

#### 1. Resolve dependency audit advisories

What it is: Upgrade or override vulnerable dependency paths reported by `pnpm audit`.

Why it is worth doing: This is the most concrete release-readiness risk remaining.

Urgency: High for public deployment, useful before broader testing.

Focused prompt: Yes. Handle as its own maintenance task.

Implementation detail: Update direct package versions first, then use pnpm overrides only if necessary. Run `pnpm audit --audit-level high`, `npm run build`, `npm run validate:math`, `npm run validate:images`, and `npm run test:smoke`.

#### 2. Harden public deployment defaults and rate limiting

What it is: Tighten CORS/proxy/rate-limit guidance and implementation for public hosting.

Why it is worth doing: It protects OpenAI cost exposure without adding accounts, analytics, or stored user data.

Urgency: High if publicly deployed; otherwise medium.

Focused prompt: Yes.

Implementation detail: Add explicit `CORS_ORIGIN` deployment guidance, review Express `trust proxy` behavior for NGINX Proxy Manager, and consider max-size guards for in-memory pending maps.

#### 3. Clean up standards reporting-category metadata

What it is: Either verify `reportingCategory` values from official source material or rename/drop the placeholder field.

Why it is worth doing: It prevents unsupported standards claims while preserving useful benchmark metadata.

Urgency: Useful before public standards claims; not a student gameplay blocker.

Focused prompt: Yes.

Implementation detail: Update `floridaBestMath.ts`, `validateMath.ts`, README wording, and `references/CURRENT_BEST_BENCHMARK_USAGE.md`.

#### 4. Expand browser smoke coverage

What it is: Add small Playwright tests for full setup, ending, image failure/no-image behavior, and mobile layout.

Why it is worth doing: It catches the kinds of regressions this app has had: setup state, transitions, mobile containment, and settings visibility.

Urgency: Useful for continuing rapid iteration.

Focused prompt: Can be grouped with test-maintenance work.

Implementation detail: Keep tests mocked and fast. Avoid requiring real OpenAI calls or real image generation.

#### 5. Centralize AI output schemas

What it is: Use backend schemas for story turn and ending JSON outputs, then apply current safety checks.

Why it is worth doing: It reduces drift between prompt instructions and runtime validation.

Urgency: Useful, not urgent.

Focused prompt: Yes.

Implementation detail: Add schemas in the API server, validate parsed AI JSON with them, preserve existing fallbacks.

### Best Next Enhancements

#### 1. Add more student-facing ending variety and rewards

What it is: Make endings feel more distinct by strengthening badge/reward language and maybe showing a few non-persistent “quest moments” from the completed session.

Why it is worth doing: Replay value improves when students feel each quest ended differently.

Priority: Useful optional enhancement.

Focused prompt: Yes.

Implementation detail: Use current story history, practiced skills, badge, and genre data. Do not add reports, saved progress, analytics, or teacher views.

#### 2. Add a small action-consequence recap in story transitions

What it is: After a correct answer reveals the next scene, subtly reinforce how the selected action changed the story.

Why it is worth doing: It makes math gating feel less bolted on and helps students connect choice, challenge, and consequence.

Priority: Useful optional enhancement.

Focused prompt: Yes.

Implementation detail: Prefer prompt and display polish over new systems. Keep benchmark codes out of story text.

#### 3. Expand genre-specific fallback variety

What it is: Add small pools of fallback scene/ending lines per genre instead of one generated fallback template.

Why it is worth doing: AI fallback moments will feel less repetitive and more polished.

Priority: Optional but high-leverage for reliability polish.

Focused prompt: Can be grouped with AI fallback improvements.

Implementation detail: Keep all fallback text controlled, age-appropriate, and button-based.

#### 4. Add more math prompt variety within existing verified benchmarks

What it is: Continue adding generator variations where benchmark fit is already verified.

Why it is worth doing: More variation increases replayability and lowers perceived repetition.

Priority: Useful ongoing enhancement.

Focused prompt: Yes, one grade band or domain at a time.

Implementation detail: Keep every new generator deterministic, metadata-complete, signature-stable, and validated.

#### 5. Add a small asset-budget maintenance note for music

What it is: Document preferred track length/encoding guidance for future MP3 additions.

Why it is worth doing: It keeps the current polished audio system from quietly bloating the production asset set.

Priority: Optional.

Focused prompt: Can be grouped with documentation maintenance.

Implementation detail: Documentation only; no new audio UI.

## Things That Should Explicitly Not Be Added

MathQuest Live should continue avoiding:

- teacher-facing UI of any kind
- teacher dashboards
- classroom mode
- teacher controls
- class codes
- rosters
- assignments
- reports
- progress monitoring
- analytics
- admin panels
- accounts
- database-backed student state
- persistent student data
- saved progress
- freeform student story input
- AI-generated math
- AI grading
- Grade 6 or middle-school content in Legend / Extreme
- dependency-heavy overbuilding
- management workflows that shift the app away from direct student play

## Verification

Commands run during this follow-up audit:

- `pnpm audit --audit-level high`
  - Failed.
  - Reported 13 vulnerabilities: 6 high and 7 moderate.
- `npm run validate:quest-starts`
  - Passed.
  - Reported 3072 safe quest genre opening combinations.
- `npm run validate:math`
  - Passed.
  - Validated 20 generated problems per difficulty, every generator with 12 samples, and 120 duplicate-choice stress samples per generator.
- `npm run validate:images`
  - Passed.
  - Image mode and prompt-safety validation passed.
- `npm run build`
  - Passed.
  - Vite still reports a non-fatal sourcemap warning for `src/components/ui/tooltip.tsx`.
- `npm run test:smoke`
  - Passed.
  - 1 Chromium smoke test passed.

## Final Verdict

MathQuest Live is currently safe enough for controlled student playtesting and is much more playable than it was at the prior audit. The core student loop is intact: preset choices, AI-written story, app-generated math, math-gated progression, session-only state, and no student data persistence.

It is also in a good place for continued iteration. Recent changes made the app more coherent: genres now shape the quest, math variety is broader, validation is stronger, image behavior is more intentional, audio is session-only, and documentation is much easier for future Codex sessions to follow.

For a public deployment, the single most valuable next fix is dependency and public-cost hardening: resolve the dependency advisories, tighten CORS/proxy/rate-limit guidance, and keep all of that account-free and analytics-free.

The single most valuable optional enhancement is richer student-facing endings and reward moments. That would improve replay value without changing the product into a teacher-management tool or adding persistence.
