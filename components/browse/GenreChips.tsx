"use client";

import { motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";

export type GenreChipItem = {
  id: number;
  name: string;
};

type GenreChipsProps = {
  genres: GenreChipItem[];
  selected: number[];
  onToggle: (genreId: number) => void;
  loading?: boolean;
  error?: boolean;
  layoutIdPrefix?: string;
  className?: string;
  size?: "sm" | "md";
};

export function GenreChips({
  genres,
  selected,
  onToggle,
  loading = false,
  error = false,
  layoutIdPrefix = "genre",
  className,
  size = "md",
}: GenreChipsProps) {
  if (loading) {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "animate-pulse rounded-full bg-muted/80 dark:bg-white/5",
              size === "sm" ? "h-8 w-20" : "h-9 w-24"
            )}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Genres unavailable. Check your TMDB API key.
      </p>
    );
  }

  if (genres.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No genres found.</p>
    );
  }

  return (
    <LayoutGroup id={layoutIdPrefix}>
      <div
        className={cn(
          "scrollbar-hide flex gap-2 overflow-x-auto pb-0.5",
          className
        )}
      >
        {genres.map((genre) => {
          const isActive = selected.includes(genre.id);

          return (
            <motion.button
              key={genre.id}
              type="button"
              layout
              onClick={() => onToggle(genre.id)}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className={cn(
                "relative shrink-0 rounded-full font-medium transition-colors touch-manipulation",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                size === "sm"
                  ? "px-3.5 py-1.5 text-xs"
                  : "px-4 py-2 text-sm",
                isActive
                  ? "text-primary-foreground"
                  : "border border-border/70 bg-card/60 text-muted-foreground hover:border-primary/20 hover:bg-accent hover:text-foreground dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`${layoutIdPrefix}-pill`}
                  className="absolute inset-0 rounded-full bg-primary shadow-[0_4px_14px_rgba(124,58,237,0.35)] dark:shadow-[0_4px_18px_rgba(167,139,250,0.28)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{genre.name}</span>
            </motion.button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}