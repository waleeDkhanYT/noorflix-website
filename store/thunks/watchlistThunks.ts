import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addWatchlistItemAction,
  clearWatchlistAction,
  getWatchlistAction,
  removeWatchlistItemAction,
  syncWatchlistAction,
} from "@/app/actions/watchlist";
import type { WatchlistItemPayload } from "@/lib/watchlist-db";
import {
  loadWatchlist,
  loadWatchlistSyncPreference,
  saveWatchlist,
  saveWatchlistSyncPreference,
} from "@/lib/watchlist-storage";
import type { RootState } from "@/store/index";
import type { ContentMediaType } from "@/types/content";
import type { WatchlistItem } from "@/types/watchlist";

export type WatchlistInitEvent = "INITIAL_SESSION" | "SIGNED_IN" | "SIGNED_OUT";

type InitializeWatchlistArgs = {
  event: WatchlistInitEvent;
  userId: string | null;
  syncEnabled: boolean;
};

type InitializeWatchlistResult = {
  items: WatchlistItem[];
  storageMode: "local" | "cloud";
  syncEnabled: boolean;
  lastSyncedAt: number | null;
  showSyncToast: boolean;
  syncedCount: number;
  syncFailed: boolean;
};

function toPayload(item: WatchlistItem): WatchlistItemPayload {
  return {
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    posterUrl: item.posterUrl,
    addedAt: item.addedAt,
  };
}

export const initializeWatchlist = createAsyncThunk<
  InitializeWatchlistResult,
  InitializeWatchlistArgs,
  { rejectValue: string }
>(
  "watchlist/initialize",
  async ({ event, userId, syncEnabled }, { rejectWithValue }) => {
    if (event === "SIGNED_OUT" || !userId) {
      const localItems = loadWatchlist();
      saveWatchlist(localItems);

      return {
        items: localItems,
        storageMode: "local",
        syncEnabled: loadWatchlistSyncPreference(),
        lastSyncedAt: null,
        showSyncToast: false,
        syncedCount: 0,
        syncFailed: false,
      };
    }

    const resolvedSyncEnabled = syncEnabled;
    saveWatchlistSyncPreference(resolvedSyncEnabled);

    if (!resolvedSyncEnabled) {
      const localItems = loadWatchlist();
      return {
        items: localItems,
        storageMode: "local",
        syncEnabled: false,
        lastSyncedAt: null,
        showSyncToast: false,
        syncedCount: 0,
        syncFailed: false,
      };
    }

    if (event === "SIGNED_IN") {
      const localItems = loadWatchlist();
      const syncResult = await syncWatchlistAction(localItems.map(toPayload));

      if (!syncResult.success) {
        return {
          items: localItems,
          storageMode: "local",
          syncEnabled: true,
          lastSyncedAt: null,
          showSyncToast: true,
          syncedCount: 0,
          syncFailed: true,
        };
      }

      saveWatchlist(syncResult.data.items);

      return {
        items: syncResult.data.items,
        storageMode: "cloud",
        syncEnabled: true,
        lastSyncedAt: Date.now(),
        showSyncToast: true,
        syncedCount: syncResult.data.mergedCount,
        syncFailed: false,
      };
    }

    const cloudResult = await getWatchlistAction();

    if (!cloudResult.success) {
      const localItems = loadWatchlist();
      return rejectWithValue(cloudResult.error);
    }

    saveWatchlist(cloudResult.data);

    return {
      items: cloudResult.data,
      storageMode: "cloud",
      syncEnabled: true,
      lastSyncedAt: null,
      showSyncToast: false,
      syncedCount: 0,
      syncFailed: false,
    };
  }
);

export const addWatchlistItemRemote = createAsyncThunk<
  WatchlistItem,
  WatchlistItem,
  { rejectValue: string; state: RootState }
>("watchlist/addRemote", async (item, { rejectWithValue, getState }) => {
  const state = getState();
  const useCloud =
    state.watchlist.storageMode === "cloud" && state.watchlist.syncEnabled;

  if (!useCloud) {
    return item;
  }

  const result = await addWatchlistItemAction({
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    posterUrl: item.posterUrl,
    addedAt: item.addedAt,
  });

  if (!result.success || !result.data) {
    return rejectWithValue(result.success ? "Failed to save item." : result.error);
  }

  return result.data;
});

export const removeWatchlistItemRemote = createAsyncThunk<
  { id: number; mediaType: ContentMediaType },
  { id: number; mediaType: ContentMediaType },
  { rejectValue: string; state: RootState }
>(
  "watchlist/removeRemote",
  async ({ id, mediaType }, { rejectWithValue, getState }) => {
    const state = getState();
    const useCloud =
      state.watchlist.storageMode === "cloud" && state.watchlist.syncEnabled;

    if (!useCloud) {
      return { id, mediaType };
    }

    const result = await removeWatchlistItemAction(id, mediaType);

    if (!result.success) {
      return rejectWithValue(result.error);
    }

    return { id, mediaType };
  }
);

export const clearWatchlistRemote = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: RootState }
>("watchlist/clearRemote", async (_, { rejectWithValue, getState }) => {
  const state = getState();
  const useCloud =
    state.watchlist.storageMode === "cloud" && state.watchlist.syncEnabled;

  if (!useCloud) {
    return;
  }

  const result = await clearWatchlistAction();

  if (!result.success) {
    return rejectWithValue(result.error);
  }
});

export const reloadCloudWatchlist = createAsyncThunk<
  WatchlistItem[],
  void,
  { rejectValue: string }
>("watchlist/reloadCloud", async (_, { rejectWithValue }) => {
  const result = await getWatchlistAction();

  if (!result.success) {
    return rejectWithValue(result.error);
  }

  saveWatchlist(result.data);
  return result.data;
});