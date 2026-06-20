import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import {
  loadWatchlistSyncPreference,
  saveWatchlistSyncPreference,
} from "@/lib/watchlist-storage";
import { clearAuth } from "@/store/slices/authSlice";
import { setWatchlistSyncEnabled } from "@/store/slices/watchlistSlice";
import {
  hydrateAuth,
  syncAuthSession,
} from "@/store/thunks/authThunks";
import { loadPreferences } from "@/store/thunks/preferencesThunks";
import { resetPreferences } from "@/store/slices/preferencesSlice";

export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  matcher: isAnyOf(hydrateAuth.fulfilled, syncAuthSession.fulfilled),
  effect: (action, listenerApi) => {
    if (!hydrateAuth.fulfilled.match(action) && !syncAuthSession.fulfilled.match(action)) {
      return;
    }

    if (action.payload.user) {
      listenerApi.dispatch(loadPreferences());
      return;
    }

    listenerApi.dispatch(resetPreferences());
  },
});

authListenerMiddleware.startListening({
  matcher: loadPreferences.fulfilled.match,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      setWatchlistSyncEnabled(action.payload.watchlistSyncEnabled)
    );
    saveWatchlistSyncPreference(action.payload.watchlistSyncEnabled);
  },
});

authListenerMiddleware.startListening({
  matcher: loadPreferences.rejected.match,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      setWatchlistSyncEnabled(loadWatchlistSyncPreference())
    );
  },
});

authListenerMiddleware.startListening({
  matcher: clearAuth.match,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(resetPreferences());
  },
});