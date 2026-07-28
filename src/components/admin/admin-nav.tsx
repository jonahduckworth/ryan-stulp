import Link from "next/link";
import { logout } from "@/app/actions/auth";

export function AdminNav({ email }: { email: string }) {
  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin">
        <strong>Ryan Stulp</strong>
        <span>Website administration</span>
      </Link>
      <nav className="admin-nav" aria-label="Admin navigation">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/listings">Listings</Link>
        <Link href="/admin/leads">Leads</Link>
        <Link href="/admin/settings">Settings</Link>
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
