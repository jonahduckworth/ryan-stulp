import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const configured = hasPublicSupabaseEnv();
  return (
    <main id="main-content" className="login-shell">
      <section className="login-card">
        <span className="eyebrow">Private administration</span>
        <div>
          <h1>Welcome back.</h1>
          <p className="lede">Manage Ryan&apos;s listings and client inquiries.</p>
        </div>
        {configured ? (
          <LoginForm />
        ) : (
          <div className="stack">
            <p className="form-status" data-status="error">
              The secure database and authentication environment has not been
              connected yet. Follow the project setup guide, then return here.
            </p>
            <Link className="button button-secondary" href="/">
              Return to website
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
