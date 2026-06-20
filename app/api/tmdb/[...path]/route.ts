import { NextRequest } from "next/server";
import { fetchFromTMDB } from "@/lib/server/fetch-tmdb";
import {
  buildUpstreamPath,
  isAllowedTmdbPath,
} from "@/lib/server/path-allowlist";
import { RATE_LIMITS } from "@/lib/server/rate-limit";
import { handleSecureGetRoute } from "@/lib/server/secure-route";
import { methodNotAllowed } from "@/lib/server/api-response";
import {
  TMDB_QUERY_KEYS,
  tmdbQuerySchema,
} from "@/lib/server/validation/schemas";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  return handleSecureGetRoute({
    request,
    routeLabel: "/api/tmdb",
    pathSegments: path,
    rateLimitKey: "tmdb",
    rateLimit: RATE_LIMITS.tmdb,
    isPathAllowed: isAllowedTmdbPath,
    queryKeys: TMDB_QUERY_KEYS,
    querySchema: tmdbQuerySchema,
    buildUpstreamPath,
    fetchUpstream: (upstreamPath, query) =>
      fetchFromTMDB(upstreamPath, { query }),
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