import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Ryan Stulp about buying, selling, investing, development, rural, or commercial real estate in Calgary and area.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
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
              <a className="contact-card" href={SITE.phoneHref}>
                <span>Call or text</span>
                <strong>{SITE.phoneDisplay}</strong>
              </a>
              <a className="contact-card" href={`mailto:${SITE.email}`}>
                <span>Email</span>
                <strong>{SITE.email}</strong>
              </a>
              <a
                className="contact-card"
                href={SITE.facebook}
                rel="noreferrer"
                target="_blank"
              >
                <span>Facebook</span>
                <strong>ryanstulprealtor</strong>
              </a>
            </div>
            <p className="form-note">
              Brokerage office: {SITE.brokerage}, {SITE.address}
            </p>
          </div>
          <LeadForm source="contact-page" />
        </div>
      </section>
    </>
  );
}
