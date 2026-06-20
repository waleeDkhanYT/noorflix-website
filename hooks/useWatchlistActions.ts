"use client";

import { toast } from "sonner";
import { createWatchlistItem } from "@/lib/watchlist";
import {
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist,
  selectUseCloudWatchlist,
} from "@/store/slices/watchlistSlice";
import {
  addWatchlistItemRemote,
  clearWatchlistRemote,
  reloadCloudWatchlist,
  removeWatchlistItemRemote,
} from "@/store/thunks/watchlistThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { ContentCardData } from "@/types/content";
import type { ContentMediaType } from "@/types/content";
import type { WatchlistItem } from "@/types/watchlist";

export function useWatchlistActions() {
  const dispatch = useAppDispatch();
  const useCloud = useAppSelector(selectUseCloudWatchlist);

  const addItem = async (item: WatchlistItem) => {
    dispatch(addToWatchlist(item));

    const result = await dispatch(addWatchlistItemRemote(item));

    if (addWatchlistItemRemote.rejected.match(result)) {
      dispatch(
        removeFromWatchlist({ id: item.id, mediaType: item.mediaType })
      );
      toast.error(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to add to watchlist."
      );
      return false;
    }

    return true;
  };

  const removeItem = async (id: number, mediaType: ContentMediaType) => {
    dispatch(removeFromWatchlist({ id, mediaType }));

    const result = await dispatch(
      removeWatchlistItemRemote({ id, mediaType })
    );

    if (removeWatchlistItemRemote.rejected.match(result)) {
      if (useCloud) {
        await dispatch(reloadCloudWatchlist());
      }
      toast.error(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to remove from watchlist."
      );
      return false;
    }

    return true;
  };

  const clearAll = async () => {
    dispatch(clearWatchlist());

    const result = await dispatch(clearWatchlistRemote());

    if (clearWatchlistRemote.rejected.match(result)) {
      if (useCloud) {
        await dispatch(reloadCloudWatchlist());
      }
      toast.error(
        typeof result.payload === "string"
          ? result.payload
          : "Failed to clear watchlist."
      );
      return false;
    }

    return true;
  };

  const toggleFromCard = async (data: ContentCardData, isSaved: boolean) => {
    const watchlistItem = createWatchlistItem(data);
    if (!watchlistItem) return false;

    if (isSaved) {
      const ok = await removeItem(watchlistItem.id, watchlistItem.mediaType);
      if (ok) toast.success("Removed from watchlist");
      return ok;
    }

    const ok = await addItem(watchlistItem);
    if (ok) toast.success("Added to watchlist");
    return ok;
  };

  return { addItem, removeItem, clearAll, toggleFromCard, useCloud };
}