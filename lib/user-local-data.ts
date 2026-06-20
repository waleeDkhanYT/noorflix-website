import {
  DATA_STORAGE_CONSENT_KEY,
} from "@/lib/consent-storage";
import {
  WATCHLIST_STORAGE_KEY,
  WATCHLIST_SYNC_PREF_KEY,
} from "@/lib/watchlist-storage";

/** Clears user-specific browser data on sign-out or account deletion. */
export function clearUserLocalData(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(WATCHLIST_STORAGE_KEY);
    localStorage.removeItem(WATCHLIST_SYNC_PREF_KEY);
    localStorage.removeItem(DATA_STORAGE_CONSENT_KEY);
  } catch {
    // Ignore storage errors (private browsing, etc.)
  }
}