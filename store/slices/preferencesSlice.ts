import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import type { ThemePreference } from "@/types/database";
import {
  loadPreferences,
  toggleWatchlistSyncPreference,
} from "@/store/thunks/preferencesThunks";
import { clearAuth } from "@/store/slices/authSlice";

export type PreferencesState = {
  favoriteGenres: number[];
  preferredLanguage: string;
  themePreference: ThemePreference;
  watchlistSyncEnabled: boolean;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: PreferencesState = {
  favoriteGenres: [],
  preferredLanguage: "en",
  themePreference: "system",
  watchlistSyncEnabled: true,
  hydrated: false,
  loading: false,
  error: null,
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    resetPreferences(state) {
      Object.assign(state, initialState);
    },
    setWatchlistSyncEnabledLocal(state, action: PayloadAction<boolean>) {
      state.watchlistSyncEnabled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPreferences.fulfilled, (state, action) => {
        state.favoriteGenres = action.payload.favoriteGenres;
        state.preferredLanguage = action.payload.preferredLanguage;
        state.themePreference = action.payload.themePreference;
        state.watchlistSyncEnabled = action.payload.watchlistSyncEnabled;
        state.hydrated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadPreferences.rejected, (state, action) => {
        state.loading = false;
        state.hydrated = true;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to load preferences.";
      })
      .addCase(toggleWatchlistSyncPreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWatchlistSyncPreference.fulfilled, (state, action) => {
        state.watchlistSyncEnabled = action.payload.enabled;
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleWatchlistSyncPreference.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to update sync preference.";
      })
      .addCase(clearAuth, (state) => {
        Object.assign(state, initialState);
      });
  },
});

export const { resetPreferences, setWatchlistSyncEnabledLocal } =
  preferencesSlice.actions;

export const selectPreferences = (state: RootState) => state.preferences;
export const selectPreferencesHydrated = (state: RootState) =>
  state.preferences.hydrated;
export const selectPreferencesLoading = (state: RootState) =>
  state.preferences.loading;
export const selectPreferencesError = (state: RootState) =>
  state.preferences.error;
export const selectFavoriteGenres = (state: RootState) =>
  state.preferences.favoriteGenres;
export const selectPreferredLanguage = (state: RootState) =>
  state.preferences.preferredLanguage;
export const selectThemePreference = (state: RootState) =>
  state.preferences.themePreference;
export const selectCloudWatchlistSyncEnabled = (state: RootState) =>
  state.preferences.watchlistSyncEnabled;

export default preferencesSlice.reducer;