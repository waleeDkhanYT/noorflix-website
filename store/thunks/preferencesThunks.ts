import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPreferencesAction,
  updateWatchlistSyncPreferenceAction,
  type UserPreferencesData,
} from "@/app/actions/preferences";
import {
  syncWatchlistAction,
} from "@/app/actions/watchlist";
import type { WatchlistItemPayload } from "@/lib/watchlist-db";
import { saveWatchlistSyncPreference } from "@/lib/watchlist-storage";
import type { RootState } from "@/store/index";
import { replaceWatchlist, setWatchlistLastSyncedAt } from "@/store/slices/watchlistSlice";
import { saveWatchlist } from "@/lib/watchlist-storage";

export const loadPreferences = createAsyncThunk<
  UserPreferencesData,
  void,
  { rejectValue: string }
>("preferences/load", async (_, { rejectWithValue }) => {
  const result = await getPreferencesAction();

  if (!result.success) {
    return rejectWithValue(result.error);
  }

  return result.data;
});

export const toggleWatchlistSyncPreference = createAsyncThunk<
  { enabled: boolean; syncedCount?: number },
  boolean,
  { rejectValue: string; state: RootState }
>(
  "preferences/toggleWatchlistSync",
  async (enabled, { rejectWithValue, dispatch, getState }) => {
    const result = await updateWatchlistSyncPreferenceAction(enabled);

    if (!result.success) {
      return rejectWithValue(result.error);
    }

    saveWatchlistSyncPreference(enabled);

    if (!enabled) {
      return { enabled: false };
    }

    const items = getState().watchlist.items;
    const payload: WatchlistItemPayload[] = items.map((item) => ({
      id: item.id,
      mediaType: item.mediaType,
      title: item.title,
      posterUrl: item.posterUrl,
      addedAt: item.addedAt,
    }));

    const syncResult = await syncWatchlistAction(payload);

    if (!syncResult.success) {
      await updateWatchlistSyncPreferenceAction(false);
      saveWatchlistSyncPreference(false);
      return rejectWithValue(syncResult.error);
    }

    dispatch(replaceWatchlist(syncResult.data.items));
    saveWatchlist(syncResult.data.items);
    dispatch(setWatchlistLastSyncedAt(Date.now()));

    return {
      enabled: true,
      syncedCount: syncResult.data.mergedCount,
    };
  }
);