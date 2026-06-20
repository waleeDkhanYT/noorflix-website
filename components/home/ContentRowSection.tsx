"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentCard } from "@/components/ui/ContentCard";
import { HorizontalRowSkeleton } from "@/components/ui/Skeleton";
import { mapTmdbToContentCard } from "@/lib/content";
import type { ContentMediaType } from "@/types/content";
import type { TMDBMedia } from "@/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Film } from "lucide-react";
import { cn } from "@/lib/utils";

type QueryState = {
  data?: { results: TMDBMedia[] };
  isLoading: boolean;
  isError: boolean;
};

type ContentRowSectionProps = {
  title: string;
  description?: string;
  seeAllHref: string;
  query: QueryState;
  limit?: number;
  mediaType?: ContentMediaType;
  filter?: (item: TMDBMedia) => boolean;
  emptyMessage?: string;
  className?: string;
};

const CARD_WIDTH =
  "w-[9.5rem] shrink-0 snap-start sm:w-[11rem] md:w-[12.5rem] lg:w-[13.5rem]";

export function ContentRowSection({
  title,
  description,
  seeAllHref,
  query,
  limit = 20,
  mediaType,
  filter,
  emptyMessage = "No titles available right now.",
  className,
}: ContentRowSectionProps) {
  const { data, isLoading, isError } = query;

  if (isLoading) {
    return <HorizontalRowSkeleton title={title} />;
  }

  const results = (data?.results ?? []).filter(
    (item) => (filter ? filter(item) : true) && (item.poster_path || item.title || item.name)
  );

  if (isError) {
    return (
      <section className={cn("space-y-4", className)}>
        <SectionHeader
          title={title}
          description={description}
          seeAllHref={seeAllHref}
        />
        <ErrorState
          title="Section unavailable"
          message={emptyMessage}
          className="py-10"
        />
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <section className={cn("space-y-4", className)}>
        <SectionHeader
          title={title}
          description={description}
          seeAllHref={seeAllHref}
        />
        <EmptyState
          icon={Film}
          title="Nothing here yet"
          description={emptyMessage}
          actionLabel="Browse all"
          actionHref={seeAllHref}
          className="py-10"
        />
      </section>
    );
  }

  return (
    <section className={cn("space-y-5", className)}>
      <SectionHeader
        title={title}
        description={description}
        seeAllHref={seeAllHref}
      />

      <div className="relative">
        <div
          className={cn(
            "scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2",
            "snap-x snap-mandatory scroll-smooth",
            "sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          )}
        >
          {results.slice(0, limit).map((item, index) => (
            <div key={`${item.id}-${item.media_type ?? "media"}`} className={CARD_WIDTH}>
              <ContentCard
                {...mapTmdbToContentCard(item, { mediaType })}
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

function SectionHeader({
  title,
  description,
  seeAllHref,
}: {
  title: string;
  description?: string;
  seeAllHref: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Link
        href={seeAllHref}
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5",
          "text-sm font-medium text-primary transition-all",
          "hover:bg-primary/10 active:scale-[0.98]"
        )}
      >
        See All
        <ArrowRight className="size-4" strokeWidth={2} />
      </Link>
    </div>
  );
}