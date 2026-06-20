import type { ContentMediaType } from "./content";
import type { DetailMediaType } from "./tmdb-detail";

export interface WatchlistItem {
  id: number;
  mediaType: ContentMediaType;
  detailType: DetailMediaType;
  title: string;
  posterUrl?: string | null;
  year?: string;
  tmdbRating?: number | null;
  overview?: string;
  addedAt: number;
  /** Supabase row id when synced to cloud */
  remoteId?: string;
}