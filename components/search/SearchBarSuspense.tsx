"use client";

import { Suspense } from "react";
import { SearchBar, type SearchBarProps } from "@/components/search/SearchBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

function SearchBarFallback({ variant }: { variant?: SearchBarProps["variant"] }) {
  return (
    <Skeleton
      className={cn(
        "w-full rounded-2xl",
        variant === "hero" ? "h-14" : "h-11"
      )}
    />
  );
}

export function SearchBarSuspense(props: SearchBarProps) {
  return (
    <Suspense fallback={<SearchBarFallback variant={props.variant} />}>
      <SearchBar {...props} />
    </Suspense>
  );
}