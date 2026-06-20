import { BrowsePageSuspense } from "@/components/browse/BrowsePageSuspense";

export default function MoviesPage() {
  return (
    <BrowsePageSuspense
      title="Popular Movies"
      description="Explore films from TMDB — filter by genre, year, and rating to find your next watch."
      basePath="/movies"
      defaultType="movie"
      defaultMediaType="movie"
      forceDiscover
      showSearchBar={false}
      emptyMessage="No movies match your filters."
    />
  );
}