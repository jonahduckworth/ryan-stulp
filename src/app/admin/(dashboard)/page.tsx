import Link from "next/link";
import { getDashboardStats } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Listings, inquiries, and the work that needs attention.</p>
        </div>
        <Link className="button button-primary" href="/admin/listings/new">
          Add listing
        </Link>
      </header>
      <section className="stat-grid" aria-label="Website summary">
        <article className="stat-card">
          <span>All listings</span>
          <strong>{stats.listings}</strong>
        </article>
        <article className="stat-card">
          <span>Published</span>
          <strong>{stats.published}</strong>
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
