import { getDetailHref } from "@/lib/detail";
import { getPosterUrl } from "@/lib/tmdb-images";
import type { ContentCardData, ContentMediaType } from "@/types/content";
import type { OMDbMedia } from "@/types/omdb";
import type { TMDBMedia } from "@/types";

const ANIME_GENRE_ID = 16;

export function getMediaTypeLabel(type: ContentMediaType): string {
  switch (type) {
    case "movie":
      return "Movie";
    case "tv":
      return "TV";
    case "anime":
      return "Anime";
  }
}

export function resolveMediaType(
  item: TMDBMedia,
  override?: ContentMediaType
): ContentMediaType {
  if (override) return override;
  if (item.media_type === "tv") return "tv";
  if (item.media_type === "movie") return "movie";
  if (item.genre_ids?.includes(ANIME_GENRE_ID) && item.original_language === "ja") {
    return "anime";
  }
  return item.title ? "movie" : "tv";
}

export function getYearFromTmdb(item: TMDBMedia): string | undefined {
  const date = item.release_date ?? item.first_air_date;
  return date ? date.slice(0, 4) : undefined;
}

export function extractRatingsFromOmdb(omdb: OMDbMedia) {
  const imdbRating =
    omdb.imdbRating && omdb.imdbRating !== "N/A" ? omdb.imdbRating : null;

  const rottenTomatoesScore =
    omdb.Ratings?.find((rating) => rating.Source === "Rotten Tomatoes")
      ?.Value ?? null;

  return { imdbRating, rottenTomatoesScore };
}

export function mapTmdbToContentCard(
  item: TMDBMedia,
  options?: {
    mediaType?: ContentMediaType;
    imdbRating?: string | null;
    rottenTomatoesScore?: string | null;
    href?: string;
    posterSize?: "w342" | "w500";
  }
): ContentCardData {
  const mediaType = resolveMediaType(item, options?.mediaType);

  return {
    id: item.id,
    title: item.title ?? item.name ?? "Untitled",
    posterUrl: getPosterUrl(item.poster_path, options?.posterSize ?? "w342"),
    year: getYearFromTmdb(item),
    mediaType,
    tmdbRating: item.vote_average > 0 ? item.vote_average : null,
    imdbRating: options?.imdbRating ?? null,
    rottenTomatoesScore: options?.rottenTomatoesScore ?? null,
    overview: item.overview || undefined,
    href: options?.href ?? getDetailHref(item, mediaType),
  };
}

export function parseRottenTomatoesScore(score: string): number | null {
  const match = score.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : null;
}