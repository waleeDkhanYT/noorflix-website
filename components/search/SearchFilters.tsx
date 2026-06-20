"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, RotateCcw, X } from "lucide-react";
import {
  useGetMovieGenresQuery,
  useGetTVGenresQuery,
} from "@/store/api/tmdbApi";
import { Dropdown } from "@/components/ui/Dropdown";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { SORT_OPTIONS } from "@/lib/search";
import {
  buildYearOptions,
  yearNumberToValue,
  yearValueToNumber,
} from "@/lib/dropdown-options";
import type { MediaTypeFilter, SearchFilters, SortOption } from "@/types/search";
import { cn } from "@/lib/utils";

type SearchFiltersProps = {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  className?: string;
};

const MEDIA_TYPES: { value: MediaTypeFilter; label: string }[] = [
  { value: "all", label: "All Media" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
  { value: "anime", label: "Anime" },
];

const YEAR_OPTIONS = buildYearOptions();

export function SearchFiltersPanel({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
  className,
}: SearchFiltersProps) {
  const {
    data: movieGenres,
    isLoading: movieGenresLoading,
    isError: movieGenresError,
  } = useGetMovieGenresQuery();
  const {
    data: tvGenres,
    isLoading: tvGenresLoading,
    isError: tvGenresError,
  } = useGetTVGenresQuery();

  const genresLoading = movieGenresLoading || tvGenresLoading;
  const genresError = movieGenresError || tvGenresError;

  const genres = useMemo(() => {
    const map = new Map<number, string>();
    movieGenres?.genres.forEach((genre) => map.set(genre.id, genre.name));
    tvGenres?.genres.forEach((genre) => map.set(genre.id, genre.name));
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [movieGenres, tvGenres]);

  const genreOptions = useMemo(
    () => genres.map((genre) => ({ value: genre.id, label: genre.name })),
    [genres]
  );

  return (
    <aside
      className={cn(
        "space-y-5 rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm",
        "dark:border-white/10 dark:bg-card/30",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:brightness-110"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        )}
      </div>

      <Dropdown
        id="media-type-filter"
        label="Media Type"
        value={filters.type}
        onChange={(value) => onChange({ type: value as MediaTypeFilter })}
        options={MEDIA_TYPES}
        placeholder="All Media"
      />

      <Dropdown
        id="sort-select"
        label="Sort By"
        value={filters.sort}
        onChange={(value) => onChange({ sort: value as SortOption })}
        options={SORT_OPTIONS}
        placeholder="Popularity"
      />

      <div className="space-y-2">
        <span className="block text-xs font-medium text-muted-foreground">
          Year Range
        </span>
        <div className="grid grid-cols-2 gap-2">
          <Dropdown
            id="year-from"
            value={yearNumberToValue(filters.yearFrom)}
            onChange={(value) =>
              onChange({ yearFrom: yearValueToNumber(value) })
            }
            options={YEAR_OPTIONS}
            placeholder="From"
            label={undefined}
          />
          <Dropdown
            id="year-to"
            value={yearNumberToValue(filters.yearTo)}
            onChange={(value) => onChange({ yearTo: yearValueToNumber(value) })}
            options={YEAR_OPTIONS}
            placeholder="To"
            label={undefined}
          />
        </div>
      </div>

      <MultiSelectDropdown
        id="genre-filter"
        label="Genres"
        values={filters.genres}
        onChange={(genres) => onChange({ genres })}
        options={genreOptions}
        placeholder="All genres"
        loading={genresLoading}
        loadingLabel="Loading genres…"
        errorLabel={
          genresError ? "Genres unavailable. Check your TMDB API key." : undefined
        }
        emptyLabel="No genres found"
      />
    </aside>
  );
}

export function SearchFilters({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
}: SearchFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border/80 px-4 py-2.5 text-sm font-medium",
            "transition-colors hover:bg-accent dark:border-white/10 dark:hover:bg-white/5"
          )}
        >
          <Filter className="size-4" />
          Filters
          {hasActiveFilters && (
            <span className="size-2 rounded-full bg-primary" />
          )}
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border/60 bg-background p-5 dark:border-white/10"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close filters"
                    className="flex size-10 items-center justify-center rounded-xl hover:bg-accent dark:hover:bg-white/10"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <SearchFiltersPanel
                  filters={filters}
                  onChange={(patch) => {
                    onChange(patch);
                  }}
                  onReset={onReset}
                  hasActiveFilters={hasActiveFilters}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <SearchFiltersPanel
        filters={filters}
        onChange={onChange}
        onReset={onReset}
        hasActiveFilters={hasActiveFilters}
        className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
      />
    </>
  );
}