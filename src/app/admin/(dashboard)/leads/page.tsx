import type { Metadata } from "next";
import Link from "next/link";
import { getAdminLeads } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Leads" };

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads();
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
