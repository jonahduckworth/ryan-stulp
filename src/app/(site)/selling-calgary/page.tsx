import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Selling in Calgary",
  description:
    "Get a clear pricing, preparation, marketing, and negotiation plan for selling Calgary-area real estate.",
  alternates: { canonical: "/selling-calgary" },
};

export default function SellingPage() {
  return (
    <>
      <PageHero
        eyebrow="Selling in Calgary"
        title="Price with evidence. Launch with purpose."
        description="Ryan builds the sale around your property, timing, and next move — from the first pricing conversation through conditions and possession."
      />
      <section className="section">
        <div className="container intro-grid">
          <div className="stack">
            <span className="eyebrow">Before the sign goes up</span>
            <h2 className="section-title">The work starts before launch day.</h2>
          </div>
          <div className="prose">
            <p>
              Effective selling is a sequence of good decisions: which work is
              worth doing, where the property sits against current competition,
              how the price supports the strategy, and how offers will be
              evaluated.
            </p>
            <p>
              Ryan gives you a direct read on those decisions. The plan may
              include preparation priorities, professional presentation,
              digital distribution, showing feedback, and adjustments based on
              the market&apos;s real response.
            </p>
            <h3>Included in the approach</h3>
            <ul>
              <li>Comparable sales and current competition review</li>
              <li>Preparation guidance focused on return and timing</li>
              <li>Clear positioning, launch, and showing plan</li>
              <li>Offer comparison beyond the headline price</li>
              <li>Condition, document, and possession follow-through</li>
            </ul>
            <Link className="button button-primary" href="/home-evaluation">
              Request a home evaluation
            </Link>
          </div>
        </div>
      </section>
      <section className="section dark">
        <div className="container">
          <blockquote className="quote">
            “Good marketing earns attention. Good strategy turns that attention
            into the right offer.”
            <cite>Ryan Stulp</cite>
          </blockquote>
        </div>
      </section>
      <CtaBand
        title="Wondering what your property could sell for?"
        href="/home-evaluation"
        label="Start the evaluation"
      />
    </>
  );
}
