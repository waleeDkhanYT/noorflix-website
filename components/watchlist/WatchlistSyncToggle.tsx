"use client";

import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { selectPreferencesLoading } from "@/store/slices/preferencesSlice";
import {
  selectWatchlistSyncEnabled,
  selectWatchlistSyncing,
} from "@/store/slices/watchlistSlice";
import {
  setWatchlistStorageMode,
  setWatchlistSyncEnabled,
} from "@/store/slices/watchlistSlice";
import { toggleWatchlistSyncPreference } from "@/store/thunks/preferencesThunks";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export function WatchlistSyncToggle() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const syncEnabled = useAppSelector(selectWatchlistSyncEnabled);
  const preferencesLoading = useAppSelector(selectPreferencesLoading);
  const syncing = useAppSelector(selectWatchlistSyncing);

  if (!isAuthenticated) {
    return (
      <p className="text-xs text-muted-foreground">
        Sign in to sync your watchlist across devices.
      </p>
    );
  }

  const handleToggle = async () => {
    const next = !syncEnabled;
    const result = await dispatch(toggleWatchlistSyncPreference(next));

    if (toggleWatchlistSyncPreference.rejected.match(result)) {
      toast.error(
        typeof result.payload === "string"
          ? result.payload
          : "Could not update sync preference."
      );
      return;
    }

    dispatch(setWatchlistSyncEnabled(next));
    dispatch(setWatchlistStorageMode(next ? "cloud" : "local"));

    if (next && toggleWatchlistSyncPreference.fulfilled.match(result)) {
      const count = result.payload.syncedCount;
      toast.success(
        count && count > 0
          ? `Watchlist synced — ${count} title${count === 1 ? "" : "s"}`
          : "Cloud sync enabled"
      );
      return;
    }

    toast.success("Cloud sync disabled — watchlist stays on this device");
  };

  const isUpdating = preferencesLoading || syncing;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={syncEnabled}
      disabled={isUpdating}
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
        "border-border/70 bg-card/60 hover:bg-accent dark:border-white/10 dark:hover:bg-white/5",
        "disabled:cursor-not-allowed disabled:opacity-60"
      )}
    >
      {isUpdating ? (
        <Loader2 className="size-4 animate-spin text-primary" />
      ) : syncEnabled ? (
        <Cloud className="size-4 text-primary" strokeWidth={2} />
      ) : (
        <CloudOff className="size-4 text-muted-foreground" strokeWidth={2} />
      )}
      <span>
        Sync across devices
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
          {syncEnabled ? "On" : "Off"}
        </span>
      </span>
    </button>
  );
}