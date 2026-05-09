# MathQuest Live Project Audit

This audit is based on a read-only inspection of the newly exported legacy hosted platform project. No app code, package files, or dependencies were changed.

## Project Structure

The repository is a pnpm workspace with separate frontend, backend, generated API packages, and legacy hosted platform scaffolding.

Main application folders:

- `artifacts/mathquest-live/` - main React/Vite frontend app.
- `artifacts/api-server/` - main Node/Express backend app.
- `lib/api-spec/` - OpenAPI contract used for generated clients and schemas.
- `lib/api-client-react/` - generated React Query API client.
- `lib/api-zod/` - generated Zod schemas and TypeScript types.
- `lib/db/` - database scaffold using Drizzle/Postgres, but not used by the MathQuest MVP flow.
- `lib/integrations-openai-ai-*` and `lib/integrations/openai_ai_integrations/` - legacy hosted platform/OpenAI integration scaffolding, not the active game OpenAI path.

Important files:

- Frontend entry point: `artifacts/mathquest-live/src/main.tsx`
- Frontend app and state machine: `artifacts/mathquest-live/src/App.tsx`
- Frontend game types and initial state: `artifacts/mathquest-live/src/types.ts`
- Setup screen: `artifacts/mathquest-live/src/pages/SetupScreen.tsx`
- Game screen: `artifacts/mathquest-live/src/pages/GameScreen.tsx`
- Ending screen: `artifacts/mathquest-live/src/pages/EndingScreen.tsx`
- Math generator: `artifacts/mathquest-live/src/mathEngine.ts`
- Backend entry point: `artifacts/api-server/src/index.ts`
- Express app setup: `artifacts/api-server/src/app.ts`
- API route mount: `artifacts/api-server/src/routes/index.ts`
- Health route: `artifacts/api-server/src/routes/health.ts`
- Game API routes: `artifacts/api-server/src/routes/game/gameRoutes.ts`
- AI prompt builder: `artifacts/api-server/src/routes/game/storyPrompt.ts`
- AI output safety validation: `artifacts/api-server/src/routes/game/safety.ts`
- Active OpenAI client: `artifacts/api-server/src/lib/openaiClient.ts`

Game state is stored in React memory only through `useState` in `artifacts/mathquest-live/src/App.tsx`. There is no localStorage/sessionStorage usage for game progress, and refresh resets the app.

## How To Run Locally

Root scripts in `package.json`:

- `pnpm run build` - typecheck, then build all packages with build scripts.
- `pnpm run typecheck:libs` - TypeScript project build for libraries.
- `pnpm run typecheck` - typecheck libraries, artifacts, and scripts.

Frontend scripts in `artifacts/mathquest-live/package.json`:

- `pnpm --filter @workspace/mathquest-live run dev`
- `pnpm --filter @workspace/mathquest-live run build`
- `pnpm --filter @workspace/mathquest-live run serve`
- `pnpm --filter @workspace/mathquest-live run typecheck`

Backend scripts in `artifacts/api-server/package.json`:

- `pnpm --filter @workspace/api-server run dev`
- `pnpm --filter @workspace/api-server run build`
- `pnpm --filter @workspace/api-server run start`
- `pnpm --filter @workspace/api-server run typecheck`

The frontend and backend run separately.

Current local run requirements:

- Backend requires `PORT`.
- Backend requires `OPENAI_API_KEY`.
- Backend optionally uses `OPENAI_MODEL`.
- Frontend Vite config requires `PORT`.
- Frontend Vite config requires `BASE_PATH`.

Expected legacy hosted platform ports:

- API server: `8080`
- Frontend: `18567`

Local development caveat: the frontend generated API client calls relative paths such as `/api/game/start`. The Vite config currently does not define a dev proxy to the backend. Outside legacy hosted platform routing, browser requests to `localhost:18567/api/...` will hit the Vite dev server instead of the Express server unless a proxy or API base URL is added.

## Security Findings

Positive findings:

- The active `OPENAI_API_KEY` usage is backend-only in `artifacts/api-server/src/lib/openaiClient.ts`.
- No direct OpenAI browser calls were found in `artifacts/mathquest-live/src`.
- No frontend reference to `OPENAI_API_KEY` was found.
- No hardcoded `sk-...` OpenAI key was found.
- The main game stores state in React memory only.

Risks and gaps:

- `.env` is not listed in `.gitignore`.
- `.env.example` does not exist.
- `legacy-hosted-platform-notes.md` says required OpenAI env vars are `LEGACY_OPENAI_BASE_URL` and `LEGACY_OPENAI_API_KEY`, but the active game server actually requires `OPENAI_API_KEY`.
- Unused/scaffolded OpenAI integration packages reference legacy hosted platform-specific OpenAI integration env vars, which may confuse local and Docker setup.
- `app.use(cors())` allows all origins. That is acceptable during early local development, but should be restricted for production.
- The backend accepts client-provided game fields such as `hero`, `difficulty`, `adventureSeed`, `maxTurns`, `storySummary`, and `chosenAction` with minimal constraints.
- There is no API rate limiting.

## Classroom Safety Findings

Positive findings:

- Students do not type freeform story actions in the main UI.
- Hero setup uses preset select controls.
- Story choices are preset buttons returned by the backend.
- Math answers are selected from buttons.
- The prompt explicitly targets 4th grade students ages 9-11.
- The prompt forbids gore, graphic violence, death, romance, profanity, horror, weapons harming people, bullying, stereotypes, politics, religion, drugs, alcohol, smoking, sexual content, self-harm, and personal information requests.
- The prompt says the student can only choose from buttons.
- The prompt tells the AI not to generate math.
- The backend has fallback scenes and fallback endings.
- OpenAI errors and invalid AI output fall back to safe content.
- No login, no database-backed student profile, and no saved student data were found in the active game flow.

Risks and gaps:

- Safety validation is a simple banned-word filter. It is useful as a guardrail but not comprehensive.
- `storySummary` is not safety-checked before being stored and reused in future prompts.
- The ending `badge` is not checked by `checkSafety()`.
- Choice IDs are only checked for membership in `A`, `B`, `C`; duplicate IDs could pass.
- The API itself does not restrict `chosenAction` to one of the previously generated choices.
- The API itself does not restrict hero fields to the frontend's preset values.
- The story length selector allows 11 and 15 chapters, while the requirement says games should last about 8 successful turns.

## Game Loop Findings

Current flow:

1. Student starts on the title screen.
2. Student goes to setup and selects a preset hero, difficulty, story length, and adventure setting.
3. Frontend calls `/api/game/start`.
4. Backend asks OpenAI for an opening scene with exactly 3 choices.
5. Student selects one story choice.
6. Frontend generates a math problem locally.
7. Student must solve the math problem before the story advances.
8. On a correct answer, frontend increments `mathSolved`.
9. If the turn limit has not been reached, frontend calls `/api/game/turn`.
10. If the turn limit has been reached, frontend calls `/api/game/ending`.

Positive findings:

- Math is required before story progression.
- Incorrect answers do not advance the story.
- After two wrong attempts on a standard problem, the app switches to a simpler recovery problem.
- With the default `maxTurns = 8`, the game ends after 8 solved math challenges.

Risks and bugs:

- `handlePlayAgain()` calls `handleStart()` using the current state but does not reset `turn`, `mathSolved`, `wrongAttempts`, `showHint`, `recoveryMode`, or stale story fields. Starting another quest from the ending screen can inherit stale progress.
- Setup exposes story lengths of 8, 11, and 15 chapters, conflicting with the MVP requirement of about 8 successful turns.
- Game state is entirely client-controlled. That is acceptable for a no-login MVP, but it means students can manipulate requests if they use browser tools.
- `turn` starts at `1`, not `0`. The default 8-turn path works, but naming may cause off-by-one confusion during future maintenance.

## Math Engine Findings

Math generation lives in `artifacts/mathquest-live/src/mathEngine.ts`.

Difficulty levels:

- `Easy` - addition/subtraction within 1000 and basic multiplication.
- `Medium` - multi-digit by one-digit multiplication, division with remainders, and area.
- `Hard` - double-digit multiplication and a fixed fraction comparison.
- `Extreme` - decimal addition.

Positive findings:

- Math is generated by code, not AI.
- Correct answers are calculated deterministically.
- Answer choices are shuffled.
- A recovery problem generator lowers difficulty after repeated incorrect attempts.

Risks and bugs:

- Wrong answers are stored in a `Set`, which prevents duplicates among wrong answers.
- However, wrong answers can accidentally include the correct answer and are deleted afterward. This can leave fewer than 3 wrong answers, producing fewer than 4 answer choices.
- Several wrong-answer ranges are narrow enough that the fewer-than-4-choices bug is plausible.
- There are no tests to guarantee exactly 4 choices, unique choices, or inclusion of exactly one correct answer.
- The hard fraction comparison branch is always `3/4` vs `5/8`, so that skill is repetitive.

## AI Integration Findings

Active OpenAI integration:

- Client file: `artifacts/api-server/src/lib/openaiClient.ts`
- Call site: `callOpenAI()` in `artifacts/api-server/src/routes/game/gameRoutes.ts`
- Default model: `gpt-4.1-mini`
- Model override: `OPENAI_MODEL`
- API method: `openai.chat.completions.create`
- Response format: `{ type: "json_object" }`

Request/response behavior:

- The server sends one user message containing the full prompt.
- The server requests JSON object output.
- The server parses the returned JSON.
- If parsing or validation fails, it returns a fallback.
- Start and turn responses are checked with `checkStoryTurnSafety()`.
- Ending responses are checked with `checkEndingSafety()`.

Positive findings:

- OpenAI is only called from the backend.
- AI is instructed not to generate math.
- AI output is validated before display.
- OpenAI failures are handled gracefully.

Risks and gaps:

- The backend does not use the generated Zod response schemas to validate AI response shape.
- `response_format: { type: "json_object" }` is better than plain text, but it does not enforce a full schema.
- JSON parsing includes a fallback regex extraction of the first object, which may be fragile.
- `storySummary` is required by the response format but not validated in `checkStoryTurnSafety()`.
- Word-count requirements are prompt-only and not enforced.
- There is no OpenAI request timeout.
- There is no retry policy.
- There is no moderation API or classifier layer.

## legacy hosted platform-Specific Issues

legacy hosted platform-specific files/config:

- `legacy-platform-config`
- `legacy-ignore`
- `artifacts/*/legacy-artifact/artifact.toml`
- legacy hosted platform Vite plugins in `artifacts/mathquest-live/vite.config.ts`
- Required `PORT` and `BASE_PATH` in Vite config
- legacy hosted platform route mapping likely makes `/api` and `/` work together in preview.

Portability concerns:

- Local development needs an explicit frontend-to-backend proxy or base URL.
- The app currently depends on legacy hosted platform-style environment injection for frontend `PORT` and `BASE_PATH`.
- `legacy-hosted-platform-notes.md` contains stale OpenAI environment documentation.
- Generated/scaffolded DB and legacy hosted platform OpenAI integration packages add noise for an MVP that should have no database and a simple backend-only OpenAI key.
- Docker/Unraid deployment will need clear routing:
  - `/api/*` to Express backend.
  - `/` to static frontend.
- NGINX Proxy Manager should terminate external traffic and route to the appropriate internal services.

## Prioritized Fix List

### Critical

- Add `.env` to `.gitignore`.
- Add `.env.example` with required local variables.
- Fix local frontend/backend routing with a Vite dev proxy or API base URL.
- Correct documentation to use the active `OPENAI_API_KEY` path.
- Fix `handlePlayAgain()` so a replay starts from clean initial game progress.

### Important

- Lock MVP story length to 8 turns or clearly explain non-8 modes.
- Strengthen AI response validation with strict schemas.
- Validate `storySummary`, unique choice IDs, choice labels, ending badge, and string lengths.
- Restrict server request values to known-safe presets.
- Guarantee math problems always return exactly 4 unique choices containing exactly one correct answer.
- Add tests for math generation and game loop behavior.
- Restrict production CORS.

### Nice To Have

- Remove or clearly document unused database scaffolding.
- Remove or isolate unused legacy hosted platform OpenAI integration scaffolding.
- Add OpenAI timeout handling.
- Add API rate limiting.
- Improve `index.html` metadata, which still says "built on legacy hosted platform."
- Add production health and deployment notes for Unraid.

## Recommended Next Steps

### Phase 1: Make It Run Locally

- Add `.env` to `.gitignore`.
- Add `.env.example`.
- Update run documentation for `OPENAI_API_KEY`, `OPENAI_MODEL`, `PORT`, and `BASE_PATH`.
- Add a Vite dev proxy for `/api` or configure the generated API client base URL.
- Verify frontend and backend startup locally.

### Phase 2: Secure And Safety Cleanup

- Reset game state correctly for play-again/new-game paths.
- Enforce the 8-turn MVP requirement.
- Tighten backend request validation to allowed presets.
- Tighten AI output validation.
- Expand safety checks to `storySummary` and ending `badge`.
- Restrict production CORS.

### Phase 3: Clean Architecture

- Centralize shared constants such as hero options, difficulties, seeds, and max turns.
- Decide whether math generation should stay client-side or move backend-side for stronger tamper resistance.
- Add focused tests for math generation, turn progression, fallback behavior, and response validation.
- Remove or document unused scaffolding so future work is easier to reason about.

### Phase 4: Docker And Unraid Readiness

- Add Dockerfile and compose configuration.
- Build the Vite frontend to static assets.
- Run Express as a separate backend service.
- Configure NGINX Proxy Manager routing:
  - `/api/*` routes to the backend.
  - all other paths route to the frontend.
- Document required Unraid environment variables.
- Add production health check guidance.
