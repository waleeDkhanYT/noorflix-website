"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { ContentCard } from "@/components/ui/ContentCard";
import { ContentCardSkeleton } from "@/components/ui/ContentCard";
import { useGetBatchRatingsQuery } from "@/store/api/ratingsApi";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getRatingKey, getItemYear, serializeSearchFilters } from "@/lib/search";
import { mapTmdbToContentCard, resolveMediaType } from "@/lib/content";
import type { ContentMediaType } from "@/types/content";
import type { SearchFilters } from "@/types/search";
import type { TMDBMedia } from "@/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Film } from "lucide-react";
import { cn } from "@/lib/utils";

type ResultsGridProps = {
  results: TMDBMedia[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  totalPages: number;
  page: number;
  onLoadMore: () => void;
  filters: SearchFilters;
  emptyMessage?: string;
  defaultMediaType?: ContentMediaType;
};

function getApiMediaType(
  item: TMDBMedia,
  filterType: SearchFilters["type"]
): "movie" | "tv" {
  if (filterType === "movie") return "movie";
  if (filterType === "tv" || filterType === "anime") return "tv";
  if (item.media_type === "movie" || item.title) return "movie";
  return "tv";
}

export function ResultsGrid({
  results,
  isLoading,
  isFetching,
  isError,
  totalPages,
  page,
  onLoadMore,
  filters,
  emptyMessage = "No results found.",
  defaultMediaType,
}: ResultsGridProps) {
  const [accumulated, setAccumulated] = useState<TMDBMedia[]>([]);
  const filterKey = serializeSearchFilters({ ...filters, page: 1 });

  useEffect(() => {
    setAccumulated([]);
  }, [filterKey]);

  useEffect(() => {
    if (isLoading && page === 1) return;

    if (page === 1) {
      setAccumulated(results);
      return;
    }

    if (results.length === 0) return;

    setAccumulated((prev) => {
      const map = new Map(prev.map((item) => [item.id, item]));
      results.forEach((item) => map.set(item.id, item));
      return Array.from(map.values());
    });
  }, [results, page, isLoading]);

  const displayItems = accumulated.length > 0 ? accumulated : results;
  const hasMore = page < totalPages;

  const sentinelRef = useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading: isFetching,
  });

  const ratingItems = useMemo(
    () =>
      displayItems.slice(0, 48).map((item) => ({
        id: item.id,
        mediaType: getApiMediaType(item, filters.type),
        title: item.title ?? item.name ?? "Untitled",
        year: getItemYear(item)?.toString(),
      })),
    [displayItems, filters.type]
  );

  const { data: ratingsData } = useGetBatchRatingsQuery(
    { items: ratingItems },
    { skip: ratingItems.length === 0 }
  );

  if (isLoading && page === 1) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <ContentCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Results unavailable"
        message="Unable to load results. Please check your TMDB API key."
      />
    );
  }

  if (displayItems.length === 0) {
    return (
      <EmptyState
        icon={Film}
        title="No matches"
        description={emptyMessage}
        actionLabel="Clear filters"
        actionHref="/search"
      />
    );
  }

  return (
    <div className="space-y-8">
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5",
          isFetching && page > 1 && "opacity-90 transition-opacity"
        )}
      >
        {displayItems.map((item, index) => {
          const apiType = getApiMediaType(item, filters.type);
          const ratingKey = getRatingKey(item.id, apiType);
          const ratings = ratingsData?.ratings[ratingKey];
          const mediaType =
            defaultMediaType ?? resolveMediaType(item, filters.type === "anime" ? "anime" : undefined);

          return (
            <ContentCard
              key={`${item.id}-${apiType}`}
              {...mapTmdbToContentCard(item, {
                mediaType,
                imdbRating: ratings?.imdbRating,
                rottenTomatoesScore: ratings?.rottenTomatoesScore,
              })}
              index={index % 20}
            />
          );
        })}
      </div>

      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetching && hasMore && (
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading more...
          </div>
        )}
        {!hasMore && displayItems.length > 0 && (
          <p className="text-sm text-muted-foreground">You&apos;ve reached the end</p>
        )}
      </div>
    </div>
  );
}