"use client";

import { ContentCard } from "@/components/ui/ContentCard";
import { mapTmdbToContentCard, resolveMediaType } from "@/lib/content";
import { type DetailRouteType, routeTypeToApiType } from "@/lib/detail";
import type { TMDBMedia } from "@/types";
import type { ContentMediaType } from "@/types/content";
import { cn } from "@/lib/utils";

type RecommendationsRowProps = {
  items: TMDBMedia[];
  routeType: DetailRouteType;
};

function resolveRecommendationMediaType(
  item: TMDBMedia,
  routeType: DetailRouteType
): ContentMediaType {
  if (routeType === "movie") return "movie";
  if (routeType === "anime") return "anime";

  const apiType = routeTypeToApiType(routeType);
  return resolveMediaType({ ...item, media_type: apiType });
}

export function RecommendationsRow({
  items,
  routeType,
}: RecommendationsRowProps) {
  const recommendations = items.filter((item) => item.poster_path).slice(0, 16);

  if (recommendations.length === 0) return null;

  const apiMediaType = routeTypeToApiType(routeType);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          More Like This
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Recommendations from TMDB
        </p>
      </div>
      <div className="relative">
        <div
          className={cn(
            "scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2",
            "snap-x snap-mandatory scroll-smooth sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          )}
        >
          {recommendations.map((item, index) => (
            <div
              key={item.id}
              className="w-[9.5rem] shrink-0 snap-start sm:w-[11rem] md:w-[12.5rem]"
            >
              <ContentCard
                {...mapTmdbToContentCard(
                  { ...item, media_type: apiMediaType },
                  {
                    mediaType: resolveRecommendationMediaType(item, routeType),
                  }
                )}
                index={index}
                sizes="180px"
              />
            </div>
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent sm:w-16"
        />
      </div>
    </section>
  );
}