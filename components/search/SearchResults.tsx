"use client";

import { useCallback } from "react";
import { SearchBarSuspense } from "@/components/search/SearchBarSuspense";
import { SearchFilters } from "@/components/search/SearchFilters";
import { ResultsGrid } from "@/components/browse/ResultsGrid";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useBrowseResults } from "@/hooks/useBrowseResults";

export function SearchResults() {
  const { filters, updateFilters, resetFilters, hasActiveFilters } =
    useSearchFilters("/search");

  const { results, totalPages, totalResults, isLoading, isFetching, isError } =
    useBrowseResults(filters);

  const handleLoadMore = useCallback(() => {
    if (filters.page < totalPages && !isFetching) {
      updateFilters({ page: filters.page + 1 }, { resetPage: false });
    }
  }, [filters.page, totalPages, isFetching, updateFilters]);

  const hasQueryOrFilters =
    filters.q.trim().length > 0 || hasActiveFilters;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Search
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Discover movies, TV shows, and anime with powerful filters — sorted
            and rated from TMDB and OMDb.
          </p>
        </div>
        <div className="max-w-2xl">
          <SearchBarSuspense variant="navbar" autoFocus={!filters.q} />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
        <SearchFilters
          filters={filters}
          onChange={updateFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="space-y-6">
          {!hasQueryOrFilters ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center dark:border-white/10">
              <p className="text-muted-foreground">
                Start typing to search, or apply filters to browse the catalog.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Searching..."
                  : `${totalResults.toLocaleString()} result${totalResults === 1 ? "" : "s"}`}
                {filters.q && (
                  <>
                    {" "}
                    for &ldquo;{filters.q}&rdquo;
                  </>
                )}
              </p>

              <ResultsGrid
                results={results}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
                totalPages={totalPages}
                page={filters.page}
                onLoadMore={handleLoadMore}
                filters={filters}
                emptyMessage={`No results found${filters.q ? ` for "${filters.q}"` : ""}. Try adjusting your filters.`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}