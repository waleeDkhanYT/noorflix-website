import "server-only";

import type { ApiErrorCode } from "@/lib/server/api-response";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type UpstreamQuery = Record<
  string,
  string | number | boolean | null | undefined
>;

export type FetchResult<T> =
  | { ok: true; data: T; status: number }
  | {
      ok: false;
      status: number;
      code: ApiErrorCode;
      message: string;
    };

type FetchFromTMDBOptions = {
  query?: UpstreamQuery;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

import { getTmdbApiKey } from "@/lib/env";

function getTmdbApiKeyOrNull(): string | null {
  return getTmdbApiKey() ?? null;
}

export async function fetchFromTMDB<T>(
  path: string,
  options: FetchFromTMDBOptions = {}
): Promise<FetchResult<T>> {
  const apiKey = getTmdbApiKeyOrNull();

  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      code: "CONFIG_ERROR",
      message: "TMDB is not configured on the server.",
    };
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const url = new URL(`${TMDB_BASE_URL}/${normalizedPath}`);
  url.searchParams.set("api_key", apiKey);

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      cache: options.cache ?? "no-store",
      next: options.next,
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        code: "UPSTREAM_ERROR",
        message: `TMDB request failed with status ${response.status}.`,
      };
    }

    const data = (await response.json()) as T;
    return { ok: true, data, status: response.status };
  } catch {
    return {
      ok: false,
      status: 502,
      code: "UPSTREAM_UNAVAILABLE",
      message: "Failed to reach TMDB.",
    };
  }
}