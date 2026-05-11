# MathQuest Live Agent Guide

## What This Repo Is

MathQuest Live is a pnpm workspace for a classroom-safe AI math adventure game. The frontend is a Vite/React app in `artifacts/mathquest-live`; the backend is an Express API in `artifacts/api-server`; shared generated API clients live under `lib/`; utility scripts live in `scripts/`.

The app’s core constraints matter:

- No student accounts, saved progress, database-backed student state, analytics, ads, or freeform student story input.
- Student choices stay preset/button-based.
- Math is generated and checked by app code, not AI.
- AI is used for story text and optional backend-only images only.
- Do not expose `OPENAI_API_KEY` or other secrets to frontend code.
- Florida B.E.S.T. challenge bands are the model: Easy = Grade 3, Medium = Grade 4, Hard = Grade 5, Extreme = advanced Grade 5 only.

## First Things To Inspect

- `README.md` for product behavior, environment variables, Docker/Unraid notes, and public deployment guidance.
- `package.json` for root workspace commands.
- `artifacts/mathquest-live/src/App.tsx` for browser game state and API flow.
- `artifacts/mathquest-live/src/mathEngine.ts` and `artifacts/mathquest-live/src/math/floridaBestMath.ts` for deterministic math generation and standards metadata.
- `artifacts/mathquest-live/src/components/MathRichDisplay.tsx` for student-facing fraction/table visuals driven by math problem metadata.
- `artifacts/api-server/src/routes/game/` for story routes, prompt construction, and safety/fallback behavior.
- `artifacts/api-server/src/images/` for optional backend image generation.
- `artifacts/mathquest-live/src/lib/sounds.ts`, `artifacts/mathquest-live/src/lib/musicManager.ts`, and `artifacts/mathquest-live/src/assets/music/` for frontend audio.
- `lib/api-spec/openapi.yaml` plus generated files in `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/` for API client/schema contracts.
- `references/` for standards references, planning docs, and future Markdown reference material.
- `references/UPDATES.md` for the newest durable project change notes and agent handoff breadcrumbs.

## Commands

Use pnpm. The root `preinstall` script rejects npm/yarn installs.

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
- Local frontend default: `http://localhost:18567`.
- Backend dev default: `http://localhost:8080`, with Vite proxying `/api`.
- `npm run build` runs typechecks first, then builds workspace packages that define a build script.
- There is no separate lint script currently. Do not document or assume one exists.
- There is no general unit-test framework currently. Use the validators and build unless a task adds or discovers a specific test command.

## Generated And Derived Files

- API generated outputs are under:
  - `lib/api-client-react/src/generated/`
  - `lib/api-zod/src/generated/`
- Regenerate them from `lib/api-spec/openapi.yaml` with:

```sh
pnpm --filter @workspace/api-spec run codegen
```

- Build artifacts live in `dist/` and are ignored.
- `*.tsbuildinfo`, `.cache/`, `.local/`, `.env`, and `.env.*` are ignored.
- Do not commit real secrets or local environment files.

## Math And Standards Conventions

- Difficulty is a standards band, not a student grade selector.
- Keep Extreme inside Grade 5 expectations. Do not add Grade 6 content such as negative numbers, slope, linear equations, or middle-school ratios/proportional relationships.
- Every math problem should include difficulty, grade band, standards system, benchmark metadata, skill label, problem type, hints, and a stable signature.
- Fraction/table-style problems may include optional `richDisplay` metadata. Keep it visual-only and aligned with the plain-text prompt; answer checking and signatures should still use deterministic problem data, not rendered markup.
- Signatures should identify the mathematical problem and ignore answer choice order.
- Duplicate prevention is session-only browser memory; do not add persistence unless explicitly requested.
- Normal student UI should not be cluttered with benchmark codes.
- Update `references/CURRENT_BEST_BENCHMARK_USAGE.md` when benchmark usage changes.
- Use the grade reference docs in `references/` as the source for benchmark wording already imported into the repo.

## AI, Safety, And Images

- Story generation lives on the backend. Frontend code should never call OpenAI directly.
- Safety and fallback behavior are part of the route/prompt flow; preserve graceful fallbacks when changing story/image code.
- The AI must not generate or solve math.
- Image generation is optional, backend-only, disabled by default, and stores temporary/disposable images in memory.
- Image prompt text should be built from controlled game metadata only, not student freeform input.
- Image failures, timeouts, invalid providers, or rate limits must not block gameplay permanently.
- Intro/cover and outro images may intentionally gate scene presentation behind themed loading copy; normal in-story images should remain non-blocking unless a task explicitly changes that behavior.

## UI Conventions

- Keep the Chronicler setup flow preset/button-based.
- Do not reintroduce the removed standalone pre-quest writing screen; first-story/cover preparation belongs in the game loading state.
- Preserve session-only color schemes; do not add `localStorage` unless specifically requested.
- Preserve session-only audio settings. Background music defaults to 50% fresh-session volume. Background music files belong in `artifacts/mathquest-live/src/assets/music/` and are auto-discovered by Vite from `.mp3` files; do not add a hand-maintained music manifest.
- Site/social preview assets belong in `artifacts/mathquest-live/public/images/`; keep social metadata centralized in `artifacts/mathquest-live/index.html`.
- Rotating Chronicle/loading copy should stay readable. Use a calm cadence around 4-5 seconds unless a task needs faster feedback.
- Keep mobile layouts and focus states in mind. Buttons/cards should remain large enough for Chromebooks and tablets.
- Use existing components and styles in `artifacts/mathquest-live/src/components/` and `artifacts/mathquest-live/src/index.css` before inventing new patterns.

## Deployment Notes

- Docker build uses the root `Dockerfile`.
- `docker-compose.yml` defines local production-like serving on port `3000`.
- GitHub Actions publishes Docker images from `.github/workflows/docker-publish.yml` on `main`, semantic version tags, and manual dispatch.
- Production serves the backend API and built frontend from the Express server. `STATIC_DIR` defaults to the built frontend path locally and `/app/public` in Docker.

## Done When

For most code changes, a task is done when:

- The requested behavior is implemented without violating the no-accounts/no-database/no-saved-student-data/no-freeform-input constraints.
- Relevant docs are updated when commands, environment variables, standards usage, deployment behavior, or developer workflow changes.
- `references/UPDATES.md` has a newest-first timestamped note before each meaningful commit or checkpoint.
- `npm run build` succeeds.
- `npm run validate:math` succeeds for math changes.
- `npm run validate:images` succeeds for image-mode changes.
- Generated API clients are regenerated if `lib/api-spec/openapi.yaml` changes.
- `git status --short` is reviewed, and unrelated user changes are not reverted.

If verification cannot be run, state the blocker explicitly in the final response.
