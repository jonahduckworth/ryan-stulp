import Link from "next/link";
import { getDashboardStats } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const attentionItems = [
    stats.newLeads
      ? {
          label: `${stats.newLeads} new lead${stats.newLeads === 1 ? "" : "s"} to review`,
          detail: "Open each inquiry, make contact, and update its status.",
          href: "/admin/leads?status=new",
        }
      : null,
    stats.listingStatuses.draft
      ? {
          label: `${stats.listingStatuses.draft} draft listing${stats.listingStatuses.draft === 1 ? "" : "s"}`,
          detail: "Finish the details and photos, preview, then publish when ready.",
          href: "/admin/listings?status=draft",
        }
      : null,
    stats.draftUpdates
      ? {
          label: `${stats.draftUpdates} draft market update${stats.draftUpdates === 1 ? "" : "s"}`,
          detail: "Review the copy, preview the article, and publish when ready.",
          href: "/admin/market-updates?status=draft",
        }
      : null,
    !process.env.RESEND_API_KEY || !process.env.LEAD_EMAIL_FROM
      ? {
          label: "Lead email notifications need setup",
          detail: "The dashboard still captures leads, but email alerts are not ready.",
          href: "/admin/settings",
        }
      : null,
    !process.env.TURNSTILE_SECRET_KEY ||
    !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      ? {
          label: "Spam protection needs setup",
          detail: "Add the production Turnstile keys before launch.",
          href: "/admin/settings",
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    detail: string;
    href: string;
  }>;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Listings, inquiries, and the work that needs attention.</p>
        </div>
        <div className="admin-header-actions">
          <Link
            className="button button-secondary"
            href="/admin/market-updates/new"
          >
            Write update
          </Link>
          <Link className="button button-primary" href="/admin/listings/new">
            Add listing
          </Link>
        </div>
      </header>
      <section className="stat-grid" aria-label="Website summary">
        <article className="stat-card">
          <span>All listings</span>
          <strong>{stats.listings}</strong>
        </article>
        <article className="stat-card">
          <span>Published listings</span>
          <strong>{stats.published}</strong>
        </article>
        <article className="stat-card">
          <span>Published updates</span>
          <strong>{stats.publishedUpdates}</strong>
        </article>
        <article className="stat-card">
          <span>New leads</span>
          <strong>{stats.newLeads}</strong>
        </article>
        <article className="stat-card">
          <span>Total leads</span>
          <strong>{stats.totalLeads}</strong>
        </article>
      </section>
      <section className="admin-panel">
        <header className="admin-panel-header">
          <div>
            <h2>Needs attention</h2>
            <p>The shortest useful list of what to handle next.</p>
          </div>
        </header>
        {attentionItems.length ? (
          <div className="attention-list">
            {attentionItems.map((item) => (
              <Link className="attention-item" href={item.href} key={item.label}>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <h3>Everything is caught up</h3>
            <p>
              No new leads, draft listings, draft updates, or connection issues
              need action.
            </p>
          </div>
        )}
      </section>
      <section className="admin-panel">
        <header className="admin-panel-header">
          <div>
            <h2>Listing workflow</h2>
            <p>Every property by its current publication stage.</p>
          </div>
          <Link href="/admin/listings">Manage listings</Link>
        </header>
        <div className="workflow-grid">
          {Object.entries(stats.listingStatuses).map(([status, count]) => (
            <div className="workflow-count" key={status}>
              <span className="status-badge" data-status={status}>
                {status}
              </span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="admin-panel">
        <header className="admin-panel-header">
          <h2>Recent leads</h2>
          <Link href="/admin/leads">View all</Link>
        </header>
        {stats.recentLeads.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Intent</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td data-label="Name">
                      <Link href={`/admin/leads/${lead.id}`}>{lead.name}</Link>
                    </td>
                    <td data-label="Intent">{lead.intent}</td>
                    <td data-label="Status">
                      <span className="status-badge" data-status={lead.status}>
                        {lead.status}
                      </span>
                    </td>
                    <td data-label="Received">{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <h3>No leads yet</h3>
            <p>New contact and evaluation requests will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
