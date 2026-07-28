import Link from "next/link";

export function CtaBand({
  title = "Your next move starts with a useful conversation.",
  href = "/contact",
  label = "Talk to Ryan",
}: {
  title?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section
      className="cta-band section-tight"
      data-analytics-location="cta_band"
    >
      <div className="container cta-grid">
        <h2>{title}</h2>
        <Link className="button button-light" href={href}>
          {label} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
