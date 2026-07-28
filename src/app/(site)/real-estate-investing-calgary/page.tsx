import type { Metadata } from "next";
import { ServiceDetailPage } from "@/components/service-detail-page";

export const metadata: Metadata = {
  title: "Real Estate Investing Calgary",
  description:
    "Evaluate Calgary real estate investment opportunities with clear property context, comparable evidence, due diligence, and risk-aware guidance.",
  alternates: { canonical: "/real-estate-investing-calgary" },
};

export default function RealEstateInvestingPage() {
  return (
    <ServiceDetailPage
      eyebrow="Real estate investing in Calgary"
      title="Make the property answer to the strategy."
      description="Ryan helps investors compare Calgary-area opportunities with a clear view of the property, market context, intended use, time horizon, and risks that could change the outcome."
      serviceType="Calgary real estate investment services"
      servicePath="/real-estate-investing-calgary"
      introTitle="An attractive listing is not automatically a sound investment."
      intro={[
        "A useful investment search begins with the objective: income, improvement, redevelopment, long-term appreciation, business use, or another clearly defined outcome. That objective determines which numbers and property characteristics deserve the most attention.",
        "Ryan helps gather the real estate evidence, compare alternatives, and keep assumptions visible. Financial, tax, legal, and construction conclusions remain with the appropriate professional advisors.",
      ]}
      points={[
        {
          title: "Set the investment criteria",
          description:
            "Define the intended outcome, capital limits, time horizon, property type, target area, and level of work you are prepared to manage.",
        },
        {
          title: "Pressure-test assumptions",
          description:
            "Compare the asking story with current competition, recent activity, property condition, likely costs, and exit considerations.",
        },
        {
          title: "Investigate the property",
          description:
            "Plan inspections, document review, zoning or use questions, and specialist input around the risks specific to the opportunity.",
        },
        {
          title: "Keep the decision disciplined",
          description:
            "Use clear conditions, deadlines, and decision points so enthusiasm does not replace evidence during negotiation.",
        },
      ]}
      faq={[
        {
          question: "Does Ryan provide investment returns or tax advice?",
          answer:
            "No. Ryan provides real estate representation and property-market context. Return projections, financing, tax, legal, and accounting advice should be verified with the appropriate professionals.",
        },
        {
          question: "Can Ryan help with residential and commercial investments?",
          answer:
            "Yes. Ryan works across residential, commercial, rural, builder, and development opportunities. The search and due diligence plan should be tailored to the property type.",
        },
        {
          question: "What information should I bring to the first conversation?",
          answer:
            "Bring the outcome you want, approximate budget, timeline, preferred property type or area, and any assumptions you are already using. It is fine if those details are still developing.",
        },
      ]}
      relatedLinks={[
        {
          href: "/commercial-real-estate-calgary",
          label: "Commercial real estate",
          description:
            "Start with the business requirement and the full property decision.",
        },
        {
          href: "/buying-calgary",
          label: "Buying in Calgary",
          description:
            "See the broader purchase process from preparation through possession.",
        },
      ]}
      ctaTitle="Have an opportunity you want to pressure-test?"
      ctaLabel="Discuss the investment"
    />
  );
}
