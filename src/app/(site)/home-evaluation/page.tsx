import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Home Evaluation",
  description:
    "Request a practical, property-specific Calgary home evaluation from Ryan Stulp.",
  alternates: { canonical: "/home-evaluation" },
};

export default function HomeEvaluationPage() {
  return (
    <>
      <PageHero
        eyebrow="Home evaluation"
        title="Start with a useful value conversation."
        description="An online estimate cannot see your upgrades, condition, timing, or competition. Ryan can. Share the property and your plans to get a more useful starting point."
      />
      <section className="section">
        <div className="container split-grid">
          <div className="prose">
            <h2>What this evaluation is for</h2>
            <p>
              Ryan will review the property details, recent comparable sales,
              active competition, and the context around your timing. The goal
              is not an inflated promise. It is a realistic pricing range and a
              conversation about what could affect it.
            </p>
            <ul>
              <li>No obligation to list</li>
              <li>Confidential and specific to your property</li>
              <li>Useful whether you are selling soon or planning ahead</li>
            </ul>
          </div>
          <LeadForm
            source="home-evaluation"
            defaultIntent="sell"
            includeAddress
            pageUrl="/home-evaluation"
          />
        </div>
      </section>
    </>
  );
}
