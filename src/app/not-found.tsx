import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="section">
      <div className="narrow stack">
        <span className="eyebrow">404</span>
        <h1 className="display">That page is not here.</h1>
        <p className="lede">
          The property may no longer be public, or the address may have changed.
        </p>
        <div className="button-row">
          <Link className="button button-primary" href="/listings">
            View listings
          </Link>
          <Link className="button button-secondary" href="/">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
