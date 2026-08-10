import type { Metadata } from "next";
import { ServiceDetailPage } from "@/components/service-detail-page";

export const metadata: Metadata = {
  title: "Rural Real Estate Near Calgary",
  description:
    "Practical guidance for acreages, rural homes, land, and country properties in the Calgary area with Ryan Stulp.",
  alternates: { canonical: "/rural-real-estate-calgary" },
};

export default function RuralRealEstatePage() {
  return (
    <ServiceDetailPage
      eyebrow="Rural real estate near Calgary"
      title="Understand the land, systems, and lifestyle together."
      description="Ryan helps buyers and sellers approach acreages, rural homes, land, and country properties with a clear plan for the questions that make rural real estate different."
      serviceType="Calgary-area rural real estate services"
      servicePath="/rural-real-estate-calgary"
      introTitle="Rural value is tied to details a city listing may never mention."
      intro={[
        "Access, water, wastewater systems, outbuildings, land use, services, maintenance, travel time, and future plans can materially change whether a rural property fits. A productive search makes those questions visible early.",
        "Ryan helps organize the real estate process and the appropriate property-specific due diligence. Specialized conclusions about wells, septic systems, environmental conditions, land use, structures, and financing should be verified by qualified professionals.",
      ]}
      points={[
        {
          title: "Clarify the intended use",
          description:
            "Define how you expect to live on, operate, improve, or eventually sell the property, not just the acreage or bedroom count.",
        },
        {
          title: "Map the property systems",
          description:
            "Identify water, wastewater, heating, access, structures, services, and maintenance questions that require records or specialist review.",
        },
        {
          title: "Review land and location",
          description:
            "Consider permitted use, boundaries, access, surroundings, travel time, seasonal conditions, and how future plans fit the property.",
        },
        {
          title: "Build the right conditions",
          description:
            "Allow enough time and the appropriate terms for inspections, documents, financing, and rural-property investigation.",
        },
      ]}
      faq={[
        {
          question: "What makes buying an acreage different from a city home?",
          answer:
            "Rural properties can involve private water and wastewater systems, additional structures, access and maintenance questions, land-use considerations, and different financing or insurance requirements.",
        },
        {
          question: "Does Ryan inspect wells, septic systems, or land?",
          answer:
            "No. Ryan helps identify the questions and coordinate the transaction, while qualified inspectors and other specialists provide technical conclusions.",
        },
        {
          question: "Can Ryan help sell a rural property?",
          answer:
            "Yes. Ryan is licensed for rural real estate in Alberta. A rural marketing plan should clearly present the land, systems, structures, access, and lifestyle details buyers need to understand.",
        },
      ]}
      relatedLinks={[
        {
          href: "/calgary-areas",
          label: "Calgary and area",
          description:
            "Compare broad parts of the city and the decision to look beyond it.",
        },
        {
          href: "/selling-calgary",
          label: "Selling strategy",
          description:
            "See how preparation, positioning, and negotiation fit together.",
        },
      ]}
      ctaTitle="Considering an acreage, rural home, or land?"
      ctaLabel="Talk through the property"
    />
  );
}
