"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { SearchBarSuspense } from "@/components/search/SearchBarSuspense";
import { BrowseFilters } from "@/components/browse/BrowseFilters";
import { ResultsGrid } from "@/components/browse/ResultsGrid";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useBrowseResults } from "@/hooks/useBrowseResults";
import type { ContentMediaType } from "@/types/content";
import type { MediaTypeFilter } from "@/types/search";

type FilteredBrowsePageProps = {
  title: string;
  description: string;
  basePath: string;
  defaultType?: MediaTypeFilter;
  defaultMediaType?: ContentMediaType;
  forceDiscover?: boolean;
  showSearchBar?: boolean;
  emptyMessage?: string;
};

export function FilteredBrowsePage({
  title,
  description,
  basePath,
  defaultType,
  defaultMediaType,
  forceDiscover = false,
  showSearchBar = true,
  emptyMessage,
}: FilteredBrowsePageProps) {
  const { filters, updateFilters, resetFilters, hasActiveFilters } =
    useSearchFilters(basePath);

  const effectiveFilters = {
    ...filters,
    type: filters.type === "all" && defaultType ? defaultType : filters.type,
  };

  const activeMediaType: ContentMediaType =
    defaultMediaType ?? (defaultType === "movie" ? "movie" : defaultType === "tv" ? "tv" : "anime");

  const { results, totalPages, totalResults, isLoading, isFetching, isError } =
    useBrowseResults(effectiveFilters, { forceDiscover });

  const handleLoadMore = useCallback(() => {
    if (effectiveFilters.page < totalPages && !isFetching) {
      updateFilters({ page: effectiveFilters.page + 1 }, { resetPage: false });
    }
  }, [effectiveFilters.page, totalPages, isFetching, updateFilters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 space-y-4 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-muted-foreground">{description}</p>
        </motion.div>
        {showSearchBar && (
          <div className="max-w-2xl">
            <SearchBarSuspense variant="navbar" />
          </div>
        )}
      </header>

      <BrowseFilters
        filters={effectiveFilters}
        onChange={updateFilters}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        activeMediaType={activeMediaType}
        basePath={basePath}
      />

      <div className="space-y-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground"
        >
          {isLoading
            ? "Loading..."
            : `${totalResults.toLocaleString()} title${totalResults === 1 ? "" : "s"} found`}
          {effectiveFilters.q && (
            <>
              {" "}
              for &ldquo;{effectiveFilters.q}&rdquo;
            </>
          )}
        </motion.p>

        <ResultsGrid
          results={results}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          totalPages={totalPages}
          page={effectiveFilters.page}
          onLoadMore={handleLoadMore}
          filters={effectiveFilters}
          defaultMediaType={defaultMediaType}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}