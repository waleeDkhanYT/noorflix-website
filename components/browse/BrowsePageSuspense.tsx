"use client";

import { Suspense } from "react";
import { ContentCardSkeleton } from "@/components/ui/ContentCard";
import { FilteredBrowsePage } from "@/components/browse/FilteredBrowsePage";
import type { ComponentProps } from "react";

function BrowseFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 space-y-2 lg:mb-8">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-muted/70 dark:bg-white/5" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-lg bg-muted/50 dark:bg-white/5" />
      </div>
      <div className="mb-8 hidden h-36 animate-pulse rounded-2xl bg-muted/60 dark:bg-white/5 lg:block" />
      <div className="mb-6 h-11 animate-pulse rounded-xl bg-muted/60 dark:bg-white/5 lg:hidden" />
      <div className="mb-6 h-4 w-32 animate-pulse rounded-md bg-muted/50 dark:bg-white/5" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <ContentCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function BrowsePageSuspense(
  props: ComponentProps<typeof FilteredBrowsePage>
) {
  return (
    <Suspense fallback={<BrowseFallback />}>
      <FilteredBrowsePage {...props} />
    </Suspense>
  );
}