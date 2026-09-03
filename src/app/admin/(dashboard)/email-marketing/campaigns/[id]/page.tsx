import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterCampaignControls } from "@/components/admin/newsletter-campaign-controls";
import {
  getAdminNewsletterCampaign,
  getAdminNewsletterContacts,
  getAdminNewsletterDeliveries,
} from "@/lib/data/admin";
import { NEWSLETTER_DELIVERY_LABELS } from "@/lib/newsletter";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Email campaign" };

export default async function NewsletterCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [campaign, deliveries, contacts] = await Promise.all([
    getAdminNewsletterCampaign(id),
    getAdminNewsletterDeliveries(id),
    getAdminNewsletterContacts(),
  ]);
  if (!campaign) notFound();
  const counts = new Map<string, number>();
  for (const delivery of deliveries) counts.set(delivery.status, (counts.get(delivery.status) ?? 0) + 1);
  const recipientCount = contacts.filter((contact) => contact.subscription_status === "subscribed" && contact.resend_sync_status === "synced").length;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div><p className="eyebrow">Email campaign</p><h1>{campaign.market_update_title}</h1><p>{campaign.preview_text}</p></div>
        <Link className="button button-secondary" href="/admin/email-marketing">Back to email marketing</Link>
      </header>
      <section className="admin-summary-grid" aria-label="Campaign delivery summary">
        <div className="admin-summary-card"><span>Recipients</span><strong>{campaign.recipient_count || recipientCount}</strong></div>
        <div className="admin-summary-card"><span>Delivered</span><strong>{counts.get("delivered") ?? 0}</strong></div>
        <div className="admin-summary-card"><span>Delayed</span><strong>{counts.get("delivery_delayed") ?? 0}</strong></div>
        <div className="admin-summary-card"><span>Problems</span><strong>{(counts.get("bounced") ?? 0) + (counts.get("failed") ?? 0) + (counts.get("suppressed") ?? 0) + (counts.get("complained") ?? 0)}</strong></div>
      </section>
      {campaign.status === "prepared" || campaign.status === "failed" ? (
        <section className="admin-panel">
          <NewsletterCampaignControls
            campaignId={campaign.id}
            title={campaign.market_update_title}
            recipientCount={recipientCount}
            sender={process.env.NEWSLETTER_EMAIL_FROM || "Ryan Stulp <updates@ryanstulp.ca>"}
            replyTo={process.env.NEWSLETTER_REPLY_TO || SITE.email}
          />
        </section>
      ) : null}
      {campaign.failure_message ? <p className="form-error">{campaign.failure_message}</p> : null}
      <section className="admin-panel">
        <div className="admin-panel-header"><div><h2>Recipient delivery</h2><p>Operational events reported by Resend. Delivered means accepted by the recipient&apos;s mail server.</p></div></div>
        {deliveries.length ? (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Recipient</th><th>Status</th><th>Updated</th><th>Details</th></tr></thead><tbody>{deliveries.map((delivery) => <tr key={delivery.id}><td data-label="Recipient">{delivery.recipient_email}</td><td data-label="Status"><span className="status-badge" data-status={delivery.status}>{NEWSLETTER_DELIVERY_LABELS[delivery.status]}</span></td><td data-label="Updated">{formatDate(delivery.status_at)}</td><td data-label="Details">{delivery.detail || "—"}</td></tr>)}</tbody></table></div>
        ) : (
          <div className="admin-empty"><h3>No delivery events yet</h3><p>Statuses will appear here after Resend begins processing the campaign.</p></div>
        )}
      </section>
    </div>
  );
}
