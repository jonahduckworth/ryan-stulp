export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-hero">
      <div className="container stack">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display">{title}</h1>
        <p className="lede">{description}</p>
      </div>
    </header>
  );
}
