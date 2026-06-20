import "server-only";

import { fetchFromTMDB } from "@/lib/server/fetch-tmdb";

/**
 * Server-only TMDB fetch (API key never sent to the client).
 * Used for generateMetadata and other SSR needs.
 */
export async function fetchTmdbServer<T>(path: string): Promise<T | null> {
  const result = await fetchFromTMDB<T>(path, {
    next: { revalidate: 3600 },
  });

  return result.ok ? result.data : null;
}

export { fetchFromTMDB } from "@/lib/server/fetch-tmdb";