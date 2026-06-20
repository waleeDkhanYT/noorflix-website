import "server-only";

import type { ApiErrorCode } from "@/lib/server/api-response";

const OMDB_BASE_URL = "https://www.omdbapi.com";

export type OMDbQuery = {
  i?: string;
  t?: string;
  y?: string;
  plot?: "short" | "full";
};

export type FetchResult<T> =
  | { ok: true; data: T; status: number }
  | {
      ok: false;
      status: number;
      code: ApiErrorCode;
      message: string;
    };

import { getOmdbApiKey } from "@/lib/env";

function getOmdbApiKeyOrNull(): string | null {
  return getOmdbApiKey() ?? null;
}

export async function fetchFromOMDb<T>(
  query: OMDbQuery
): Promise<FetchResult<T>> {
  const apiKey = getOmdbApiKeyOrNull();

  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      code: "CONFIG_ERROR",
      message: "OMDb is not configured on the server.",
    };
  }

  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("r", "json");

  if (query.i) url.searchParams.set("i", query.i);
  if (query.t) url.searchParams.set("t", query.t);
  if (query.y) url.searchParams.set("y", query.y);
  url.searchParams.set("plot", query.plot ?? "short");

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        code: "UPSTREAM_ERROR",
        message: `OMDb request failed with status ${response.status}.`,
      };
    }

    const data = (await response.json()) as T;
    return { ok: true, data, status: response.status };
  } catch {
    return {
      ok: false,
      status: 502,
      code: "UPSTREAM_UNAVAILABLE",
      message: "Failed to reach OMDb.",
    };
  }
}