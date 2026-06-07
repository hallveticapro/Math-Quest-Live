# MathQuest Live Code Review Resolution Plan

## Purpose

This plan converts every action item from `MATHQUEST_CODE_REVIEW_2026-06-06.md` into measurable, implementation-ready work. Each item below has concrete evidence required for completion. If a requirement cannot be completed safely during implementation, it must be split into a smaller measurable task or documented as a deferred blocker with exact evidence showing why it cannot be completed now.

## Source Review

- Source report: `MATHQUEST_CODE_REVIEW_2026-06-06.md`
- Review date: 2026-06-06
- Plan date: 2026-06-07

## Current Execution Status

This plan is both the implementation roadmap and the durable status tracker for resolving every action item in `MATHQUEST_CODE_REVIEW_2026-06-06.md`. As of 2026-06-07 14:24 EDT, Phases 1-11 are complete with local evidence and matching entries in `references/UPDATES.md`.

| Phase | Status | Evidence / next step |
| --- | --- | --- |
| Phase 1 - Image pending state and image API contract | Complete | Commit `c419eaa` (`fix: handle pending image timeouts and image API schema`); `references/UPDATES.md` entry `2026-06-07T09:50:23-04:00`. |
| Phase 2 - Prepared turn generated API contract | Complete | Commit `efd1163` (`chore: add prepared turn routes to API contract`); `references/UPDATES.md` entry `2026-06-07T09:54:49-04:00`. |
| Phase 3 - AI-cost controls and OpenAI startup behavior | Complete | Commit `57cdeb5` (`chore: harden AI route limits and OpenAI startup`); `references/UPDATES.md` entry `2026-06-07T10:00:07-04:00`. Final proof: `OPENAI_API_KEY= NODE_ENV=production PORT=39999 STATIC_DIR=artifacts/mathquest-live/dist/public node --enable-source-maps artifacts/api-server/dist/index.mjs` served `/api/healthz` as `{"status":"ok"}`. |
| Phase 4 - Database scaffold and starter script cleanup | Complete | Commit `e8e7ce5` (`chore: remove unused database and starter script`); `references/UPDATES.md` entry `2026-06-07T10:03:39-04:00`. |
| Phase 5 - Unused UI scaffold and dependency pruning | Complete | Commit `c8e35ce` (`chore: prune unused frontend UI scaffold`); `references/UPDATES.md` entries `2026-06-07T10:05:05-04:00` and `2026-06-07T10:07:45-04:00`. |
| Phase 6 - Small UI and asset cleanup | Complete | Commit `9055336` (`fix: clean small UI and asset leftovers`); `references/UPDATES.md` entry `2026-06-07T10:09:44-04:00`. |
| Phase 7 - API client consistency | Complete | Commit `d14d30a` (`chore: normalize frontend API client usage`); `references/UPDATES.md` entry `2026-06-07T10:12:31-04:00`. |
| Phase 8 - Expanded smoke coverage | Complete | Smoke tests now cover quick start, full Chronicler setup with audio-only setup settings, game settings full scope, ending flow, read-aloud start/stop with mocked browser speech, and pending image timeout. Validation passed: `npm run test:smoke`, frontend typecheck, and `npm run build`. |
| Phase 9 - Math engine split | Complete | Math engine is split into `math/engineCore.ts` plus grade-owned generator modules under `math/generators/`; `mathEngine.ts` remains a compatibility facade. Validation passed: frontend typecheck, `npm run validate:math`, and `npm run build`. |
| Phase 10 - Backend story route/prompt data split | Complete | Story profile data, fallback lines, input validation, pending-turn stores, route response types, and TTL cleanup now live in route-adjacent modules. Representative start/turn/ending prompts compared byte-for-byte against commit `d0da2bb`; validation passed with API typecheck, `npm run validate:quest-starts`, `npm run test:smoke`, and `npm run build`. |
| Phase 11 - Final docs/review cleanup | Complete | Final review item status table added below, docs/env guidance verified, stale active references checked, no-key server startup proof recorded, and final validation passed for every command listed in [Final Validation Results](#final-validation-results). |

### Continue-From-Here Checklist

All phases are complete. Before future work begins, start from a fresh `git status --short`, inspect `references/UPDATES.md`, and treat any new product request as a separate scoped task.

## Non-Negotiable Guardrails

Do not add:

- teacher-facing UI
- dashboards
- classroom mode
- reports
- rosters
- accounts
- database-backed student state
- analytics
- ads
- saved progress
- persistent student data
- freeform student story input
- AI-generated math
- Grade 6+ content in Extreme / Legend

Preserve:

- preset/button/card student choices
- deterministic app-generated math
- backend-only story/image AI calls
- session-only settings
- Florida B.E.S.T. challenge bands
- graceful fallback behavior
- temporary/disposable image storage

## Measurable Acceptance Rules

Every phase is complete only when all of these are true:

1. Every listed task has either:
   - direct code evidence,
   - command output evidence,
   - smoke/validator evidence,
   - documentation evidence, or
   - an explicit deferred-blocker note with the exact reason and next unblock step.
2. Broad items are split until each remaining item can be checked with a command, file diff, test, or manual instruction.
3. "Works," "safe," "clean," "where practical," and "if desired" are not acceptable proof by themselves.
4. A validation command is evidence only if it covers the requirement it is being used to prove.
5. Generated API changes are not complete until generated files are regenerated and typechecks pass.
6. Deletion work is not complete until `rg` proves no remaining imports/references, excluding intentional notes in review/plan files.

If a future implementer finds that a listed measurable requirement is too broad to verify directly, they must split that requirement in `PLAN.md` before coding. The split is acceptable only when each child requirement names one of:

- a file diff to inspect,
- an `rg` command to run,
- a validation command to run,
- a deterministic automated test to add/run,
- a manual test with exact UI state to observe, or
- a documented blocker with the next unblock step.

## Required Final Validation Suite

Run this before the final checkpoint:

```sh
pnpm --filter @workspace/mathquest-live run typecheck
pnpm --filter @workspace/api-server run typecheck
npm run validate:math
npm run validate:images
npm run validate:quest-starts
npm run build
npm run test:smoke
```

Expected result:

- Every command exits `0`.
- Any build warning that remains is either already accepted in this plan or documented in `README.md`, `AGENTS.md`, or `references/UPDATES.md`.

## Phase 1 - Fix Image Pending State And Image API Contract

Source action items:

- P1: Pending story images can leave the UI stuck on "Illustration still loading..."
- Quick win: Add `/api/images/status/{imageJobId}` and pending/failed image states to OpenAPI.

### Phase 1A - Make pending image timeout measurable

Files to inspect:

- `artifacts/mathquest-live/src/components/SceneImage.tsx`
- `artifacts/mathquest-live/tests/main-flow.smoke.spec.ts`

Tasks:

1. Define a visible max-poll behavior for non-blocking pending images.
2. After max attempts, set the local image state to failed/hidden or a deliberate timeout state.
3. Add a deterministic smoke test or component-level smoke path that mocks an image status endpoint returning `pending` until polling is exhausted.

Measurable acceptance:

- `SceneImage.tsx` contains an explicit exhausted-poll branch that changes `resolvedImage` away from `pending`.
- `rg "Illustration still loading" artifacts/mathquest-live/src/components/SceneImage.tsx` still finds the loading copy only for active pending state, not timeout state.
- `npm run test:smoke` includes a passing test or assertion proving the pending placeholder disappears or changes after max polling.
- Intro/outro blocking image paths are not changed in `artifacts/mathquest-live/src/App.tsx` or backend route behavior unless explicitly required by the image contract update.

Targeted validation:

```sh
npm run test:smoke
pnpm --filter @workspace/mathquest-live run typecheck
```

### Phase 1B - Bring image status payloads into OpenAPI

Files to inspect:

- `artifacts/api-server/src/images/imageTypes.ts`
- `artifacts/api-server/src/images/imageService.ts`
- `artifacts/api-server/src/routes/images/imageRoutes.ts`
- `lib/api-spec/openapi.yaml`
- `lib/api-client-react/src/generated/`
- `lib/api-zod/src/generated/`

Tasks:

1. Add OpenAPI schemas for `ready`, `pending`, and `failed` image states.
2. Add `/api/images/status/{imageJobId}` to OpenAPI.
3. Regenerate generated clients.
4. Verify generated schemas/types include all runtime statuses.

Measurable acceptance:

- `rg "status/:imageJobId|/status/\\{imageJobId\\}|imageJobId" lib/api-spec/openapi.yaml artifacts/api-server/src/routes/images/imageRoutes.ts` proves the route exists in both runtime and spec.
- `rg "pending|failed|ready" lib/api-spec/openapi.yaml lib/api-client-react/src/generated lib/api-zod/src/generated` proves generated artifacts include all three statuses.
- `pnpm --filter @workspace/api-spec run codegen` has been run after the OpenAPI edit.
- `pnpm --filter @workspace/mathquest-live run typecheck` and `pnpm --filter @workspace/api-server run typecheck` pass.

Targeted validation:

```sh
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/mathquest-live run typecheck
pnpm --filter @workspace/api-server run typecheck
npm run validate:images
npm run build
```

## Phase 2 - Bring Prepared Turn Routes Into The Generated API Contract

Source action items:

- P1: Prepared-turn runtime contracts are hand-written and drift from the generated API spec.
- P2: API client strategy is inconsistent.

### Phase 2A - Add prepared-turn OpenAPI schemas

Files to inspect:

- `artifacts/mathquest-live/src/App.tsx`
- `artifacts/api-server/src/routes/game/gameRoutes.ts`
- `lib/api-spec/openapi.yaml`

Tasks:

1. Add OpenAPI paths for `/api/game/prepare` and `/api/game/resolve`.
2. Add schemas for:
   - `PrepareGameStepBody`
   - `PrepareGameStepResponse`
   - `ResolvePreparedStepBody`
   - `ResolvePreparedStepResponse`
   - `LastMathSkill`
3. Include `kind`, `pendingId`, `turn`, `lastMathSkill`, and resolve union shape.

Measurable acceptance:

- `rg "/game/prepare|/game/resolve|PrepareGameStep|ResolvePreparedStep|LastMathSkill|lastMathSkill" lib/api-spec/openapi.yaml` finds every named path/schema/field.
- The OpenAPI body schema lists `kind`, `hero`, `difficulty`, `adventureSeed`, `turn`, `maxTurns`, `storySummary`, `chosenAction`, and optional `lastMathSkill`.
- The resolve response schema represents both `turn` and `ending` results.

### Phase 2B - Regenerate and consume generated prepared-turn types

Files to inspect:

- `artifacts/mathquest-live/src/App.tsx`
- `artifacts/api-server/src/routes/game/gameRoutes.ts`
- `lib/api-client-react/src/generated/`
- `lib/api-zod/src/generated/`

Tasks:

1. Regenerate generated clients.
2. Remove local duplicate prepared-turn type definitions from `App.tsx` if generated equivalents exist.
3. Use generated frontend functions or generated response/body types for prepare/resolve.
4. Use generated zod schemas for backend body parsing where they cover the runtime need.
5. Keep existing custom allowlist validation after zod parsing.

Measurable acceptance:

- `rg "type PrepareGameStepBody|type PrepareGameStepResponse|type ResolvePreparedStepResponse" artifacts/mathquest-live/src/App.tsx` returns no local duplicate type definitions unless a comment explains a measured generated-client limitation.
- `rg "prepareGameStep|resolvePreparedStep" lib/api-client-react/src/generated artifacts/mathquest-live/src/App.tsx` proves generated prepared-turn support is available and used, or documents why not.
- `rg "PrepareGameStep|ResolvePreparedStep" lib/api-zod/src/generated artifacts/api-server/src/routes/game/gameRoutes.ts` proves backend parsing can reference generated schemas, or documents why custom parsing remains necessary.
- `npm run test:smoke` passes and still advances through a prepared math gate.

Targeted validation:

```sh
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/mathquest-live run typecheck
pnpm --filter @workspace/api-server run typecheck
npm run test:smoke
npm run build
```

## Phase 3 - Harden Public AI-Cost Controls And OpenAI Startup Behavior

Source action items:

- P1: Public AI-cost routes need stronger backpressure and deployment defaults.
- P1: OpenAI startup failure can prevent the server from booting even for non-AI routes.
- Quick win: Add max-count constants/env vars for image jobs and stored images.
- Quick win: Document public `CORS_ORIGIN` usage.

### Phase 3A - Make proxy, CORS, and rate-limit deployment settings explicit

Files to inspect:

- `artifacts/api-server/src/app.ts`
- `artifacts/api-server/src/lib/rateLimit.ts`
- `.env.example`
- `README.md`

Tasks:

1. Add explicit `TRUST_PROXY` or equivalent proxy configuration.
2. Keep local defaults working without proxy setup.
3. Document public deployment guidance for `CORS_ORIGIN`, `TRUST_PROXY`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, and `IMAGE_RATE_LIMIT_MAX_REQUESTS`.

Measurable acceptance:

- `rg "TRUST_PROXY|trust proxy" artifacts/api-server/src .env.example README.md` finds code and docs.
- `.env.example` includes a `TRUST_PROXY` entry or a documented equivalent.
- `README.md` states `CORS_ORIGIN=*` is for local/private use and public deployments should set an exact origin.
- `pnpm --filter @workspace/api-server run typecheck` passes.

### Phase 3B - Bound in-memory AI/image state

Files to inspect:

- `artifacts/api-server/src/routes/game/gameRoutes.ts`
- `artifacts/api-server/src/images/imageService.ts`
- `artifacts/api-server/src/images/imageStore.ts`

Tasks:

1. Add max-size caps for pending prepared turns.
2. Add max-size caps for episode plans.
3. Add max-size caps for image jobs.
4. Add max-size caps for stored temporary images.
5. Return friendly 429 or 503 JSON responses when capacity is reached.
6. Add per-client or per-episode pending-turn limit.

Measurable acceptance:

- `rg "MAX_|MAX.*PENDING|MAX.*IMAGE|MAX.*EPISODE|capacity|too_many|rate_limited" artifacts/api-server/src/routes/game artifacts/api-server/src/images` finds explicit cap logic.
- Each capped map has a deterministic cap value from env or constant.
- Every capacity rejection returns JSON with an `error` code and classroom-safe `message`.
- No cap uses accounts, database state, analytics, or persistent identifiers.
- `npm run test:smoke` still passes.

### Phase 3C - Allow server health/static startup without OpenAI key

Files to inspect:

- `artifacts/api-server/src/lib/openaiClient.ts`
- `artifacts/api-server/src/routes/game/gameRoutes.ts`
- `artifacts/api-server/src/images/providers/openaiImageProvider.ts`
- `README.md`
- `.env.example`

Tasks:

1. Remove import-time throw for missing `OPENAI_API_KEY`.
2. Keep story/image routes explicit when AI is unavailable.
3. Preserve backend-only AI boundaries.
4. Document that normal gameplay still requires `OPENAI_API_KEY`.

Measurable acceptance:

- Running `OPENAI_API_KEY= pnpm --filter @workspace/api-server run typecheck` passes.
- A server-start smoke command without `OPENAI_API_KEY` is added or manually documented as passing.
- `rg "throw new Error.*OPENAI_API_KEY|OPENAI_API_KEY must be set" artifacts/api-server/src/lib/openaiClient.ts` returns no import-time crash.
- `README.md` still clearly says normal AI gameplay requires `OPENAI_API_KEY`.

Targeted validation:

```sh
pnpm --filter @workspace/api-server run typecheck
npm run validate:images
npm run test:smoke
npm run build
```

## Phase 4 - Remove Database Scaffold And Starter Script Dead Code

Source action items:

- P2: Database scaffold contradicts product constraints and adds unused dependencies.
- Quick win: Remove `scripts/src/hello.ts`.
- Redundancy removal log entries for `lib/db`, `@workspace/db`, `drizzle-orm`, and `hello`.

### Phase 4A - Remove unused database workspace

Files to inspect:

- `lib/db/`
- `artifacts/api-server/package.json`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `AGENTS.md`
- `README.md`

Tasks:

1. Delete `lib/db/`.
2. Remove `@workspace/db` from `artifacts/api-server/package.json`.
3. Remove unused Drizzle dependencies introduced only for `lib/db`.
4. Remove workspace and TypeScript references to `lib/db`.
5. Update lockfile with the minimum correct pnpm command.

Measurable acceptance:

- `test ! -d lib/db` passes.
- `rg "@workspace/db|DATABASE_URL|drizzle" artifacts lib package.json pnpm-workspace.yaml tsconfig.json README.md AGENTS.md` returns no active runtime/dependency references, excluding historical notes if intentionally kept.
- `pnpm-lock.yaml` no longer includes `@workspace/db`.
- `pnpm --filter @workspace/api-server run typecheck` passes.

### Phase 4B - Remove starter hello script

Files to inspect:

- `scripts/package.json`
- `scripts/src/hello.ts`

Tasks:

1. Delete `scripts/src/hello.ts`.
2. Remove the `hello` script from `scripts/package.json`.

Measurable acceptance:

- `test ! -f scripts/src/hello.ts` passes.
- `rg '"hello"|Hello from @workspace/scripts' scripts` returns no matches.
- `npm run build` still passes.

Targeted validation:

```sh
pnpm --filter @workspace/api-server run typecheck
npm run build
```

## Phase 5 - Prune Unused UI Scaffold And Clean Frontend Dependencies

Source action items:

- P2: Large unused UI scaffold bloats dependencies and build surface.
- P2: Frontend bundle is large enough to start watching.
- P3: Build warnings should be either resolved or documented.
- Redundancy removal log entries for unused UI components and likely removable frontend dependencies.

### Phase 5A - Inventory actual UI component imports

Files to inspect:

- `artifacts/mathquest-live/src/components/ui/`
- `artifacts/mathquest-live/src/`
- `artifacts/mathquest-live/package.json`

Tasks:

1. Produce an import inventory using `rg "@/components/ui|components/ui" artifacts/mathquest-live/src`.
2. Identify keep-list files.
3. Identify delete-list files.

Measurable acceptance:

- `PLAN.md` or `references/UPDATES.md` records the keep-list and delete-list before deletion.
- The keep-list includes every UI component import found by `rg`.
- The delete-list contains no file imported by app code.

### Phase 5B - Delete unused UI components

Tasks:

1. Delete every UI scaffold file on the measured delete-list.
2. Keep files required by imports.

Measurable acceptance:

- For every deleted file, `rg "<component-file-name-without-extension>" artifacts/mathquest-live/src` has no import reference.
- `pnpm --filter @workspace/mathquest-live run typecheck` passes.

### Phase 5C - Remove dependencies only after import proof

Tasks:

1. Remove dependencies that are only used by deleted UI scaffold.
2. Keep dependencies still imported by retained UI or app code.
3. Update `pnpm-lock.yaml`.

Measurable acceptance:

- For each removed dependency, `rg "<package-name>" artifacts/mathquest-live/src artifacts/mathquest-live/package.json` proves it is not imported or listed.
- `pnpm install --lockfile-only` or the chosen pnpm lock update command has been run.
- `npm run build` passes.

### Phase 5D - Resolve or document build warnings

Tasks:

1. Run `npm run build`.
2. If the tooltip sourcemap warning remains, either fix it or document why it remains.
3. If the chunk-size warning remains, document current bundle size and next owner.

Measurable acceptance:

- `npm run build` output is captured in the final summary.
- If warnings remain, `README.md`, `AGENTS.md`, or `references/UPDATES.md` contains a dated note naming the warning and why it is accepted temporarily.

Targeted validation:

```sh
pnpm --filter @workspace/mathquest-live run typecheck
npm run build
```

## Phase 6 - Resolve Small UI And Asset Cleanup Items

Source action items:

- P3: Settings selected badge still uses text.
- P3: `Hamster` ancestry may be accidental now that Koala replaced the request.
- P3: `@assets` Vite alias points to an old attached-assets folder.
- P3: Vite dev server allows all hosts.
- Quick wins and redundancy log entries for selected badge, `@assets`, attached assets, and Hamster decision.

### Phase 6A - Make settings selected badge measurable

Files to inspect:

- `artifacts/mathquest-live/src/components/QuestSettingsDialog.tsx`

Tasks:

1. Remove the visible word `Selected` from `SelectedBadge`.
2. Keep the checkmark and `aria-pressed` selected state.

Measurable acceptance:

- `rg "Selected" artifacts/mathquest-live/src/components/QuestSettingsDialog.tsx` returns no visible selected-badge text, or only comments/test names if intentionally retained.
- `rg "aria-pressed" artifacts/mathquest-live/src/components/QuestSettingsDialog.tsx` proves selected state remains accessible.
- `pnpm --filter @workspace/mathquest-live run typecheck` passes.

### Phase 6B - Split Hamster ancestry into an explicit decision gate

Files to inspect:

- `artifacts/mathquest-live/src/adventureOptions.ts`
- `artifacts/api-server/src/routes/game/storyPrompt.ts`
- `references/UPDATES.md`

Decision rule:

- If the implementation prompt explicitly says to remove Hamster, remove it.
- If no explicit product decision is present, keep Hamster and add a note in `references/UPDATES.md` that it was reviewed and intentionally left unchanged.

Measurable acceptance if removing:

- `rg "Hamster" artifacts/mathquest-live/src/adventureOptions.ts artifacts/api-server/src/routes/game/storyPrompt.ts` returns no active option/allowlist matches.
- `npm run validate:quest-starts` passes.

Measurable acceptance if keeping:

- `references/UPDATES.md` contains a dated note stating Hamster was reviewed and intentionally retained pending product direction.
- `npm run validate:quest-starts` passes.

### Phase 6C - Remove unused attached-assets alias

Files to inspect:

- `artifacts/mathquest-live/vite.config.ts`
- `attached_assets/`

Tasks:

1. Confirm no `@assets` imports exist.
2. Remove `@assets` alias.
3. Delete `attached_assets/` only if it has no documentation value and no imports.

Measurable acceptance:

- `rg "@assets" .` returns no active source/config imports, excluding `PLAN.md` or review references.
- `artifacts/mathquest-live/vite.config.ts` no longer maps `@assets`.
- If `attached_assets/` remains, `references/UPDATES.md` documents why it remains.

### Phase 6D - Make Vite allowed-host behavior explicit

Files to inspect:

- `artifacts/mathquest-live/vite.config.ts`
- `README.md`

Tasks:

1. Replace `allowedHosts: true` with an environment-driven list or document why it remains.
2. Keep local defaults working for `localhost` and `127.0.0.1`.

Measurable acceptance:

- `rg "allowedHosts: true" artifacts/mathquest-live/vite.config.ts` returns no match, or README/UPDATES contains an explicit dated rationale for keeping it.
- `README.md` documents any new environment variable for allowed hosts.
- `pnpm --filter @workspace/mathquest-live run typecheck` passes.

Targeted validation:

```sh
npm run validate:quest-starts
pnpm --filter @workspace/mathquest-live run typecheck
npm run build
```

## Phase 7 - Make API Client Usage Consistent

Source action items:

- P2: API client strategy is inconsistent.
- Redundancy removal log: `@tanstack/react-query` and `QueryClientProvider` are candidates if generated hooks remain unused.

### Phase 7A - Inventory API access patterns

Files to inspect:

- `artifacts/mathquest-live/src/App.tsx`
- `artifacts/mathquest-live/src/main.tsx`
- `artifacts/mathquest-live/package.json`
- `lib/api-client-react/src/generated/`
- `lib/api-spec/openapi.yaml`

Tasks:

1. Search for `customFetch`, generated API functions, React Query hooks, `QueryClient`, and `QueryClientProvider`.
2. Decide one frontend API pattern after Phases 1 and 2.

Measurable acceptance:

- `references/UPDATES.md` records the chosen API pattern and why.
- `rg "customFetch|QueryClient|QueryClientProvider|use[A-Z].*Query|startGame|takeTurn|getEnding" artifacts/mathquest-live/src lib/api-client-react/src/generated` is reviewed and summarized in the implementation final response.

### Phase 7B - Remove duplicate manual API types

Tasks:

1. Use generated types/functions for game routes where available.
2. Remove local duplicate API body/response types.

Measurable acceptance:

- `rg "type .*Body|type .*Response" artifacts/mathquest-live/src/App.tsx` shows no local API contract duplicates for routes covered by generated clients, unless each remaining type has a comment explaining why generated support is impossible.
- `pnpm --filter @workspace/mathquest-live run typecheck` passes.

### Phase 7C - Remove React Query only if unused

Decision rule:

- If generated clients or app code still require React Query hooks, keep it.
- If no hooks/provider are used, remove `QueryClientProvider`, `QueryClient`, and `@tanstack/react-query`.

Measurable acceptance if removing:

- `rg "QueryClient|QueryClientProvider|@tanstack/react-query" artifacts/mathquest-live/src artifacts/mathquest-live/package.json` returns no active matches.
- `pnpm-lock.yaml` no longer has a frontend dependency edge for `@tanstack/react-query`.

Measurable acceptance if keeping:

- `references/UPDATES.md` documents the import or generated-client reason it remains.

Targeted validation:

```sh
pnpm --filter @workspace/mathquest-live run typecheck
npm run test:smoke
npm run build
```

## Phase 8 - Expand Smoke Test Coverage

Source action items:

- P2: Testing is strong for math but thin for story, image, audio, and setup regressions.
- Quick wins: Add full setup smoke test and image pending timeout smoke test.

### Phase 8A - Add full setup smoke coverage

Files to inspect:

- `artifacts/mathquest-live/tests/main-flow.smoke.spec.ts`
- `artifacts/mathquest-live/playwright.config.ts`
- `artifacts/mathquest-live/src/pages/SetupScreen.tsx`

Tasks:

1. Mock story routes.
2. Exercise full setup flow using default ancestry/class.
3. Verify setup settings are audio-only.

Measurable acceptance:

- Smoke test includes a test title mentioning full setup or Chronicler setup.
- Test asserts a story scene appears after setup.
- Test asserts setup settings do not show color/challenge controls.
- `npm run test:smoke` passes.

### Phase 8B - Add game settings and ending smoke coverage

Tasks:

1. Verify game settings show audio, color, and challenge controls.
2. Advance through a mocked math gate.
3. Reach mocked ending.

Measurable acceptance:

- Smoke test asserts game settings include color/challenge controls.
- Smoke test asserts ending screen text/title appears.
- `npm run test:smoke` passes.

### Phase 8C - Add image pending timeout smoke coverage

Tasks:

1. Mock a pending image response.
2. Mock status polling as permanently pending or eventually failed.
3. Assert the pending UI does not remain forever.

Measurable acceptance:

- Smoke test includes an assertion for the image pending timeout/failure behavior.
- Test does not require real image generation.
- `npm run test:smoke` passes.

### Phase 8D - Add read-aloud/music ducking coverage if browser-stable

Decision rule:

- Add read-aloud/music ducking smoke coverage if Web Speech/audio can be mocked deterministically.
- If Playwright/browser behavior is too flaky, document the blocker and add a smaller unit-like test seam or manual checklist.

Measurable acceptance if automated:

- Smoke test mocks `speechSynthesis` and asserts read-aloud controls can start/stop without crashing.
- `npm run test:smoke` passes.

Measurable acceptance if deferred:

- `references/UPDATES.md` records why browser speech/audio automation was deferred and lists manual steps.

Targeted validation:

```sh
npm run test:smoke
npm run build
```

## Phase 9 - Split Math Engine Without Behavior Changes

Source action item:

- P2: `mathEngine.ts` is too large for safe long-term standards expansion.

Precondition:

- Do this after Phases 1-8 improve API contracts and smoke coverage.

### Phase 9A - Record current math behavior baseline

Files to inspect:

- `artifacts/mathquest-live/src/mathEngine.ts`
- `artifacts/mathquest-live/src/math/validateMath.ts`

Tasks:

1. Run `npm run validate:math` before refactor.
2. Save or summarize generator counts and validation sample output in `references/UPDATES.md`.

Measurable acceptance:

- `references/UPDATES.md` includes a dated pre-refactor math validation baseline.
- `npm run validate:math` exits `0` before refactor.

### Phase 9B - Extract shared math core

Tasks:

1. Extract shared types/helpers/signature/choice utilities into a math core module.
2. Keep exported public API stable.

Measurable acceptance:

- `rg "generateUniqueMathProblem|generateUniqueRecoveryProblem" artifacts/mathquest-live/src` proves existing public imports still resolve.
- `pnpm --filter @workspace/mathquest-live run typecheck` passes.

### Phase 9C - Split generators by grade/difficulty

Tasks:

1. Move Grade 3 generators into a Grade 3 module.
2. Move Grade 4 generators into a Grade 4 module.
3. Move Grade 5 generators into a Grade 5 module.
4. Move Extreme / advanced Grade 5 generators into an Extreme module.

Measurable acceptance:

- `rg "g3_|Grade 3|Easy" artifacts/mathquest-live/src/math` finds Grade 3 generator module ownership.
- `rg "g4_|Grade 4|Medium" artifacts/mathquest-live/src/math` finds Grade 4 generator module ownership.
- `rg "g5_|Grade 5|Hard|Extreme" artifacts/mathquest-live/src/math` finds Grade 5/Extreme generator module ownership.
- `artifacts/mathquest-live/src/mathEngine.ts` is reduced to orchestration/exports or renamed to a compatibility facade.

### Phase 9D - Prove no math behavior drift

Measurable acceptance:

- `npm run validate:math` exits `0` after refactor.
- `pnpm --filter @workspace/mathquest-live run typecheck` exits `0`.
- No benchmark metadata changes are made unless reflected in `references/CURRENT_BEST_BENCHMARK_USAGE.md`.
- If any generated problem signatures intentionally change, the change is documented with rationale in `references/UPDATES.md`; otherwise no intentional signature drift.

Targeted validation:

```sh
npm run validate:math
pnpm --filter @workspace/mathquest-live run typecheck
npm run build
```

## Phase 10 - Split Backend Story Route And Prompt Data Without Behavior Changes

Source action item:

- P2: Backend story route and prompt data are concentrated in oversized files.

Precondition:

- Do this after route contracts and smoke coverage are improved.

### Phase 10A - Extract story data from route mechanics

Files to inspect:

- `artifacts/api-server/src/routes/game/gameRoutes.ts`
- `artifacts/api-server/src/routes/game/storyPrompt.ts`
- `artifacts/api-server/src/routes/game/safety.ts`

Tasks:

1. Move genre profile and expansion data into data modules.
2. Move fallback scene/ending line pools into data modules.
3. Preserve prompt text byte-for-byte for unchanged inputs, or document every intentional prompt-output difference.

Measurable acceptance:

- `storyPrompt.ts` no longer contains the full genre/fallback data tables.
- New data modules are imported by `storyPrompt.ts`.
- A pre/post comparison exists for representative prompt-builder inputs. The comparison is either byte-for-byte identical or lists every intentional changed line.
- `npm run validate:quest-starts` passes.

### Phase 10B - Extract route validation and pending stores

Tasks:

1. Move request allowlist validation into a validation module.
2. Move pending turn and episode plan maps into store modules.
3. Preserve TTL behavior.
4. Preserve route paths and response shapes.

Measurable acceptance:

- `gameRoutes.ts` no longer directly owns all pending-turn and episode-plan map logic.
- New store modules contain TTL cleanup logic.
- `rg "pendingTurns|episodePlans|setInterval" artifacts/api-server/src/routes/game` proves route/store ownership is clear.
- API server typecheck passes.

### Phase 10C - Prove no story route behavior drift

Measurable acceptance:

- `pnpm --filter @workspace/api-server run typecheck` exits `0`.
- `npm run validate:quest-starts` exits `0`.
- `npm run test:smoke` exits `0`.
- No route path changes appear in `lib/api-spec/openapi.yaml` except those already required by earlier phases.

Targeted validation:

```sh
pnpm --filter @workspace/api-server run typecheck
npm run validate:quest-starts
npm run test:smoke
npm run build
```

## Phase 11 - Final Documentation And Review Cleanup

Source action items:

- P3: Build warnings should be resolved or documented.
- All quick wins.
- All redundancy removal log entries.

### Phase 11A - Update durable docs

Files to inspect:

- `README.md`
- `AGENTS.md`
- `references/UPDATES.md`
- `MATHQUEST_CODE_REVIEW_2026-06-06.md`
- `PLAN.md`

Tasks:

1. Update `references/UPDATES.md` with concise dated entries for completed phases.
2. Update `README.md` only where runtime behavior, env vars, validation, or deployment guidance changed.
3. Update `AGENTS.md` only where commands, conventions, generated files, or guardrails changed.

Measurable acceptance:

- `references/UPDATES.md` contains dated entries for every implemented phase.
- `rg "TRUST_PROXY|CORS_ORIGIN|allowedHosts|validate:images|validate:quest-starts" README.md AGENTS.md .env.example` proves changed operational guidance is documented if those features changed.
- No docs claim database support or persistent student state.

### Phase 11B - Resolve review and plan status

Tasks:

1. Mark review items resolved, deferred, or superseded in a summary section.
2. Document any remaining warnings or accepted tradeoffs.
3. Confirm no stale file references remain after deletions.

Measurable acceptance:

- `PLAN.md` or a follow-up section in `MATHQUEST_CODE_REVIEW_2026-06-06.md` lists every source review item and its final status.
- `rg "lib/db|attached_assets|scripts/src/hello.ts|@assets" README.md AGENTS.md references artifacts lib scripts` returns only intentional historical/plan/review references or no matches.
- `git status --short` is reviewed in the final response.

### Phase 11C - Final validation

Measurable acceptance:

- Final response includes exact pass/fail result for:
  - `pnpm --filter @workspace/mathquest-live run typecheck`
  - `pnpm --filter @workspace/api-server run typecheck`
  - `npm run validate:math`
  - `npm run validate:images`
  - `npm run validate:quest-starts`
  - `npm run build`
  - `npm run test:smoke`
- If a command fails, final response includes command, error summary, whether related to this work, and fix/defer reason.

## Review Item Coverage Matrix

| Review item | Plan phase | Measurable proof |
| --- | --- | --- |
| Pending story images can leave the UI stuck | Phase 1A | Smoke/component test plus `SceneImage` exhausted-poll branch |
| Image status route/schema missing from OpenAPI | Phase 1B | OpenAPI route/schema plus regenerated generated files |
| Public AI-cost routes need stronger backpressure | Phases 3A and 3B | Proxy/CORS docs, cap logic, friendly capacity responses |
| Prepared-turn runtime contracts drift from OpenAPI | Phases 2A and 2B | OpenAPI schemas, generated files, no local duplicate types |
| Missing OpenAI key crashes server startup | Phase 3C | No import-time throw and server-start evidence without key |
| `mathEngine.ts` too large | Phases 9A-9D | Grade modules plus math validator before/after |
| Backend story route/prompt files too large | Phases 10A-10C | Data/store/validation modules plus route validation |
| Database scaffold contradicts constraints | Phase 4A | `lib/db` absent and `rg` proves no active db refs |
| Starter `hello` script | Phase 4B | File/script absent and build passes |
| Large unused UI scaffold | Phases 5A-5C | Import inventory, deleted unused files, dependency proof |
| API client strategy inconsistent | Phases 2 and 7 | Generated route contracts and API access inventory |
| Thin smoke coverage outside math | Phase 8 | New smoke tests for setup/settings/image/ending |
| Frontend bundle size warning | Phases 5D and 11B | Build output reduced or documented |
| Settings selected badge text | Phase 6A | No visible `Selected` text in badge and `aria-pressed` remains |
| Hamster ancestry decision | Phase 6B | Removed with validation or documented retained decision |
| Unused `@assets` alias and old attached asset | Phase 6C | Alias removed and no active `@assets` imports |
| Vite `allowedHosts: true` | Phase 6D | Env-driven config or documented rationale |
| Build warnings | Phases 5D and 11B | Warnings removed or documented |
| Dependency pruning | Phases 4, 5, and 7 | Package/import proof and lockfile update |

## Final Review Item Status

| Source review item | Final status | Evidence |
| --- | --- | --- |
| Pending story images can leave the UI stuck | Resolved | Phase 1 added an exhausted-poll branch and smoke coverage for pending image timeout. |
| Image status route/schema missing from OpenAPI | Resolved | Phase 1 added ready/pending/failed status schemas plus `/api/images/status/{imageJobId}` and regenerated generated clients. |
| Public AI-cost routes need stronger backpressure | Resolved | Phase 3 added documented CORS/proxy guidance, prepared-turn/episode/image caps, and friendly capacity responses. |
| Prepared-turn runtime contracts drift from OpenAPI | Resolved | Phase 2 added prepared-turn OpenAPI schemas, regenerated generated clients, and switched frontend/backend consumers to generated contracts. |
| Missing OpenAI key crashes server startup | Resolved | Phase 3 moved OpenAI access behind runtime requirement checks; README documents safe fallback/static diagnostics without a key. |
| `mathEngine.ts` too large | Resolved | Phase 9 split shared helpers into `math/engineCore.ts` and grade-owned generator modules while preserving the public facade. |
| Backend story route/prompt files too large | Resolved | Phase 10 split story data, fallbacks, input validation, pending stores, and route response types into route-adjacent modules. |
| Database scaffold contradicts constraints | Resolved | Phase 4 removed `lib/db`, database workspace references, and unused database dependencies. |
| Starter `hello` script | Resolved | Phase 4 removed the unused starter script and related package entry. |
| Large unused UI scaffold | Resolved | Phase 5 removed unused scaffold components and pruned unused frontend dependencies. |
| API client strategy inconsistent | Resolved | Phases 2 and 7 normalized game calls through generated API clients and removed the unused app-level query client. |
| Thin smoke coverage outside math | Resolved | Phase 8 added smoke coverage for setup, settings scope, ending flow, browser speech start/stop, and pending image timeout. |
| Frontend bundle size warning | Accepted tradeoff | Phase 5 and 7 reduced bundle inputs, but the main Vite JS chunk remains slightly over 500 kB. This is documented in `references/UPDATES.md` and should be handled later with focused code-splitting if needed. |
| Settings selected badge text | Resolved | Phase 6 replaced visible selected text with icon-only selected badges while preserving accessible pressed state. |
| Hamster ancestry decision | Superseded by product direction | Phase 6 documented retention; later product work added/kept approved animal ancestry options. No removal is planned without an explicit product decision. |
| Unused `@assets` alias and old attached asset | Resolved | Phase 6 removed the Vite alias and old attached asset artifact; only historical update notes mention them now. |
| Vite `allowedHosts: true` | Resolved | Phase 6 replaced open allowed hosts with documented `VITE_ALLOWED_HOSTS` configuration. |
| Build warnings | Accepted tradeoff | Tooltip sourcemap warning was removed with scaffold cleanup. The remaining Vite chunk-size warning is non-fatal and documented as a future code-splitting candidate. |
| Dependency pruning | Resolved | Phases 4, 5, and 7 removed database, unused UI, and unused direct React Query dependency edges while preserving generated client support. |

## Final Validation Results

All final validation commands exited `0` on 2026-06-07:

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm --filter @workspace/mathquest-live run typecheck` | Passed | Frontend TypeScript checked with `tsc -p tsconfig.json --noEmit`. |
| `pnpm --filter @workspace/api-server run typecheck` | Passed | API TypeScript checked with `tsc -p tsconfig.json --noEmit`. |
| `npm run validate:math` | Passed | Validated generated problems across all difficulties and per-generator stress samples. |
| `npm run validate:images` | Passed | Image generation mode/config validation passed. |
| `npm run validate:quest-starts` | Passed | Reported `921984` safe quest opening combinations. |
| `npm run build` | Passed | Typechecks and workspace builds passed; the remaining Vite chunk-size warning is accepted as a future code-splitting tradeoff. |
| `npm run test:smoke` | Passed | Playwright ran 5 smoke tests successfully. |
| `OPENAI_API_KEY= NODE_ENV=production PORT=39999 STATIC_DIR=artifacts/mathquest-live/dist/public node --enable-source-maps artifacts/api-server/dist/index.mjs` plus `curl http://127.0.0.1:39999/api/healthz` | Passed | Server started without `OPENAI_API_KEY`; health endpoint returned `{"status":"ok"}`. |

## Recommended Commit Strategy

Commit after each phase with clear messages such as:

1. `fix: handle pending image timeouts and image API schema`
2. `chore: add prepared turn routes to API contract`
3. `chore: harden AI route limits and OpenAI startup`
4. `chore: remove unused database and starter script`
5. `chore: prune unused frontend UI scaffold`
6. `fix: clean small UI and asset leftovers`
7. `chore: normalize frontend API client usage`
8. `test: expand MathQuest smoke coverage`
9. `refactor: split math generators by grade`
10. `refactor: split backend story route data`
11. `docs: record code review cleanup completion`
