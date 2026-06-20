"use client";

import { useMemo } from "react";
import {
  useDiscoverMoviesQuery,
  useDiscoverTVQuery,
  useSearchMoviesQuery,
  useSearchMultiQuery,
  useSearchTVQuery,
} from "@/store/api/tmdbApi";
import { applyClientFilters } from "@/lib/search";
import type { SearchFilters } from "@/types/search";
import type { TMDBMedia } from "@/types";

type BrowseQueryResult = {
  results: TMDBMedia[];
  totalPages: number;
  totalResults: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  mode: "search" | "discover";
};

export function useBrowseResults(
  filters: SearchFilters,
  options?: { forceDiscover?: boolean }
): BrowseQueryResult {
  const hasQuery = filters.q.trim().length > 0;
  const useDiscover = options?.forceDiscover || !hasQuery;

  const searchMulti = useSearchMultiQuery(
    { query: filters.q, page: filters.page },
    { skip: useDiscover || filters.type !== "all" }
  );

  const searchMovies = useSearchMoviesQuery(
    { query: filters.q, page: filters.page },
    { skip: useDiscover || filters.type !== "movie" }
  );

  const searchTV = useSearchTVQuery(
    { query: filters.q, page: filters.page },
    { skip: useDiscover || filters.type !== "tv" && filters.type !== "anime" }
  );

  const discoverMovies = useDiscoverMoviesQuery(
    { filters, page: filters.page },
    { skip: !useDiscover || filters.type === "tv" || filters.type === "anime" }
  );

  const discoverTV = useDiscoverTVQuery(
    { filters, page: filters.page },
    {
      skip:
        !useDiscover ||
        filters.type === "movie" ||
        (filters.type !== "tv" && filters.type !== "anime" && filters.type !== "all"),
    }
  );

  return useMemo(() => {
    if (useDiscover) {
      const isMovieOnly = filters.type === "movie";
      const isTvOrAnime =
        filters.type === "tv" ||
        filters.type === "anime" ||
        filters.type === "all";

      if (isMovieOnly) {
        return {
          results: discoverMovies.data?.results ?? [],
          totalPages: discoverMovies.data?.total_pages ?? 1,
          totalResults: discoverMovies.data?.total_results ?? 0,
          isLoading: discoverMovies.isLoading,
          isFetching: discoverMovies.isFetching,
          isError: discoverMovies.isError,
          mode: "discover" as const,
        };
      }

      if (isTvOrAnime) {
        const tvResults = discoverTV.data?.results ?? [];
        const movieResults =
          filters.type === "all" ? discoverMovies.data?.results ?? [] : [];

        const merged =
          filters.type === "all"
            ? [...movieResults, ...tvResults]
            : tvResults;

        const deduped = Array.from(
          new Map(merged.map((item) => [item.id, item])).values()
        );

        return {
          results: deduped,
          totalPages: Math.max(
            discoverTV.data?.total_pages ?? 1,
            discoverMovies.data?.total_pages ?? 1
          ),
          totalResults:
            (discoverMovies.data?.total_results ?? 0) +
            (discoverTV.data?.total_results ?? 0),
          isLoading:
            filters.type === "all"
              ? discoverMovies.isLoading || discoverTV.isLoading
              : discoverTV.isLoading,
          isFetching:
            filters.type === "all"
              ? discoverMovies.isFetching || discoverTV.isFetching
              : discoverTV.isFetching,
          isError:
            filters.type === "all"
              ? discoverMovies.isError && discoverTV.isError
              : discoverTV.isError,
          mode: "discover" as const,
        };
      }
    }

    const activeQuery =
      filters.type === "movie"
        ? searchMovies
        : filters.type === "tv" || filters.type === "anime"
          ? searchTV
          : searchMulti;

    const rawResults = activeQuery.data?.results ?? [];
    const needsClientFilter =
      filters.type === "anime" ||
      filters.genres.length > 0 ||
      filters.yearFrom != null ||
      filters.yearTo != null ||
      filters.sort !== "popularity";

    const results = needsClientFilter
      ? applyClientFilters(rawResults, filters)
      : rawResults.filter((item) => item.media_type !== "person");

    return {
      results,
      totalPages: activeQuery.data?.total_pages ?? 1,
      totalResults: activeQuery.data?.total_results ?? results.length,
      isLoading: activeQuery.isLoading,
      isFetching: activeQuery.isFetching,
      isError: activeQuery.isError,
      mode: "search" as const,
    };
  }, [
    useDiscover,
    filters,
    discoverMovies,
    discoverTV,
    searchMovies,
    searchTV,
    searchMulti,
  ]);
}