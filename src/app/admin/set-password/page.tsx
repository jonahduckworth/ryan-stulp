import type { Metadata } from "next";
import { PasswordSetupForm } from "@/components/admin/password-setup-form";

export const metadata: Metadata = {
  title: "Set admin password",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function SetAdminPasswordPage() {
  return (
    <main id="main-content" className="login-shell">
      <section className="login-card">
        <span className="eyebrow">Private administration</span>
        <div>
          <h1>Secure your account.</h1>
          <p className="lede">
            Choose a unique password with at least 12 characters.
          </p>
        </div>
        <PasswordSetupForm />
      </section>
    </main>
  );
}
