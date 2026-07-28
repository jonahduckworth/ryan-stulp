import type { Metadata } from "next";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getAdminSiteSettings } from "@/lib/data/admin";
import { resolveSiteIdentity, SITE } from "@/lib/site";
import { hasPublicSupabaseEnv, hasServiceSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Settings" };

function State({ ready }: { ready: boolean }) {
  return (
    <span className="status-badge" data-status={ready ? "active" : "new"}>
      {ready ? "Connected" : "Needs setup"}
    </span>
  );
}

export default async function SettingsPage() {
  const settings = await getAdminSiteSettings();
  const identity = resolveSiteIdentity(settings);
  const checks = [
    ["Database and authentication", hasPublicSupabaseEnv()],
    ["Secure lead capture", hasServiceSupabaseEnv()],
    [
      "Lead email notifications",
      Boolean(process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_FROM),
    ],
    [
      "Spam protection",
      Boolean(
        process.env.TURNSTILE_SECRET_KEY &&
          process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      ),
    ],
    ["Google Analytics", Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)],
  ] as const;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Settings</h1>
          <p>Read-only connection health. Secrets are managed in hosting.</p>
        </div>
      </header>
      <section className="admin-panel config-list">
        {checks.map(([label, ready]) => (
          <div className="config-row" key={label}>
            <strong>{label}</strong>
            <State ready={ready} />
          </div>
        ))}
      </section>
      <section className="admin-panel">
        <div className="admin-panel-header">
          <h2>Website identity</h2>
        </div>
        <div className="detail-list">
          <div className="detail-row">
            <span>Public website</span>
            <a href="/" target="_blank">
              Open website ↗
            </a>
          </div>
          <div className="detail-row">
            <span>Data exports</span>
            <p>Lead CSV export is available from the Leads page.</p>
          </div>
        </div>
      </section>
      <SiteSettingsForm
        identity={identity}
        notificationEmail={
          settings?.notification_email ||
          process.env.LEAD_NOTIFICATION_EMAIL ||
          SITE.email
        }
      />
    </div>
  );
}
