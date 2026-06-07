# MathQuest Live Code Review - 2026-06-06

## Executive Summary

MathQuest Live is in solid functional shape: the current build, typechecks, math validator, image validator, quest-start validator, and existing Playwright smoke test all pass. The strongest parts of the codebase are the deterministic math validation layer, the backend-only AI boundary, the preset-only student input model, and the recent session guards that prevent stale async start/ending responses from replacing a newer quest. The biggest risks are public-deployment hardening around AI-cost routes, incomplete generated API contracts for prepared turns and pending images, and a few UX edge cases where non-blocking image generation can leave a permanent loading placeholder. The dominant maintainability issue is not bad code so much as accumulated feature mass in a few very large files, especially `App.tsx`, `mathEngine.ts`, `gameRoutes.ts`, and `storyPrompt.ts`.

Validation baseline from this review:

- `pnpm --filter @workspace/mathquest-live run typecheck` passed.
- `pnpm --filter @workspace/api-server run typecheck` passed.
- `npm run validate:math` passed.
- `npm run validate:images` passed.
- `npm run validate:quest-starts` passed with `921984` safe combinations.
- `npm run build` passed, with the existing Vite chunk-size warning and one sourcemap warning from `src/components/ui/tooltip.tsx`.
- `npm run test:smoke` passed.

## 2. Prioritised Action Items

### P0

No P0 issues were found in this review. I did not find an obvious production crash, student-data loss path, exposed OpenAI key in frontend code, AI-generated math path, database-backed student state, or direct violation of the no-accounts/no-analytics/no-freeform-input guardrails.

### P1

#### 1. Pending story images can leave the UI stuck on "Illustration still loading..."

**Affected files / functions**

- `artifacts/mathquest-live/src/components/SceneImage.tsx`
- `artifacts/api-server/src/images/imageService.ts`
- `artifacts/api-server/src/routes/images/imageRoutes.ts`
- `lib/api-spec/openapi.yaml`
- `lib/api-client-react/src/generated/*`
- `lib/api-zod/src/generated/*`

**Problem**

`SceneImage` polls a pending image every 2 seconds, but after 10 attempts it only clears the interval and leaves `resolvedImage.status === "pending"`. If a job is still pending, slow, lost, or never observed as failed, students can see a permanent dashed "Illustration still loading..." block. The runtime API also returns `pending` and `failed` image statuses, but the OpenAPI `StoryImage` schema only represents `ready`, and `/api/images/status/:imageJobId` is not in the spec. That means the generated API types do not describe real frontend data.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/src/components/SceneImage.tsx, artifacts/api-server/src/images/imageService.ts, artifacts/api-server/src/routes/images/imageRoutes.ts, lib/api-spec/openapi.yaml, and the generated API clients. Do not rewrite the whole app.

Fix non-blocking scene image polling so pending images cannot remain stuck forever. When SceneImage reaches its max polling attempts, convert the local image state to a failed/hidden state or a concise expired placeholder, rather than leaving "Illustration still loading..." visible indefinitely. Keep intro/outro blocking behavior unchanged. Update lib/api-spec/openapi.yaml so StoryImage supports ready, pending, and failed states and add the image status endpoint. Regenerate generated clients with pnpm --filter @workspace/api-spec run codegen. Run npm run validate:images and npm run build.

Acceptance criteria:
- Non-blocking story images either resolve, fail quietly, or show a deliberate timeout state.
- No permanent pending placeholder remains after polling is exhausted.
- OpenAPI and generated clients match the runtime image payloads.
- Image failures still never block gameplay permanently.
```

#### 2. Public AI-cost routes need stronger backpressure and deployment defaults

**Affected files / functions**

- `artifacts/api-server/src/app.ts`
- `artifacts/api-server/src/lib/rateLimit.ts`
- `artifacts/api-server/src/routes/game/gameRoutes.ts`
- `artifacts/api-server/src/images/imageService.ts`
- `artifacts/api-server/src/images/imageStore.ts`
- `.env.example`
- `README.md`

**Problem**

The API has useful in-memory rate limiting, but public deployment still has soft spots. `CORS_ORIGIN` defaults to wildcard behavior, `req.ip` is used without explicit proxy guidance, and expensive `/api/game/prepare` requests can start OpenAI work before math is solved. `pendingTurns`, `episodePlans`, `imageJobs`, and temporary images have TTL cleanup, but no hard max sizes or per-session/per-IP pending caps. This is acceptable for local or small classroom use, but a public URL could be embedded or spammed by other sites, causing unnecessary OpenAI cost or false throttling behind a proxy.

**Fix prompt**

```text
Before editing, inspect artifacts/api-server/src/app.ts, artifacts/api-server/src/lib/rateLimit.ts, artifacts/api-server/src/routes/game/gameRoutes.ts, artifacts/api-server/src/images/imageService.ts, artifacts/api-server/src/images/imageStore.ts, .env.example, and README.md. Do not add accounts, analytics, a database, or persistent student tracking.

Harden public-deployment cost controls for AI routes. Add explicit proxy configuration support such as TRUST_PROXY with clear docs. Keep the current portable in-memory limiter, but improve its client-key behavior for known proxy deployments. Add conservative in-memory caps for pending prepared turns, episode plans, image jobs, and stored images, returning friendly 429/503 responses when capacity is reached. Add per-episode or per-client pending prepared-turn limits so repeated action clicks or scripted calls cannot accumulate unbounded OpenAI work. Update README and .env.example to recommend exact CORS origins for public deployment instead of wildcard. Run npm run build, npm run validate:images, and npm run test:smoke.

Acceptance criteria:
- Public deployment docs explain CORS_ORIGIN, TRUST_PROXY, and rate-limit tuning.
- Expensive AI work has rate limits plus bounded in-memory pending state.
- Friendly errors are returned instead of crashes.
- No accounts, database, analytics, or persistent tracking are added.
```

#### 3. Prepared-turn runtime contracts are hand-written and drift from the generated API spec

**Affected files / functions**

- `artifacts/mathquest-live/src/App.tsx` (`PrepareGameStepBody`, `PrepareGameStepResponse`, `ResolvePreparedStepResponse`, `prepareGameStep`, `resolvePreparedStep`)
- `artifacts/api-server/src/routes/game/gameRoutes.ts` (`/prepare`, `/resolve`, `parsePrepareBody`)
- `lib/api-spec/openapi.yaml`
- `lib/api-client-react/src/generated/*`
- `lib/api-zod/src/generated/*`

**Problem**

The app uses generated clients for `startGame`, `takeTurn`, and `getEnding`, but the newer `/api/game/prepare` and `/api/game/resolve` flow is manually typed in `App.tsx` and manually parsed in `gameRoutes.ts`. `lastMathSkill` is a real runtime field but is not represented in the OpenAPI spec. This makes the most stateful part of the game less protected by generated validation than older, simpler routes.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/src/App.tsx, artifacts/api-server/src/routes/game/gameRoutes.ts, lib/api-spec/openapi.yaml, lib/api-client-react/src/generated, and lib/api-zod/src/generated. Do not change the game loop or AI behavior.

Bring /api/game/prepare and /api/game/resolve into the generated API contract. Add OpenAPI schemas for PrepareGameStepBody, PrepareGameStepResponse, ResolvePreparedStepBody, ResolvePreparedStepResponse, and the lastMathSkill metadata. Regenerate generated clients with pnpm --filter @workspace/api-spec run codegen. Replace the local manual frontend types/functions in App.tsx with generated client calls or generated response types. Where appropriate, replace manual backend parsing with generated zod schemas plus the existing allowlist validation. Run pnpm --filter @workspace/mathquest-live run typecheck, pnpm --filter @workspace/api-server run typecheck, npm run build, and npm run test:smoke.

Acceptance criteria:
- Prepared-turn request/response shapes are documented in OpenAPI.
- Generated frontend/backend types match runtime payloads.
- Existing math gate and prepared story behavior still work.
- No AI math generation is introduced.
```

#### 4. OpenAI startup failure can prevent the server from booting even for non-AI routes

**Affected files / functions**

- `artifacts/api-server/src/lib/openaiClient.ts`
- `artifacts/api-server/src/routes/game/gameRoutes.ts`
- `artifacts/api-server/src/images/providers/openaiImageProvider.ts`

**Problem**

`openaiClient.ts` throws at module import time when `OPENAI_API_KEY` is missing. That is straightforward, but it also means the entire server cannot boot to serve health/static frontend/non-AI diagnostics without the key. For production this may be desired; for Docker smoke checks, health probes, and clearer deployment diagnostics it is brittle. The app already has graceful fallbacks for story generation once a request is running, but not for process startup.

**Fix prompt**

```text
Before editing, inspect artifacts/api-server/src/lib/openaiClient.ts, artifacts/api-server/src/routes/game/gameRoutes.ts, artifacts/api-server/src/images/providers/openaiImageProvider.ts, README.md, and .env.example. Do not expose OpenAI keys to the frontend.

Change OpenAI client initialization so the Express server can boot and serve /api/health/static frontend even if OPENAI_API_KEY is missing, while AI routes still return clear friendly errors or fallbacks when a story/image request requires the key. Keep production docs clear that OPENAI_API_KEY is required for normal gameplay. Avoid silently pretending AI is configured. Run pnpm --filter @workspace/api-server run typecheck and npm run build.

Acceptance criteria:
- Missing OPENAI_API_KEY no longer crashes server import/startup.
- Story routes still fail gracefully with kid-safe fallback/error behavior when no key is configured.
- Health/static serving can work for deployment diagnostics.
- README/.env.example explain the behavior.
```

### P2

#### 1. `mathEngine.ts` is too large for safe long-term standards expansion

**Affected files / functions**

- `artifacts/mathquest-live/src/mathEngine.ts`
- `artifacts/mathquest-live/src/math/floridaBestMath.ts`
- `artifacts/mathquest-live/src/math/validateMath.ts`
- `references/CURRENT_BEST_BENCHMARK_USAGE.md`

**Problem**

`mathEngine.ts` contains types, choice helpers, signature logic, rich display helpers, recovery logic, and every generator for Grades 3-5 plus Extreme. It validates well, but future standards expansion is risky because unrelated generator changes happen in one very large file. This also makes dead-code review and benchmark-specific reasoning harder.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/src/mathEngine.ts, artifacts/mathquest-live/src/math/floridaBestMath.ts, artifacts/mathquest-live/src/math/validateMath.ts, and references/CURRENT_BEST_BENCHMARK_USAGE.md. Do not change generated problem behavior in this pass.

Refactor mathEngine.ts into small modules without changing public behavior. Extract shared types/helpers/signature/choice utilities into a math/core module, Grade 3 generators into math/generators/grade3.ts, Grade 4 into grade4.ts, Grade 5 into grade5.ts, and Extreme into grade5Extreme.ts. Keep the existing generateUniqueMathProblem and generateUniqueRecoveryProblem API stable. Preserve all signatures, benchmark metadata, hints, rich display metadata, and validation behavior. Run npm run validate:math and npm run build.

Acceptance criteria:
- Math validator output still passes.
- Existing exported math engine functions remain compatible.
- Generator code is grouped by grade/difficulty.
- No benchmark mappings or generated problem shapes change.
```

#### 2. Backend story route and prompt data are concentrated in oversized files

**Affected files / functions**

- `artifacts/api-server/src/routes/game/gameRoutes.ts`
- `artifacts/api-server/src/routes/game/storyPrompt.ts`
- `artifacts/api-server/src/routes/game/safety.ts`

**Problem**

`gameRoutes.ts` mixes request validation, pending-turn storage, OpenAI calls, fallback handling, story history, image scheduling, and route handlers. `storyPrompt.ts` mixes allowlists, genre profile data, prompt builders, and plan creation. Both files are working, but they are now large enough that small changes to story flavor or safety can accidentally touch route mechanics.

**Fix prompt**

```text
Before editing, inspect artifacts/api-server/src/routes/game/gameRoutes.ts, artifacts/api-server/src/routes/game/storyPrompt.ts, and artifacts/api-server/src/routes/game/safety.ts. Do not change story behavior or prompt wording in this pass.

Refactor backend story code for maintainability. Move genre profile/expansion data and fallback lines into data modules, move request allowlist validation into a validation module, and move pending prepared-turn/episode-plan storage into small store modules with the same TTL behavior. Keep route paths, request/response shapes, prompt text, image behavior, and fallbacks unchanged. Run pnpm --filter @workspace/api-server run typecheck, npm run validate:quest-starts, and npm run build.

Acceptance criteria:
- Runtime behavior and validation results are unchanged.
- Story data is separated from route mechanics.
- Route handlers become easier to scan.
- No teacher UI, persistence, analytics, or database is added.
```

#### 3. Database scaffold contradicts the product constraints and adds unused dependencies

**Affected files / functions**

- `lib/db/*`
- `artifacts/api-server/package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- root `tsconfig.json` references, if present

**Problem**

The repo still tracks a Drizzle/Postgres workspace with conversation/message schemas and `DATABASE_URL` requirements, and `@workspace/api-server` depends on `@workspace/db` and `drizzle-orm`. No active app code imports the database package, and the product explicitly avoids accounts, saved progress, analytics, and database-backed student state. This increases dependency surface area and confuses future agents.

**Fix prompt**

```text
Before editing, inspect lib/db, artifacts/api-server/package.json, pnpm-workspace.yaml, pnpm-lock.yaml, and root tsconfig references. Do not add any replacement persistence.

Remove the unused database scaffold from the workspace. Delete lib/db, remove @workspace/db and drizzle-orm from the API server package, remove db workspace references, and update the lockfile with pnpm install --lockfile-only if needed. Confirm no source imports @workspace/db or DATABASE_URL. Update AGENTS.md/README only if they mention the db scaffold. Run pnpm install --frozen-lockfile only if the lockfile already matches; otherwise run the appropriate pnpm lockfile update, then npm run build.

Acceptance criteria:
- No database package remains in the workspace.
- API server still builds and runs without DATABASE_URL.
- Product guardrails remain no database/no saved student data.
```

#### 4. Large unused UI scaffold bloats dependencies and build surface

**Affected files / functions**

- `artifacts/mathquest-live/src/components/ui/*`
- `artifacts/mathquest-live/package.json`
- `artifacts/mathquest-live/src/hooks/use-mobile.ts`
- `artifacts/mathquest-live/src/hooks/use-toast.ts`
- `artifacts/mathquest-live/src/components/ui/dialog.tsx`
- `artifacts/mathquest-live/src/components/ui/tooltip.tsx`
- `artifacts/mathquest-live/src/components/ui/toaster.tsx`

**Problem**

The app uses a small subset of the shadcn/Radix UI scaffold, but dozens of tracked UI components and their dependencies are unused. This contributes to the large frontend module count, makes dependency audits noisier, and may be related to the current Vite sourcemap warning in `tooltip.tsx`. Keep the components actually used by dialogs/tooltips/toasts; delete the rest.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/src/components/ui, artifacts/mathquest-live/package.json, and all imports from "@/components/ui". Do not change visible app behavior.

Prune unused shadcn/Radix UI scaffold from MathQuest Live. Keep only components that are imported by app code, such as dialog, tooltip, toast/toaster, and any genuinely used card utilities. Delete unused UI component files and remove dependencies that are only needed by those deleted files. Do not remove lucide-react or core React/Vite/Tailwind dependencies. Run pnpm --filter @workspace/mathquest-live run typecheck and npm run build.

Acceptance criteria:
- No deleted component is imported anywhere.
- Package dependencies match actual usage.
- Build still passes.
- App UI behavior is unchanged.
```

#### 5. API client strategy is inconsistent

**Affected files / functions**

- `artifacts/mathquest-live/src/App.tsx`
- `lib/api-client-react/src/generated/*`
- `lib/api-spec/openapi.yaml`
- `artifacts/mathquest-live/src/main.tsx` or app provider setup
- `artifacts/mathquest-live/package.json`

**Problem**

The frontend imports generated fetch functions for some routes, writes manual `customFetch` wrappers for others, and still wraps the app in `QueryClientProvider` even though the current screen flow does not use generated React Query hooks. This is not a correctness bug, but it creates two patterns for API access and keeps `@tanstack/react-query` in the runtime path without clear benefit.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/src/App.tsx, lib/api-client-react/src/generated, lib/api-spec/openapi.yaml, artifacts/mathquest-live/package.json, and app provider setup. Do not change route behavior.

Choose one API client pattern and make it consistent. Prefer generated fetch functions for all game routes once OpenAPI includes prepare/resolve/image status. If no React Query hooks are used, remove QueryClientProvider and @tanstack/react-query from the frontend app unless generated clients require it. Keep error handling and fallback behavior intact. Run pnpm --filter @workspace/mathquest-live run typecheck and npm run build.

Acceptance criteria:
- Game API calls use one consistent typed pattern.
- Unused provider/dependency code is removed if no hooks remain.
- No route behavior changes.
```

#### 6. Testing is strong for math but thin for story, image, audio, and setup regressions

**Affected files / functions**

- `artifacts/mathquest-live/tests/main-flow.smoke.spec.ts`
- `artifacts/mathquest-live/playwright.config.ts`
- `artifacts/api-server/src/routes/game/*`
- `artifacts/api-server/src/images/*`

**Problem**

The math validator is extensive and the single Playwright smoke test is useful, but the smoke coverage only exercises Quick Start through one math gate with mocked API responses. There is no automated coverage for full Chronicler setup, settings scope, read-aloud/music ducking, image pending timeout, ending flow, or backend safety fallback paths. Recent work has been UI/state heavy, so this gap will compound.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/tests/main-flow.smoke.spec.ts, artifacts/mathquest-live/playwright.config.ts, artifacts/mathquest-live/src/App.tsx, GameScreen.tsx, SetupScreen.tsx, and SceneImage.tsx. Do not add accounts, dashboards, analytics, or persistence.

Add focused Playwright smoke coverage for the riskiest current flows: full setup with default ancestry/class, setup settings audio-only scope, game settings full scope, image pending timeout/failure display, read-aloud start/stop with music ducking mocked where practical, and ending transition. Keep API responses mocked so tests do not call OpenAI. Run npm run test:smoke and npm run build.

Acceptance criteria:
- Smoke tests cover setup, game, image pending/failure, read-aloud controls, and ending at a high level.
- Tests do not require OPENAI_API_KEY or network AI calls.
- Existing smoke test still passes.
```

#### 7. Frontend bundle is large enough to start watching

**Affected files / functions**

- `artifacts/mathquest-live/src/App.tsx`
- `artifacts/mathquest-live/src/mathEngine.ts`
- `artifacts/mathquest-live/src/assets/music/*`
- `artifacts/mathquest-live/package.json`
- `artifacts/mathquest-live/vite.config.ts`

**Problem**

The production build succeeds, but Vite reports the main JS chunk is over 500 kB. The app transforms 1800+ modules, largely due to broad UI/dependency scaffold and a large single-route frontend bundle. This is acceptable for MVP, but if more generators, UI, and media controls land without pruning, first-load performance will degrade on school Chromebooks.

**Fix prompt**

```text
Before editing, inspect the Vite build output, artifacts/mathquest-live/package.json, artifacts/mathquest-live/src/App.tsx, artifacts/mathquest-live/src/mathEngine.ts, and component imports. Do not change app behavior.

Reduce frontend bundle size by pruning unused UI/dependencies first, then consider lazy-loading infrequently used dialogs or heavy modules if the bundle remains large. Do not split math generation out of the initial bundle if that would delay gameplay or complicate deterministic math. Run npm run build and compare bundle warnings before/after.

Acceptance criteria:
- Unused dependencies are removed.
- The app still loads and builds.
- Bundle warning is reduced or a concrete remaining cause is documented.
```

### P3

#### 1. Settings selected badge still uses text where compact checkmark-only styling was requested earlier

**Affected files / functions**

- `artifacts/mathquest-live/src/components/QuestSettingsDialog.tsx` (`SelectedBadge`)

**Problem**

`SelectedBadge` still renders the word `Selected` beside the checkmark for color and challenge cards. Earlier UI cleanup removed selected text in setup cards because it crowded the layout. Settings cards are less crowded than setup, so this is not urgent, but it is inconsistent and can still compete with option text on narrow screens.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/src/components/QuestSettingsDialog.tsx and current selected-state styles. Do not redesign settings.

Change the settings SelectedBadge to use the existing small checkmark badge without the "Selected" text, matching the cleaner selected-card pattern used elsewhere. Preserve aria-pressed on the buttons so selected state remains accessible. Run pnpm --filter @workspace/mathquest-live run typecheck and npm run build.

Acceptance criteria:
- Settings selected cards show a compact checkmark badge.
- No card text is covered or pushed by selected-state text.
- Accessibility selected state remains available through aria-pressed.
```

#### 2. `Hamster` ancestry may be accidental now that Koala replaced the request

**Affected files / functions**

- `artifacts/mathquest-live/src/adventureOptions.ts`
- `artifacts/api-server/src/routes/game/storyPrompt.ts`
- `references/UPDATES.md`

**Problem**

The user initially asked for Hamster, then corrected to Koala. The code currently includes both. This is harmless and classroom-safe, but if Koala was intended to replace Hamster, Hamster is a stale option. Do not remove it without product confirmation unless the next cleanup prompt explicitly says Koala should replace Hamster.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/src/adventureOptions.ts, artifacts/api-server/src/routes/game/storyPrompt.ts, and references/UPDATES.md. Do not change unrelated hero options.

If Hamster was an accidental ancestry from the corrected request, remove Hamster from the frontend ancestry list, backend ALLOWED_ANCESTRIES, descriptions, and any docs that present current options. Keep Koala. Run npm run validate:quest-starts and npm run build.

Acceptance criteria:
- Koala remains available.
- Hamster is removed only if this cleanup is explicitly desired.
- Frontend/backend allowlists stay synchronized.
```

#### 3. `@assets` Vite alias points to an old attached-assets folder

**Affected files / functions**

- `artifacts/mathquest-live/vite.config.ts`
- `attached_assets/Pasted-Build-a-working-MVP-web-app-called-MathQuest-Live-This-_1778265639100.txt`

**Problem**

The Vite config still defines `@assets` to point at `attached_assets`, but no app source imports `@assets`. The folder contains an old pasted MVP prompt text file. This is harmless, but it is dead context that can mislead future agents about where assets belong. Current music and public images already have better homes.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/vite.config.ts and search for @assets imports. Do not move real app assets.

Remove the unused @assets alias if no imports use it. Delete the old attached_assets prompt file/folder if it is not needed as project documentation. Run pnpm --filter @workspace/mathquest-live run typecheck and npm run build.

Acceptance criteria:
- No @assets imports remain.
- Vite config only defines aliases that are used.
- Build still passes.
```

#### 4. Vite dev server allows all hosts

**Affected files / functions**

- `artifacts/mathquest-live/vite.config.ts`

**Problem**

`server.allowedHosts` and `preview.allowedHosts` are set to `true`. This is convenient for tunnels and LAN testing, but it is a loose default. It does not expose secrets by itself, and Vite is development-only here, but it is worth tightening or documenting because the app is often used in local/public-ish classroom networking.

**Fix prompt**

```text
Before editing, inspect artifacts/mathquest-live/vite.config.ts and README development instructions. Do not change production Express serving.

Replace allowedHosts: true with an environment-driven allowed-hosts list or document why it must remain true for the current workflow. Keep localhost/127.0.0.1 working by default. Run pnpm --filter @workspace/mathquest-live run typecheck and npm run build.

Acceptance criteria:
- Local development still works.
- Host allowance is explicit and documented.
```

#### 5. Build warnings should be either resolved or documented

**Affected files / functions**

- `artifacts/mathquest-live/src/components/ui/tooltip.tsx`
- `artifacts/mathquest-live/package.json`
- `artifacts/mathquest-live/vite.config.ts`

**Problem**

The build currently warns that Vite cannot resolve the original sourcemap location for `src/components/ui/tooltip.tsx`, and it warns about a chunk over 500 kB. Neither warning breaks the build, but repeated warnings train future agents to ignore build output.

**Fix prompt**

```text
Before editing, run npm run build and inspect the warnings. Then inspect artifacts/mathquest-live/src/components/ui/tooltip.tsx, artifact package dependencies, and Vite config. Do not change UI behavior.

Resolve the tooltip sourcemap warning if it is caused by a stale generated component or dependency mismatch. If the chunk warning remains after unused dependency cleanup, document the known cause in references/UPDATES.md or README developer notes. Run npm run build.

Acceptance criteria:
- Build warnings are either removed or clearly documented as accepted.
- No visible app behavior changes.
```

## 3. Quick Wins

These are small, safe fixes that can be batched after the P1 work:

- Remove `scripts/src/hello.ts` and the `hello` script from `scripts/package.json`; it is starter scaffold and not used by validation or app behavior.
- Remove the unused `@assets` Vite alias and old `attached_assets` prompt file if no historical documentation value remains.
- Convert `QuestSettingsDialog` selected badges to checkmark-only badges.
- Decide whether `Hamster` should remain; if not, remove it from frontend/backend allowlists and run `npm run validate:quest-starts`.
- Add `/api/images/status/{imageJobId}` and pending/failed image states to OpenAPI when fixing image polling.
- Add max-count constants/env vars for image jobs and stored images; this can be done without adding a database.
- Add one Playwright smoke test for the full setup flow using mocked story routes.
- Add one Playwright smoke test for image pending timeout behavior.
- Add a short README note that `CORS_ORIGIN=*` is for local/private testing and public deployments should use the real origin.

## 4. Redundancy Removal Log

Items that appear deletable or removable after a focused verification pass:

- `lib/db/` - unused Drizzle/Postgres scaffold; no active source imports it, and it conflicts with the no-database product direction.
- `@workspace/db` dependency in `artifacts/api-server/package.json` - unused because the API server does not import the db package.
- `drizzle-orm` dependency in `artifacts/api-server/package.json` - unused directly by the API server.
- `scripts/src/hello.ts` - starter script that only logs a message.
- `scripts/package.json` `hello` script - only invokes the unused starter script.
- `attached_assets/Pasted-Build-a-working-MVP-web-app-called-MathQuest-Live-This-_1778265639100.txt` - old pasted prompt artifact, not used by app code.
- `@assets` alias in `artifacts/mathquest-live/vite.config.ts` - no current imports use it.
- Unused UI scaffold files under `artifacts/mathquest-live/src/components/ui/`: `accordion.tsx`, `alert-dialog.tsx`, `alert.tsx`, `aspect-ratio.tsx`, `avatar.tsx`, `badge.tsx`, `breadcrumb.tsx`, `button-group.tsx`, `button.tsx`, `calendar.tsx`, `carousel.tsx`, `chart.tsx`, `checkbox.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `empty.tsx`, `field.tsx`, `form.tsx`, `hover-card.tsx`, `input-group.tsx`, `input-otp.tsx`, `input.tsx`, `item.tsx`, `kbd.tsx`, `label.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `popover.tsx`, `progress.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `sonner.tsx`, `spinner.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`, `toggle-group.tsx`, and `toggle.tsx`. Keep `dialog.tsx`, `tooltip.tsx`, `toast.tsx`, and `toaster.tsx` unless a fresh import scan says otherwise.
- Likely removable frontend dependencies after UI scaffold pruning: `@hookform/resolvers`, many unused `@radix-ui/*` packages, `cmdk`, `date-fns`, `embla-carousel-react`, `framer-motion`, `input-otp`, `next-themes`, `react-day-picker`, `react-hook-form`, `react-icons`, `react-resizable-panels`, `recharts`, `sonner`, `vaul`, and `wouter`. Remove only after confirming no remaining imports.
- `@tanstack/react-query` and `QueryClientProvider` are candidates only if the generated API client strategy is simplified away from React Query hooks.
- `Hamster` ancestry is a removal candidate only if the product decision is that the later Koala request replaced it rather than adding to it.
