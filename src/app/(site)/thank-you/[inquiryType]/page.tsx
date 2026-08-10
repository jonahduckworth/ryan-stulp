import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConversionEvent } from "@/components/conversion-event";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

const INQUIRY_TYPES = {
  listing: {
    eyebrow: "Listing inquiry received",
    title: "Ryan has the property and your question.",
    description:
      "Ryan will review the listing details and follow up personally with availability and the clearest next step.",
  },
  "home-evaluation": {
    eyebrow: "Evaluation request received",
    title: "Your property details are with Ryan.",
    description:
      "Ryan will review what you shared and follow up with a practical starting point for value, timing, and preparation.",
  },
  buy: {
    eyebrow: "Buyer inquiry received",
    title: "Your search starts with a real conversation.",
    description:
      "Ryan will follow up personally to understand your criteria, timing, and the decisions in front of you.",
  },
  sell: {
    eyebrow: "Seller inquiry received",
    title: "Ryan has your selling goals.",
    description:
      "Ryan will follow up personally to discuss timing, positioning, and the next useful step for your property.",
  },
  invest: {
    eyebrow: "Investment inquiry received",
    title: "Ryan has the opportunity you are considering.",
    description:
      "Ryan will follow up personally to understand your criteria and help evaluate the next move.",
  },
  commercial: {
    eyebrow: "Commercial inquiry received",
    title: "Your commercial real estate question is with Ryan.",
    description:
      "Ryan will follow up personally to understand the property, business need, and timing.",
  },
  general: {
    eyebrow: "Message received",
    title: "Thanks for reaching out.",
    description:
      "Ryan will read your message and follow up personally with a clear next step.",
  },
} as const;

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ inquiryType: string }>;
}) {
  const { inquiryType } = await params;
  const content =
    INQUIRY_TYPES[inquiryType as keyof typeof INQUIRY_TYPES];
  if (!content) notFound();

  return (
    <section className="section thank-you-page">
      <ConversionEvent
        name="generate_lead"
        parameters={{ lead_type: inquiryType }}
      />
      <div className="container">
        <div className="thank-you-card stack">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1 className="display">{content.title}</h1>
          <p className="lede">{content.description}</p>
          <div className="next-steps">
            <h2>What happens next</h2>
            <ol>
              <li>Ryan reviews the information you shared.</li>
              <li>He contacts you directly, with no call centre or bulk mailing list.</li>
              <li>You decide together whether a call, meeting, or property visit is useful.</li>
            </ol>
          </div>
          <div className="button-row">
            <Link className="button button-primary" href="/">
              Return home
            </Link>
            <a className="button button-secondary" href={SITE.phoneHref}>
              Call {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
