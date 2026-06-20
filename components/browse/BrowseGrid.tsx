"use client";

import { useState } from "react";
import { ContentCard } from "@/components/ui/ContentCard";
import { ContentCardSkeleton } from "@/components/ui/ContentCard";
import { mapTmdbToContentCard } from "@/lib/content";
import type { ContentMediaType } from "@/types/content";
import type { TMDBMedia } from "@/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Film } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginatedData = {
  results: TMDBMedia[];
  page: number;
  total_pages: number;
};

type BrowseGridProps = {
  title: string;
  description: string;
  data?: PaginatedData;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  page: number;
  onPageChange: (page: number) => void;
  mediaType?: ContentMediaType;
  filter?: (item: TMDBMedia) => boolean;
  emptyMessage?: string;
};

export function BrowseGrid({
  title,
  description,
  data,
  isLoading,
  isFetching,
  isError,
  page,
  onPageChange,
  mediaType,
  filter,
  emptyMessage = "No titles found.",
}: BrowseGridProps) {
  const results = (data?.results ?? []).filter((item) =>
    filter ? filter(item) : true
  );

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <ContentCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Browse unavailable"
          message="Unable to load content. Please check your TMDB API key."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Film}
          title="Nothing to show"
          description={emptyMessage}
        />
      ) : (
        <>
          <div
            className={cn(
              "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
              isFetching && !isLoading && "opacity-70 transition-opacity"
            )}
          >
            {results.map((item, index) => (
              <ContentCard
                key={`${item.id}-${item.media_type ?? "media"}`}
                {...mapTmdbToContentCard(item, { mediaType })}
                index={index}
              />
            ))}
          </div>

          {data && data.total_pages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                onClick={() => onPageChange(page - 1)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.total_pages}
              </span>
              <button
                type="button"
                disabled={page >= data.total_pages || isFetching}
                onClick={() => onPageChange(page + 1)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}