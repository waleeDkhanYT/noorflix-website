import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  WatchmodeSearchResponse,
  WatchmodeSource,
  WatchmodeTitle,
} from "@/types";

export const watchmodeApi = createApi({
  reducerPath: "watchmodeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/watchmode" }),
  tagTypes: ["Title", "Sources", "Search"],
  endpoints: (builder) => ({
    searchTitles: builder.query<
      WatchmodeSearchResponse,
      { search: string; page?: number }
    >({
      query: ({ search, page = 1 }) =>
        `/autocomplete-search/?search_value=${encodeURIComponent(search)}&search_type=3&page=${page}`,
      providesTags: ["Search"],
    }),
    getTitleDetails: builder.query<WatchmodeTitle, number>({
      query: (id) => `/title/${id}/details/`,
      providesTags: (_result, _error, id) => [{ type: "Title", id }],
    }),
    getTitleSources: builder.query<WatchmodeSource[], number>({
      query: (id) => `/title/${id}/sources/`,
      providesTags: (_result, _error, id) => [{ type: "Sources", id }],
    }),
    getSourcesByTmdb: builder.query<
      WatchmodeSource[],
      { mediaType: "movie" | "tv"; tmdbId: number; region?: string }
    >({
      query: ({ mediaType, tmdbId, region = "US" }) =>
        `/title/${mediaType}/${tmdbId}/sources/?regions=${region}`,
      providesTags: (_result, _error, { tmdbId }) => [
        { type: "Sources", id: tmdbId },
      ],
    }),
  }),
});

export const {
  useSearchTitlesQuery,
  useGetTitleDetailsQuery,
  useGetTitleSourcesQuery,
  useGetSourcesByTmdbQuery,
} = watchmodeApi;