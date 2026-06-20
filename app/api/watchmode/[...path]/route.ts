import { NextRequest } from "next/server";
import { fetchFromWatchmode } from "@/lib/server/fetch-watchmode";
import {
  buildUpstreamPath,
  isAllowedWatchmodePath,
} from "@/lib/server/path-allowlist";
import { RATE_LIMITS } from "@/lib/server/rate-limit";
import { handleSecureGetRoute } from "@/lib/server/secure-route";
import { methodNotAllowed } from "@/lib/server/api-response";
import {
  WATCHMODE_QUERY_KEYS,
  watchmodeQuerySchema,
} from "@/lib/server/validation/schemas";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  return handleSecureGetRoute({
    request,
    routeLabel: "/api/watchmode",
    pathSegments: path,
    rateLimitKey: "watchmode",
    rateLimit: RATE_LIMITS.watchmode,
    isPathAllowed: isAllowedWatchmodePath,
    queryKeys: WATCHMODE_QUERY_KEYS,
    querySchema: watchmodeQuerySchema,
    buildUpstreamPath,
    fetchUpstream: (upstreamPath, query) =>
      fetchFromWatchmode(upstreamPath, { query }),
  });
}

export async function POST() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}