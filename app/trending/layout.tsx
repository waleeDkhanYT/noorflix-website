import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Trending",
  description: "See what's trending this week in movies and TV on NoorFlix.",
  path: "/trending",
});

export default function TrendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}