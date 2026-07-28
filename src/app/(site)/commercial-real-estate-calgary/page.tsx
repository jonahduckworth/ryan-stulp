import type { Metadata } from "next";
import { ServiceDetailPage } from "@/components/service-detail-page";

export const metadata: Metadata = {
  title: "Commercial Real Estate Calgary",
  description:
    "Practical Calgary commercial real estate guidance for buyers, sellers, business owners, builders, developers, and investors.",
  alternates: { canonical: "/commercial-real-estate-calgary" },
};

export default function CommercialRealEstatePage() {
  return (
    <ServiceDetailPage
      eyebrow="Commercial real estate in Calgary"
      title="Start with the business need, not just the building."
      description="Ryan helps commercial buyers, sellers, business owners, builders, and developers clarify the property requirements, risks, and next steps behind a commercial real estate decision."
      serviceType="Calgary commercial real estate services"
      servicePath="/commercial-real-estate-calgary"
      introTitle="A commercial property has to work on more than paper."
      intro={[
        "Location, access, permitted use, operating costs, physical condition, timing, and future flexibility can matter as much as the headline price. Ryan helps organize those questions before they become expensive surprises.",
        "Every commercial transaction is different. Ryan keeps the real estate process clear and helps coordinate the right conversations with legal, financing, inspection, planning, and other professional advisors where they are needed.",
      ]}
      points={[
        {
          title: "Define the requirement",
          description:
            "Clarify intended use, size, location, access, timing, budget, and the conditions that would make a property workable.",
        },
        {
          title: "Compare the full cost",
          description:
            "Look beyond asking price or base rent to the operating, improvement, financing, and timing implications of each option.",
        },
        {
          title: "Plan due diligence",
          description:
            "Identify the property, document, condition, zoning, and professional-review questions that should be resolved before commitment.",
        },
        {
          title: "Negotiate a practical path",
          description:
            "Structure the conversation around the business objective, material risks, required conditions, and a realistic closing plan.",
        },
      ]}
      faq={[
        {
          question: "Does Ryan represent commercial buyers and sellers?",
          answer:
            "Ryan is licensed for commercial real estate in Alberta and works with commercial buyers, sellers, business owners, builders, developers, and investors. The exact scope starts with the property and business need.",
        },
        {
          question: "Can Ryan help evaluate leasing versus purchasing?",
          answer:
            "Ryan can help compare the real estate considerations and available options. Financing, tax, accounting, and legal advice should come from the appropriate licensed professionals.",
        },
        {
          question: "When should due diligence begin?",
          answer:
            "The key questions should be identified before an offer is finalized so the appropriate conditions, timelines, documents, and professional reviews can be planned.",
        },
      ]}
      relatedLinks={[
        {
          href: "/real-estate-investing-calgary",
          label: "Real estate investing",
          description:
            "Evaluate an opportunity against your strategy, risk tolerance, and intended hold.",
        },
        {
          href: "/listings",
          label: "Current opportunities",
          description:
            "Review Ryan's active, pending, and recently sold public listings.",
        },
      ]}
      ctaTitle="Have a commercial property or requirement to discuss?"
      ctaLabel="Talk through the opportunity"
    />
  );
}
