"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useGetTrendingQuery } from "@/store/api/tmdbApi";
import { SearchBarSuspense } from "@/components/search/SearchBarSuspense";
import { HeroSkeleton } from "@/components/ui/Skeleton";
import { getBackdropUrl } from "@/lib/tmdb-images";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { data, isLoading, isError, refetch } = useGetTrendingQuery({
    mediaType: "movie",
    timeWindow: "week",
  });

  if (isLoading) {
    return (
      <section className="relative -mt-16 min-h-[min(88vh,900px)] pt-16 sm:min-h-[88vh]">
        <HeroSkeleton />
      </section>
    );
  }

  const featured =
    data?.results?.find((item) => item.backdrop_path) ?? data?.results?.[0];

  const backdropUrl = getBackdropUrl(featured?.backdrop_path, "original");
  const title = featured?.title ?? featured?.name ?? "NoorFlix";
  const overview = featured?.overview;

  return (
    <section className="relative -mt-16 min-h-[min(88vh,900px)] overflow-hidden pt-16 sm:min-h-[88vh]">
      <div className="absolute inset-0">
        {backdropUrl && !isError ? (
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top scale-105"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-violet-950 via-background to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(min(88vh,900px)-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl space-y-6 sm:space-y-8"
        >
          {featured && !isError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-xs font-medium uppercase tracking-[0.25em] text-white/60 sm:text-sm"
            >
              Now trending · {title}
            </motion.p>
          )}

          {isError && (
            <div className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white/80 backdrop-blur-sm">
              Trending backdrop unavailable.{" "}
              <button
                type="button"
                onClick={() => refetch()}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Discover.
              <span className="block text-primary">Feel. Watch.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base md:text-lg"
            >
              {overview ??
                "Explore movies, TV shows, and anime — curated with cinematic detail and streaming info."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl"
          >
            <SearchBarSuspense variant="hero" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-2 pt-1 sm:gap-3 sm:pt-2"
          >
            {["Movies", "TV Shows", "Anime", "Watchlist"].map((label) => (
              <span
                key={label}
                className={cn(
                  "rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs",
                  "transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                )}
              >
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}