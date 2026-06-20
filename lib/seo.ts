import type { Metadata } from "next";

const SITE_NAME = "NoorFlix";
const DEFAULT_DESCRIPTION =
  "Discover movies, TV shows, and anime with ratings, streaming info, and a premium browsing experience.";

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  imagePath,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  imagePath?: string | null;
  noIndex?: boolean;
}): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path}`;
  const ogImage = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${siteUrl}${imagePath}`
    : null;

  const socialImages = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      ...(socialImages && { images: socialImages }),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export const rootMetadata: Metadata = {
  ...buildMetadata({
    title: "Discover Movies, TV & Anime",
    description: DEFAULT_DESCRIPTION,
    path: "/",
  }),
  title: {
    default: `${SITE_NAME} — Discover Movies, TV & Anime`,
    template: `%s | ${SITE_NAME}`,
  },
};