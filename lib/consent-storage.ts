export const DATA_STORAGE_CONSENT_KEY = "noorflix-data-storage-consent";

export function hasDataStorageConsent(): boolean {
  if (typeof window === "undefined") return true;

  try {
    return localStorage.getItem(DATA_STORAGE_CONSENT_KEY) === "accepted";
  } catch {
    return true;
  }
}

export function acceptDataStorageConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DATA_STORAGE_CONSENT_KEY, "accepted");
}