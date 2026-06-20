import { getPosterUrl } from "@/lib/tmdb-images";
import { getDetailTypeFromMediaType } from "@/lib/watchlist";
import type { MediaType, WatchlistInsert, WatchlistRow } from "@/types/database";
import type { ContentMediaType } from "@/types/content";
import type { WatchlistItem } from "@/types/watchlist";

export function getWatchlistItemKey(
  contentId: number | string,
  mediaType: ContentMediaType
): string {
  return `${mediaType}-${contentId}`;
}

export function posterUrlToPath(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/t\/p\/w\d+(\/.+)$/);
  return match?.[1] ?? null;
}

export function watchlistItemToRow(
  item: WatchlistItem,
  userId: string
): WatchlistInsert & { user_id: string } {
  return {
    user_id: userId,
    content_id: String(item.id),
    media_type: item.mediaType,
    title: item.title,
    poster_path: posterUrlToPath(item.posterUrl) ?? null,
    added_at: new Date(item.addedAt).toISOString(),
  };
}

export function watchlistRowToItem(row: WatchlistRow): WatchlistItem {
  const contentId = Number.parseInt(row.content_id, 10);

  return {
    id: Number.isNaN(contentId) ? 0 : contentId,
    mediaType: row.media_type,
    detailType: getDetailTypeFromMediaType(row.media_type),
    title: row.title,
    posterUrl: getPosterUrl(row.poster_path, "w342"),
    tmdbRating: null,
    overview: undefined,
    addedAt: new Date(row.added_at).getTime(),
    remoteId: row.id,
  };
}

/**
 * Union merge — keeps the newer `addedAt` when the same title exists in both lists.
 */
export function mergeWatchlistItems(
  localItems: WatchlistItem[],
  remoteItems: WatchlistItem[]
): WatchlistItem[] {
  const merged = new Map<string, WatchlistItem>();

  for (const item of remoteItems) {
    if (!item.id) continue;
    merged.set(getWatchlistItemKey(item.id, item.mediaType), item);
  }

  for (const item of localItems) {
    if (!item.id) continue;
    const key = getWatchlistItemKey(item.id, item.mediaType);
    const existing = merged.get(key);

    if (!existing || item.addedAt >= existing.addedAt) {
      merged.set(key, {
        ...item,
        remoteId: existing?.remoteId ?? item.remoteId,
      });
    }
  }

  return Array.from(merged.values()).sort((a, b) => b.addedAt - a.addedAt);
}

export type WatchlistItemPayload = {
  id: number;
  mediaType: ContentMediaType;
  title: string;
  posterUrl?: string | null;
  addedAt?: number;
};