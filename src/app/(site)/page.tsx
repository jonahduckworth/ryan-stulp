import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { GoogleReviews } from "@/components/google-reviews";
import { JsonLd } from "@/components/json-ld";
import { ListingCard } from "@/components/listing-card";
import {
  getPublishedListings,
  getPublicSiteSettings,
} from "@/lib/data/public";
import { resolveSiteIdentity } from "@/lib/site";
import {
  GOOGLE_REVIEW_PROFILE_URL,
  GOOGLE_REVIEW_SUMMARY,
} from "@/lib/testimonials";

export default async function HomePage() {
  const [publishedListings, settings] = await Promise.all([
    getPublishedListings(),
    getPublicSiteSettings(),
  ]);
  const listings = publishedListings.slice(0, 3);
  const identity = resolveSiteIdentity(settings);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "@id": `${identity.url}/#agent`,
          name: identity.licensedName,
          alternateName: "Ryan Stulp",
          url: identity.url,
          telephone: identity.phoneDisplay,
          email: identity.email,
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
            name: identity.brokerage,
          },
        }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{identity.homepageEyebrow}</span>
            <h1 className="display">{identity.homepageTitle}</h1>
            <p className="lede">{identity.homepageDescription}</p>
            <p className="hero-positioning">
              Market-focused advice. Straight answers. Education before
              pressure.
            </p>
            <div className="button-row" data-analytics-location="home_hero">
              <Link className="button button-primary" href="/contact">
                Tell Ryan your goal
              </Link>
              <Link className="button button-secondary" href="/listings">
                Explore listings
              </Link>
            </div>
            <a
              className="hero-review"
              href={GOOGLE_REVIEW_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={`${GOOGLE_REVIEW_SUMMARY.rating} out of 5 from ${GOOGLE_REVIEW_SUMMARY.count} Google reviews`}
              data-analytics-event="google_reviews_click"
            >
              <strong>{GOOGLE_REVIEW_SUMMARY.rating} / 5</strong>
              <span>{GOOGLE_REVIEW_SUMMARY.count} Google reviews</span>
              <span className="hero-review-link">Read reviews</span>
            </a>
          </div>
          <div className="hero-portrait">
            <Image
              src="/images/ryan-stulp-leaning.jpg"
              alt="Ryan Stulp, Calgary real estate professional"
              width={1166}
              height={1749}
              priority
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      <section className="trust-bar" aria-label="Real estate services">
        <div className="container trust-grid">
          <div className="trust-item">
            <strong>Residential</strong>
            <span>Buying and selling guidance</span>
          </div>
          <div className="trust-item">
            <strong>Commercial</strong>
            <span>Business and development needs</span>
          </div>
          <div className="trust-item">
            <strong>Rural</strong>
            <span>Property beyond the city</span>
          </div>
          <div className="trust-item">
            <strong>Calgary and area</strong>
            <span>Local market context</span>
          </div>
        </div>
      </section>

      <section className="section personal-intro">
        <div className="container personal-grid">
          <div className="personal-portrait">
            <Image
              src="/images/ryan-stulp-standing.jpg"
              alt="Professional portrait of Ryan Stulp standing in a dark suit"
              width={1166}
              height={1749}
              sizes="(max-width: 900px) 100vw, 40vw"
            />
          </div>
          <div className="stack personal-copy">
            <span className="eyebrow">The person behind the advice</span>
            <h2 className="section-title">
              Market knowledge, without the sales pressure.
            </h2>
            <p className="lede">
              Ryan&apos;s job is not to talk you into a move. It is to help you
              understand the market, compare the trade-offs, and decide what
              makes sense for you.
            </p>
            <p>
              Whether the right answer is to move quickly, adjust the plan, wait,
              or walk away, you will get the honest read and the context behind
              it.
            </p>
            <Link className="button button-secondary" href="/about">
              Meet Ryan
            </Link>
          </div>
        </div>
        <div className="container difference-grid" aria-label="Why work with Ryan">
          <article className="difference-card">
            <span>01</span>
            <h3>Read the market</h3>
            <p>
              Use current activity, competition, and local context instead of
              relying on assumptions.
            </p>
          </article>
          <article className="difference-card">
            <span>02</span>
            <h3>Get the straight answer</h3>
            <p>
              Hear the opportunity, the trade-offs, and the risks in plain
              language.
            </p>
          </article>
          <article className="difference-card">
            <span>03</span>
            <h3>Understand the decision</h3>
            <p>
              Know why a recommendation makes sense before you choose the next
              step.
            </p>
          </article>
        </div>
      </section>

      <section className="section-tight">
        <div className="container pathways">
          <Link className="path-card" href="/buying-calgary">
            <div className="path-content">
              <span className="eyebrow">For buyers</span>
              <h3>Find the right fit, and know why.</h3>
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

      <GoogleReviews />

      <section className="section">
        <div className="container stack">
          <div className="section-heading-row">
            <div className="stack">
              <span className="eyebrow">Property expertise</span>
              <h2 className="section-title">
                Different properties need different questions.
              </h2>
            </div>
            <p className="lede">
              Go deeper on the property type or location you are considering,
              without losing sight of the decision behind it.
            </p>
          </div>
          <div className="expertise-grid">
            <Link
              className="expertise-card"
              href="/commercial-real-estate-calgary"
            >
              <span>01 · Commercial</span>
              <h3>Property that works for the business.</h3>
              <p>
                Clarify use, location, cost, due diligence, and the conditions
                behind a commercial decision.
              </p>
              <strong>Explore commercial guidance →</strong>
            </Link>
            <Link
              className="expertise-card"
              href="/real-estate-investing-calgary"
            >
              <span>02 · Investment</span>
              <h3>Evidence before assumptions.</h3>
              <p>
                Compare opportunities against the strategy, time horizon, work,
                risk, and exit you are prepared to manage.
              </p>
              <strong>Explore investment guidance →</strong>
            </Link>
            <Link
              className="expertise-card"
              href="/rural-real-estate-calgary"
            >
              <span>03 · Rural</span>
              <h3>See the whole property system.</h3>
              <p>
                Bring land, access, water, wastewater, structures, services, and
                lifestyle into the same decision.
              </p>
              <strong>Explore rural guidance →</strong>
            </Link>
          </div>
          <Link className="area-feature" href="/calgary-areas">
            <div>
              <span className="eyebrow">Calgary and area</span>
              <h3>Choose the trade-offs before the neighbourhood.</h3>
            </div>
            <p>
              Compare the inner city, northwest, northeast, southwest,
              southeast, and surrounding area using the factors that affect
              daily life and long-term fit.
            </p>
            <strong>Explore the area guide →</strong>
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

      <CtaBand />
    </>
  );
}
