# syntax=docker/dockerfile:1.7

FROM node:24-slim AS build

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:24-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV STATIC_DIR=/app/public

COPY --from=build /app/artifacts/api-server/dist ./dist
COPY --from=build /app/artifacts/mathquest-live/dist/public ./public

EXPOSE 3000

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
