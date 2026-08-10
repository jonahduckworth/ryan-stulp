import { JsonLd } from "@/components/json-ld";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqSection({
  title = "Common questions",
  items,
}: {
  title?: string;
  items: FaqItem[];
}) {
  return (
    <section className="section">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />
      <div className="container faq-layout">
        <div className="stack">
          <span className="eyebrow">Useful context</span>
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
