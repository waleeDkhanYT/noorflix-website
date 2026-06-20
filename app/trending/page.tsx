"use client";

import { useState } from "react";
import { useGetTrendingQuery } from "@/store/api/tmdbApi";
import { BrowseGrid } from "@/components/browse/BrowseGrid";
import type { TMDBMedia } from "@/types";

function excludePeople(item: TMDBMedia) {
  return item.media_type !== "person";
}

export default function TrendingPage() {
  const [page, setPage] = useState(1);
  const query = useGetTrendingQuery({
    mediaType: "all",
    timeWindow: "week",
    page,
  });

  return (
    <BrowseGrid
      title="Trending This Week"
      description="The hottest movies and TV shows right now — updated weekly from TMDB."
      data={query.data}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      isError={query.isError}
      page={page}
      onPageChange={setPage}
      filter={excludePeople}
      emptyMessage="No trending titles found this week."
    />
  );
}