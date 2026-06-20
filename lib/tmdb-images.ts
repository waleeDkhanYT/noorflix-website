const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getPosterUrl(
  path: string | null | undefined,
  size: "w185" | "w342" | "w500" | "original" = "w342"
) {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null | undefined,
  size: "w780" | "w1280" | "original" = "original"
) {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}