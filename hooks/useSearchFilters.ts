"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  DEFAULT_SEARCH_FILTERS,
  parseSearchFilters,
  serializeSearchFilters,
} from "@/lib/search";
import type { SearchFilters } from "@/types/search";

export function useSearchFilters(basePath = "/search") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseSearchFilters(searchParams),
    [searchParams]
  );

  const updateFilters = useCallback(
    (patch: Partial<SearchFilters>, options?: { resetPage?: boolean }) => {
      const next: SearchFilters = {
        ...filters,
        ...patch,
        page: options?.resetPage === false ? (patch.page ?? filters.page) : 1,
      };

      const query = serializeSearchFilters(next);
      const target = pathname.startsWith(basePath) ? pathname : basePath;
      router.push(query ? `${target}?${query}` : target, { scroll: false });
    },
    [filters, router, pathname, basePath]
  );

  const resetFilters = useCallback(() => {
    const query = filters.q
      ? `q=${encodeURIComponent(filters.q)}`
      : "";
    router.push(query ? `${basePath}?${query}` : basePath, { scroll: false });
  }, [filters.q, router, basePath]);

  const setPage = useCallback(
    (page: number) => updateFilters({ page }, { resetPage: false }),
    [updateFilters]
  );

  const hasActiveFilters =
    filters.type !== DEFAULT_SEARCH_FILTERS.type ||
    filters.genres.length > 0 ||
    filters.yearFrom != null ||
    filters.yearTo != null ||
    filters.sort !== DEFAULT_SEARCH_FILTERS.sort;

  return {
    filters,
    updateFilters,
    resetFilters,
    setPage,
    hasActiveFilters,
  };
}