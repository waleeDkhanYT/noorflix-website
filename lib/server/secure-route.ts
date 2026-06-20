import type { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/server/api-response";
import { getClientIp } from "@/lib/server/get-client-ip";
import { logApiRequest } from "@/lib/server/request-log";
import {
  checkRateLimit,
  type RateLimitConfig,
} from "@/lib/server/rate-limit";
import {
  BLOCKED_UPSTREAM_QUERY_KEYS,
  formatZodIssues,
} from "@/lib/server/validation/schemas";
import type { z } from "zod";
import type { FetchResult } from "@/lib/server/fetch-tmdb";

type SecureGetRouteOptions<TQuery extends z.ZodType, TData> = {
  request: NextRequest;
  routeLabel: string;
  pathSegments: string[];
  rateLimitKey: string;
  rateLimit: RateLimitConfig;
  isPathAllowed: (segments: string[]) => boolean;
  queryKeys: readonly string[];
  querySchema: TQuery;
  buildUpstreamPath: (segments: string[]) => string;
  fetchUpstream: (
    path: string,
    query: z.infer<TQuery>
  ) => Promise<FetchResult<TData>>;
};

export async function handleSecureGetRoute<TQuery extends z.ZodType, TData>({
  request,
  routeLabel,
  pathSegments,
  rateLimitKey,
  rateLimit,
  isPathAllowed,
  queryKeys,
  querySchema,
  buildUpstreamPath,
  fetchUpstream,
}: SecureGetRouteOptions<TQuery, TData>) {
  const startedAt = Date.now();
  const ip = getClientIp(request);

  const limit = checkRateLimit(`${rateLimitKey}:${ip}`, rateLimit);
  if (!limit.allowed) {
    logApiRequest({
      route: routeLabel,
      method: "GET",
      ip,
      status: 429,
      durationMs: Date.now() - startedAt,
      error: "rate_limited",
    });

    return apiError("RATE_LIMITED", "Too many requests. Please try again later.", 429, {
      retryAfterMs: limit.retryAfterMs,
    });
  }

  if (!isPathAllowed(pathSegments)) {
    logApiRequest({
      route: routeLabel,
      method: "GET",
      ip,
      status: 403,
      durationMs: Date.now() - startedAt,
      error: "path_not_allowed",
    });

    return apiError("FORBIDDEN", "This API path is not permitted.", 403);
  }

  for (const key of request.nextUrl.searchParams.keys()) {
    if (BLOCKED_UPSTREAM_QUERY_KEYS.has(key)) {
      logApiRequest({
        route: routeLabel,
        method: "GET",
        ip,
        status: 400,
        durationMs: Date.now() - startedAt,
        error: "blocked_query_key",
      });

      return apiError(
        "VALIDATION_ERROR",
        "Client-supplied credentials are not accepted.",
        400
      );
    }
  }

  const rawQuery: Record<string, string> = {};
  for (const key of queryKeys) {
    const value = request.nextUrl.searchParams.get(key);
    if (value !== null) rawQuery[key] = value;
  }

  const parsedQuery = querySchema.safeParse(rawQuery);
  if (!parsedQuery.success) {
    logApiRequest({
      route: routeLabel,
      method: "GET",
      ip,
      status: 400,
      durationMs: Date.now() - startedAt,
      error: "validation_error",
    });

    return apiError(
      "VALIDATION_ERROR",
      "Invalid query parameters.",
      400,
      formatZodIssues(parsedQuery.error)
    );
  }

  const upstreamPath = buildUpstreamPath(pathSegments);
  const result = await fetchUpstream(upstreamPath, parsedQuery.data);

  logApiRequest({
    route: `${routeLabel}/${upstreamPath}`,
    method: "GET",
    ip,
    status: result.ok ? result.status : result.status,
    durationMs: Date.now() - startedAt,
    error: result.ok ? undefined : result.message,
  });

  if (!result.ok) {
    return apiError(result.code, result.message, result.status);
  }

  return apiSuccess(result.data, result.status);
}