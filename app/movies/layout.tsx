import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Movies",
  description: "Browse and filter popular movies from TMDB on NoorFlix.",
  path: "/movies",
});

export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}