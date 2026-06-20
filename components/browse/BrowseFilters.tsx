"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import {
  useGetMovieGenresQuery,
  useGetTVGenresQuery,
} from "@/store/api/tmdbApi";
import { GenreChips } from "@/components/browse/GenreChips";
import { Dropdown } from "@/components/ui/Dropdown";
import { SORT_OPTIONS } from "@/lib/search";
import {
  BROWSE_TABS,
  getBrowseActiveFilterCount,
  getBrowseTabHref,
  getGenreSource,
} from "@/lib/browse-filters";
import {
  buildYearOptions,
  yearNumberToValue,
  yearValueToNumber,
} from "@/lib/dropdown-options";
import type { ContentMediaType } from "@/types/content";
import type { SearchFilters, SortOption } from "@/types/search";
import { cn } from "@/lib/utils";

type BrowseFiltersProps = {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  activeMediaType: ContentMediaType;
  basePath: string;
  className?: string;
};

const YEAR_OPTIONS = buildYearOptions();

function BrowseFiltersContent({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
  activeMediaType,
  basePath,
  layoutIdPrefix = "browse",
}: BrowseFiltersProps & {
  layoutIdPrefix?: string;
}) {
  const genreSource = getGenreSource(activeMediaType);

  const {
    data: movieGenres,
    isLoading: movieGenresLoading,
    isError: movieGenresError,
  } = useGetMovieGenresQuery(undefined, { skip: genreSource !== "movie" });
  const {
    data: tvGenres,
    isLoading: tvGenresLoading,
    isError: tvGenresError,
  } = useGetTVGenresQuery(undefined, { skip: genreSource !== "tv" });

  const genresLoading =
    genreSource === "movie" ? movieGenresLoading : tvGenresLoading;
  const genresError =
    genreSource === "movie" ? movieGenresError : tvGenresError;

  const genres = useMemo(() => {
    const source =
      genreSource === "movie" ? movieGenres?.genres : tvGenres?.genres;
    const list = (source ?? [])
      .map((genre) => ({ id: genre.id, name: genre.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (activeMediaType === "anime") {
      const animation = list.find((genre) => genre.id === 16);
      const rest = list.filter((genre) => genre.id !== 16);
      return animation ? [animation, ...rest] : list;
    }

    return list;
  }, [activeMediaType, genreSource, movieGenres, tvGenres]);

  const toggleGenre = (genreId: number) => {
    const next = filters.genres.includes(genreId)
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId];
    onChange({ genres: next });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative inline-flex w-full rounded-xl border border-border/60 bg-muted/40 p-1 dark:border-white/10 dark:bg-white/[0.03] sm:w-auto">
            {BROWSE_TABS.map((tab) => {
              const isActive = basePath === tab.href;
              const href = getBrowseTabHref(tab.href, filters);

              return (
                <Link
                  key={tab.id}
                  href={href}
                  className={cn(
                    "relative flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium transition-colors sm:flex-none sm:px-5",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`${layoutIdPrefix}-media-tab`}
                      className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Dropdown
              id={`${layoutIdPrefix}-sort`}
              value={filters.sort}
              onChange={(value) => onChange({ sort: value as SortOption })}
              options={SORT_OPTIONS}
              placeholder="Sort"
              fullWidth={false}
              triggerClassName="min-w-[9.5rem]"
            />
            <div className="flex items-center gap-2">
              <Dropdown
                id={`${layoutIdPrefix}-year-from`}
                value={yearNumberToValue(filters.yearFrom)}
                onChange={(value) =>
                  onChange({ yearFrom: yearValueToNumber(value) })
                }
                options={YEAR_OPTIONS}
                placeholder="From"
                fullWidth={false}
                triggerClassName="min-w-[6.5rem]"
              />
              <span className="text-xs font-medium text-muted-foreground">
                –
              </span>
              <Dropdown
                id={`${layoutIdPrefix}-year-to`}
                value={yearNumberToValue(filters.yearTo)}
                onChange={(value) =>
                  onChange({ yearTo: yearValueToNumber(value) })
                }
                options={YEAR_OPTIONS}
                placeholder="To"
                fullWidth={false}
                triggerClassName="min-w-[6.5rem]"
              />
            </div>
            {hasActiveFilters && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onReset}
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border/70 px-3.5 py-2 text-sm font-medium",
                  "text-muted-foreground transition-colors hover:border-primary/25 hover:bg-accent hover:text-foreground",
                  "dark:border-white/10 dark:hover:bg-white/5"
                )}
              >
                <RotateCcw className="size-3.5" />
                Reset
              </motion.button>
            )}
          </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Genres
            </span>
          </div>
          {filters.genres.length > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
            >
              {filters.genres.length} selected
            </motion.span>
          )}
        </div>
        <div className="relative">
          <GenreChips
            genres={genres}
            selected={filters.genres}
            onToggle={toggleGenre}
            loading={genresLoading}
            error={genresError}
            layoutIdPrefix={`${layoutIdPrefix}-genre`}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background/95 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export function BrowseFilters({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
  activeMediaType,
  basePath,
  className,
}: BrowseFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount = getBrowseActiveFilterCount(filters);

  return (
    <>
      <div className={cn("mb-6 space-y-3 lg:hidden", className)}>
        <div className="relative flex w-full rounded-xl border border-border/60 bg-muted/40 p-1 dark:border-white/10 dark:bg-white/[0.03]">
          {BROWSE_TABS.map((tab) => {
            const isActive = basePath === tab.href;
            const href = getBrowseTabHref(tab.href, filters);

            return (
              <Link
                key={tab.id}
                href={href}
                className={cn(
                  "relative flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors sm:text-sm",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="browse-mobile-tab"
                    className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setMobileOpen(true)}
            className={cn(
              "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold",
              "border-border/70 bg-card/80 shadow-[var(--shadow-soft)] backdrop-blur-md",
              "dark:border-white/10 dark:bg-white/[0.04]"
            )}
          >
            <Filter className="size-4" />
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 320 }}
                className={cn(
                  "fixed inset-x-0 bottom-0 z-[110] flex max-h-[88vh] flex-col rounded-t-3xl",
                  "border-t border-border/60 bg-background/95 backdrop-blur-xl",
                  "dark:border-white/10 dark:bg-[#0c0a14]/95"
                )}
              >
                <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-5 py-4 dark:border-white/10">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      Filters
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Refine your browse results
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close filters"
                    className="flex size-10 items-center justify-center rounded-xl border border-border/60 hover:bg-accent dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5">
                  <BrowseFiltersContent
                    filters={filters}
                    onChange={onChange}
                    onReset={onReset}
                    hasActiveFilters={hasActiveFilters}
                    activeMediaType={activeMediaType}
                    basePath={basePath}
                    layoutIdPrefix="browse-mobile"
                  />
                </div>

                <div className="shrink-0 border-t border-border/50 p-5 dark:border-white/10">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMobileOpen(false)}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_rgba(124,58,237,0.28)]"
                  >
                    Show Results
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        layout
        className={cn(
          "hidden lg:block",
          "sticky top-16 z-30 -mx-2 mb-8 rounded-2xl p-4 sm:-mx-0",
          "glass-panel shadow-[var(--shadow-soft)]",
          className
        )}
      >
        <BrowseFiltersContent
          filters={filters}
          onChange={onChange}
          onReset={onReset}
          hasActiveFilters={hasActiveFilters}
          activeMediaType={activeMediaType}
          basePath={basePath}
          layoutIdPrefix="browse-desktop"
        />
      </motion.div>
    </>
  );
}