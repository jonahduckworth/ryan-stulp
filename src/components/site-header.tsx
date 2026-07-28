import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { MobileNav } from "@/components/mobile-nav";

export function SiteHeader() {
  return (
    <>
      <div className="identity-strip">
        Ryan Stulp · Licensed real estate professional with {SITE.brokerage}
      </div>
      <header className="site-header">
        <div className="container nav-row">
          <Link className="brand" href="/" aria-label="Ryan Stulp home">
            <Image
              src="/brand/ryan-stulp-logo.png"
              alt="Ryan Stulp, The Real Estate District"
              width={1400}
              height={445}
              priority
            />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
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
