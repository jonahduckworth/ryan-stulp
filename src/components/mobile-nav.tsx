"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/site";

export function MobileNav() {
  const pathname = usePathname();
  return <MobileNavMenu key={pathname} />;
}

function MobileNavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <nav
          id="mobile-navigation"
          className="mobile-panel"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/home-evaluation">Home evaluation</Link>
          <Link href="/contact">Contact Ryan</Link>
        </nav>
      ) : null}
    </div>
  );
}
