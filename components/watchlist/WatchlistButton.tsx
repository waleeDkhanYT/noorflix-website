"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import {
  selectIsInWatchlist,
} from "@/store/slices/watchlistSlice";
import { useAppSelector } from "@/store/hooks";
import { createWatchlistItem } from "@/lib/watchlist";
import { useWatchlistActions } from "@/hooks/useWatchlistActions";
import type { ContentCardData } from "@/types/content";
import { cn } from "@/lib/utils";

type WatchlistButtonProps = {
  item: ContentCardData;
  variant?: "icon" | "button";
  className?: string;
  onToggle?: (added: boolean) => void;
};

export function WatchlistButton({
  item,
  variant = "icon",
  className,
  onToggle,
}: WatchlistButtonProps) {
  const { toggleFromCard } = useWatchlistActions();
  const [isPending, setIsPending] = useState(false);
  const watchlistItem = createWatchlistItem(item);

  if (!watchlistItem) return null;

  const isSaved = useAppSelector((state) =>
    selectIsInWatchlist(state, watchlistItem.id, watchlistItem.mediaType)
  );

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsPending(true);
    try {
      const ok = await toggleFromCard(item, isSaved);
      if (ok) onToggle?.(!isSaved);
    } finally {
      setIsPending(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={isSaved ? "Remove from watchlist" : "Add to watchlist"}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
          isSaved
            ? "bg-primary text-primary-foreground hover:brightness-110"
            : "border border-border/80 hover:bg-accent dark:border-white/10 dark:hover:bg-white/5",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="size-4" strokeWidth={2} />
        ) : (
          <Bookmark className="size-4" strokeWidth={2} />
        )}
        {isSaved ? "In Watchlist" : "Add to Watchlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isSaved ? "Remove from watchlist" : "Add to watchlist"}
      className={cn(
        "flex size-8 items-center justify-center rounded-full backdrop-blur-sm transition-all",
        "hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
        isSaved
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-black/45 text-white hover:bg-black/60",
        className
      )}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="size-4" strokeWidth={2} />
      ) : (
        <Bookmark className="size-4" strokeWidth={2} />
      )}
    </button>
  );
}