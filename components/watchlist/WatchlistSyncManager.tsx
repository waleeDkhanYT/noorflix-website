"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  selectAuthInitialized,
  selectAuthUserId,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import { selectCloudWatchlistSyncEnabled, selectPreferencesHydrated } from "@/store/slices/preferencesSlice";
import { initializeWatchlist } from "@/store/thunks/watchlistThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function WatchlistSyncManager() {
  const dispatch = useAppDispatch();
  const authInitialized = useAppSelector(selectAuthInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userId = useAppSelector(selectAuthUserId);
  const preferencesHydrated = useAppSelector(selectPreferencesHydrated);
  const syncEnabled = useAppSelector(selectCloudWatchlistSyncEnabled);
  const syncEnabledRef = useRef(syncEnabled);
  syncEnabledRef.current = syncEnabled;
  const loginSyncDoneRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authInitialized) return;

    const preferencesReady = !isAuthenticated || preferencesHydrated;
    if (!preferencesReady) return;

    const handleAuthEvent = async (
      event: "INITIAL_SESSION" | "SIGNED_IN" | "SIGNED_OUT",
      sessionUserId: string | null
    ) => {
      const mappedEvent =
        event === "SIGNED_OUT" || !sessionUserId ? "SIGNED_OUT" : event;

      if (
        mappedEvent === "SIGNED_IN" &&
        loginSyncDoneRef.current === sessionUserId
      ) {
        return;
      }

      const result = await dispatch(
        initializeWatchlist({
          event: mappedEvent,
          userId: sessionUserId,
          syncEnabled: isAuthenticated ? syncEnabledRef.current : true,
        })
      );

      if (initializeWatchlist.rejected.match(result)) {
        toast.error(
          typeof result.payload === "string"
            ? result.payload
            : "Could not load watchlist."
        );
        return;
      }

      if (!initializeWatchlist.fulfilled.match(result)) return;

      const payload = result.payload;

      if (sessionUserId) {
        loginSyncDoneRef.current = sessionUserId;
      } else {
        loginSyncDoneRef.current = null;
      }

      if (payload.showSyncToast) {
        if (payload.syncFailed) {
          toast.error("Could not sync watchlist. Using local copy.");
          return;
        }

        const count = payload.syncedCount;
        toast.success(
          count > 0
            ? `Watchlist synced — ${count} title${count === 1 ? "" : "s"}`
            : "Watchlist synced"
        );
      }
    };

    const supabase = createClient();

    void supabase.auth.getSession().then(({ data: { session } }) => {
      void handleAuthEvent(
        "INITIAL_SESSION",
        session?.user?.id ?? null
      );
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;

      const mapped =
        event === "SIGNED_OUT"
          ? "SIGNED_OUT"
          : event === "SIGNED_IN"
            ? "SIGNED_IN"
            : "INITIAL_SESSION";

      void handleAuthEvent(mapped, session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [authInitialized, dispatch, isAuthenticated, preferencesHydrated]);

  return null;
}