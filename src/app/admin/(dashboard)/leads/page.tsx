import type { Metadata } from "next";
import Link from "next/link";
import { getAdminLeads } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads" };

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; intent?: string }>;
}) {
  const [allLeads, query] = await Promise.all([getAdminLeads(), searchParams]);
  const search = query.q?.trim().toLowerCase() ?? "";
  const status = [
    "new",
    "contacted",
    "qualified",
    "won",
    "lost",
    "archived",
  ].includes(query.status ?? "")
    ? query.status
    : "";
  const intent = ["buy", "sell", "invest", "commercial", "general"].includes(
    query.intent ?? "",
  )
    ? query.intent
    : "";
  const leads = allLeads.filter((lead) => {
    const searchable = [lead.name, lead.email, lead.phone, lead.property_address]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (
      (!search || searchable.includes(search)) &&
      (!status || lead.status === status) &&
      (!intent || lead.intent === intent)
    );
  });
  const filtersActive = Boolean(search || status || intent);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Leads</h1>
          <p>Every website inquiry, with status and private follow-up notes.</p>
        </div>
        <Link className="button button-secondary" href="/admin/leads/export">
          Export CSV
        </Link>
      </header>
      <section className="admin-panel">
        <form className="admin-filter-bar" method="get">
          <div className="field">
            <label htmlFor="lead-search">Search leads</label>
            <input
              id="lead-search"
              name="q"
              defaultValue={query.q ?? ""}
              placeholder="Name, email, phone, or property"
            />
          </div>
          <div className="field">
            <label htmlFor="lead-status-filter">Status</label>
            <select
              id="lead-status-filter"
              name="status"
              defaultValue={status}
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="lead-intent-filter">Intent</label>
            <select
              id="lead-intent-filter"
              name="intent"
              defaultValue={intent}
            >
              <option value="">All intents</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="invest">Invest</option>
              <option value="commercial">Commercial</option>
              <option value="general">General</option>
            </select>
          </div>
          <div className="admin-filter-actions">
            <button className="button button-primary" type="submit">
              Apply filters
            </button>
            {filtersActive ? (
              <Link className="button button-secondary" href="/admin/leads">
                Clear
              </Link>
            ) : null}
          </div>
        </form>
        <div className="admin-results-summary" aria-live="polite">
          Showing {leads.length} of {allLeads.length} leads
        </div>
        {leads.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Intent</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td data-label="Name">
                      <Link href={`/admin/leads/${lead.id}`}>{lead.name}</Link>
                      <br />
                      <span className="form-note">{lead.email}</span>
                    </td>
                    <td data-label="Intent">{lead.intent}</td>
                    <td data-label="Status">
                      <span className="status-badge" data-status={lead.status}>
                        {lead.status}
                      </span>
                    </td>
                    <td data-label="Source">{lead.source}</td>
                    <td data-label="Received">{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filtersActive ? (
          <div className="admin-empty">
            <h2>No leads match those filters</h2>
            <p>Clear the filters or try a broader search.</p>
            <Link className="button button-secondary" href="/admin/leads">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="admin-empty">
            <h2>No leads yet</h2>
            <p>Contact and evaluation submissions will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
