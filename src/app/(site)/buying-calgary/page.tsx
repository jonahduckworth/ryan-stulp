import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { FaqSection } from "@/components/faq-section";
import { InlineTestimonial } from "@/components/inline-testimonial";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Buying in Calgary",
  description:
    "Practical guidance for buying a home, investment, rural, development, or commercial property in Calgary and area.",
  alternates: { canonical: "/buying-calgary" },
};

export default function BuyingPage() {
  return (
    <>
      <PageHero
        eyebrow="Buying in Calgary"
        title="Search with context. Offer with confidence."
        description="A good purchase is more than finding a property you like. Ryan helps you define the right search, understand value, and make a decision that still works after the excitement settles."
      />
      <section className="section">
        <div className="container stack">
          <span className="eyebrow">Your buying plan</span>
          <h2 className="section-title">Know what matters before the offer.</h2>
          <div className="steps">
            <article className="step">
              <span className="step-number">01</span>
              <div>
                <h3>Get ready</h3>
                <p>
                  Align budget, financing, timing, location, and non-negotiables
                  so the search starts with a useful filter.
                </p>
              </div>
            </article>
            <article className="step">
              <span className="step-number">02</span>
              <div>
                <h3>Compare clearly</h3>
                <p>
                  Review recent activity, property condition, likely resale
                  considerations, and the trade-offs behind each option.
                </p>
              </div>
            </article>
            <article className="step">
              <span className="step-number">03</span>
              <div>
                <h3>Protect the decision</h3>
                <p>
                  Structure the offer thoughtfully, manage conditions, and keep
                  every deadline moving toward possession.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="section-tight">
        <div className="container">
          <InlineTestimonial
            author="Ravdeep Singh"
            quote="Ryan was knowledgeable, responsive, and always had our best interests in mind. His professionalism and market expertise made everything smooth and stress-free."
          />
        </div>
      </section>
      <FaqSection
        title="Questions buyers often ask"
        items={[
          {
            question: "When should I contact Ryan if I am not pre-approved yet?",
            answer:
              "You can reach out early. Ryan can help clarify the search, timing, and questions to bring to a mortgage professional before you begin viewing seriously.",
          },
          {
            question: "Does Ryan work with first-time buyers and investors?",
            answer:
              "Yes. Ryan works with first-time buyers, experienced buyers, and investors across residential, rural, commercial, and development opportunities.",
          },
          {
            question: "Can Ryan help outside Calgary?",
            answer:
              "Ryan serves Calgary and surrounding communities. Share the location you are considering so he can confirm whether it fits his service area.",
          },
        ]}
      />
      <section className="section surface">
        <div className="container split-grid">
          <div className="stack">
            <span className="eyebrow">Start here</span>
            <h2 className="section-title">Tell Ryan what a good purchase looks like.</h2>
            <p className="lede">
              You do not need to have everything figured out. Share what you know
              now and Ryan can help organize the next steps.
            </p>
          </div>
          <LeadForm
            source="buying-page"
            defaultIntent="buy"
            pageUrl="/buying-calgary"
          />
        </div>
      </section>
      <CtaBand
        title="Already watching a property?"
        href="/contact"
        label="Get a second look"
      />
    </>
  );
}
