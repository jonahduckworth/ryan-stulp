import type { MetadataRoute } from "next";
import { getPublishedListings } from "@/lib/data/public";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/listings",
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
  const listings = await getPublishedListings();
  const now = new Date();

  return [
    ...staticPaths.map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: path === "/listings" ? ("daily" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/privacy" ? 0.2 : 0.8,
    })),
    ...listings.map((listing) => ({
      url: `${SITE.url}/listings/${listing.slug}`,
      lastModified: new Date(listing.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: listing.cover_image_url ? [listing.cover_image_url] : undefined,
    })),
  ];
}
