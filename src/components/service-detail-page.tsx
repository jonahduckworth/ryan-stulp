import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/site";

export type ServicePoint = {
  title: string;
  description: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

export function ServiceDetailPage({
  eyebrow,
  title,
  description,
  serviceType,
  servicePath,
  introTitle,
  intro,
  points,
  faq,
  relatedLinks,
  ctaTitle,
  ctaLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  serviceType: string;
  servicePath: string;
  introTitle: string;
  intro: string[];
  points: ServicePoint[];
  faq: FaqItem[];
  relatedLinks: RelatedLink[];
  ctaTitle: string;
  ctaLabel: string;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: serviceType,
              serviceType,
              url: `${SITE.url}${servicePath}`,
              areaServed: {
                "@type": "City",
                name: "Calgary",
                containedInPlace: {
                  "@type": "AdministrativeArea",
                  name: "Alberta",
                },
              },
              provider: {
                "@id": `${SITE.url}/#agent`,
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE.url,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: eyebrow,
                  item: `${SITE.url}${servicePath}`,
                },
              ],
            },
          ],
        }}
      />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <section className="section">
        <div className="container intro-grid">
          <div className="stack">
            <span className="eyebrow">A practical starting point</span>
            <h2 className="section-title">{introTitle}</h2>
          </div>
          <div className="prose">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link className="button button-primary" href="/contact">
              Discuss your plans
            </Link>
          </div>
        </div>
      </section>
      <section className="section surface">
        <div className="container stack">
          <span className="eyebrow">What Ryan helps you evaluate</span>
          <div className="service-point-grid">
            {points.map((point, index) => (
              <article className="service-point" key={point.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{point.title}</h2>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <FaqSection items={faq} title="Questions clients often ask" />
      <section className="section-tight">
        <div className="container stack">
          <span className="eyebrow">Related guidance</span>
          <div className="related-link-grid">
            {relatedLinks.map((item) => (
              <Link className="related-link-card" href={item.href} key={item.href}>
                <h2>{item.label}</h2>
                <p>{item.description}</p>
                <strong>Explore this guide →</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title={ctaTitle} href="/contact" label={ctaLabel} />
    </>
  );
}
