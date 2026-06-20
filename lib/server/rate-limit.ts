type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });

    return {
      allowed: true,
      remaining: config.limit - 1,
      retryAfterMs: 0,
    };
  }

  if (entry.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, entry.resetAt - now),
    };
  }

  entry.count += 1;
  buckets.set(key, entry);

  return {
    allowed: true,
    remaining: config.limit - entry.count,
    retryAfterMs: 0,
  };
}

export const RATE_LIMITS = {
  tmdb: { limit: 120, windowMs: 60_000 },
  watchmode: { limit: 60, windowMs: 60_000 },
  omdb: { limit: 60, windowMs: 60_000 },
  ratings: { limit: 30, windowMs: 60_000 },
} as const satisfies Record<string, RateLimitConfig>;