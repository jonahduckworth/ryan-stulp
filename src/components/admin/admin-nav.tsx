"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/listings", label: "Listings" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin">
        <strong>Ryan Stulp</strong>
        <span>Website administration</span>
      </Link>
      <nav className="admin-nav" aria-label="Admin navigation">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              className={active ? "is-active" : undefined}
              href={link.href}
              aria-current={active ? "page" : undefined}
              key={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-footer">
        <span className="admin-user">{email}</span>
        <form action={logout}>
          <button className="button admin-signout" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
