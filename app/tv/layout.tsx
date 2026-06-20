import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "TV Shows",
  description: "Discover TV series and web shows with filters and ratings on NoorFlix.",
  path: "/tv",
});

export default function TVLayout({ children }: { children: React.ReactNode }) {
  return children;
}