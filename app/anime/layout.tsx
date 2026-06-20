import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Anime",
  description: "Explore anime series discovered via TMDB on NoorFlix.",
  path: "/anime",
});

export default function AnimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}