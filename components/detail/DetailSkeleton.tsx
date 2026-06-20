"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <Skeleton className="aspect-[21/9] w-full rounded-none sm:rounded-2xl" />
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <Skeleton className="mx-auto aspect-[2/3] w-48 shrink-0 rounded-2xl md:mx-0 md:-mt-32" />
          <div className="flex-1 space-y-4 pt-4">
            <Skeleton className="h-10 w-3/4 max-w-lg" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-20 w-full max-w-2xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  );
}