# MathQuest Live Project Audit - 2026-05-10

## Scope

This audit reviews the current MathQuest Live repo after the latest story, math, audio, standards-reference, and documentation passes. It is intentionally analysis-only: no application behavior changes are included in this report.

## Architecture Snapshot

- Frontend: Vite/React app in `artifacts/mathquest-live`.
- Frontend entry: `artifacts/mathquest-live/src/main.tsx`, with primary game orchestration in `artifacts/mathquest-live/src/App.tsx`.
- Backend: Express API in `artifacts/api-server`, with app setup in `src/app.ts` and server entry in `src/index.ts`.
- Story routes and safety/fallbacks: `artifacts/api-server/src/routes/game/`.
- Optional image generation: `artifacts/api-server/src/images/`, backend-only, temporary in-memory storage.
- Math generation: deterministic code in `artifacts/mathquest-live/src/mathEngine.ts`.
- Florida B.E.S.T. metadata: `artifacts/mathquest-live/src/math/floridaBestMath.ts`.
- Theme system: `artifacts/mathquest-live/src/colorSchemes.ts` plus CSS custom properties in `src/index.css`.
- Audio: session-only frontend music/effects in `src/lib/musicLibrary.ts`, `src/lib/musicManager.ts`, and `src/lib/sounds.ts`.
- API contract: `lib/api-spec/openapi.yaml` with generated clients in `lib/api-client-react/src/generated/` and zod schemas in `lib/api-zod/src/generated/`.
- References and planning docs: `references/`.
- Deployment: root `Dockerfile`, `docker-compose.yml`, and `.github/workflows/docker-publish.yml`.

## Current Strengths

- The app preserves the strongest classroom guardrails: no accounts, no database-backed student state, no analytics, no freeform student story input, and no frontend OpenAI key exposure.
- The Chronicler setup flow is now meaningfully more polished than a static form: preset choices, live color themes, quick start, and session-only settings all fit the classroom use case.
- Math remains code-generated and separated from AI story generation.
- Florida B.E.S.T. benchmark metadata is now substantially broader and documented under `references/`.
- Quest length now has clearer chapter counts: Quick 8, Standard 12, Full 16.
- Story generation now has stronger continuity through a backend episode plan and fuller story history.
- Image generation remains optional and backend-only, with cover/outro mode available.
- Audio controls are session-only and correctly separated from navigation effects.
- `AGENTS.md` gives future agents a useful map of commands, constraints, generated files, and done criteria.

## Student Experience And Playability

### What Works

- The fantasy framing is coherent and age-appropriate.
- Preset choices keep student input safe and fast.
- Math gates are still required before story progression.
- Progress is visible during gameplay.
- Skill-specific hints and supportive feedback reduce shame after wrong answers.
- Quick Start gives teachers a one-tap path for centers, early finishers, or rushed transitions.

### Risks

- Longer quest lengths may now exceed the original 10-15 minute goal for some classrooms, especially with AI/image latency.
- The increased math variety is good, but some problem text may still feel repetitive because many generators use similar fantasy item templates.
- The story can still feel disconnected from math unless the AI consistently uses the safe math skill flavor metadata well.

### Recommendations

- Add a teacher-facing note that Quick/Standard/Full are approximate timing bands, not guaranteed minute counts.
- Add a lightweight "recent skill mix" display for teachers only if it can stay hidden from normal student UI.
- Add more generator prompt templates per skill over time to reduce repeated wording.

## Chronicler Setup Flow

### What Works

- Setup is one question at a time and stays preset-only.
- The static intro image is a strong first impression.
- Confirmation moments are separate from question screens.
- Back behavior is available and setup values remain visible in the final flow.
- Color scheme preview is live and session-only.
- Quick Start coexists with full setup.

### Risks

- Setup is richer but still fairly long for impatient students.
- Some screen heights can still vary by option density, especially on smaller laptops and tablets.
- Quick Start now asks only difficulty, which is sensible, but teachers may want a "default class mode" later.

### Recommendations

- Keep full setup as the premium experience and Quick Start as the classroom-speed path.
- Continue testing setup on 1366x768 and mobile Safari; those are likely classroom pain points.

## Color Scheme, Settings, And Audio

### What Works

- Color schemes are centralized and applied via CSS variables.
- Settings can change color scheme and difficulty during an active adventure.
- Difficulty changes affect future math only and do not reset progress.
- Background music is discovered from local MP3 assets and managed globally.
- Background music defaults to a modest 10% volume.
- Navigation sound effects can be turned off independently.

### Risks

- Audio autoplay behavior varies by browser and device; current unlock-on-interaction is the right direction but should be manually tested on iPadOS and school-managed Chromebooks.
- Settings are session-only as intended, but refresh behavior should remain explicit in docs.

### Recommendations

- Add a short "Audio" section to teacher-facing docs if teachers report surprise about music.
- Keep the audio manager small; avoid playlists, track pickers, or persistent preferences for MVP.

## Florida B.E.S.T. Standards Alignment

### What Works

- Difficulty bands remain aligned to the intended model:
  - Easy / Adventurer: Grade 3.
  - Medium / Hero: Grade 4.
  - Hard / Champion: Grade 5.
  - Extreme / Legend: advanced Grade 5 within Grade 5 limits.
- Current math problems include benchmark metadata, official wording, conservative descriptions, skill labels, signatures, and hints.
- Grade 3, Grade 4, and Grade 5 reference files are now in `references/`.
- Normal student-facing UI does not clutter gameplay with benchmark codes.

### Risks

- Domains/strands are still conservative placeholders in generated metadata.
- Some generator coverage is broad relative to a single benchmark; future formal reporting should validate each generator shape against CPALMS/FDOE.
- Extreme must continue to be watched carefully so it does not drift into Grade 6 topics.

### Recommendations

- Add official domain/strand/reporting category metadata when available from a trusted source.
- Add a standards QA pass for each new generator before public/commercial standards claims.
- Keep documentation wording conservative: aligned bands, not exhaustive coverage.

## Math Generation And Reliability

### What Works

- Exact duplicate prevention uses stable signatures that ignore answer choice order.
- New `varietyGroup` metadata lets gameplay prefer unused skill families within a quest before repeating.
- Recovery problems participate in signature tracking.
- `npm run validate:math` validates 20 problems per difficulty for metadata, choices, answers, hints, and signatures.
- Recent expansion improves Easy, Medium, Hard, and Extreme variety.

### Risks

- Generator randomness is not seeded; this is fine for gameplay, but makes exact audit reproduction harder.
- Variety rotation is session-only browser memory, which is correct for privacy but means refresh resets all tracking.
- Some generated wrong-answer choices still rely on fallback generation for unit-bearing answers.

### Recommendations

- Add targeted validator loops for every individual generator, not only difficulty-level random samples.
- Add a "no duplicate choices after fallback" stress script with higher sample counts.
- Consider deterministic seeded validation only for CI/debugging, not gameplay.

## Story, AI Safety, And Images

### What Works

- Story generation is backend-only.
- Prompts enforce kid-safe content, exactly three choices, JSON output, and no AI-generated math.
- Fallback scenes and endings exist.
- Episode plans improve continuity without exposing planning UI to students.
- Cover/outro image behavior can block presentation while normal scenes remain non-blocking.
- Image prompts are built from controlled metadata and explicitly avoid text/numbers.

### Risks

- AI output safety remains probabilistic; validators help but cannot guarantee perfect story quality.
- Story history is capped to avoid prompt bloat; very long games may lose early details.
- Image generation latency can still make intro/outro feel slow when enabled.

### Recommendations

- Add a small library of fallback scenes/endings by theme so fallback mode feels less generic.
- Add logs around story fallback frequency and image timeout frequency in dev-only mode, without analytics or student data.
- Keep image generation off by default for classroom reliability unless teachers opt in.

## Accessibility And Mobile Readiness

### What Works

- Buttons and choice cards are large and keyboard focus has been improved.
- Settings/info modals have accessible labels and centered transitions.
- Static intro image has meaningful alt text.
- Selected states use checkmark and glow, not color alone.

### Risks

- Dense math screens with hints can become tall on mobile.
- Some decorative type choices are visually strong but may be harder for struggling readers.
- Reduced-motion support exists in places but should be audited end-to-end.

### Recommendations

- Manually test the full loop on iPhone Safari, iPad Safari, and 1366x768 Chromebook resolution.
- Add a high-readability theme or "simple text" mode later if teachers request intervention support.
- Keep avoiding animations that control comprehension or timing.

## Technical Reliability

### What Works

- The app uses request locks for starts, quick starts, actions, and math answers.
- Pending story generation supports background preparation while math is solved.
- Session version checks reduce stale async updates after reset.
- Docker and production static serving are straightforward.
- OpenAPI codegen keeps API clients and backend schemas aligned.

### Risks

- In-memory episode plans and pending turns vanish on backend restart, returning fallback behavior or rebuilt plans.
- There is no comprehensive automated browser test for the full game loop.
- `pnpm audit` currently reports dependency advisories.

### Recommendations

- Add a Playwright smoke test later for title -> setup/quick start -> one math gate -> next scene.
- Add a test for settings changes during an active math problem.
- Review dependency advisories and update safe transitive paths in a separate dependency-maintenance task.

## Deployment Readiness

### What Works

- Dockerfile performs workspace install/build and serves the built frontend through the backend.
- `docker-compose.yml` documents production-like environment variables.
- GitHub Actions publishes to GHCR on `main`, tags, and manual dispatch.
- Secrets remain server-side.
- `.env.example` exists and documents image/audio relevant settings.

### Risks

- Runtime uses Node 24 slim; verify Unraid host expectations and image compatibility.
- `pnpm audit` reports high/moderate advisories in current dependency graph.
- GHCR publishing depends on branch/tag workflow and package permissions.

### Recommendations

- Add an Unraid checklist with exact env vars and volume expectations if teachers/admins are a target audience.
- Create a separate dependency update branch for audit remediation.

## Validation Run

Commands run during this audit pass:

```sh
npm run validate:math
npm run validate:images
pnpm audit
```

Results:

- `npm run validate:math`: passed.
- `npm run validate:images`: passed.
- `pnpm audit`: failed with 13 reported vulnerabilities: 6 high and 7 moderate.

Notable audit findings:

- `picomatch` ReDoS advisories through Orval/Vite/Tailwind paths.
- `path-to-regexp` ReDoS advisories through Express/router.
- `lodash` advisories through `recharts`.
- `fast-uri`, `brace-expansion`, `yaml`, and `postcss` transitive advisories through tooling/build dependencies.

These were not remediated in this audit-only step.

## Prioritized Recommendations

### Critical / MVP

1. Dependency audit remediation.
   - Why: security and deployment confidence.
   - Difficulty: Medium.
   - Likely files: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`.
   - Grouping: implement alone.

2. Per-generator math validation.
   - Why: random difficulty-level validation can miss rare generator bugs.
   - Difficulty: Medium.
   - Likely files: `artifacts/mathquest-live/src/validateMath.ts`, `mathEngine.ts`.
   - Grouping: can pair with future generator additions.

3. Manual standards metadata domain/strand pass.
   - Why: benchmark codes are broader now, but domain fields remain placeholders.
   - Difficulty: Medium.
   - Likely files: `floridaBestMath.ts`, `references/`.
   - Grouping: implement alone.

### High-Impact MVP

1. Browser smoke test for the main game loop.
   - Why: catches regressions in setup, async story prep, math gate, settings, and ending.
   - Difficulty: Medium.
   - Likely files: test config and frontend selectors.
   - Grouping: implement alone.

2. Add theme-specific fallback scenes.
   - Why: AI failures should still feel polished.
   - Difficulty: Low.
   - Likely files: `gameRoutes.ts`, story fallback helpers.
   - Grouping: can pair with story prompt cleanup.

3. Improve generator text variety.
   - Why: repeated prompt templates reduce replay value.
   - Difficulty: Low/Medium.
   - Likely files: `mathEngine.ts`.
   - Grouping: can pair with per-generator validation.

### Nice-To-Have

1. Simple teacher-facing "skills practiced this quest" summary.
   - Why: classroom usefulness without saved student data.
   - Difficulty: Low.
   - Likely files: `EndingScreen.tsx`, `GameScreen.tsx`.
   - Grouping: implement alone.

2. High-readability text mode.
   - Why: supports struggling readers.
   - Difficulty: Medium.
   - Likely files: `colorSchemes.ts`, `index.css`, settings UI.
   - Grouping: implement alone.

3. More fallback image/status copy.
   - Why: makes optional image latency feel intentional.
   - Difficulty: Low.
   - Likely files: `SceneImage.tsx`, image service copy.
   - Grouping: can pair with image UX polish.

### Later

1. Teacher-configurable defaults without accounts.
   - Why: classroom setup speed.
   - Difficulty: High if persistence is avoided; requires careful design.
   - Target: Later.

2. Printable standards summary.
   - Why: teacher trust and lesson planning.
   - Difficulty: Medium.
   - Target: Later, after standards metadata is fully verified.

3. More authored adventure seed packs.
   - Why: replayability.
   - Difficulty: Medium.
   - Target: Later.

## Open Questions

- Should dependency audit remediation prefer upgrades only, or are dependency replacements acceptable if a package is unmaintained?
- Should generated story images remain opt-in for all deployments, or should some Docker presets enable cover/outro once latency is acceptable?
- Should the future standards domain/strand pass use CPALMS category names verbatim or conservative internal labels?
- Should classroom timing targets be revised now that quest lengths are 8/12/16 math-gated chapters?
