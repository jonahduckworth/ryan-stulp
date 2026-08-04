import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { ListingExplorer } from "@/components/listing-explorer";
import { PageHero } from "@/components/page-hero";
import { getPublishedListings } from "@/lib/data/public";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Explore current Calgary-area residential, rural, investment, development, and commercial listings represented by Ryan Stulp.",
  alternates: { canonical: "/listings" },
};

export default async function ListingsPage() {
  const listings = await getPublishedListings();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Ryan Stulp real estate listings",
          url: `${SITE.url}/listings`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: listings.length,
            itemListElement: listings.map((listing, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: listing.title,
              url: `${SITE.url}/listings/${listing.slug}`,
              image: listing.cover_image_url || undefined,
            })),
          },
        }}
      />
      <PageHero
        eyebrow="Listings"
        title="Current properties and opportunities."
        description="Explore Ryan's active, pending, and recently sold properties. If nothing here matches, share your criteria. The right opportunity may not be public yet."
      />
      <section className="section surface">
        <div className="container">
          {listings.length ? (
            <ListingExplorer listings={listings} />
          ) : (
            <div className="empty-state">
              <span className="eyebrow">No public inventory right now</span>
              <h3>New listings can be added here at any time.</h3>
              <p className="lede">
                Ryan&apos;s admin dashboard is ready for properties as they come
                to market. In the meantime, tell him what you need.
              </p>
              <Link className="button button-primary" href="/contact">
                Share your criteria
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="container intro-grid">
          <div className="stack">
            <span className="eyebrow">Search beyond the feed</span>
            <h2 className="section-title">
              The right fit may not be public yet.
            </h2>
          </div>
          <div className="prose">
            <p>
              Public listings are only one part of a useful search. Ryan can help
              you compare residential, commercial, investment, and rural
              opportunities across Calgary and surrounding communities.
            </p>
            <p>
              Share the property type, area, timing, and trade-offs that matter
              to you. That gives Ryan a better starting point than a long list of
              links.
            </p>
            <div className="button-row">
              <Link className="button button-secondary" href="/calgary-areas">
                Explore Calgary areas
              </Link>
              <Link className="button button-primary" href="/contact">
                Share your criteria
              </Link>
            </div>
          </div>
        </div>
      </section>
      <CtaBand
        title="Not seeing the right property?"
        href="/contact"
        label="Tell Ryan what you need"
      />
    </>
  );
}
