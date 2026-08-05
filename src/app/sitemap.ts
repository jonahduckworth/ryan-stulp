import type { MetadataRoute } from "next";
import {
  getPublishedListings,
  getPublishedMarketUpdates,
} from "@/lib/data/public";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/listings",
    "/market-updates",
    "/buying-calgary",
    "/selling-calgary",
    "/home-evaluation",
    "/commercial-real-estate-calgary",
    "/real-estate-investing-calgary",
    "/rural-real-estate-calgary",
    "/calgary-areas",
    "/about",
    "/contact",
    "/privacy",
  ];
  const [listings, marketUpdates] = await Promise.all([
    getPublishedListings(),
    getPublishedMarketUpdates(),
  ]);
  const now = new Date();

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency:
        path === "/listings" || path === "/market-updates"
          ? ("weekly" as const)
          : ("monthly" as const),
      priority: path === "" ? 1 : path === "/privacy" ? 0.2 : 0.8,
    })),
    ...listings.map((listing) => ({
      url: `${SITE.url}/listings/${listing.slug}`,
      lastModified: new Date(listing.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: listing.cover_image_url ? [listing.cover_image_url] : undefined,
    })),
    ...marketUpdates.map((update) => ({
      url: `${SITE.url}/market-updates/${update.slug}`,
      lastModified: new Date(update.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: update.cover_image_url
        ? [new URL(update.cover_image_url, SITE.url).toString()]
        : undefined,
    })),
  ];
}
