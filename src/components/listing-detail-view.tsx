import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { ConversionEvent } from "@/components/conversion-event";
import {
  ListingGallery,
  type GalleryImage,
} from "@/components/listing-gallery";
import { AREA_LABELS } from "@/lib/listing-options";
import type {
  Listing,
  ListingMedia,
  ListingPropertyDetails,
} from "@/lib/types";
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
  const details =
    listing.property_details ?? ({} as Partial<ListingPropertyDetails>);
  const transactionLabels = {
    sale: "For sale",
    lease: "For lease",
    "sale-or-lease": "For sale or lease",
  } as const;
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
    details.parking ? ["Parking", details.parking] : null,
    details.lotSize ? ["Lot size", details.lotSize] : null,
    details.annualPropertyTax !== null &&
    details.annualPropertyTax !== undefined
      ? ["Property tax", `${formatCurrency(details.annualPropertyTax)} / year`]
      : null,
    details.monthlyCondoFee !== null &&
    details.monthlyCondoFee !== undefined
      ? ["Condo fee", `${formatCurrency(details.monthlyCondoFee)} / month`]
      : null,
    details.transactionType
      ? ["Availability", transactionLabels[details.transactionType]]
      : null,
    details.zoning ? ["Zoning / land use", details.zoning] : null,
    details.commercialUse ? ["Use", details.commercialUse] : null,
    details.acreage !== null && details.acreage !== undefined
      ? ["Land", `${details.acreage.toLocaleString("en-CA")} acres`]
      : null,
    details.waterSource ? ["Water", details.waterSource] : null,
    details.wastewaterSystem
      ? ["Wastewater", details.wastewaterSystem]
      : null,
    details.outbuildings ? ["Outbuildings", details.outbuildings] : null,
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
            {listing.area_key ? (
              <Link
                className="contact-card listing-area-guide"
                href={`/calgary-areas#${listing.area_key}`}
              >
                <span>Area guide</span>
                <strong>{AREA_LABELS[listing.area_key]} →</strong>
              </Link>
            ) : null}
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
