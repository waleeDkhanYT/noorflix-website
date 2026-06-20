"use client";

import { useGetPopularMoviesQuery } from "@/store/api/tmdbApi";
import { ContentRowSection } from "@/components/home/ContentRowSection";

export function PopularMoviesSection() {
  const query = useGetPopularMoviesQuery({ page: 1 });

  return (
    <ContentRowSection
      title="Popular Movies"
      description="Blockbusters and fan favorites worth watching"
      seeAllHref="/movies"
      query={query}
      mediaType="movie"
      emptyMessage="Popular movies will appear once your TMDB API key is configured."
    />
  );
}