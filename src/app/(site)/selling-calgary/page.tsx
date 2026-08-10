import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { FaqSection } from "@/components/faq-section";
import { InlineTestimonial } from "@/components/inline-testimonial";
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
        description="Ryan builds the sale around your property, timing, and next move, from the first pricing conversation through conditions and possession."
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
      <section className="section-tight">
        <div className="container">
          <InlineTestimonial
            author="Alison Whellams"
            quote="Ryan has sold two of my properties and helped me buy my current house. He is great! Always professional, knowledgeable, and made himself available for showings."
          />
        </div>
      </section>
      <FaqSection
        title="Questions sellers often ask"
        items={[
          {
            question: "Do I need to renovate before selling?",
            answer:
              "Not automatically. Ryan can help separate work that may support the sale from work that could cost time or money without a useful return.",
          },
          {
            question: "How is an asking price chosen?",
            answer:
              "The starting point is recent comparable activity, current competition, property condition, timing, and the strategy for attracting and evaluating offers.",
          },
          {
            question: "Can I ask for an evaluation before I am ready to list?",
            answer:
              "Yes. An early conversation can help you understand value, preparation priorities, and timing without committing to a launch date.",
          },
        ]}
      />
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
