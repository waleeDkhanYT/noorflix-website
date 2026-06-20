import "server-only";

import type { ApiErrorCode } from "@/lib/server/api-response";
import type { UpstreamQuery } from "@/lib/server/fetch-tmdb";

const WATCHMODE_BASE_URL = "https://api.watchmode.com/v1";

export type FetchResult<T> =
  | { ok: true; data: T; status: number }
  | {
      ok: false;
      status: number;
      code: ApiErrorCode;
      message: string;
    };

type FetchFromWatchmodeOptions = {
  query?: UpstreamQuery;
  cache?: RequestCache;
};

import { getWatchmodeApiKey } from "@/lib/env";

function getWatchmodeApiKeyOrNull(): string | null {
  return getWatchmodeApiKey() ?? null;
}

export async function fetchFromWatchmode<T>(
  path: string,
  options: FetchFromWatchmodeOptions = {}
): Promise<FetchResult<T>> {
  const apiKey = getWatchmodeApiKeyOrNull();

  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      code: "CONFIG_ERROR",
      message: "Watchmode is not configured on the server.",
    };
  }

  const normalizedPath = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const url = new URL(`${WATCHMODE_BASE_URL}/${normalizedPath}`);
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
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        code: "UPSTREAM_ERROR",
        message: `Watchmode request failed with status ${response.status}.`,
      };
    }

    const data = (await response.json()) as T;
    return { ok: true, data, status: response.status };
  } catch {
    return {
      ok: false,
      status: 502,
      code: "UPSTREAM_UNAVAILABLE",
      message: "Failed to reach Watchmode.",
    };
  }
}