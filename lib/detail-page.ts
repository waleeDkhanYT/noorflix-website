import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getBackdropUrl } from "@/lib/tmdb-images";
import { fetchTmdbServer } from "@/lib/tmdb-server";
import {
  type DetailRouteType,
  getDetailHrefFromId,
  routeTypeToApiType,
} from "@/lib/detail";

export function parseDetailId(id: string): number | null {
  const numericId = Number.parseInt(id, 10);
  return Number.isNaN(numericId) ? null : numericId;
}

export async function generateDetailPageMetadata(
  routeType: DetailRouteType,
  id: string
): Promise<Metadata> {
  const path = `/${routeType}/${id}`;
  const numericId = parseDetailId(id);

  if (numericId === null) {
    return buildMetadata({
      title: "Title Not Found",
      path,
      noIndex: true,
    });
  }

  const apiType = routeTypeToApiType(routeType);
  const data = await fetchTmdbServer<{
    title?: string;
    name?: string;
    overview?: string;
    backdrop_path?: string | null;
  }>(`${apiType}/${numericId}`);

  if (!data) {
    return buildMetadata({
      title: "Details",
      path: getDetailHrefFromId(numericId, routeType),
    });
  }

  const title = data.title ?? data.name ?? "Details";
  const description =
    data.overview?.slice(0, 160) ||
    `View details, ratings, cast, and where to watch ${title} on NoorFlix.`;
  const ogImage = getBackdropUrl(data.backdrop_path, "w1280");

  return buildMetadata({
    title,
    description,
    path: getDetailHrefFromId(numericId, routeType),
    imagePath: ogImage,
  });
}