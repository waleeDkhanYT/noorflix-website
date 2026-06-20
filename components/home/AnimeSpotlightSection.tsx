"use client";

import { useDiscoverAnimeQuery } from "@/store/api/tmdbApi";
import { ContentRowSection } from "@/components/home/ContentRowSection";

export function AnimeSpotlightSection() {
  const query = useDiscoverAnimeQuery({ page: 1 });

  return (
    <ContentRowSection
      title="Anime Spotlight"
      description="Top anime series discovered via TMDB Animation genre"
      seeAllHref="/anime"
      query={query}
      mediaType="anime"
      emptyMessage="Anime titles will appear once your TMDB API key is configured."
    />
  );
}