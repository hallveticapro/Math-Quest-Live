# MathQuest Live ChatGPT Project Handoff

## Purpose

Use this file to give a future ChatGPT or Codex session fast project context without turning the app into a different product. MathQuest Live is a direct-to-user, session-only student play experience: students pick preset options, solve deterministic math, and advance through safe AI-written story scenes.

## Product Guardrails

- No teacher-facing UI, dashboards, classroom mode, rosters, reports, analytics, accounts, database, saved progress, ads, or persistent student data.
- No freeform student story input. Student choices remain preset/button-based.
- Math is generated and checked by app code, never by AI.
- AI is backend-only and writes story text plus optional controlled images.
- Frontend code must never receive or use `OPENAI_API_KEY`.
- Challenge bands are standards bands: Easy/Adventurer = Grade 3, Medium/Hero = Grade 4, Hard/Champion = Grade 5, Extreme/Legend = advanced Grade 5 only.
- Extreme must stay inside Grade 5 expectations. Avoid Grade 6+ content such as negative numbers, slope, linear equations, and middle-school ratios.

## Current Architecture

- Frontend: Vite/React app in `artifacts/mathquest-live`.
- Main frontend state and API flow: `artifacts/mathquest-live/src/App.tsx`.
- Setup flow: `artifacts/mathquest-live/src/pages/SetupScreen.tsx`.
- Title and Quick Start flow: `artifacts/mathquest-live/src/pages/TitleScreen.tsx`.
- Gameplay UI: `artifacts/mathquest-live/src/pages/GameScreen.tsx`.
- Ending/outro UI: `artifacts/mathquest-live/src/pages/EndingScreen.tsx`.
- Deterministic math generation: `artifacts/mathquest-live/src/mathEngine.ts`.
- Florida B.E.S.T. metadata: `artifacts/mathquest-live/src/math/floridaBestMath.ts`.
- Rich fraction/table visuals: `artifacts/mathquest-live/src/components/MathRichDisplay.tsx`.
- Color schemes: `artifacts/mathquest-live/src/colorSchemes.ts`.
- Frontend audio: `artifacts/mathquest-live/src/lib/sounds.ts`, `artifacts/mathquest-live/src/lib/musicManager.ts`, and `artifacts/mathquest-live/src/assets/music/`.
- Backend API: `artifacts/api-server/src/routes/game/`.
- Story prompt and fallback logic: `artifacts/api-server/src/routes/game/storyPrompt.ts`.
- Optional backend image generation: `artifacts/api-server/src/images/`.
- API contract source: `lib/api-spec/openapi.yaml`; generated clients live under `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/`.

## Current UX Notes

- The Chronicler setup is step-by-step and preset-only.
- The old standalone pre-quest writing screen was removed. Setup now transitions directly into the game loading state for first story/cover preparation.
- Color schemes preview live during setup and can be changed in settings during play. They are session-only.
- Background music and navigation sound effects are session-only. Music files are auto-discovered by Vite from `.mp3` files in `artifacts/mathquest-live/src/assets/music/`; the fresh-session music volume defaults to 5%.
- Loading copy rotates slowly enough to read, currently around a 4.5-second cadence.
- Intro/cover and outro images may block scene presentation behind themed loading copy; normal in-story images should remain non-blocking unless deliberately changed.
- Social embed metadata is centralized in `artifacts/mathquest-live/index.html`; rich social image assets live in `artifacts/mathquest-live/public/images/`.

## Math Model Notes

- Every generated problem should include difficulty, grade band, standards system, benchmark metadata, skill label, problem type, hints, and a stable signature.
- Signatures should identify the mathematical problem and ignore answer choice order.
- Duplicate prevention is session-only browser memory.
- Optional `richDisplay` metadata can be used for visual fractions/tables, but the plain prompt must still make sense and answer checking must stay deterministic.
- Keep benchmark codes out of normal student-facing UI.
- Update `references/CURRENT_BEST_BENCHMARK_USAGE.md` when benchmark usage changes.

## Documentation Map

- `AGENTS.md`: repo-specific instructions for Codex agents.
- `UPDATES.md`: newest-first project change log. Add a timestamped entry before meaningful commits/checkpoints.
- `README.md`: user/developer setup, environment, deployment, and feature documentation.
- `references/`: long-form standards references, audits, plans, and future Markdown planning material.
- `references/PLAN.md`: if present and explicitly requested by the user, treat it as the source of truth for that task.

## Verification Commands

Use pnpm. The root `preinstall` script rejects npm/yarn package installs.

```sh
npm run build
npm run validate:math
npm run validate:images
pnpm --filter @workspace/mathquest-live run typecheck
pnpm --filter @workspace/api-server run typecheck
```

There is no general lint or unit-test command currently. Use build and validators unless a task adds or discovers a specific test.

## Good Next-Session Habits

- Inspect before editing.
- Keep changes focused; avoid broad rewrites.
- Make small local commits for large multi-part plans when requested.
- Preserve unrelated user changes in the worktree.
- Run the relevant validators for the area touched.
- State blockers explicitly instead of silently skipping validation.
