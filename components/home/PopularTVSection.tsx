"use client";

import { useGetPopularTVQuery } from "@/store/api/tmdbApi";
import { ContentRowSection } from "@/components/home/ContentRowSection";

export function PopularTVSection() {
  const query = useGetPopularTVQuery({ page: 1 });

  return (
    <ContentRowSection
      title="Popular TV Shows & Web Series"
      description="Binge-worthy series and streaming originals"
      seeAllHref="/tv"
      query={query}
      mediaType="tv"
      emptyMessage="Popular TV shows will appear once your TMDB API key is configured."
    />
  );
}