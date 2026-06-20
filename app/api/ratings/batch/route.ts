import { NextRequest } from "next/server";
import {
  apiError,
  apiSuccess,
  methodNotAllowed,
} from "@/lib/server/api-response";
import { fetchFromOMDb } from "@/lib/server/fetch-omdb";
import { fetchFromTMDB } from "@/lib/server/fetch-tmdb";
import { getClientIp } from "@/lib/server/get-client-ip";
import { logApiRequest } from "@/lib/server/request-log";
import { RATE_LIMITS, checkRateLimit } from "@/lib/server/rate-limit";
import {
  batchRatingsBodySchema,
  formatZodIssues,
} from "@/lib/server/validation/schemas";
import type { BatchRatingsResponse } from "@/types/search";

type ExternalIdsResponse = {
  imdb_id?: string | null;
};

type OMDbRatingResponse = {
  Response?: string;
  imdbRating?: string;
  Ratings?: { Source: string; Value: string }[];
};

async function fetchImdbId(
  mediaType: "movie" | "tv",
  id: number
): Promise<string | null> {
  const result = await fetchFromTMDB<ExternalIdsResponse>(
    `${mediaType}/${id}/external_ids`
  );

  if (!result.ok) return null;

  const imdbId = result.data.imdb_id;
  return imdbId && imdbId !== "N/A" ? imdbId : null;
}

async function fetchOmdbRatings(imdbId: string) {
  const result = await fetchFromOMDb<OMDbRatingResponse>({
    i: imdbId,
    plot: "short",
  });

  if (!result.ok) return null;

  const data = result.data;
  if (data.Response !== "True") return null;

  const rottenTomatoesScore =
    data.Ratings?.find((rating) => rating.Source === "Rotten Tomatoes")
      ?.Value ?? null;

  const imdbRating =
    data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : null;

  return { imdbRating, rottenTomatoesScore };
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const ip = getClientIp(request);
  const routeLabel = "/api/ratings/batch";

  const limit = checkRateLimit(`ratings:${ip}`, RATE_LIMITS.ratings);
  if (!limit.allowed) {
    logApiRequest({
      route: routeLabel,
      method: "POST",
      ip,
      status: 429,
      durationMs: Date.now() - startedAt,
      error: "rate_limited",
    });

    return apiError("RATE_LIMITED", "Too many requests. Please try again later.", 429, {
      retryAfterMs: limit.retryAfterMs,
    });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    logApiRequest({
      route: routeLabel,
      method: "POST",
      ip,
      status: 400,
      durationMs: Date.now() - startedAt,
      error: "invalid_json",
    });

    return apiError("VALIDATION_ERROR", "Invalid JSON request body.", 400);
  }

  const parsed = batchRatingsBodySchema.safeParse(body);
  if (!parsed.success) {
    logApiRequest({
      route: routeLabel,
      method: "POST",
      ip,
      status: 400,
      durationMs: Date.now() - startedAt,
      error: "validation_error",
    });

    return apiError(
      "VALIDATION_ERROR",
      "Invalid request body.",
      400,
      formatZodIssues(parsed.error)
    );
  }

  const items = parsed.data.items;
  const ratings: BatchRatingsResponse["ratings"] = {};

  const chunkSize = 4;
  for (let index = 0; index < items.length; index += chunkSize) {
    const chunk = items.slice(index, index + chunkSize);

    await Promise.all(
      chunk.map(async (item) => {
        const key = `${item.mediaType}-${item.id}`;

        try {
          const imdbId = await fetchImdbId(item.mediaType, item.id);
          if (!imdbId) {
            ratings[key] = { imdbRating: null, rottenTomatoesScore: null };
            return;
          }

          const omdb = await fetchOmdbRatings(imdbId);
          ratings[key] = omdb ?? {
            imdbRating: null,
            rottenTomatoesScore: null,
          };
        } catch {
          ratings[key] = { imdbRating: null, rottenTomatoesScore: null };
        }
      })
    );
  }

  logApiRequest({
    route: routeLabel,
    method: "POST",
    ip,
    status: 200,
    durationMs: Date.now() - startedAt,
  });

  return apiSuccess({ ratings } satisfies BatchRatingsResponse);
}

export async function GET() {
  return methodNotAllowed();
}