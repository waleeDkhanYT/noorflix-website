import type { WatchlistItem } from "@/types/watchlist";

export const WATCHLIST_STORAGE_KEY = "noorflix-watchlist";
export const WATCHLIST_SYNC_PREF_KEY = "noorflix-watchlist-sync";

export function loadWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as WatchlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWatchlist(items: WatchlistItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
}

export function loadWatchlistSyncPreference(): boolean {
  if (typeof window === "undefined") return true;

  try {
    const raw = localStorage.getItem(WATCHLIST_SYNC_PREF_KEY);
    if (raw === null) return true;
    return raw === "true";
  } catch {
    return true;
  }
}

export function saveWatchlistSyncPreference(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WATCHLIST_SYNC_PREF_KEY, String(enabled));
}