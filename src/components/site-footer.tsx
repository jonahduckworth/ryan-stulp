import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h2>Real estate, with a clear next step.</h2>
          <p>
            Straight answers and practical guidance for buyers, sellers,
            investors, builders, and developers across Calgary and area.
          </p>
          <div className="button-row">
            <a className="button button-light" href={SITE.phoneHref}>
              {SITE.phoneDisplay}
            </a>
            <a className="button button-secondary" href={`mailto:${SITE.email}`}>
              Email Ryan
            </a>
          </div>
        </div>
        <nav className="footer-links" aria-label="Services">
          <strong>Explore</strong>
          <Link href="/listings">Listings</Link>
          <Link href="/buying-calgary">Buying in Calgary</Link>
          <Link href="/selling-calgary">Selling in Calgary</Link>
          <Link href="/home-evaluation">Home evaluation</Link>
        </nav>
        <nav className="footer-links" aria-label="Company">
          <strong>Ryan Stulp</strong>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <a href={SITE.facebook} rel="noreferrer" target="_blank">
            Facebook
          </a>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {SITE.licensedName}. All rights reserved.
        </span>
        <span>
          {SITE.brokerage} · {SITE.address}
        </span>
      </div>
    </footer>
  );
}
