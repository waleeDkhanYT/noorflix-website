import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const routes = [
    "",
    "/movies",
    "/tv",
    "/anime",
    "/trending",
    "/search",
    "/watchlist",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/trending" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}