import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminLeadForm } from "@/components/admin/lead-form";
import { getAdminLead } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Lead details" };

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getAdminLead(id);
  if (!lead) notFound();

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>{lead.name}</h1>
          <p>
            {lead.intent} inquiry received {formatDate(lead.created_at)}
          </p>
        </div>
        <div className="button-row">
          <a className="button button-secondary" href={`mailto:${lead.email}`}>
            Email
          </a>
          {lead.phone ? (
            <a className="button button-primary" href={`tel:${lead.phone}`}>
              Call
            </a>
          ) : null}
        </div>
      </header>
      <div className="lead-detail-grid">
        <section className="admin-panel detail-list">
          <div className="detail-row">
            <span>Email</span>
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
          </div>
          <div className="detail-row">
            <span>Phone</span>
            <p>{lead.phone ?? "Not provided"}</p>
          </div>
          <div className="detail-row">
            <span>Intent</span>
            <p>{lead.intent}</p>
          </div>
          <div className="detail-row">
            <span>Property</span>
            <p>{lead.property_address ?? "Not provided"}</p>
          </div>
          <div className="detail-row">
            <span>Source</span>
            <p>{lead.source}</p>
          </div>
          <div className="detail-row">
            <span>Message</span>
            <p>{lead.message}</p>
          </div>
        </section>
        <AdminLeadForm lead={lead} />
      </div>
    </div>
  );
}
