import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { ListingCard } from "@/components/listing-card";
import { getPublishedListings } from "@/lib/data/public";
import { SITE } from "@/lib/site";

export default async function HomePage() {
  const listings = (await getPublishedListings()).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: SITE.licensedName,
          alternateName: "Ryan Stulp",
          url: SITE.url,
          telephone: SITE.phoneDisplay,
          email: SITE.email,
          areaServed: "Calgary and surrounding area, Alberta",
          address: {
            "@type": "PostalAddress",
            streetAddress: "#375 7220 Fisher St SE",
            addressLocality: "Calgary",
            addressRegion: "AB",
            postalCode: "T2H 2H8",
            addressCountry: "CA",
          },
          worksFor: {
            "@type": "Organization",
            name: SITE.brokerage,
          },
        }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Calgary and area real estate</span>
            <h1 className="display">Make your next move with clarity.</h1>
            <p className="lede">
              Whether you&apos;re buying your first home, selling, investing, or
              planning a development, Ryan gives you a clear read on the market
              and a practical path forward.
            </p>
            <div className="button-row">
              <Link className="button button-primary" href="/contact">
                Tell Ryan your goal
              </Link>
              <Link className="button button-secondary" href="/listings">
                Explore listings
              </Link>
            </div>
          </div>
          <div className="hero-portrait">
            <Image
              src="/images/ryan-stulp.jpg"
              alt="Ryan Stulp, Calgary real estate professional"
              width={1066}
              height={1600}
              priority
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      <section className="trust-bar" aria-label="Ryan's experience">
        <div className="container trust-grid">
          <div className="trust-item">
            <strong>80+</strong>
            <span>Transaction sides since becoming licensed</span>
          </div>
          <div className="trust-item">
            <strong>7+ years</strong>
            <span>Sales experience</span>
          </div>
          <div className="trust-item">
            <strong>Residential</strong>
            <span>Homes, rural property, and investments</span>
          </div>
          <div className="trust-item">
            <strong>Commercial</strong>
            <span>Guidance for business and development needs</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container intro-grid">
          <div className="stack">
            <span className="eyebrow">A grounded approach</span>
            <h2 className="section-title">Advice that helps you decide.</h2>
          </div>
          <div className="stack">
            <p className="lede">
              Real estate gets complicated when the advice is vague. Ryan
              explains the trade-offs, keeps the process organized, and makes
              sure you understand what happens next.
            </p>
            <p>
              His work spans first-time buyers, experienced investors, builders,
              developers, rural properties, and commercial opportunities. The
              approach stays the same: listen first, be direct, and protect the
              client&apos;s priorities from beginning to end.
            </p>
            <Link className="button button-secondary" href="/about">
              Meet Ryan
            </Link>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container pathways">
          <Link className="path-card" href="/buying-calgary">
            <div className="path-content">
              <span className="eyebrow">For buyers</span>
              <h3>Find the right fit — and know why.</h3>
              <p>
                Build a smart search, compare opportunities clearly, and make
                offers with context.
              </p>
              <strong>Plan your purchase →</strong>
            </div>
          </Link>
          <Link className="path-card" href="/selling-calgary">
            <div className="path-content">
              <span className="eyebrow">For sellers</span>
              <h3>Position your property to move.</h3>
              <p>
                Get an honest pricing conversation, a focused launch plan, and
                steady guidance through every offer.
              </p>
              <strong>Plan your sale →</strong>
            </div>
          </Link>
        </div>
      </section>

      <section className="section surface">
        <div className="container stack">
          <span className="eyebrow">Current opportunities</span>
          <h2 className="section-title">Properties worth a closer look.</h2>
          {listings.length > 0 ? (
            <div className="listing-grid">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="eyebrow">Inventory is being prepared</span>
              <h3>No public listings are posted right now.</h3>
              <p className="lede">
                Listings can change quickly. Tell Ryan what you&apos;re looking
                for and he&apos;ll help you find relevant opportunities.
              </p>
              <Link className="button button-primary" href="/contact">
                Share what you need
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <span className="eyebrow">What working together looks like</span>
          <h2 className="section-title">A process you can follow.</h2>
          <div className="steps">
            <article className="step">
              <span className="step-number">01</span>
              <div>
                <h3>Start with the goal</h3>
                <p>
                  Ryan listens for your timing, constraints, and definition of a
                  good outcome before recommending a route.
                </p>
              </div>
            </article>
            <article className="step">
              <span className="step-number">02</span>
              <div>
                <h3>Build the strategy</h3>
                <p>
                  You get useful market context and a plan that fits the property
                  and the decision in front of you.
                </p>
              </div>
            </article>
            <article className="step">
              <span className="step-number">03</span>
              <div>
                <h3>Move with confidence</h3>
                <p>
                  Ryan keeps the details organized, communicates directly, and
                  stays accountable through possession and beyond.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <blockquote className="quote">
            “We never felt pressured — only informed. Ryan made a complicated
            move feel manageable from the first conversation to possession.”
            <cite>— Calgary client</cite>
          </blockquote>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
