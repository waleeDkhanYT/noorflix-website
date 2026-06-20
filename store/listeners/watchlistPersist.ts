import {
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import {
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist,
  replaceWatchlist,
} from "@/store/slices/watchlistSlice";
import { saveWatchlist } from "@/lib/watchlist-storage";
import type { RootState } from "@/store/index";

export const watchlistListenerMiddleware = createListenerMiddleware();

watchlistListenerMiddleware.startListening({
  matcher: isAnyOf(
    addToWatchlist,
    removeFromWatchlist,
    clearWatchlist,
    replaceWatchlist
  ),
  effect: (_action, listenerApi) => {
    const state = (listenerApi.getState() as RootState).watchlist;
    const shouldMirrorLocal =
      state.storageMode === "local" ||
      !state.syncEnabled ||
      state.storageMode === "cloud";

    if (shouldMirrorLocal) {
      saveWatchlist(state.items);
    }
  },
});