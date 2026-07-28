import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { ConversionEvent } from "@/components/conversion-event";
import {
  ListingGallery,
  type GalleryImage,
} from "@/components/listing-gallery";
import type { Listing, ListingMedia } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ListingDetailView({
  listing,
  media,
  preview = false,
}: {
  listing: Listing;
  media: ListingMedia[];
  preview?: boolean;
}) {
  const facts = [
    listing.bedrooms !== null ? ["Bedrooms", listing.bedrooms] : null,
    listing.bathrooms !== null ? ["Bathrooms", listing.bathrooms] : null,
    listing.square_feet !== null
      ? ["Interior", `${listing.square_feet.toLocaleString("en-CA")} sq. ft.`]
      : null,
    listing.year_built !== null ? ["Year built", listing.year_built] : null,
    listing.neighbourhood ? ["Neighbourhood", listing.neighbourhood] : null,
    listing.mls_number ? ["MLS", listing.mls_number] : null,
    ["Property type", listing.property_type],
  ].filter(Boolean) as [string, string | number][];
  const gallery: GalleryImage[] = media.length
    ? media.map((image) => ({
        id: image.id,
        url: image.public_url,
        alt: image.alt_text,
        caption: image.caption,
      }))
    : listing.cover_image_url
      ? [
          {
            id: "cover",
            url: listing.cover_image_url,
            alt: `Property at ${listing.address}`,
            caption: null,
          },
        ]
      : [];
  const inquiryHref =
    listing.cta_destination ||
    `/contact?listing=${encodeURIComponent(listing.address)}&listingId=${listing.id}`;

  return (
    <>
      {!preview ? (
        <ConversionEvent
          name="view_listing"
          parameters={{ listing_id: listing.id, listing_status: listing.status }}
        />
      ) : null}
      {preview ? (
        <div className="preview-banner" role="status">
          Admin preview · This page is not public
        </div>
      ) : null}
      <header className="page-hero">
        <div className="container stack">
          <span className="eyebrow">{listing.status} listing</span>
          <h1 className="display">{listing.title}</h1>
          <p className="lede">
            {listing.address}
            {listing.address_line_2 ? `, ${listing.address_line_2}` : ""},{" "}
            {listing.city}, {listing.province}
          </p>
          <p className="listing-price">{formatCurrency(listing.price)}</p>
        </div>
      </header>
      <ListingGallery images={gallery} listingTitle={listing.title} />
      <section className="section">
        <div className="container split-grid">
          <div className="contact-cards">
            {facts.map(([label, value]) => (
              <div className="contact-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="prose">
            <h2>About this property</h2>
            {listing.description.split("\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {listing.features.length ? (
              <>
                <h3>Highlights</h3>
                <ul>
                  {listing.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </>
            ) : null}
            <Link
              className="button button-primary"
              href={inquiryHref}
              data-analytics-event="listing_inquiry_click"
            >
              {listing.cta_label || "Ask Ryan about this property"}
            </Link>
          </div>
        </div>
      </section>
      <CtaBand
        title="Want a private look or the full property details?"
        href={inquiryHref}
        label={listing.cta_label || "Contact Ryan"}
      />
    </>
  );
}
