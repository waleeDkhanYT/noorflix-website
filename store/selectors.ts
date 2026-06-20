import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import {
  selectAuthProfile,
  selectAuthSession,
  selectAuthUser,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import {
  selectWatchlistCount,
  selectWatchlistItems,
  selectUseCloudWatchlist,
} from "@/store/slices/watchlistSlice";
import {
  selectFavoriteGenres,
  selectThemePreference,
} from "@/store/slices/preferencesSlice";
import {
  getUserAvatarUrl,
  getUserDisplayName,
} from "@/lib/auth";

export const selectCurrentUser = createSelector(
  [selectAuthUser, selectAuthProfile, selectAuthSession],
  (user, profile, session) => ({
    user,
    profile,
    session,
    isAuthenticated: user !== null,
  })
);

export const selectUserDisplayName = createSelector(
  [selectAuthUser, selectAuthProfile],
  (user, profile) => getUserDisplayName(user, profile)
);

export const selectUserAvatarUrl = createSelector(
  [selectAuthProfile],
  (profile) => getUserAvatarUrl(profile)
);

export const selectWatchlistSummary = createSelector(
  [selectWatchlistItems, selectWatchlistCount, selectUseCloudWatchlist],
  (items, count, useCloud) => ({
    items,
    count,
    useCloud,
  })
);

export const selectUserPreferencesSummary = createSelector(
  [selectFavoriteGenres, selectThemePreference, selectIsAuthenticated],
  (favoriteGenres, themePreference, isAuthenticated) => ({
    favoriteGenres,
    themePreference,
    isAuthenticated,
  })
);