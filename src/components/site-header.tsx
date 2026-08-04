import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS, type PublicSiteIdentity } from "@/lib/site";
import { MobileNav } from "@/components/mobile-nav";

export function SiteHeader({ identity }: { identity: PublicSiteIdentity }) {
  return (
    <>
      <div className="identity-strip">
        Ryan Stulp · Licensed real estate professional with {identity.brokerage}
      </div>
      <header className="site-header">
        <div className="container nav-row">
          <Link className="brand" href="/" aria-label="Ryan Stulp home">
            <Image
              src="/brand/ryan-stulp-horizontal-color.png"
              alt={`Ryan Stulp, ${identity.brokerage}`}
              width={2800}
              height={503}
              priority
            />
          </Link>
          <nav
            className="desktop-nav"
            aria-label="Primary navigation"
            data-analytics-location="site_header"
          >
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="button button-primary" href="/contact">
              Start a conversation
            </Link>
          </nav>
          <MobileNav />
        </div>
      </header>
    </>
  );
}
