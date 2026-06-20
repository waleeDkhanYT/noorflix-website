import { serializeSearchFilters } from "@/lib/search";
import type { SearchFilters } from "@/types/search";
import type { ContentMediaType } from "@/types/content";

export const BROWSE_TABS = [
  { id: "movie" as const, label: "Movies", href: "/movies" },
  { id: "tv" as const, label: "TV Shows", href: "/tv" },
  { id: "anime" as const, label: "Anime", href: "/anime" },
];

export function getBrowseTabHref(path: string, filters: SearchFilters): string {
  const query = serializeSearchFilters({
    ...filters,
    type: "all",
    page: 1,
    q: "",
  });
  return query ? `${path}?${query}` : path;
}

export function getBrowseActiveFilterCount(filters: SearchFilters): number {
  let count = 0;
  if (filters.genres.length > 0) count += filters.genres.length;
  if (filters.yearFrom != null) count += 1;
  if (filters.yearTo != null) count += 1;
  if (filters.sort !== "popularity") count += 1;
  return count;
}

export function getGenreSource(
  mediaType: ContentMediaType
): "movie" | "tv" {
  return mediaType === "movie" ? "movie" : "tv";
}