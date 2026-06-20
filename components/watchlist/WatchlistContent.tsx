"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bookmark, Loader2 } from "lucide-react";
import { ContentCard } from "@/components/ui/ContentCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SupabaseErrorBanner } from "@/components/ui/SupabaseErrorBanner";
import { WatchlistSyncToggle } from "@/components/watchlist/WatchlistSyncToggle";
import {
  selectWatchlistItems,
  selectWatchlistLoading,
  selectWatchlistError,
  selectWatchlistSyncing,
  clearWatchlistError,
} from "@/store/slices/watchlistSlice";
import {
  selectPreferencesError,
  selectPreferencesLoading,
} from "@/store/slices/preferencesSlice";
import { selectAuthError, selectIsAuthenticated } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { watchlistItemToCardData } from "@/lib/watchlist";
import { useWatchlistActions } from "@/hooks/useWatchlistActions";

export function WatchlistContent() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWatchlistItems);
  const loading = useAppSelector(selectWatchlistLoading);
  const syncing = useAppSelector(selectWatchlistSyncing);
  const watchlistError = useAppSelector(selectWatchlistError);
  const preferencesError = useAppSelector(selectPreferencesError);
  const preferencesLoading = useAppSelector(selectPreferencesLoading);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { clearAll } = useWatchlistActions();
  const [dismissedError, setDismissedError] = useState(false);

  const activeError =
    !dismissedError &&
    (watchlistError || preferencesError || authError);

  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {syncing
            ? "Syncing your watchlist…"
            : preferencesLoading
              ? "Loading your preferences…"
              : "Loading watchlist…"}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        {activeError && (
          <SupabaseErrorBanner
            message={activeError}
            onDismiss={() => {
              setDismissedError(true);
              dispatch(clearWatchlistError());
            }}
          />
        )}
        <WatchlistSyncToggle />
        <EmptyState
          icon={Bookmark}
          title="Your watchlist is empty"
          description={
            isAuthenticated
              ? "Save movies and shows with the bookmark icon — they'll sync when cloud sync is on."
              : "Save movies and shows you want to watch later using the bookmark icon on any title."
          }
          actionLabel="Start Exploring"
          actionHref="/"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {activeError && (
        <SupabaseErrorBanner
          message={activeError}
          onDismiss={() => {
            setDismissedError(true);
            dispatch(clearWatchlistError());
          }}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {items.length} saved title{items.length === 1 ? "" : "s"}
            {isAuthenticated ? " · signed in" : " · stored on this device"}
            {syncing ? " · syncing…" : ""}
          </p>
          <WatchlistSyncToggle />
        </div>
        <button
          type="button"
          onClick={async () => {
            const ok = await clearAll();
            if (ok) toast.success("Watchlist cleared");
          }}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item, index) => (
          <ContentCard
            key={`${item.mediaType}-${item.id}`}
            {...watchlistItemToCardData(item)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}