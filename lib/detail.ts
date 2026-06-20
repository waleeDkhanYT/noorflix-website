import type { ContentMediaType } from "@/types/content";
import type { DetailMediaType } from "@/types/tmdb-detail";
import type { TMDBMedia } from "@/types";
import type { TMDBVideo } from "@/types/tmdb-detail";
import { resolveMediaType } from "@/lib/content";

export type DetailRouteType = "movie" | "tv" | "anime";

export function routeTypeToApiType(routeType: DetailRouteType): DetailMediaType {
  return routeType === "movie" ? "movie" : "tv";
}

export function toDetailMediaType(
  type: ContentMediaType | DetailMediaType | DetailRouteType | string
): DetailMediaType {
  if (type === "movie") return "movie";
  return "tv";
}

export function getDetailHrefFromId(
  id: number,
  routeType: DetailRouteType
): string {
  return `/${routeType}/${id}`;
}

export function getDetailHref(
  item: TMDBMedia,
  mediaType?: ContentMediaType
): string {
  const resolved = resolveMediaType(item, mediaType);
  return getDetailHrefFromId(item.id, resolved);
}

export function getImdbId(
  imdbId?: string | null,
  externalIds?: { imdb_id?: string | null }
): string | null {
  const id = imdbId ?? externalIds?.imdb_id;
  return id && id !== "N/A" ? id : null;
}

export function pickTrailer(videos: TMDBVideo[]): TMDBVideo | null {
  const youtube = videos.filter((video) => video.site === "YouTube");
  return (
    youtube.find((video) => video.type === "Trailer" && video.official) ??
    youtube.find((video) => video.type === "Trailer") ??
    youtube.find((video) => video.type === "Teaser") ??
    youtube[0] ??
    null
  );
}

export const WATCH_REGIONS = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "IN", label: "India" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
] as const;

export type WatchRegionCode = (typeof WATCH_REGIONS)[number]["code"];

export function getPlatformStyle(name: string): string {
  const normalized = name.toLowerCase();

  if (normalized.includes("netflix")) {
    return "from-[#E50914] to-[#B20710] text-white";
  }
  if (normalized.includes("prime") || normalized.includes("amazon")) {
    return "from-[#00A8E1] to-[#146EB4] text-white";
  }
  if (normalized.includes("disney")) {
    return "from-[#113CCF] to-[#0d2d9a] text-white";
  }
  if (normalized.includes("hotstar") || normalized.includes("jio")) {
    return "from-[#0F5298] to-[#0c3d72] text-white";
  }
  if (normalized.includes("hulu")) {
    return "from-[#1CE783] to-[#0fa866] text-black";
  }
  if (normalized.includes("hbo") || normalized.includes("max")) {
    return "from-[#5822B4] to-[#3d1780] text-white";
  }
  if (normalized.includes("apple")) {
    return "from-[#1a1a1a] to-[#333] text-white";
  }

  return "from-primary/90 to-primary text-primary-foreground";
}