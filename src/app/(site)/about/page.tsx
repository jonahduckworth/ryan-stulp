import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Ryan Stulp, a Calgary-area real estate professional serving residential, commercial, rural, investment, and development clients.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Ryan"
        title="Direct advice. Serious follow-through."
        description="Ryan works across residential, commercial, rural, investment, and development real estate, helping clients understand the opportunity and the risk before they make a move."
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
              real estate. He brings a direct, sales-focused approach to helping
              clients understand the decision in front of them.
            </p>
            <p>
              He supports first-time buyers, growing families, investors,
              builders, developers, rural clients, and commercial decision
              makers. That range matters: every property is different, but good
              representation always starts with clear priorities, informed
              negotiation, and details that do not get dropped.
            </p>
            <h3>What you can expect</h3>
            <ul>
              <li>Plain-language market and property guidance</li>
              <li>A strategy shaped around your timing and risk tolerance</li>
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
