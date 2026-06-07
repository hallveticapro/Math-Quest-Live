import crypto from "node:crypto";
import {
  createEpisodePlan,
  type EpisodePlan,
} from "./storyPrompt.js";
import type { PreparedTurnResult } from "./storyRouteTypes.js";

type PendingTurn = {
  id: string;
  kind: PreparedTurnResult["kind"];
  turn: number;
  clientKey: string;
  episodeId?: string;
  expiresAt: number;
  promise: Promise<PreparedTurnResult>;
};

const PENDING_TURN_TTL_MS = 10 * 60 * 1000;
const EPISODE_PLAN_TTL_MS = 3 * 60 * 60 * 1000;
const pendingTurns = new Map<string, PendingTurn>();
const episodePlans = new Map<string, { plan: EpisodePlan; expiresAt: number }>();

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

const MAX_PENDING_TURNS = readPositiveInt(process.env.MAX_PENDING_TURNS, 120);
const MAX_PENDING_TURNS_PER_CLIENT = readPositiveInt(
  process.env.MAX_PENDING_TURNS_PER_CLIENT,
  4,
);
const MAX_PENDING_TURNS_PER_EPISODE = readPositiveInt(
  process.env.MAX_PENDING_TURNS_PER_EPISODE,
  2,
);
const MAX_EPISODE_PLANS = readPositiveInt(process.env.MAX_EPISODE_PLANS, 300);

export function readStoryTimeoutMs() {
  const parsed = readPositiveInt(process.env.STORY_TIMEOUT_MS, 30000);
  if (parsed < 1000 || parsed > 120000) return 30000;
  return parsed;
}

export function cleanupPreparedStores() {
  const now = Date.now();
  for (const [id, pending] of pendingTurns.entries()) {
    if (pending.expiresAt <= now) {
      pendingTurns.delete(id);
    }
  }

  for (const [id, episode] of episodePlans.entries()) {
    if (episode.expiresAt <= now) {
      episodePlans.delete(id);
    }
  }
}

setInterval(cleanupPreparedStores, 60 * 1000).unref();

function createEpisodeId() {
  return `episode_${crypto.randomUUID()}`;
}

function countPendingTurnsForClient(clientKey: string) {
  let count = 0;
  for (const pending of pendingTurns.values()) {
    if (pending.clientKey === clientKey) count += 1;
  }
  return count;
}

function countPendingTurnsForEpisode(episodeId: string | undefined) {
  if (!episodeId) return 0;
  let count = 0;
  for (const pending of pendingTurns.values()) {
    if (pending.episodeId === episodeId) count += 1;
  }
  return count;
}

export function storeEpisodePlan(plan: EpisodePlan) {
  cleanupPreparedStores();
  if (episodePlans.size >= MAX_EPISODE_PLANS) return null;

  const episodeId = createEpisodeId();
  episodePlans.set(episodeId, {
    plan,
    expiresAt: Date.now() + EPISODE_PLAN_TTL_MS,
  });
  return episodeId;
}

export function resolveEpisodePlan(
  data: Parameters<typeof createEpisodePlan>[0],
  episodeId?: string,
) {
  if (episodeId?.startsWith("episode_")) {
    const stored = episodePlans.get(episodeId);
    if (stored && stored.expiresAt > Date.now()) {
      stored.expiresAt = Date.now() + EPISODE_PLAN_TTL_MS;
      return stored.plan;
    }
  }

  return createEpisodePlan(data);
}

export function createPendingTurn(input: {
  kind: PreparedTurnResult["kind"];
  turn: number;
  clientKey: string;
  episodeId?: string;
  promise: Promise<PreparedTurnResult>;
}):
  | { ok: true; pendingId: string }
  | {
      ok: false;
      status: 429 | 503;
      error: "too_many_pending_turns" | "capacity_reached";
      message: string;
    } {
  cleanupPreparedStores();

  if (pendingTurns.size >= MAX_PENDING_TURNS) {
    return {
      ok: false,
      status: 503,
      error: "capacity_reached",
      message: "The Chronicle is helping many heroes right now. Please try again in a moment.",
    };
  }

  if (
    countPendingTurnsForClient(input.clientKey) >= MAX_PENDING_TURNS_PER_CLIENT ||
    countPendingTurnsForEpisode(input.episodeId) >= MAX_PENDING_TURNS_PER_EPISODE
  ) {
    return {
      ok: false,
      status: 429,
      error: "too_many_pending_turns",
      message: "The next page is already being prepared. Please wait a moment.",
    };
  }

  const pendingId = `pending_${crypto.randomUUID()}`;
  pendingTurns.set(pendingId, {
    id: pendingId,
    kind: input.kind,
    turn: input.turn,
    clientKey: input.clientKey,
    episodeId: input.episodeId,
    expiresAt: Date.now() + PENDING_TURN_TTL_MS,
    promise: input.promise,
  });

  return { ok: true, pendingId };
}

export function getPendingTurn(pendingId: string) {
  const pending = pendingTurns.get(pendingId);
  if (!pending || pending.expiresAt <= Date.now()) {
    pendingTurns.delete(pendingId);
    return undefined;
  }
  return pending;
}

export function deletePendingTurn(pendingId: string) {
  pendingTurns.delete(pendingId);
}
