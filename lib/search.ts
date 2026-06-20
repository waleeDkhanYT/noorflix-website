import type { TMDBMedia } from "@/types";
import type { MediaTypeFilter, SearchFilters, SortOption } from "@/types/search";

const ANIME_GENRE_ID = 16;

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  q: "",
  type: "all",
  genres: [],
  yearFrom: null,
  yearTo: null,
  sort: "popularity",
  page: 1,
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Rating" },
  { value: "release_date", label: "Release Date" },
];

export function parseSearchFilters(
  params: URLSearchParams
): SearchFilters {
  const genres = params.get("genres");
  const yearFrom = params.get("yearFrom");
  const yearTo = params.get("yearTo");
  const type = params.get("type") as MediaTypeFilter | null;
  const sort = params.get("sort") as SortOption | null;
  const page = Number.parseInt(params.get("page") ?? "1", 10);

  return {
    q: params.get("q") ?? "",
    type:
      type === "movie" || type === "tv" || type === "anime" || type === "all"
        ? type
        : "all",
    genres: genres
      ? genres
          .split(",")
          .map((id) => Number.parseInt(id, 10))
          .filter((id) => !Number.isNaN(id))
      : [],
    yearFrom: yearFrom ? Number.parseInt(yearFrom, 10) : null,
    yearTo: yearTo ? Number.parseInt(yearTo, 10) : null,
    sort:
      sort === "rating" || sort === "release_date" || sort === "popularity"
        ? sort
        : "popularity",
    page: Number.isNaN(page) || page < 1 ? 1 : page,
  };
}

export function serializeSearchFilters(filters: SearchFilters): string {
  const params = new URLSearchParams();

  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.genres.length > 0) {
    params.set("genres", filters.genres.join(","));
  }
  if (filters.yearFrom != null) params.set("yearFrom", String(filters.yearFrom));
  if (filters.yearTo != null) params.set("yearTo", String(filters.yearTo));
  if (filters.sort !== "popularity") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));

  return params.toString();
}

export function getDiscoverSort(
  sort: SortOption,
  mediaType: "movie" | "tv"
): string {
  switch (sort) {
    case "rating":
      return "vote_average.desc";
    case "release_date":
      return mediaType === "movie"
        ? "primary_release_date.desc"
        : "first_air_date.desc";
    default:
      return "popularity.desc";
  }
}

export function buildDiscoverQuery(
  filters: SearchFilters,
  mediaType: "movie" | "tv",
  page: number
): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("sort_by", getDiscoverSort(filters.sort, mediaType));

  const genreIds = [...filters.genres];
  if (filters.type === "anime" && !genreIds.includes(ANIME_GENRE_ID)) {
    genreIds.push(ANIME_GENRE_ID);
  }

  if (genreIds.length > 0) {
    params.set("with_genres", genreIds.join(","));
  }

  if (filters.type === "anime") {
    params.set("with_original_language", "ja");
  }

  if (filters.yearFrom != null) {
    const gte = `${filters.yearFrom}-01-01`;
    if (mediaType === "movie") {
      params.set("primary_release_date.gte", gte);
    } else {
      params.set("first_air_date.gte", gte);
    }
  }

  if (filters.yearTo != null) {
    const lte = `${filters.yearTo}-12-31`;
    if (mediaType === "movie") {
      params.set("primary_release_date.lte", lte);
    } else {
      params.set("first_air_date.lte", lte);
    }
  }

  return params.toString();
}

export function getItemYear(item: TMDBMedia): number | null {
  const date = item.release_date ?? item.first_air_date;
  if (!date) return null;
  const year = Number.parseInt(date.slice(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

export function isAnimeItem(item: TMDBMedia): boolean {
  return (
    item.genre_ids?.includes(ANIME_GENRE_ID) === true &&
    item.original_language === "ja"
  );
}

export function applyClientFilters(
  items: TMDBMedia[],
  filters: SearchFilters
): TMDBMedia[] {
  return items
    .filter((item) => {
      if (item.media_type === "person") return false;

      if (filters.type === "movie") {
        const isMovie =
          item.media_type === "movie" ||
          (!item.media_type && Boolean(item.title));
        if (!isMovie || isAnimeItem(item)) return false;
      }

      if (filters.type === "tv") {
        const isTv =
          item.media_type === "tv" || (!item.media_type && Boolean(item.name));
        if (!isTv || isAnimeItem(item)) return false;
      }

      if (filters.type === "anime" && !isAnimeItem(item)) return false;

      if (filters.genres.length > 0) {
        const ids = item.genre_ids ?? [];
        const hasGenre = filters.genres.some((genreId) => ids.includes(genreId));
        if (!hasGenre) return false;
      }

      const year = getItemYear(item);
      if (filters.yearFrom != null && year != null && year < filters.yearFrom) {
        return false;
      }
      if (filters.yearTo != null && year != null && year > filters.yearTo) {
        return false;
      }

      return true;
    })
    .sort((a, b) => sortItems(a, b, filters.sort));
}

function sortItems(a: TMDBMedia, b: TMDBMedia, sort: SortOption): number {
  switch (sort) {
    case "rating":
      return b.vote_average - a.vote_average;
    case "release_date": {
      const dateA = a.release_date ?? a.first_air_date ?? "";
      const dateB = b.release_date ?? b.first_air_date ?? "";
      return dateB.localeCompare(dateA);
    }
    default:
      return b.popularity - a.popularity;
  }
}

export function getRatingKey(id: number, mediaType: "movie" | "tv") {
  return `${mediaType}-${id}`;
}