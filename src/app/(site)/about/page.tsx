import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Ryan Stulp, a Calgary-area real estate professional helping buyers, sellers, investors, builders, and commercial clients make informed decisions.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Ryan"
        title="Direct advice. Serious follow-through."
        description="Ryan helps buyers, sellers, investors, builders, and commercial clients understand the opportunity, the risk, and the market before they make a move."
      />
      <section className="section">
        <div className="container split-grid">
          <div className="portrait-frame">
            <Image
              src="/images/ryan-stulp.jpg"
              alt="Portrait of Ryan Stulp"
              width={1066}
              height={1600}
              sizes="(max-width: 900px) 100vw, 42vw"
            />
          </div>
          <div className="prose">
            <span className="eyebrow">The person behind the process</span>
            <h2>Built around communication and accountability.</h2>
            <p>
              Ryan is licensed in Alberta for residential, commercial, and rural
              real estate. His approach is market-focused and education-first:
              explain what the data says, be candid about the risk, and give
              people room to make the right decision without pressure.
            </p>
            <p>
              He supports first-time and repeat buyers, homeowners preparing to
              sell, growing families, investors, builders, developers, rural
              clients, and commercial decision makers. That range matters: every
              property is different, but good representation always starts with
              clear priorities, informed negotiation, and details that do not get
              dropped.
            </p>
            <aside className="about-philosophy">
              <span className="eyebrow">Why the work matters</span>
              <h3>Confidence comes from clarity, not pressure.</h3>
              <p>
                A real estate decision can shape a family&apos;s next chapter, a
                business plan, or years of financial choices. Ryan&apos;s role is
                to make the trade-offs understandable and help clients choose
                what fits, even when the best move is to wait or walk away.
              </p>
            </aside>
            <h3>What you can expect</h3>
            <ul>
              <li>Plain-language market and property guidance</li>
              <li>A strategy shaped around your timing and risk tolerance</li>
              <li>Honest pricing and positioning guidance for sellers</li>
              <li>Direct communication before, during, and after the deal</li>
              <li>Strong follow-through across documents, conditions, and possession</li>
            </ul>
            <Link className="button button-primary" href="/contact">
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
      <CtaBand
        title="Bring Ryan the real question, even if you are early."
        label="Contact Ryan"
      />
    </>
  );
}
