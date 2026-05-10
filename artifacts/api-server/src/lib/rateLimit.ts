import type { NextFunction, Request, Response } from "express";

type RateLimitOptions = {
  maxRequestsEnv: string;
  defaultMaxRequests: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function readBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

export function createRateLimit({ maxRequestsEnv, defaultMaxRequests }: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!readBoolean(process.env.RATE_LIMIT_ENABLED, true)) {
      next();
      return;
    }

    const windowMs = readPositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000);
    const maxRequests = readPositiveInt(
      process.env[maxRequestsEnv],
      defaultMaxRequests,
    );
    const now = Date.now();
    const key = `${maxRequestsEnv}:${req.ip ?? "unknown"}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= maxRequests) {
      res
        .status(429)
        .setHeader("Retry-After", Math.ceil((current.resetAt - now) / 1000))
        .json({
          error: "rate_limited",
          message:
            "The Chronicle needs a short rest. Please wait a moment and try again.",
        });
      return;
    }

    current.count += 1;
    next();
  };
}
