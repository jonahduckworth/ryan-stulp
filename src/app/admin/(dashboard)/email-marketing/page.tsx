import type { Metadata } from "next";
import Link from "next/link";
import { setNewsletterContactStatus } from "@/app/actions/newsletter";
import { NewsletterContactForm } from "@/components/admin/newsletter-contact-form";
import {
  getAdminNewsletterCampaigns,
  getAdminNewsletterContacts,
} from "@/lib/data/admin";
import { NEWSLETTER_DELIVERY_LABELS, newsletterContactName } from "@/lib/newsletter";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Email marketing" };

export default async function EmailMarketingPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    contact?: string;
    error?: string;
  }>;
}) {
  const [contacts, campaigns, query] = await Promise.all([
    getAdminNewsletterContacts(),
    getAdminNewsletterCampaigns(),
    searchParams,
  ]);
  const search = query.q?.trim().toLowerCase() ?? "";
  const status = ["subscribed", "unsubscribed", "suppressed"].includes(query.status ?? "")
    ? query.status
    : "";
  const filteredContacts = contacts.filter((contact) => {
    const searchable = `${contact.first_name} ${contact.last_name} ${contact.email}`.toLowerCase();
    return (!search || searchable.includes(search)) && (!status || contact.subscription_status === status);
  });
  const filtersActive = Boolean(search || status);
  const totals = {
    subscribed: contacts.filter((contact) => contact.subscription_status === "subscribed").length,
    unsubscribed: contacts.filter((contact) => contact.subscription_status === "unsubscribed").length,
    suppressed: contacts.filter((contact) => contact.subscription_status === "suppressed").length,
  };
  const notice = query.contact === "unsubscribe"
    ? "Subscriber removed from future market updates."
    : query.contact === "subscribe"
      ? "Subscriber restored."
      : query.contact === "sync"
        ? "Subscriber synced with Resend."
      : query.error
        ? "The subscriber could not be updated. Check the Resend connection and try again."
        : "";

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Email marketing</h1>
          <p>Manage subscribers and operational delivery results for Ryan&apos;s market updates.</p>
        </div>
      </header>

      {notice ? (
        <p className={query.error ? "form-error" : "admin-notice"} role="status">
          {notice}
        </p>
      ) : null}

      <section className="admin-summary-grid" aria-label="Subscriber summary">
        <div className="admin-summary-card">
          <span>Subscribed</span>
          <strong>{totals.subscribed.toLocaleString("en-CA")}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Unsubscribed</span>
          <strong>{totals.unsubscribed.toLocaleString("en-CA")}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Suppressed</span>
          <strong>{totals.suppressed.toLocaleString("en-CA")}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Campaigns sent</span>
          <strong>{campaigns.filter((campaign) => campaign.status === "sent").length}</strong>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Add subscriber</h2>
            <p>Add a former client who already agreed to receive Ryan&apos;s market updates.</p>
          </div>
        </div>
        <NewsletterContactForm />
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Campaigns</h2>
            <p>Publishing prepares an email. Ryan chooses when to send it.</p>
          </div>
        </div>
        {campaigns.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Market update</th><th>Status</th><th>Recipients</th><th>Delivered</th><th>Problems</th><th>Sent</th></tr></thead>
              <tbody>
                {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td data-label="Market update"><Link href={`/admin/email-marketing/campaigns/${campaign.id}`}>{campaign.market_update_title}</Link></td>
                      <td data-label="Status"><span className="status-badge" data-status={campaign.status}>{campaign.status}</span></td>
                      <td data-label="Recipients">{campaign.recipient_count || "—"}</td>
                      <td data-label="Delivered">{campaign.delivered_count}</td>
                      <td data-label="Problems">{campaign.problem_count}</td>
                      <td data-label="Sent">{campaign.sent_at ? formatDate(campaign.sent_at) : "Not sent"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty"><h3>No campaigns yet</h3><p>The first campaign will be prepared when Ryan publishes a market update.</p></div>
        )}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div><h2>Subscribers</h2><p>Unsubscribes and delivery suppressions are retained so imports cannot reactivate them.</p></div>
        </div>
        <form className="admin-filter-bar" method="get">
          <div className="field"><label htmlFor="subscriber-search">Search subscribers</label><input id="subscriber-search" name="q" defaultValue={query.q ?? ""} placeholder="Name or email" /></div>
          <div className="field"><label htmlFor="subscriber-status">Subscription status</label><select id="subscriber-status" name="status" defaultValue={status}><option value="">All statuses</option><option value="subscribed">Subscribed</option><option value="unsubscribed">Unsubscribed</option><option value="suppressed">Suppressed</option></select></div>
          <div className="admin-filter-actions"><button className="button button-primary" type="submit">Apply filters</button>{filtersActive ? <Link className="button button-secondary" href="/admin/email-marketing">Clear</Link> : null}</div>
        </form>
        <div className="admin-results-summary" aria-live="polite">Showing {filteredContacts.length} of {contacts.length} subscribers</div>
        {filteredContacts.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Subscriber</th><th>Subscription</th><th>Resend sync</th><th>Last delivery</th><th>Added</th><th>Action</th></tr></thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td data-label="Subscriber"><strong>{newsletterContactName(contact.first_name, contact.last_name)}</strong><br /><span className="form-note">{contact.email}</span>{contact.resend_sync_status === "failed" ? <><br /><span className="field-error">Resend sync needs attention</span></> : null}</td>
                    <td data-label="Subscription"><span className="status-badge" data-status={contact.subscription_status}>{contact.subscription_status}</span></td>
                    <td data-label="Resend sync"><span className="status-badge" data-status={contact.resend_sync_status}>{contact.resend_sync_status}</span></td>
                    <td data-label="Last delivery">{contact.last_delivery_status ? NEWSLETTER_DELIVERY_LABELS[contact.last_delivery_status] : "No email yet"}</td>
                    <td data-label="Added">{formatDate(contact.consent_confirmed_at)}</td>
                    <td data-label="Action">
                      {contact.subscription_status === "subscribed" && contact.resend_sync_status !== "synced" ? (
                        <form action={setNewsletterContactStatus}><input type="hidden" name="id" value={contact.id} /><input type="hidden" name="action" value="sync" /><button className="button button-secondary button-compact" type="submit">Retry sync</button></form>
                      ) : contact.subscription_status === "subscribed" ? (
                        <form action={setNewsletterContactStatus}><input type="hidden" name="id" value={contact.id} /><input type="hidden" name="action" value="unsubscribe" /><button className="button button-secondary button-compact" type="submit">Unsubscribe</button></form>
                      ) : contact.subscription_status === "unsubscribed" ? (
                        <form action={setNewsletterContactStatus}><input type="hidden" name="id" value={contact.id} /><input type="hidden" name="action" value="subscribe" /><button className="button button-secondary button-compact" type="submit">Restore</button></form>
                      ) : <span className="form-note">Resolve in Resend</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty"><h3>No subscribers match</h3><p>Clear the filters or add a subscriber above.</p></div>
        )}
      </section>
    </div>
  );
}
