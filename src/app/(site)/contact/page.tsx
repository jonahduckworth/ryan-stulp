import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { getPublicSiteSettings } from "@/lib/data/public";
import { resolveSiteIdentity } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Ryan Stulp about buying, selling, investing, development, rural, or commercial real estate in Calgary and area.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{
    listing?: string | string[];
    listingId?: string | string[];
    utm_source?: string | string[];
    utm_medium?: string | string[];
    utm_campaign?: string | string[];
    utm_term?: string | string[];
    utm_content?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const first = (value?: string | string[]) =>
    (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 500) ?? "";
  const listingValue = Array.isArray(query.listing)
    ? query.listing[0]
    : query.listing;
  const listing = listingValue?.trim().slice(0, 180) ?? "";
  const rawListingId = first(query.listingId);
  const listingId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      rawListingId,
    )
      ? rawListingId
      : "";
  const campaign = {
    source: first(query.utm_source),
    medium: first(query.utm_medium),
    campaign: first(query.utm_campaign),
    term: first(query.utm_term),
    content: first(query.utm_content),
  };
  const pageQuery = new URLSearchParams();
  if (listing) pageQuery.set("listing", listing);
  if (listingId) pageQuery.set("listingId", listingId);
  for (const [key, value] of Object.entries(campaign)) {
    if (value) pageQuery.set(`utm_${key}`, value);
  }
  const pageUrl = `/contact${pageQuery.size ? `?${pageQuery}` : ""}`;
  const identity = resolveSiteIdentity(await getPublicSiteSettings());

  return (
    <>
      <PageHero
        eyebrow="Contact Ryan"
        title="Bring the question. Get a clear next step."
        description="You do not need a polished plan before reaching out. Tell Ryan what you are considering, what is uncertain, and when you hope to move."
      />
      <section className="section">
        <div className="container split-grid">
          <div className="stack">
            <div className="contact-cards">
              <a className="contact-card" href={identity.phoneHref}>
                <span>Call or text</span>
                <strong>{identity.phoneDisplay}</strong>
              </a>
              <a className="contact-card" href={`mailto:${identity.email}`}>
                <span>Email</span>
                <strong>{identity.email}</strong>
              </a>
              <a
                className="contact-card"
                href={identity.facebook}
                rel="noreferrer"
                target="_blank"
              >
                <span>Facebook</span>
                <strong>ryanstulprealtor</strong>
              </a>
            </div>
            <p className="form-note">
              Brokerage office: {identity.brokerage}, {identity.address}
            </p>
          </div>
          <LeadForm
            source={listing ? "listing-detail" : "contact-page"}
            defaultIntent={listing ? "buy" : "general"}
            includeAddress={Boolean(listing)}
            defaultPropertyAddress={listing}
            listingId={listingId}
            pageUrl={pageUrl}
            campaign={campaign}
          />
        </div>
      </section>
    </>
  );
}
