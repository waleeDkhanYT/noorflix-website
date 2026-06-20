import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { OMDbMedia } from "@/types";

export const omdbApi = createApi({
  reducerPath: "omdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/omdb" }),
  tagTypes: ["Media"],
  endpoints: (builder) => ({
    getByImdbId: builder.query<OMDbMedia, string>({
      query: (imdbId) => `?i=${encodeURIComponent(imdbId)}&plot=full`,
      providesTags: (_result, _error, imdbId) => [{ type: "Media", id: imdbId }],
    }),
    searchByTitle: builder.query<OMDbMedia, { title: string; year?: string }>({
      query: ({ title, year }) => {
        const params = new URLSearchParams({ t: title, plot: "full" });
        if (year) params.set("y", year);
        return `?${params.toString()}`;
      },
      providesTags: ["Media"],
    }),
  }),
});

export const { useGetByImdbIdQuery, useSearchByTitleQuery } = omdbApi;