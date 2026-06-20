import { BrowsePageSuspense } from "@/components/browse/BrowsePageSuspense";

export default function AnimePage() {
  return (
    <BrowsePageSuspense
      title="Anime Spotlight"
      description="Japanese animation from TMDB — filtered by Animation genre with advanced browse controls."
      basePath="/anime"
      defaultType="anime"
      defaultMediaType="anime"
      forceDiscover
      showSearchBar={false}
      emptyMessage="No anime titles match your filters."
    />
  );
}