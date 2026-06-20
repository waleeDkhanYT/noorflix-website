"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  mergeWatchlistItems,
  watchlistItemToRow,
  watchlistRowToItem,
} from "@/lib/watchlist-db";
import { parseInput } from "@/lib/validation/parse";
import {
  syncWatchlistInputSchema,
  watchlistItemPayloadSchema,
  watchlistMutationSchema,
} from "@/lib/validation/user";
import { actionError, actionSuccess, type ActionResult } from "@/types/actions";
import type { WatchlistItem } from "@/types/watchlist";

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function getWatchlistAction(): Promise<
  ActionResult<WatchlistItem[]>
> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return actionError("Not authenticated");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlists")
    .select("*")
    .eq("user_id", userId)
    .order("added_at", { ascending: false });

  if (error) {
    return actionError(error.message);
  }

  return actionSuccess((data ?? []).map(watchlistRowToItem));
}

export async function addWatchlistItemAction(
  item: unknown
): Promise<ActionResult<WatchlistItem>> {
  const parsed = parseInput(watchlistItemPayloadSchema, item);
  if (!parsed.success) {
    return parsed;
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return actionError("Not authenticated");
  }

  const payload = parsed.data;
  const watchlistItem: WatchlistItem = {
    id: payload.id,
    mediaType: payload.mediaType,
    detailType: payload.mediaType === "movie" ? "movie" : "tv",
    title: payload.title,
    posterUrl: payload.posterUrl,
    addedAt: payload.addedAt ?? Date.now(),
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlists")
    .upsert(watchlistItemToRow(watchlistItem, userId), {
      onConflict: "user_id,content_id,media_type",
    })
    .select("*")
    .single();

  if (error || !data) {
    return actionError(error?.message ?? "Failed to save item");
  }

  revalidatePath("/watchlist");
  return actionSuccess(watchlistRowToItem(data));
}

export async function removeWatchlistItemAction(
  contentId: unknown,
  mediaType: unknown
): Promise<ActionResult> {
  const parsed = parseInput(watchlistMutationSchema, {
    contentId,
    mediaType,
  });
  if (!parsed.success) {
    return parsed;
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return actionError("Not authenticated");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("watchlists")
    .delete()
    .eq("user_id", userId)
    .eq("content_id", String(parsed.data.contentId))
    .eq("media_type", parsed.data.mediaType);

  if (error) {
    return actionError(error.message);
  }

  revalidatePath("/watchlist");
  return actionSuccess(undefined);
}

export async function clearWatchlistAction(): Promise<ActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return actionError("Not authenticated");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("watchlists")
    .delete()
    .eq("user_id", userId);

  if (error) {
    return actionError(error.message);
  }

  revalidatePath("/watchlist");
  return actionSuccess(undefined);
}

export async function syncWatchlistAction(
  localItems: unknown
): Promise<
  ActionResult<{ items: WatchlistItem[]; mergedCount: number; newCount: number }>
> {
  const parsed = parseInput(syncWatchlistInputSchema, localItems);
  if (!parsed.success) {
    return parsed;
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return actionError("Not authenticated");
  }

  const supabase = await createClient();

  const { data: remoteRows, error: fetchError } = await supabase
    .from("watchlists")
    .select("*")
    .eq("user_id", userId);

  if (fetchError) {
    return actionError(fetchError.message);
  }

  const remoteItems = (remoteRows ?? []).map(watchlistRowToItem);
  const localWatchlistItems: WatchlistItem[] = parsed.data.map((item) => ({
    id: item.id,
    mediaType: item.mediaType,
    detailType: item.mediaType === "movie" ? "movie" : "tv",
    title: item.title,
    posterUrl: item.posterUrl,
    addedAt: item.addedAt ?? Date.now(),
  }));

  const merged = mergeWatchlistItems(localWatchlistItems, remoteItems);
  const remoteKeys = new Set(
    remoteItems.map((item) => `${item.mediaType}-${item.id}`)
  );
  const newCount = merged.filter(
    (item) => !remoteKeys.has(`${item.mediaType}-${item.id}`)
  ).length;

  if (merged.length > 0) {
    const { error: upsertError } = await supabase.from("watchlists").upsert(
      merged.map((item) => watchlistItemToRow(item, userId)),
      { onConflict: "user_id,content_id,media_type" }
    );

    if (upsertError) {
      return actionError(upsertError.message);
    }
  }

  const { data: finalRows, error: finalError } = await supabase
    .from("watchlists")
    .select("*")
    .eq("user_id", userId)
    .order("added_at", { ascending: false });

  if (finalError) {
    return actionError(finalError.message);
  }

  revalidatePath("/watchlist");

  return actionSuccess({
    items: (finalRows ?? []).map(watchlistRowToItem),
    mergedCount: merged.length,
    newCount,
  });
}