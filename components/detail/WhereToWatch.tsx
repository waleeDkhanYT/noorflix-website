"use client";

import { useState } from "react";
import { ExternalLink, Tv } from "lucide-react";
import { useGetSourcesByTmdbQuery } from "@/store/api/watchmodeApi";
import { Dropdown } from "@/components/ui/Dropdown";
import { WATCH_REGIONS, getPlatformStyle, type WatchRegionCode } from "@/lib/detail";
import type { DetailMediaType } from "@/types/tmdb-detail";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

type WhereToWatchProps = {
  mediaType: DetailMediaType;
  tmdbId: number;
};

const REGION_OPTIONS = WATCH_REGIONS.map((region) => ({
  value: region.code,
  label: region.label,
}));

export function WhereToWatch({ mediaType, tmdbId }: WhereToWatchProps) {
  const [region, setRegion] = useState<WatchRegionCode>("US");
  const { data, isLoading, isError } = useGetSourcesByTmdbQuery({
    mediaType,
    tmdbId,
    region,
  });

  const sources = data ?? [];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Where to Watch
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Streaming platforms via Watchmode
          </p>
        </div>
        <Dropdown
          id="watch-region"
          label="Region"
          value={region}
          onChange={(value) => setRegion(value as WatchRegionCode)}
          options={REGION_OPTIONS}
          fullWidth={false}
          triggerClassName="min-w-[12.5rem] sm:min-w-[14rem]"
          className="w-full sm:w-auto"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-36 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
          <p className="text-sm text-muted-foreground">
            Streaming info unavailable. Add your Watchmode API key to enable this
            section.
          </p>
        </div>
      ) : sources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center dark:border-white/10">
          <Tv className="mx-auto size-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            No streaming options found for {region}.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {sources.map((source) => (
            <a
              key={`${source.source_id}-${source.region}-${source.web_url}`}
              href={source.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-4 py-3",
                "text-sm font-semibold shadow-sm transition-all",
                "hover:scale-[1.02] hover:shadow-md active:scale-[0.98]",
                getPlatformStyle(source.name)
              )}
            >
              <span>{source.name}</span>
              {source.price != null && source.price > 0 && (
                <span className="text-xs opacity-80">${source.price}</span>
              )}
              <ExternalLink className="size-3.5 opacity-80" strokeWidth={2} />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}