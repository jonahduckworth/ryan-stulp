import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { ListingDetailView } from "@/components/listing-detail-view";
import {
  getPublishedListingBySlug,
  getPublishedListingMedia,
} from "@/lib/data/public";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getPublishedListingBySlug(slug);
  if (!listing) return { title: "Listing not found" };

  return {
    title: listing.seo_title || listing.title,
    description: listing.seo_description || listing.description.slice(0, 155),
    alternates: { canonical: `/listings/${listing.slug}` },
    openGraph: listing.social_image_url || listing.cover_image_url
      ? { images: [{ url: listing.social_image_url || listing.cover_image_url! }] }
      : undefined,
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getPublishedListingBySlug(slug);
  if (!listing) notFound();
  const media = await getPublishedListingMedia(listing.id);
  const listingImages = Array.from(
    new Set([
      ...media.map((item) => item.public_url),
      ...(listing.cover_image_url ? [listing.cover_image_url] : []),
    ]),
  );

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Offer",
          url: `${SITE.url}/listings/${listing.slug}`,
          price: listing.price,
          priceCurrency: "CAD",
          availability:
            listing.status === "sold"
              ? "https://schema.org/SoldOut"
              : listing.status === "pending"
                ? "https://schema.org/LimitedAvailability"
                : "https://schema.org/InStock",
          seller: {
            "@id": `${SITE.url}/#agent`,
          },
          itemOffered: {
            "@type":
              listing.listing_type === "commercial" ? "Place" : "Residence",
            name: listing.title,
            description: listing.description,
            address: {
              "@type": "PostalAddress",
              streetAddress: [listing.address, listing.address_line_2]
                .filter(Boolean)
                .join(", "),
              addressLocality: listing.city,
              addressRegion: listing.province,
              postalCode: listing.postal_code,
              addressCountry: "CA",
            },
            numberOfBedrooms: listing.bedrooms,
            floorSize: listing.square_feet
              ? {
                  "@type": "QuantitativeValue",
                  value: listing.square_feet,
                  unitCode: "FTK",
                }
              : undefined,
            image: listingImages,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE.url,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Listings",
              item: `${SITE.url}/listings`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: listing.title,
              item: `${SITE.url}/listings/${listing.slug}`,
            },
          ],
        }}
      />
      <ListingDetailView listing={listing} media={media} />
    </>
  );
}
