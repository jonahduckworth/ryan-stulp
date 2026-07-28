import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { ListingCard } from "@/components/listing-card";
import { PageHero } from "@/components/page-hero";
import { getPublishedListings } from "@/lib/data/public";

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
      <PageHero
        eyebrow="Listings"
        title="Current properties and opportunities."
        description="Explore Ryan's active, pending, and recently sold properties. If nothing here matches, share your criteria — the right opportunity may not be public yet."
      />
      <section className="section surface">
        <div className="container">
          {listings.length ? (
            <div className="listing-grid">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
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
      <CtaBand
        title="Not seeing the right property?"
        href="/contact"
        label="Tell Ryan what you need"
      />
    </>
  );
}
