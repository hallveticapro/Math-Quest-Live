# MathQuest Live

MathQuest Live is a classroom-safe AI math adventure game. The app has a Vite/React frontend and a Node/Express backend.

## Requirements

- Node.js 24
- pnpm
- An OpenAI API key for the backend

This workspace intentionally uses pnpm. Do not use `npm install` for dependencies.

## Install

```sh
pnpm install --frozen-lockfile
```

## Environment

The OpenAI API key is read only by the backend from server environment variables. Do not put the key in frontend code.

Required for the API server:

```sh
export OPENAI_API_KEY="your_api_key_here"
```

Optional:

```sh
export OPENAI_MODEL="gpt-4.1-mini"
export PORT="8080"
```

Frontend local defaults:

- `FRONTEND_PORT=18567`
- `HOST=127.0.0.1`
- `BASE_PATH=/`
- `API_PROXY_TARGET=http://localhost:8080`

The frontend calls relative `/api` routes. During local development, Vite proxies `/api` to the backend.

## Run Locally

Start both the backend and frontend from the repo root:

```sh
OPENAI_API_KEY="your_api_key_here" pnpm run dev
```

Then open:

```text
http://localhost:18567
```

You can also run each side separately.

Backend:

```sh
OPENAI_API_KEY="your_api_key_here" pnpm --filter @workspace/api-server run dev
```

Frontend:

```sh
pnpm --filter @workspace/mathquest-live run dev
```

API health check:

```text
http://localhost:8080/api/healthz
```

## Build And Typecheck

```sh
pnpm run typecheck
pnpm run build
```

## Project Layout

- `artifacts/mathquest-live/` - Vite/React frontend.
- `artifacts/api-server/` - Express backend and OpenAI story routes.
- `lib/api-spec/` - OpenAPI source spec.
- `lib/api-client-react/` - generated frontend API client.
- `lib/api-zod/` - generated backend validation schemas.

## Notes

- No OpenAI API key is used by the frontend.
- Frontend API calls use `/api/...` routes.
- Game state is in browser memory and resets on refresh.
