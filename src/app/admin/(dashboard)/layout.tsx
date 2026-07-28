import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { verifyAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Ryan Stulp Admin",
  },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await verifyAdmin();
  return (
    <div className="admin-body">
      <div className="admin-shell">
        <AdminNav email={admin.email} />
        <main id="main-content" className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
