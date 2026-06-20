"use server";

import { createClient } from "@/lib/supabase/server";
import { parseInput } from "@/lib/validation/parse";
import {
  updatePreferencesInputSchema,
  watchlistSyncPreferenceSchema,
} from "@/lib/validation/user";
import type { ThemePreference, UserPreferencesUpdate } from "@/types/database";
import { actionError, actionSuccess, type ActionResult } from "@/types/actions";

export type UserPreferencesData = {
  favoriteGenres: number[];
  preferredLanguage: string;
  themePreference: ThemePreference;
  watchlistSyncEnabled: boolean;
};

export async function getPreferencesAction(): Promise<
  ActionResult<UserPreferencesData>
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionError("Not authenticated");
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .select(
      "favorite_genres, preferred_language, theme_preference, watchlist_sync_enabled"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return actionError(error.message);
  }

  const favoriteGenres = Array.isArray(data?.favorite_genres)
    ? (data.favorite_genres as number[])
    : [];

  return actionSuccess({
    favoriteGenres,
    preferredLanguage: data?.preferred_language ?? "en",
    themePreference: (data?.theme_preference ?? "system") as ThemePreference,
    watchlistSyncEnabled: data?.watchlist_sync_enabled ?? true,
  });
}

export async function getWatchlistSyncPreferenceAction(): Promise<
  ActionResult<boolean>
> {
  const result = await getPreferencesAction();
  if (!result.success) {
    return result;
  }

  return actionSuccess(result.data.watchlistSyncEnabled);
}

export async function updateWatchlistSyncPreferenceAction(
  enabled: unknown
): Promise<ActionResult<boolean>> {
  const parsed = parseInput(watchlistSyncPreferenceSchema, enabled);
  if (!parsed.success) {
    return parsed;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionError("Not authenticated");
  }

  const { error } = await supabase
    .from("user_preferences")
    .update({ watchlist_sync_enabled: parsed.data })
    .eq("user_id", user.id);

  if (error) {
    return actionError(error.message);
  }

  return actionSuccess(parsed.data);
}

export async function updatePreferencesAction(
  input: unknown
): Promise<ActionResult<UserPreferencesData>> {
  const parsed = parseInput(updatePreferencesInputSchema, input);
  if (!parsed.success) {
    return parsed;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionError("Not authenticated");
  }

  const updates: UserPreferencesUpdate = {};

  if (parsed.data.favoriteGenres !== undefined) {
    updates.favorite_genres = parsed.data.favoriteGenres;
  }
  if (parsed.data.preferredLanguage !== undefined) {
    updates.preferred_language = parsed.data.preferredLanguage;
  }
  if (parsed.data.themePreference !== undefined) {
    updates.theme_preference = parsed.data.themePreference;
  }
  if (parsed.data.watchlistSyncEnabled !== undefined) {
    updates.watchlist_sync_enabled = parsed.data.watchlistSyncEnabled;
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .update(updates)
    .eq("user_id", user.id)
    .select(
      "favorite_genres, preferred_language, theme_preference, watchlist_sync_enabled"
    )
    .single();

  if (error || !data) {
    return actionError(error?.message ?? "Failed to update preferences.");
  }

  const favoriteGenres = Array.isArray(data.favorite_genres)
    ? (data.favorite_genres as number[])
    : [];

  return actionSuccess({
    favoriteGenres,
    preferredLanguage: data.preferred_language,
    themePreference: data.theme_preference as ThemePreference,
    watchlistSyncEnabled: data.watchlist_sync_enabled,
  });
}