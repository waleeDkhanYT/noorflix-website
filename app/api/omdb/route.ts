import { NextRequest } from "next/server";
import {
  apiError,
  apiSuccess,
  methodNotAllowed,
} from "@/lib/server/api-response";
import { fetchFromOMDb } from "@/lib/server/fetch-omdb";
import { getClientIp } from "@/lib/server/get-client-ip";
import { logApiRequest } from "@/lib/server/request-log";
import { RATE_LIMITS, checkRateLimit } from "@/lib/server/rate-limit";
import {
  BLOCKED_UPSTREAM_QUERY_KEYS,
  formatZodIssues,
  omdbQuerySchema,
} from "@/lib/server/validation/schemas";

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const ip = getClientIp(request);
  const routeLabel = "/api/omdb";

  const limit = checkRateLimit(`omdb:${ip}`, RATE_LIMITS.omdb);
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

  const rawQuery = {
    i: request.nextUrl.searchParams.get("i") ?? undefined,
    t: request.nextUrl.searchParams.get("t") ?? undefined,
    y: request.nextUrl.searchParams.get("y") ?? undefined,
    plot: request.nextUrl.searchParams.get("plot") ?? undefined,
  };

  const parsed = omdbQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
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
      formatZodIssues(parsed.error)
    );
  }

  const result = await fetchFromOMDb(parsed.data);

  logApiRequest({
    route: routeLabel,
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

export async function POST() {
  return methodNotAllowed();
}