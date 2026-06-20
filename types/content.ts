export type ContentMediaType = "movie" | "tv" | "anime";

export interface ContentCardData {
  id?: string | number;
  title: string;
  posterUrl?: string | null;
  year?: string;
  mediaType: ContentMediaType;
  tmdbRating?: number | null;
  imdbRating?: string | null;
  rottenTomatoesScore?: string | null;
  overview?: string;
  href?: string;
}