import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildDiscoverQuery } from "@/lib/search";
import type {
  TMDBMedia,
  TMDBGenre,
  TMDBMovieDetails,
  TMDBPaginatedResponse,
  TMDBTVDetails,
  TMDBMovieDetailsFull,
  TMDBTVDetailsFull,
  DetailMediaType,
} from "@/types";
import type { SearchFilters } from "@/types/search";

const DETAIL_APPEND =
  "videos,credits,recommendations,external_ids";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/tmdb" }),
  tagTypes: ["Movie", "TV", "Trending", "Search", "Anime", "Genres", "Discover"],
  endpoints: (builder) => ({
    getTrending: builder.query<
      TMDBPaginatedResponse<TMDBMedia>,
      {
        mediaType?: "all" | "movie" | "tv";
        timeWindow?: "day" | "week";
        page?: number;
      }
    >({
      query: ({ mediaType = "all", timeWindow = "week", page = 1 } = {}) =>
        `/trending/${mediaType}/${timeWindow}?page=${page}`,
      providesTags: ["Trending"],
    }),
    getPopularMovies: builder.query<
      TMDBPaginatedResponse<TMDBMedia>,
      { page?: number }
    >({
      query: ({ page = 1 } = {}) => `/movie/popular?page=${page}`,
      providesTags: ["Movie"],
    }),
    getPopularTV: builder.query<
      TMDBPaginatedResponse<TMDBMedia>,
      { page?: number }
    >({
      query: ({ page = 1 } = {}) => `/tv/popular?page=${page}`,
      providesTags: ["TV"],
    }),
    searchMulti: builder.query<
      TMDBPaginatedResponse<TMDBMedia>,
      { query: string; page?: number }
    >({
      query: ({ query, page = 1 }) =>
        `/search/multi?query=${encodeURIComponent(query)}&page=${page}`,
      providesTags: ["Search"],
    }),
    searchMovies: builder.query<
      TMDBPaginatedResponse<TMDBMedia>,
      { query: string; page?: number }
    >({
      query: ({ query, page = 1 }) =>
        `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
      providesTags: ["Search"],
    }),
    searchTV: builder.query<
      TMDBPaginatedResponse<TMDBMedia>,
      { query: string; page?: number }
    >({
      query: ({ query, page = 1 }) =>
        `/search/tv?query=${encodeURIComponent(query)}&page=${page}`,
      providesTags: ["Search"],
    }),
    getMovieGenres: builder.query<{ genres: TMDBGenre[] }, void>({
      query: () => "/genre/movie/list",
      providesTags: ["Genres"],
    }),
    getTVGenres: builder.query<{ genres: TMDBGenre[] }, void>({
      query: () => "/genre/tv/list",
      providesTags: ["Genres"],
    }),
    discoverMovies: builder.query<
      TMDBPaginatedResponse<TMDBMedia>,
      { filters: SearchFilters; page?: number }
    >({
      query: ({ filters, page = 1 }) =>
        `/discover/movie?${buildDiscoverQuery(filters, "movie", page)}`,
      providesTags: ["Discover"],
    }),
    discoverTV: builder.query<
      TMDBPaginatedResponse<TMDBMedia>,
      { filters: SearchFilters; page?: number }
    >({
      query: ({ filters, page = 1 }) =>
        `/discover/tv?${buildDiscoverQuery(filters, "tv", page)}`,
      providesTags: ["Discover"],
    }),
    getMovieDetails: builder.query<TMDBMovieDetails, number>({
      query: (id) => `/movie/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Movie", id }],
    }),
    getTVDetails: builder.query<TMDBTVDetails, number>({
      query: (id) => `/tv/${id}`,
      providesTags: (_result, _error, id) => [{ type: "TV", id }],
    }),
    getMovieDetailsFull: builder.query<TMDBMovieDetailsFull, number>({
      query: (id) =>
        `/movie/${id}?append_to_response=${DETAIL_APPEND}`,
      providesTags: (_result, _error, id) => [{ type: "Movie", id }],
    }),
    getTVDetailsFull: builder.query<TMDBTVDetailsFull, number>({
      query: (id) =>
        `/tv/${id}?append_to_response=${DETAIL_APPEND}`,
      providesTags: (_result, _error, id) => [{ type: "TV", id }],
    }),
    getDetailsFull: builder.query<
      TMDBMovieDetailsFull | TMDBTVDetailsFull,
      { mediaType: DetailMediaType; id: number }
    >({
      query: ({ mediaType, id }) =>
        `/${mediaType}/${id}?append_to_response=${DETAIL_APPEND}`,
      providesTags: (_result, _error, { mediaType, id }) => [
        { type: mediaType === "movie" ? "Movie" : "TV", id },
      ],
    }),
    discoverAnime: builder.query<
      TMDBPaginatedResponse<TMDBMedia>,
      { page?: number }
    >({
      query: ({ page = 1 } = {}) =>
        `/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=${page}`,
      providesTags: ["Anime"],
    }),
  }),
});

export const {
  useGetTrendingQuery,
  useGetPopularMoviesQuery,
  useGetPopularTVQuery,
  useSearchMultiQuery,
  useSearchMoviesQuery,
  useSearchTVQuery,
  useGetMovieGenresQuery,
  useGetTVGenresQuery,
  useDiscoverMoviesQuery,
  useDiscoverTVQuery,
  useGetMovieDetailsQuery,
  useGetTVDetailsQuery,
  useGetMovieDetailsFullQuery,
  useGetTVDetailsFullQuery,
  useGetDetailsFullQuery,
  useDiscoverAnimeQuery,
} = tmdbApi;