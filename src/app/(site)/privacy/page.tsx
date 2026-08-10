import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getPublicSiteSettings } from "@/lib/data/public";
import { resolveSiteIdentity } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for the Ryan Stulp real estate website.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const identity = resolveSiteIdentity(await getPublicSiteSettings());
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="How your information is handled."
        description="This site collects only the information needed to respond to inquiries, manage listings, understand site performance, and operate safely."
      />
      <section className="section">
        <div className="narrow prose">
          <h2>Information you provide</h2>
          <p>
            When you submit a form, the site stores the contact details,
            property information, and message you choose to provide. Ryan and
            authorized administrators use this information to respond to your
            request and manage the relationship.
          </p>
          <h2>Site operations and analytics</h2>
          <p>
            Security checks may process a privacy-preserving request identifier
            to reduce spam and abuse. If analytics is enabled, aggregate usage
            information such as page visits and device type may be collected.
            Form contents are not sent to analytics.
          </p>
          <h2>Sharing and retention</h2>
          <p>
            Information is not sold. It may be processed by service providers
            used to host the site, store data, prevent spam, and deliver email.
            Records are kept only as long as reasonably needed for the inquiry,
            legal obligations, and business records.
          </p>
          <h2>Your choices</h2>
          <p>
            To ask about, correct, or request deletion of your information,
            email <a href={`mailto:${identity.email}`}>{identity.email}</a>. Some
            records may need to be retained where required by law or brokerage
            obligations.
          </p>
          <p>Last updated: July 27, 2026.</p>
        </div>
      </section>
    </>
  );
}
