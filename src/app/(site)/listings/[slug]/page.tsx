import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { getPublishedListingBySlug } from "@/lib/data/public";
import { formatCurrency } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getPublishedListingBySlug(slug);
  if (!listing) return { title: "Listing not found" };

  return {
    title: listing.title,
    description: listing.description.slice(0, 155),
    alternates: { canonical: `/listings/${listing.slug}` },
    openGraph: listing.cover_image_url
      ? { images: [{ url: listing.cover_image_url }] }
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

  const facts = [
    listing.bedrooms !== null ? ["Bedrooms", listing.bedrooms] : null,
    listing.bathrooms !== null ? ["Bathrooms", listing.bathrooms] : null,
    listing.square_feet !== null
      ? ["Interior", `${listing.square_feet.toLocaleString("en-CA")} sq. ft.`]
      : null,
    ["Property type", listing.property_type],
  ].filter(Boolean) as [string, string | number][];

  return (
    <>
      <header className="page-hero">
        <div className="container stack">
          <span className="eyebrow">{listing.status} listing</span>
          <h1 className="display">{listing.title}</h1>
          <p className="lede">
            {listing.address}, {listing.city}, {listing.province}
          </p>
          <p className="listing-price">{formatCurrency(listing.price)}</p>
        </div>
      </header>
      {listing.cover_image_url ? (
        <div className="container section-tight">
          <div className="listing-image" style={{ aspectRatio: "16 / 9" }}>
            <Image
              src={listing.cover_image_url}
              alt={`Property at ${listing.address}`}
              fill
              priority
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}
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
              href={`/contact?listing=${encodeURIComponent(listing.address)}`}
            >
              Ask Ryan about this property
            </Link>
          </div>
        </div>
      </section>
      <CtaBand
        title="Want a private look or the full property details?"
        href="/contact"
        label="Contact Ryan"
      />
    </>
  );
}
