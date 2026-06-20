import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Watchlist",
  description: "Your saved movies and shows on NoorFlix.",
  path: "/watchlist",
});

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}