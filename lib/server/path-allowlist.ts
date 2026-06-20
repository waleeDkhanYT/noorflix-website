const TMDB_PATH_PATTERNS: RegExp[] = [
  /^trending\/(all|movie|tv)\/(day|week)$/,
  /^movie\/popular$/,
  /^tv\/popular$/,
  /^search\/(multi|movie|tv)$/,
  /^genre\/(movie|tv)\/list$/,
  /^discover\/(movie|tv)$/,
  /^(movie|tv)\/\d+$/,
  /^(movie|tv)\/\d+\/external_ids$/,
];

const WATCHMODE_PATH_PATTERNS: RegExp[] = [
  /^autocomplete-search\/?$/,
  /^title\/\d+\/details\/?$/,
  /^title\/\d+\/sources\/?$/,
  /^title\/(movie|tv)\/\d+\/sources\/?$/,
];

function normalizePath(pathSegments: string[]): string {
  return pathSegments
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join("/");
}

export function isAllowedTmdbPath(pathSegments: string[]): boolean {
  if (pathSegments.length === 0) return false;

  const path = normalizePath(pathSegments);
  if (path.includes("..")) return false;

  return TMDB_PATH_PATTERNS.some((pattern) => pattern.test(path));
}

export function isAllowedWatchmodePath(pathSegments: string[]): boolean {
  if (pathSegments.length === 0) return false;

  const path = normalizePath(pathSegments);
  if (path.includes("..")) return false;

  return WATCHMODE_PATH_PATTERNS.some((pattern) => pattern.test(path));
}

export function buildUpstreamPath(pathSegments: string[]): string {
  return normalizePath(pathSegments);
}