"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import { Film } from "lucide-react";
import { MediaTypeBadge } from "@/components/ui/MediaTypeBadge";
import { WatchlistButton } from "@/components/watchlist/WatchlistButton";
import { parseRottenTomatoesScore } from "@/lib/content";
import type { ContentCardData } from "@/types/content";
import { cn } from "@/lib/utils";

export type ContentCardProps = ContentCardData & {
  index?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  animate?: boolean;
};

function RatingPill({
  label,
  value,
  className,
  icon,
}: {
  label: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none",
        className
      )}
    >
      {icon}
      <span className="opacity-80">{label}</span>
      <span>{value}</span>
    </span>
  );
}

function PosterFallback({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-muted p-4 text-center">
      <Film className="size-8 text-muted-foreground/50" strokeWidth={1.5} />
      <span className="line-clamp-3 text-xs text-muted-foreground">{title}</span>
    </div>
  );
}

export function ContentCard({
  id,
  title,
  posterUrl,
  year,
  mediaType,
  tmdbRating,
  imdbRating,
  rottenTomatoesScore,
  overview,
  href,
  index = 0,
  className,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw",
  animate = true,
}: ContentCardProps) {
  const router = useRouter();

  const rtValue = rottenTomatoesScore
    ? parseRottenTomatoesScore(rottenTomatoesScore)
    : null;
  const rtDisplay = rottenTomatoesScore?.includes("%")
    ? rottenTomatoesScore
    : rtValue !== null
      ? `${rtValue}%`
      : rottenTomatoesScore;

  const hasRatings =
    (tmdbRating != null && tmdbRating > 0) ||
    imdbRating ||
    rottenTomatoesScore;

  const handleNavigate = () => {
    if (href) router.push(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!href) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(href);
    }
  };

  return (
    <motion.article
      initial={animate ? { opacity: 0, y: 18 } : false}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : undefined}
      onClick={href ? handleNavigate : undefined}
      onKeyDown={href ? handleKeyDown : undefined}
      className={cn(
        "group relative flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl",
        href && "cursor-pointer",
        className
      )}
    >
      <motion.div
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={cn(
          "relative aspect-[2/3] overflow-hidden rounded-xl",
          "ring-1 ring-border/60 bg-card",
          "shadow-sm transition-shadow duration-300",
          "group-hover:shadow-xl group-hover:ring-primary/20",
          "dark:ring-white/10 dark:group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)]",
          "dark:group-hover:ring-primary/30"
        )}
      >
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              priority={priority}
              sizes={sizes}
              className="object-cover"
            />
          ) : (
            <PosterFallback title={title} />
          )}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-2.5 top-2.5 z-10">
          <MediaTypeBadge type={mediaType} variant="overlay" />
        </div>

        {id != null && (
          <div className="absolute right-2.5 top-2.5 z-20">
            <WatchlistButton
              item={{
                id,
                title,
                posterUrl,
                year,
                mediaType,
                tmdbRating,
                overview,
                href,
              }}
            />
          </div>
        )}

        {overview && (
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-2 p-3 pt-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="line-clamp-3 text-xs leading-relaxed text-white/90">
              {overview}
            </p>
          </div>
        )}
      </motion.div>

      <div className="mt-3 space-y-2">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {year && (
              <span className="text-xs font-medium text-muted-foreground">
                {year}
              </span>
            )}
            {year && (
              <span
                aria-hidden
                className="size-1 rounded-full bg-border dark:bg-white/20"
              />
            )}
            <MediaTypeBadge type={mediaType} variant="inline" />
          </div>
        </div>

        {hasRatings && (
          <div className="flex flex-wrap items-center gap-1.5">
            {tmdbRating != null && tmdbRating > 0 && (
              <RatingPill
                label="TMDB"
                value={tmdbRating.toFixed(1)}
                className="bg-amber-400/15 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
                icon={
                  <StarIcon
                    sx={{ fontSize: 11 }}
                    className="!text-amber-500 dark:!text-amber-400"
                  />
                }
              />
            )}
            {imdbRating && (
              <RatingPill
                label="IMDb"
                value={imdbRating}
                className="bg-[#F5C518]/15 text-[#9a7b0a] dark:bg-[#F5C518]/10 dark:text-[#F5C518]"
              />
            )}
            {rtDisplay && (
              <RatingPill
                label="RT"
                value={rtDisplay}
                className={cn(
                  rtValue !== null && rtValue >= 60
                    ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                    : rtValue !== null
                      ? "bg-red-500/15 text-red-700 dark:bg-red-400/10 dark:text-red-300"
                      : "bg-muted text-muted-foreground"
                )}
              />
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function ContentCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="aspect-[2/3] animate-pulse rounded-xl bg-muted/80 dark:bg-white/5" />
      <div className="space-y-2">
        <div className="h-4 w-4/5 animate-pulse rounded-md bg-muted/80 dark:bg-white/5" />
        <div className="h-3 w-1/2 animate-pulse rounded-md bg-muted/60 dark:bg-white/5" />
        <div className="flex gap-1.5">
          <div className="h-5 w-14 animate-pulse rounded-md bg-muted/60 dark:bg-white/5" />
          <div className="h-5 w-14 animate-pulse rounded-md bg-muted/60 dark:bg-white/5" />
        </div>
      </div>
    </div>
  );
}