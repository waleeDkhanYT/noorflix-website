"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Film, Sparkles, TrendingUp } from "lucide-react";
import { useGetDetailsFullQuery } from "@/store/api/tmdbApi";
import { useGetByImdbIdQuery } from "@/store/api/omdbApi";
import { DetailSkeleton } from "@/components/detail/DetailSkeleton";
import { DetailRatings } from "@/components/detail/DetailRatings";
import { WhereToWatch } from "@/components/detail/WhereToWatch";
import { CastSection } from "@/components/detail/CastSection";
import { TrailerSection } from "@/components/detail/TrailerSection";
import { RecommendationsRow } from "@/components/detail/RecommendationsRow";
import { MediaTypeBadge } from "@/components/ui/MediaTypeBadge";
import { WatchlistButton } from "@/components/watchlist/WatchlistButton";
import { extractRatingsFromOmdb } from "@/lib/content";
import {
  formatCurrency,
  formatDate,
  formatPopularity,
  formatRuntime,
} from "@/lib/format";
import {
  type DetailRouteType,
  getDetailHrefFromId,
  getImdbId,
  pickTrailer,
  routeTypeToApiType,
} from "@/lib/detail";
import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb-images";
import type { ContentMediaType } from "@/types/content";
import { ErrorState } from "@/components/ui/ErrorState";
import { cn } from "@/lib/utils";

type DetailContentProps = {
  routeType: DetailRouteType;
  id: number;
  className?: string;
};

function getDisplayMediaType(
  routeType: DetailRouteType,
  genres: { id: number; name: string }[],
  language?: string
): ContentMediaType {
  if (routeType === "anime") return "anime";
  if (routeType === "movie") return "movie";

  if (
    genres.some((genre) => genre.id === 16) &&
    language === "ja"
  ) {
    return "anime";
  }
  return "tv";
}

export function DetailContent({
  routeType,
  id,
  className,
}: DetailContentProps) {
  const router = useRouter();
  const mediaType = routeTypeToApiType(routeType);

  const { data, isLoading, isError, refetch } = useGetDetailsFullQuery({
    mediaType,
    id,
  });

  const isMovie = mediaType === "movie";
  const imdbId = data
    ? getImdbId(
        isMovie ? (data as { imdb_id?: string }).imdb_id : undefined,
        data.external_ids
      )
    : null;

  const { data: omdbData } = useGetByImdbIdQuery(imdbId ?? "", {
    skip: !imdbId,
  });

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
        <ErrorState
          title="Couldn't load details"
          message="Check your TMDB API key in .env.local and try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const title = isMovie
    ? (data as { title: string }).title
    : (data as { name: string }).name;
  const releaseDate = isMovie
    ? (data as { release_date: string }).release_date
    : (data as { first_air_date: string }).first_air_date;
  const runtime = isMovie
    ? (data as { runtime: number }).runtime
    : (data as { episode_run_time: number[] }).episode_run_time?.[0];

  const { imdbRating, rottenTomatoesScore } = omdbData
    ? extractRatingsFromOmdb(omdbData)
    : { imdbRating: null, rottenTomatoesScore: null };

  const metascore =
    omdbData?.Metascore && omdbData.Metascore !== "N/A"
      ? omdbData.Metascore
      : null;

  const backdropUrl = getBackdropUrl(data.backdrop_path, "w1280");
  const posterUrl = getPosterUrl(data.poster_path, "w500");
  const trailer = pickTrailer(data.videos?.results ?? []);
  const displayType = getDisplayMediaType(
    routeType,
    data.genres,
    isMovie ? undefined : (data as { original_language?: string }).original_language
  );
  const detailHref = getDetailHrefFromId(id, displayType);

  const budget = isMovie ? (data as { budget: number }).budget : null;
  const revenue = isMovie ? (data as { revenue: number }).revenue : null;
  const seasons = !isMovie
    ? (data as { number_of_seasons: number }).number_of_seasons
    : null;
  const episodes = !isMovie
    ? (data as { number_of_episodes: number }).number_of_episodes
    : null;

  const metaItems = [
    releaseDate && {
      icon: Calendar,
      label: formatDate(releaseDate),
    },
    formatRuntime(runtime) && {
      icon: Clock,
      label: formatRuntime(runtime)!,
    },
    !isMovie &&
      seasons && {
        icon: Film,
        label: `${seasons} season${seasons > 1 ? "s" : ""}${
          episodes ? ` · ${episodes} eps` : ""
        }`,
      },
    {
      icon: TrendingUp,
      label: `Popularity ${formatPopularity(data.popularity)}`,
    },
    {
      icon: Sparkles,
      label: `User score ${data.vote_average.toFixed(1)}/10`,
    },
  ].filter(Boolean) as { icon: typeof Calendar; label: string }[];

  return (
    <article className={cn("pb-16", className)}>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <motion.button
          type="button"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-full border border-border/80 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/10 dark:hover:bg-white/5"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          Back
        </motion.button>
      </div>

      <div className="relative min-h-[42vh] overflow-hidden sm:min-h-[48vh]">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="h-full min-h-[42vh] bg-gradient-to-br from-violet-950 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto w-44 shrink-0 -mt-28 sm:w-52 md:mx-0 md:-mt-36 lg:w-56"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border/50 dark:ring-white/10">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 768px) 176px, 224px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
                  No poster
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="min-w-0 flex-1 space-y-5 pt-2 md:pt-6"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <MediaTypeBadge type={displayType} variant="inline" />
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground dark:bg-white/10">
                  {data.status}
                </span>
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              {data.tagline && (
                <p className="text-base italic text-muted-foreground sm:text-lg">
                  {data.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-border/80 px-3 py-1 text-xs font-medium dark:border-white/10"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {metaItems.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5">
                  <item.icon className="size-4 shrink-0" strokeWidth={2} />
                  {item.label}
                </span>
              ))}
            </div>

            <DetailRatings
              tmdbRating={data.vote_average}
              tmdbVotes={data.vote_count}
              imdbRating={imdbRating}
              rottenTomatoesScore={rottenTomatoesScore}
              metascore={metascore}
            />

            <WatchlistButton
              variant="button"
              item={{
                id,
                title,
                posterUrl,
                year: releaseDate?.slice(0, 4),
                mediaType: displayType,
                tmdbRating: data.vote_average,
                overview: data.overview,
                href: detailHref,
              }}
            />

            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              {data.overview || "No overview available."}
            </p>

            {(budget || revenue) && (
              <div className="flex flex-wrap gap-6 text-sm">
                {budget && formatCurrency(budget) && (
                  <div>
                    <span className="text-muted-foreground">Budget</span>
                    <p className="font-semibold">{formatCurrency(budget)}</p>
                  </div>
                )}
                {revenue && formatCurrency(revenue) && (
                  <div>
                    <span className="text-muted-foreground">Revenue</span>
                    <p className="font-semibold">{formatCurrency(revenue)}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mt-14 space-y-14"
        >
          <WhereToWatch mediaType={mediaType} tmdbId={id} />
          <TrailerSection trailer={trailer} />
          <CastSection
            cast={data.credits?.cast ?? []}
            crew={data.credits?.crew ?? []}
          />
          <RecommendationsRow
            items={data.recommendations?.results ?? []}
            routeType={routeType}
          />
        </motion.div>
      </div>
    </article>
  );
}