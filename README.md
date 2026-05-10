# MathQuest Live

## Overview

MathQuest Live is a classroom-safe AI math adventure game for elementary students. Students choose from preset hero and story options, solve code-generated math challenges, and advance through short AI-written adventure scenes.

The MVP does not require student accounts, login, a database, saved progress, rosters, or stored student data. Game state lives in browser memory and resets on refresh.

Students begin with a step-by-step Chronicler setup flow instead of a single form. During setup they choose preset hero details, challenge level, quest length, adventure theme, and a session-only color scheme. Color schemes preview live while students choose them and remain active through the current game session. They affect visual appearance only; they do not affect difficulty, standards alignment, math content, AI safety rules, story outcome, or saved data. Refreshing the page resets the MVP session.

Core features include preset-only student choices, deterministic app-generated math, Florida B.E.S.T. standards-band challenge levels, skill-specific hints, repeated-question prevention within a quest, session-only color themes, optional backend-only AI images, and a Quick Start path for faster classroom launch.

Made for educators with love by Andrew Hall ❤️

- Support: [Buy Me a Coffee](https://buymeacoffee.com/hallveticapro)
- GitHub: [hallveticapro/math-quest-live](https://github.com/hallveticapro/math-quest-live)
- Threads: [@hallveticapro](https://www.threads.net/@hallveticapro)
- Instagram: [@hallveticapro](https://www.instagram.com/hallveticapro)
- TikTok: [@hallveticapro](https://www.tiktok.com/@hallveticapro)

© 2026 MathQuest Live

## Quest Lengths

Quest length is measured by successful math challenges, not setup, intro text, wrong-answer retries, or the ending screen.

- `Quick Quest` - 5 successful math challenges.
- `Standard Quest` - 8 successful math challenges.
- `Full Quest` - 10 successful math challenges.

The game screen shows visible progress as `Math Challenges: solved / total`. Progress advances only after a correct math answer moves the story forward.

## Environment Variables

Required:

- `OPENAI_API_KEY` - Server-side OpenAI API key used by the Express backend. Keep this secret. Never put it in frontend code and never commit it.

Optional:

- `OPENAI_MODEL` - Story model used by the backend. Defaults to `gpt-4.1-mini`.
- `STORY_TIMEOUT_MS` - Maximum time the backend waits for AI story text before returning safe fallback content. Defaults to `30000`.
- `RATE_LIMIT_ENABLED` - Enables simple in-memory rate protection for AI-cost endpoints. Defaults to `true`.
- `RATE_LIMIT_WINDOW_MS` - Rate-limit window length. Defaults to `60000`.
- `RATE_LIMIT_MAX_REQUESTS` - Maximum game/story API requests per window. Defaults to `60`.
- `IMAGE_RATE_LIMIT_MAX_REQUESTS` - Maximum image-status polling requests per window. Defaults to `20`.
- `CORS_ORIGIN` - Allowed CORS origin for the API. Defaults to `*`.
- `PORT` - Port used by the production Express server. Defaults to `3000`.
- `NODE_ENV` - Use `production` for Docker/Unraid production serving.
- `STATIC_DIR` - Directory containing the built frontend files. Docker sets this to `/app/public`.
- `FRONTEND_PORT` - Vite dev server port. Defaults to `18567`.
- `HOST` - Vite dev server host. Defaults to `127.0.0.1`.
- `BASE_PATH` - Vite base path. Defaults to `/`.
- `API_PROXY_TARGET` - Vite dev proxy target for `/api`. Defaults to `http://localhost:8080`.
- `ENABLE_IMAGE_GENERATION` - Enables backend-only generated illustrations when set to `true`. Defaults to `false`.
- `IMAGE_MODE` - Image generation mode. Valid values are `off`, `cover`, `cover_outro`, `milestones`, and `every_scene`. Defaults to `cover_outro`.
- `IMAGE_PROVIDER` - Image provider. Defaults to `openai`. Unsupported providers log a warning and disable images.
- `IMAGE_MODEL` - Image model. Defaults to `gpt-image-1-mini`.
- `IMAGE_QUALITY` - Image quality. Valid values are `low`, `medium`, and `high`. Defaults to `medium`.
- `IMAGE_SIZE` - Generated image size. Defaults to `1024x1024`.
- `IMAGE_STYLE` - Image prompt style. Defaults to `cartoon-fantasy`.
- `IMAGE_TIMEOUT_MS` - Maximum time the backend will wait for an image before continuing without one. Defaults to `45000`.
- `IMAGE_STORAGE_MODE` - Temporary image storage mode. Currently `memory`.

Copy `.env.example` to `.env` for local use and fill in your real key:

```sh
cp .env.example .env
```

Do not commit `.env`.

## Local Development

This repository is a pnpm workspace. `npm install` is intentionally not the dependency installer for this project.

```sh
# Do not use this for this pnpm workspace:
npm install

# Use this instead:
pnpm install --frozen-lockfile
```

Start both frontend and backend from the repo root:

```sh
npm run dev
```

Open:

```text
http://localhost:18567
```

Run each side separately if needed:

```sh
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/mathquest-live run dev
```

The frontend calls relative `/api` routes. During local Vite development, `/api` is proxied to the backend.

## Developer And Codex Notes

The repo-level agent guide is `AGENTS.md`. Start there for the current project map, commands, constraints, generated files, and task completion checks.

Planning and standards-reference Markdown files live in the root `references/` directory. Put future planning/reference `.md` files there instead of under `artifacts/`.

Common verification commands:

```sh
npm run build
npm run validate:math
npm run validate:images
```

Targeted checks:

```sh
pnpm --filter @workspace/mathquest-live run typecheck
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-spec run codegen
```

There is no general lint or unit-test script currently. Do not assume one exists unless a future package manifest adds it.

Generated API files live in `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/`. If `lib/api-spec/openapi.yaml` changes, regenerate those clients with:

```sh
pnpm --filter @workspace/api-spec run codegen
```

Future Codex sessions should preserve the MVP constraints: no student accounts, no database-backed student state, no analytics, no freeform student story input, backend-only OpenAI calls, and code-generated math only.

## Frontend Audio

Background music files live in:

```text
artifacts/mathquest-live/src/assets/music/
```

To add more quest music later, drop `.mp3` files into that folder and rebuild the app. The frontend discovers all MP3 files in that folder at build time with Vite, so there is no manually maintained music manifest.

The old root `MUSIC/` folder was only a temporary intake location and should not remain in the repo after files are moved.

Audio settings are session-only and reset on refresh:

- Background music defaults to on.
- Background music volume defaults to 50%.
- Navigation sound effects default to on.

Music starts only after a user interaction unlocks browser audio. Tracks rotate through a shuffled playlist, avoid immediate repeats when multiple tracks exist, fade in/out, and transition smoothly between songs. If the music folder is empty, gameplay continues without background music.

## Difficulty and Florida B.E.S.T. Standards Alignment

Students choose a challenge level, not a grade level. The student-facing labels map to Florida B.E.S.T. Mathematics content bands in code:

- `Easy` / `Adventurer` maps to Grade 3 Florida B.E.S.T. math skills.
- `Medium` / `Hero` maps to Grade 4 Florida B.E.S.T. math skills.
- `Hard` / `Champion` maps to Grade 5 Florida B.E.S.T. math skills.
- `Extreme` / `Legend` uses advanced Grade 5 Florida B.E.S.T. skills and does not jump into middle school standards.

The standards map lives in `artifacts/mathquest-live/src/math/floridaBestMath.ts`. It defines each difficulty band, grade band, benchmark codes, conservative teacher-readable benchmark descriptions, skill labels, allowed generators, and verification metadata. These labels are intended to support classroom practice and teacher transparency. They do not claim exhaustive coverage of every benchmark in a grade.

Math problems include Florida B.E.S.T. benchmark metadata for teacher visibility and internal alignment. Current benchmark metadata has been cross-checked against user-provided CPALMS course-export PDFs for Grades 3-5. Some generators intentionally cover a focused subset of a benchmark, and a few generator/benchmark pairings are marked for review before formal standards reporting. Benchmark descriptions are intentionally conservative and should be verified against CPALMS/FDOE before public release, formal standards reporting, or commercial standards claims.

All math problems are generated by app code in `artifacts/mathquest-live/src/mathEngine.ts`. The AI does not generate, solve, or validate math problems. Each generated problem includes metadata for future teacher/debug views:

```ts
{
  difficulty: "Easy",
  gradeBand: 3,
  standardsSystem: "Florida B.E.S.T. Mathematics",
  benchmark: "MA.3.AR.1.2",
  benchmarkDescription: "Practice one- and two-step whole-number word problems involving multiplication within Grade 3 limits.",
  officialBenchmark: "Solve one- and two-step real-world problems involving any of four operations with whole numbers.",
  verificationStatus: "verified_from_provided_source",
  skill: "multiplication within 100",
  skillId: "g3_multiplication_equal_groups",
  problemType: "g3MultiplicationFacts",
  signature: "Easy|MA.3.AR.1.2|g3_multiplication_equal_groups|..."
}
```

MathQuest tracks generated problem signatures in memory during each quest to avoid repeated questions within a session. The signature ignores answer choice order, so the same problem with shuffled answers still counts as a repeat. This tracking resets when a new quest starts, when Play Again starts a fresh run, or when the page refreshes.

Run the lightweight math validator:

```sh
npm run validate:math
```

The validator samples all four difficulty levels and checks that every generated problem has benchmark metadata, verification metadata, a difficulty, a grade band, a signature, four unique answer choices, the correct answer in the choices, and no duplicate signatures within the sample batch.

## Public Deployment Cost Protection

MathQuest Live includes simple, portable, in-memory rate protection for AI-cost routes. It does not add accounts, analytics, a database, or saved student tracking. For public deployments, keep `RATE_LIMIT_ENABLED=true` and tune:

```text
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
IMAGE_RATE_LIMIT_MAX_REQUESTS=20
```

When the limit is reached, the API returns a friendly `429` response asking the user to wait briefly.

## Optional AI Image Generation

Generated illustrations are backend-only and off by default. Set `ENABLE_IMAGE_GENERATION=true` to allow the Express server to request temporary OpenAI images. The frontend never receives the OpenAI API key.

The default mode is:

```text
IMAGE_MODE=cover_outro
IMAGE_PROVIDER=openai
IMAGE_MODEL=gpt-image-1-mini
IMAGE_QUALITY=medium
IMAGE_STYLE=cartoon-fantasy
```

Image modes:

- `off` - Never generate images.
- `cover` - Generate only the intro/cover image.
- `cover_outro` - Generate only the intro/cover and ending/outro images.
- `milestones` - Generate intro, every second story turn, and ending images.
- `every_scene` - Attempt an image for each generated scene and ending.

Images can increase cost and latency. `every_scene` should be used cautiously. Cover and outro images are allowed to finish before those scenes appear; regular in-story images stay non-blocking, so story text returns first and eligible images appear later if they finish in time. Image generation failure, rate limits, timeouts, or unsupported providers do not stop gameplay; the app continues with the story text and math challenge.

After the intro, the app starts preparing the next scene as soon as the student chooses an action. The student solves the required math challenge while the backend generates the next story text and any eligible image. The prepared scene is only revealed after a correct math answer, so the math gate remains required.

Generated images are stored temporarily in server memory and are disposable. They are not written to permanent storage and are lost when the server restarts or when the image expires. No student freeform input is used in image prompts. Prompts use controlled game metadata and generic style language such as cartoon fantasy/storybook; they avoid living artists, studios, brands, and franchise-specific styles.

Run the lightweight image-mode validator:

```sh
npm run validate:images
```

Manual image checks:

- `ENABLE_IMAGE_GENERATION=false`: gameplay should behave like the text-only app.
- `ENABLE_IMAGE_GENERATION=true` and `IMAGE_MODE=cover`: intro image only.
- `ENABLE_IMAGE_GENERATION=true` and `IMAGE_MODE=cover_outro`: intro and ending images only.
- `ENABLE_IMAGE_GENERATION=true` and `IMAGE_MODE=milestones`: intro, every second story turn, and ending images.
- `ENABLE_IMAGE_GENERATION=true` and `IMAGE_MODE=every_scene`: images attempted for each scene.
- Invalid `IMAGE_PROVIDER`: server logs a warning and gameplay continues without images.
- Provider failure or timeout: gameplay continues without showing technical errors to students.
- Confirm `OPENAI_API_KEY` appears only in backend environment configuration, not frontend code.

## Production Build

Build everything:

```sh
npm run build
```

Start the production Express server after building:

```sh
npm start
```

Production Express serves:

- `/api/*` from the backend routes.
- Built frontend static files from `artifacts/mathquest-live/dist/public` by default when started from the repo root.
- `index.html` fallback for non-API routes so client-side routing can work.

## Docker Local Testing

Create a local `.env` first:

```sh
cp .env.example .env
```

Set `OPENAI_API_KEY` in `.env`, then run:

```sh
docker compose up --build
```

The app will be available at:

```text
http://localhost:3000
```

Equivalent Docker commands:

```sh
docker build -t mathquest-live .
docker run --env-file .env -p 3000:3000 mathquest-live
```

## GitHub Actions Image Build

Workflow file:

```text
.github/workflows/docker-publish.yml
```

Pushing to `main` builds and publishes a Docker image to GitHub Container Registry.

Pushing a semantic version tag publishes versioned tags:

```sh
git tag v1.0.0
git push origin v1.0.0
```

Images are published to GHCR using this format:

```text
ghcr.io/YOUR_GITHUB_USERNAME_OR_ORG/YOUR_REPO_NAME:latest
```

The workflow also publishes git SHA tags and semantic version tags when applicable.

GitHub package visibility may need to be set to public if you want Unraid to pull without authentication. If the package is private, Unraid must authenticate to GHCR with a GitHub token that has package read permissions.

## Unraid Deployment Notes

In Unraid:

1. Go to the Docker tab.
2. Select Add Container.
3. Set Repository/image to:

```text
ghcr.io/YOUR_GITHUB_USERNAME_OR_ORG/YOUR_REPO_NAME:latest
```

4. Set Network Type to `Bridge` for most setups.
5. Add a port mapping:
   - Host port: `3000`
   - Container port: `3000`
6. Add environment variables:
   - `OPENAI_API_KEY=your_real_openai_api_key`
   - `PORT=3000`
   - `NODE_ENV=production`
   - `OPENAI_MODEL=gpt-4.1-mini`
   - `STORY_TIMEOUT_MS=30000`
   - `RATE_LIMIT_ENABLED=true`
   - `RATE_LIMIT_WINDOW_MS=60000`
   - `RATE_LIMIT_MAX_REQUESTS=60`
   - `IMAGE_RATE_LIMIT_MAX_REQUESTS=20`
   - `CORS_ORIGIN=*`
   - `ENABLE_IMAGE_GENERATION=false`
   - `IMAGE_MODE=cover_outro`
   - `IMAGE_PROVIDER=openai`
   - `IMAGE_MODEL=gpt-image-1-mini`
   - `IMAGE_QUALITY=medium`
   - `IMAGE_SIZE=1024x1024`
   - `IMAGE_STYLE=cartoon-fantasy`
   - `IMAGE_TIMEOUT_MS=45000`
   - `IMAGE_STORAGE_MODE=memory`
7. Set a restart policy if your Unraid UI/template supports it.
8. Apply/start the container.

Visit:

```text
http://UNRAID_SERVER_IP:3000
```

To test optional images on Unraid, start with:

```text
ENABLE_IMAGE_GENERATION=true
IMAGE_MODE=cover_outro
IMAGE_MODEL=gpt-image-1-mini
IMAGE_QUALITY=medium
```

Use `milestones` or `every_scene` only if you are comfortable with the additional image cost and latency.

## NGINX Proxy Manager Notes

Use NGINX Proxy Manager to forward your chosen domain or subdomain to the Unraid server IP and host port.

Use:

- Scheme: `http`
- Forward hostname/IP: your Unraid server IP
- Forward port: the host port mapped to the container, for example `3000`

The container does not handle HTTPS directly. Let NGINX Proxy Manager handle SSL certificates and HTTPS termination.

Do not hardcode domain names in the app.

## Updating On Unraid

1. Push changes to GitHub.
2. GitHub Actions builds and publishes a new GHCR image.
3. In Unraid, pull/recreate/update the container.
4. If using `latest`, make sure Unraid actually pulls the new image instead of reusing the cached local image.

## Security Notes

- Do not expose `OPENAI_API_KEY` to frontend code.
- Do not commit `.env`.
- Do not store student personal data in the MVP.
- Keep the app behind NGINX Proxy Manager, Cloudflare, or equivalent controls if exposing it publicly.
- Consider authentication later only if adding teacher dashboards, saved progress, rosters, admin settings, or other persistent classroom management features.
