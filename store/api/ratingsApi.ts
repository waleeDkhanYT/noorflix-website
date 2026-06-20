import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BatchRatingItem, BatchRatingsResponse } from "@/types/search";

export const ratingsApi = createApi({
  reducerPath: "ratingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/ratings" }),
  endpoints: (builder) => ({
    getBatchRatings: builder.query<
      BatchRatingsResponse,
      { items: BatchRatingItem[] }
    >({
      query: ({ items }) => ({
        url: "/batch",
        method: "POST",
        body: { items },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        const keys = queryArgs.items
          .map((item) => `${item.mediaType}-${item.id}`)
          .sort()
          .join("|");
        return keys;
      },
    }),
  }),
});

export const { useGetBatchRatingsQuery } = ratingsApi;