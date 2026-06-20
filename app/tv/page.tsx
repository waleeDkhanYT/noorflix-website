import { BrowsePageSuspense } from "@/components/browse/BrowsePageSuspense";

export default function TVPage() {
  return (
    <BrowsePageSuspense
      title="Popular TV Shows & Web Series"
      description="Browse series and streaming originals — filter by genre, year, and popularity."
      basePath="/tv"
      defaultType="tv"
      defaultMediaType="tv"
      forceDiscover
      showSearchBar={false}
      emptyMessage="No TV shows match your filters."
    />
  );
}