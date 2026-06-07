# MathQuest Live Agent Guide

## Repo Shape

MathQuest Live is a pnpm workspace for a classroom-safe AI math adventure game.

- Frontend: `artifacts/mathquest-live` (Vite/React).
- Backend: `artifacts/api-server` (Express API).
- Shared API contract/generated clients: `lib/`.
- Utility scripts: `scripts/`.
- Standards and durable notes: `references/`.

## Core Guardrails

- No student accounts, saved progress, database-backed student state, analytics, ads, or freeform student story input.
- Student choices must stay preset/button/card based.
- Math is generated and checked by app code, not AI.
- AI is backend-only for story text and optional images.
- Never expose `OPENAI_API_KEY` or other secrets to frontend code.
- Difficulty bands follow Florida B.E.S.T.: Easy = Grade 3, Medium = Grade 4, Hard = Grade 5, Extreme = advanced Grade 5 only.
- Keep Extreme within Grade 5 expectations; avoid Grade 6+ topics such as negative numbers, slope, linear equations, and middle-school proportional reasoning.

## Start Here

- `README.md` for product behavior, env vars, deployment, Docker/Unraid, and public hosting notes.
- `package.json` for workspace scripts.
- `artifacts/mathquest-live/src/App.tsx` for browser game state and API flow.
- `artifacts/mathquest-live/src/mathEngine.ts` and `artifacts/mathquest-live/src/math/` for deterministic math generation.
- `artifacts/mathquest-live/src/components/MathRichDisplay.tsx` for visual math rendering.
- `artifacts/api-server/src/routes/game/` for story routes, prompt construction, validation, and fallbacks.
- `artifacts/api-server/src/images/` for optional backend image generation.
- `lib/api-spec/openapi.yaml` plus generated files under `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/`.
- `references/UPDATES.md` for the latest short project checkpoint.

## Commands

Use pnpm. The root `preinstall` rejects npm/yarn installs.

```sh
pnpm install --frozen-lockfile
npm run dev
npm run build
npm run validate:math
npm run validate:images
```

Useful targeted commands:

```sh
pnpm --filter @workspace/mathquest-live run dev
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/mathquest-live run typecheck
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-spec run codegen
```

Notes:

- `npm run dev` loads `.env` if present and starts frontend and backend together.
- Frontend dev default: `http://localhost:18567`.
- Backend dev default: `http://localhost:8080`, with Vite proxying `/api`.
- `npm run build` runs typechecks first, then builds packages that define a build script.
- There is no separate lint script or general unit-test framework unless one is added later.

## Generated And Local Files

- Regenerate API clients after editing `lib/api-spec/openapi.yaml`:

```sh
pnpm --filter @workspace/api-spec run codegen
```

- Build output lives in ignored `dist/` folders.
- `*.tsbuildinfo`, `.cache/`, `.local/`, `.env`, and `.env.*` are ignored.
- Do not commit secrets or local environment files.

## Math Rules

- Difficulty is a standards band, not a student grade selector.
- Every math problem should include difficulty, grade band, standards system, benchmark metadata, skill label, problem type, hints, and a stable signature.
- Signatures identify the mathematical problem and ignore answer choice order.
- Rich display metadata is visual-only; answer checking and signatures must rely on deterministic problem data.
- Duplicate prevention is session-only browser memory.
- Normal student UI should not show benchmark-code clutter.
- Update `references/CURRENT_BEST_BENCHMARK_USAGE.md` when benchmark usage changes.
- Use the grade reference docs in `references/` for benchmark wording already imported into the repo.

## AI, Safety, And Images

- Frontend code must never call OpenAI directly.
- Preserve story/image fallback behavior when changing routes, prompts, or providers.
- AI must not generate or solve math.
- Image generation is optional, backend-only, disabled by default, and stores temporary/disposable images in memory.
- Image prompt text must come from controlled game metadata, not student freeform input.
- Image failures, timeouts, invalid providers, and rate limits must not block gameplay permanently.
- Intro/cover and outro images may gate scene presentation behind themed loading copy; normal in-story images should stay non-blocking unless explicitly changed.

## UI Conventions

- Keep the Chronicler setup flow preset/button-based.
- Do not reintroduce the removed standalone pre-quest writing screen.
- Preserve session-only color schemes and audio settings; do not add `localStorage` unless requested.
- Background music defaults to 50% fresh-session volume.
- Music files belong in `artifacts/mathquest-live/src/assets/music/` and are auto-discovered from `.mp3` files.
- Story read-aloud uses the browser Web Speech API only; do not add backend TTS, paid TTS APIs, persistence, or speech logs.
- Site/social preview assets belong in `artifacts/mathquest-live/public/images/`; social metadata stays in `artifacts/mathquest-live/index.html`.
- Rotating Chronicle/loading copy should stay readable, usually around a 4-5 second cadence.
- Keep mobile layouts, Chromebook/tablet touch targets, and focus states in mind.
- Prefer existing components and styles in `artifacts/mathquest-live/src/components/` and `artifacts/mathquest-live/src/index.css`.

## Deployment

- Docker build uses the root `Dockerfile`.
- `docker-compose.yml` serves a local production-like app on port `3000`.
- GitHub Actions publishes Docker images from `.github/workflows/docker-publish.yml` on `main`, semantic version tags, and manual dispatch.
- Production serves the backend API and built frontend from Express.
- `STATIC_DIR` defaults to the built frontend locally and `/app/public` in Docker.

## Done When

- The requested behavior is implemented without violating the core guardrails.
- Docs are updated when commands, env vars, standards usage, deployment behavior, or developer workflow changes.
- `references/UPDATES.md` has one newest checkpoint line in `YYYY-MM-DD: Short description.` format.
- Run `npm run build` for most code changes.
- Run `npm run validate:math` for math changes.
- Run `npm run validate:images` for image-mode changes.
- Regenerate API clients when `lib/api-spec/openapi.yaml` changes.
- Review `git status --short` and do not revert unrelated user changes.
- If verification cannot be run, state the blocker in the final response.
