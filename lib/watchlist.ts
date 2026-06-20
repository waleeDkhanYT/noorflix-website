import { getDetailHrefFromId } from "@/lib/detail";
import type { ContentCardData, ContentMediaType } from "@/types/content";
import type { DetailMediaType } from "@/types/tmdb-detail";
import type { WatchlistItem } from "@/types/watchlist";

export function getDetailTypeFromMediaType(
  mediaType: ContentCardData["mediaType"]
): DetailMediaType {
  return mediaType === "movie" ? "movie" : "tv";
}

export function createWatchlistItem(
  data: ContentCardData,
  overrides?: Partial<WatchlistItem>
): WatchlistItem | null {
  if (data.id == null) return null;

  const id = typeof data.id === "string" ? Number.parseInt(data.id, 10) : data.id;
  if (Number.isNaN(id)) return null;

  return {
    id,
    mediaType: data.mediaType,
    detailType: getDetailTypeFromMediaType(data.mediaType),
    title: data.title,
    posterUrl: data.posterUrl,
    year: data.year,
    tmdbRating: data.tmdbRating,
    overview: data.overview,
    addedAt: Date.now(),
    ...overrides,
  };
}

export function watchlistItemToCardData(item: WatchlistItem): ContentCardData {
  return {
    id: item.id,
    title: item.title,
    posterUrl: item.posterUrl,
    year: item.year,
    mediaType: item.mediaType,
    tmdbRating: item.tmdbRating,
    overview: item.overview,
    href: getDetailHrefFromId(item.id, item.mediaType),
  };
}

export function getWatchlistKey(
  id: number,
  mediaType: ContentMediaType
) {
  return `${mediaType}-${id}`;
}