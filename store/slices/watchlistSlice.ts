import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import { getWatchlistItemKey } from "@/lib/watchlist-db";
import { loadWatchlist } from "@/lib/watchlist-storage";
import { clearAuth } from "@/store/slices/authSlice";
import {
  addWatchlistItemRemote,
  clearWatchlistRemote,
  initializeWatchlist,
  reloadCloudWatchlist,
  removeWatchlistItemRemote,
} from "@/store/thunks/watchlistThunks";
import type { ContentMediaType } from "@/types/content";
import type { WatchlistItem } from "@/types/watchlist";

export type WatchlistStorageMode = "local" | "cloud";

type WatchlistState = {
  items: WatchlistItem[];
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  storageMode: WatchlistStorageMode;
  syncEnabled: boolean;
  syncing: boolean;
  lastSyncedAt: number | null;
};

const initialState: WatchlistState = {
  items: [],
  hydrated: false,
  loading: false,
  error: null,
  storageMode: "local",
  syncEnabled: true,
  syncing: false,
  lastSyncedAt: null,
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    setWatchlistStorageMode(
      state,
      action: PayloadAction<WatchlistStorageMode>
    ) {
      state.storageMode = action.payload;
    },
    setWatchlistSyncEnabled(state, action: PayloadAction<boolean>) {
      state.syncEnabled = action.payload;
    },
    setWatchlistLastSyncedAt(state, action: PayloadAction<number | null>) {
      state.lastSyncedAt = action.payload;
    },
    addToWatchlist(state, action: PayloadAction<WatchlistItem>) {
      const key = getWatchlistItemKey(
        action.payload.id,
        action.payload.mediaType
      );
      const index = state.items.findIndex(
        (item) => getWatchlistItemKey(item.id, item.mediaType) === key
      );

      if (index >= 0) {
        state.items[index] = action.payload;
      } else {
        state.items.unshift(action.payload);
      }
    },
    removeFromWatchlist(
      state,
      action: PayloadAction<{ id: number; mediaType: ContentMediaType }>
    ) {
      const key = getWatchlistItemKey(
        action.payload.id,
        action.payload.mediaType
      );
      state.items = state.items.filter(
        (item) => getWatchlistItemKey(item.id, item.mediaType) !== key
      );
    },
    clearWatchlist(state) {
      state.items = [];
    },
    replaceWatchlist(state, action: PayloadAction<WatchlistItem[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
    clearWatchlistError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeWatchlist.pending, (state) => {
        state.syncing = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeWatchlist.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.storageMode = action.payload.storageMode;
        state.syncEnabled = action.payload.syncEnabled;
        state.lastSyncedAt = action.payload.lastSyncedAt;
        state.hydrated = true;
        state.syncing = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(initializeWatchlist.rejected, (state, action) => {
        state.items = loadWatchlist();
        state.hydrated = true;
        state.syncing = false;
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to initialize watchlist.";
      })
      .addCase(addWatchlistItemRemote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWatchlistItemRemote.fulfilled, (state, action) => {
        const key = getWatchlistItemKey(action.payload.id, action.payload.mediaType);
        const index = state.items.findIndex(
          (item) => getWatchlistItemKey(item.id, item.mediaType) === key
        );

        if (index >= 0) {
          state.items[index] = action.payload;
        }

        state.loading = false;
      })
      .addCase(addWatchlistItemRemote.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to add watchlist item.";
      })
      .addCase(removeWatchlistItemRemote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeWatchlistItemRemote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeWatchlistItemRemote.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to remove watchlist item.";
      })
      .addCase(clearWatchlistRemote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWatchlistRemote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(clearWatchlistRemote.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to clear watchlist.";
      })
      .addCase(reloadCloudWatchlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.hydrated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(reloadCloudWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to reload watchlist.";
      })
      .addCase(clearAuth, (state) => {
        Object.assign(state, {
          ...initialState,
          hydrated: false,
        });
      });
  },
});

export const {
  setWatchlistStorageMode,
  setWatchlistSyncEnabled,
  setWatchlistLastSyncedAt,
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist,
  replaceWatchlist,
  clearWatchlistError,
} = watchlistSlice.actions;

export const selectWatchlistItems = (state: RootState) => state.watchlist.items;
export const selectWatchlistCount = (state: RootState) =>
  state.watchlist.items.length;
export const selectWatchlistHydrated = (state: RootState) =>
  state.watchlist.hydrated;
export const selectWatchlistLoading = (state: RootState) =>
  !state.watchlist.hydrated || state.watchlist.loading || state.watchlist.syncing;
export const selectWatchlistError = (state: RootState) => state.watchlist.error;
export const selectWatchlistStorageMode = (state: RootState) =>
  state.watchlist.storageMode;
export const selectWatchlistSyncEnabled = (state: RootState) =>
  state.watchlist.syncEnabled;
export const selectWatchlistSyncing = (state: RootState) =>
  state.watchlist.syncing;
export const selectWatchlistLastSyncedAt = (state: RootState) =>
  state.watchlist.lastSyncedAt;
export const selectUseCloudWatchlist = (state: RootState) =>
  state.watchlist.storageMode === "cloud" && state.watchlist.syncEnabled;

export const selectIsInWatchlist = (
  state: RootState,
  id: number,
  mediaType: ContentMediaType
) =>
  state.watchlist.items.some(
    (item) =>
      getWatchlistItemKey(item.id, item.mediaType) ===
      getWatchlistItemKey(id, mediaType)
  );

export default watchlistSlice.reducer;