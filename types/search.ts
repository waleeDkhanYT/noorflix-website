export type MediaTypeFilter = "all" | "movie" | "tv" | "anime";

export type SortOption = "popularity" | "rating" | "release_date";

export interface SearchFilters {
  q: string;
  type: MediaTypeFilter;
  genres: number[];
  yearFrom: number | null;
  yearTo: number | null;
  sort: SortOption;
  page: number;
}

export interface BatchRatingItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  year?: string;
}

export interface BatchRatingsResponse {
  ratings: Record<
    string,
    {
      imdbRating: string | null;
      rottenTomatoesScore: string | null;
    }
  >;
}