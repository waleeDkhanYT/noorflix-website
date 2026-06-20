"use client";

import StarIcon from "@mui/icons-material/Star";
import { cn } from "@/lib/utils";

type DetailRatingsProps = {
  tmdbRating?: number;
  tmdbVotes?: number;
  imdbRating?: string | null;
  rottenTomatoesScore?: string | null;
  metascore?: string | null;
  className?: string;
};

function RatingCard({
  label,
  value,
  sublabel,
  className,
  icon,
}: {
  label: string;
  value: string;
  sublabel?: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[5.5rem] flex-col gap-1 rounded-xl border border-border/60 px-4 py-3",
        "dark:border-white/10",
        className
      )}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-lg font-semibold leading-none">{value}</span>
      </div>
      {sublabel && (
        <span className="text-[10px] text-muted-foreground">{sublabel}</span>
      )}
    </div>
  );
}

export function DetailRatings({
  tmdbRating,
  tmdbVotes,
  imdbRating,
  rottenTomatoesScore,
  metascore,
  className,
}: DetailRatingsProps) {
  const hasAny =
    (tmdbRating && tmdbRating > 0) ||
    imdbRating ||
    rottenTomatoesScore ||
    (metascore && metascore !== "N/A");

  if (!hasAny) return null;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {tmdbRating != null && tmdbRating > 0 && (
        <RatingCard
          label="TMDB"
          value={tmdbRating.toFixed(1)}
          sublabel={
            tmdbVotes ? `${tmdbVotes.toLocaleString()} votes` : undefined
          }
          className="bg-amber-400/10 dark:bg-amber-400/5"
          icon={
            <StarIcon sx={{ fontSize: 18 }} className="!text-amber-500" />
          }
        />
      )}
      {imdbRating && (
        <RatingCard
          label="IMDb"
          value={imdbRating}
          className="bg-[#F5C518]/10 dark:bg-[#F5C518]/5"
        />
      )}
      {rottenTomatoesScore && (
        <RatingCard
          label="Rotten Tomatoes"
          value={rottenTomatoesScore}
          className="bg-emerald-500/10 dark:bg-emerald-400/5"
        />
      )}
      {metascore && metascore !== "N/A" && (
        <RatingCard
          label="Metascore"
          value={metascore}
          className="bg-sky-500/10 dark:bg-sky-400/5"
        />
      )}
    </div>
  );
}