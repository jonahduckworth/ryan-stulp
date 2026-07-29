import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Calgary Areas and Communities",
  description:
    "Compare Calgary's inner-city, northwest, northeast, southwest, southeast, and surrounding-area real estate considerations with Ryan Stulp.",
  alternates: { canonical: "/calgary-areas" },
};

const AREA_GROUPS = [
  {
    key: "inner-city",
    name: "Inner city",
    number: "01",
    summary:
      "Established streets, redevelopment, infill, mature amenities, and varied housing stock close to the core.",
    considerations:
      "Compare lot context, renovation history, parking, future development, transit, and the premium attached to location.",
  },
  {
    key: "northwest",
    name: "Northwest Calgary",
    number: "02",
    summary:
      "A broad mix of established communities, newer development, post-secondary access, and routes toward the mountains.",
    considerations:
      "Compare commute patterns, schools and amenities, topography, housing age, and how far northwest you want the search to extend.",
  },
  {
    key: "northeast",
    name: "Northeast Calgary",
    number: "03",
    summary:
      "Diverse residential options, major transportation connections, employment access, and communities at many price points.",
    considerations:
      "Compare flight paths where relevant, transit and road access, property age, redevelopment, and the specific block—not only the community name.",
  },
  {
    key: "southwest",
    name: "Southwest Calgary",
    number: "04",
    summary:
      "Established neighbourhoods, newer southwest growth, varied terrain, and access to major amenities and employment areas.",
    considerations:
      "Compare road and transit access, slope and drainage, renovation or redevelopment context, school priorities, and commute trade-offs.",
  },
  {
    key: "southeast",
    name: "Southeast Calgary",
    number: "05",
    summary:
      "Newer communities, lake and river-area options, established southeast neighbourhoods, and growing commercial amenities.",
    considerations:
      "Compare flood information where applicable, community fees, development timelines, transportation, property age, and future construction.",
  },
  {
    key: "surrounding-area",
    name: "Rural and surrounding area",
    number: "06",
    summary:
      "Acreages, country residential properties, land, and communities beyond Calgary's municipal boundary.",
    considerations:
      "Compare services, water and wastewater systems, land use, access, travel time, maintenance, financing, and specialist inspections.",
  },
] as const;

export default function CalgaryAreasPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Calgary areas and communities",
          url: `${SITE.url}/calgary-areas`,
          about: {
            "@type": "City",
            name: "Calgary",
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: "Alberta",
            },
          },
        }}
      />
      <PageHero
        eyebrow="Calgary areas and communities"
        title="Choose the trade-offs before the neighbourhood."
        description="A good area search starts with daily life, property type, budget, travel, and future plans. Ryan helps you compare the parts of Calgary and the surrounding area that fit the decision you are actually making."
      />
      <section className="section">
        <div className="container intro-grid">
          <div className="stack">
            <span className="eyebrow">A better way to narrow the map</span>
            <h2 className="section-title">Start with how the location needs to work.</h2>
          </div>
          <div className="prose">
            <p>
              Community names are useful, but they are not the whole decision.
              The same budget can create very different trade-offs in property
              age, lot size, commute, future development, amenities, and
              maintenance.
            </p>
            <p>
              Use these broad areas as a starting point. Ryan can then help
              compare specific communities and properties using current market
              evidence rather than generic rankings.
            </p>
            <Link className="button button-primary" href="/contact">
              Build an area shortlist
            </Link>
          </div>
        </div>
      </section>
      <section className="section surface">
        <div className="container area-guide-grid">
          {AREA_GROUPS.map((area) => (
            <article
              className="area-guide-card"
              id={area.key}
              key={area.name}
            >
              <span>{area.number}</span>
              <h2>{area.name}</h2>
              <p>{area.summary}</p>
              <div>
                <strong>Questions to compare</strong>
                <p>{area.considerations}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <FaqSection
        title="Questions about choosing an area"
        items={[
          {
            question: "Can Ryan recommend the best Calgary neighbourhood?",
            answer:
              "Ryan can help compare communities against your budget, property needs, commute, timing, and priorities. The best fit depends on the trade-offs that matter to you.",
          },
          {
            question: "Does Ryan work outside Calgary?",
            answer:
              "Ryan works in Calgary and surrounding areas, including rural real estate. Share the specific location so he can confirm whether it fits his service area and the property need.",
          },
          {
            question: "Should I choose an area before getting pre-approved?",
            answer:
              "You can begin comparing areas early, but a realistic financing range makes the shortlist much more useful by showing what property choices are available in each location.",
          },
        ]}
      />
      <section className="section-tight">
        <div className="container area-next-step">
          <div>
            <span className="eyebrow">Continue exploring</span>
            <h2>See what is currently available.</h2>
          </div>
          <div className="button-row">
            <Link className="button button-secondary" href="/listings">
              Browse listings
            </Link>
            <Link className="button button-primary" href="/buying-calgary">
              Plan a purchase
            </Link>
          </div>
        </div>
      </section>
      <CtaBand
        title="Trying to decide where your search should begin?"
        href="/contact"
        label="Compare the options"
      />
    </>
  );
}
