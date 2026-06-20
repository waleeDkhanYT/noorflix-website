"use client";

import { useGetTrendingQuery } from "@/store/api/tmdbApi";
import { ContentRowSection } from "@/components/home/ContentRowSection";
import type { TMDBMedia } from "@/types";

function excludePeople(item: TMDBMedia) {
  return item.media_type !== "person";
}

export function TrendingSection() {
  const query = useGetTrendingQuery({
    mediaType: "all",
    timeWindow: "week",
  });

  return (
    <ContentRowSection
      title="Trending This Week"
      description="Movies and TV shows everyone is talking about"
      seeAllHref="/trending"
      query={query}
      filter={excludePeople}
      emptyMessage="Trending titles will appear once your TMDB API key is configured."
    />
  );
}