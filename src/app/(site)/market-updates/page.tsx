import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { MarketUpdateCard } from "@/components/market-update-card";
import { PageHero } from "@/components/page-hero";
import { getPublishedMarketUpdates } from "@/lib/data/public";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Calgary Real Estate Market Updates",
  description:
    "Straightforward Calgary real estate market updates from Ryan Stulp, with practical context for buyers, sellers, investors, and property owners.",
  alternates: { canonical: "/market-updates" },
};

export default async function MarketUpdatesPage() {
  const updates = await getPublishedMarketUpdates();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Calgary real estate market updates",
          description:
            "Market-focused real estate analysis and practical guidance from Ryan Stulp.",
          url: `${SITE.url}/market-updates`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: updates.length,
            itemListElement: updates.map((update, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: update.title,
              url: `${SITE.url}/market-updates/${update.slug}`,
              image: update.cover_image_url
                ? new URL(update.cover_image_url, SITE.url).toString()
                : undefined,
            })),
          },
        }}
      />
      <PageHero
        eyebrow="Market updates"
        title="Calgary market context, without the sales pitch."
        description="Ryan breaks down the numbers, explains what is actually changing, and connects the broader market to the decisions buyers, sellers, and investors are making."
      />
      <section className="section surface">
        <div className="container">
          {updates.length ? (
            <div className="market-update-grid">
              {updates.map((update) => (
                <MarketUpdateCard update={update} key={update.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="eyebrow">Updates are coming</span>
              <h2>Ryan is preparing his first market perspective.</h2>
              <p className="lede">
                In the meantime, ask about the neighbourhood, property type,
                or price range that matters to you.
              </p>
              <Link className="button button-primary" href="/contact">
                Ask Ryan a market question
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="section">
        <div className="container intro-grid">
          <div className="stack">
            <span className="eyebrow">How to use these updates</span>
            <h2 className="section-title">
              Market headlines are context, not a strategy.
            </h2>
          </div>
          <div className="prose">
            <p>
              A city-wide average cannot tell you exactly what to offer, when
              to list, or whether a particular property makes sense. Property
              type, community, condition, price range, and timing all matter.
            </p>
            <p>
              Use these updates to understand the direction of the market, then
              talk to Ryan about the details behind your decision.
            </p>
          </div>
        </div>
      </section>
      <CtaBand
        title="Have a question about the Calgary market?"
        href="/contact"
        label="Ask Ryan"
      />
    </>
  );
}
