import { verifyAdmin } from "@/lib/auth";
import { getAdminLeads } from "@/lib/data/admin";
import { rowsToCsv } from "@/lib/csv";

export async function GET() {
  await verifyAdmin();
  const leads = await getAdminLeads();
  const rows = [
    [
      "Name",
      "Email",
      "Phone",
      "Intent",
      "Status",
      "Source",
      "Property",
      "Listing ID",
      "Page URL",
      "Referrer",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "UTM Term",
      "UTM Content",
      "Consent Version",
      "Message",
      "Notes",
      "Created",
    ],
    ...leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone ?? "",
      lead.intent,
      lead.status,
      lead.source,
      lead.property_address ?? "",
      lead.listing_id ?? "",
      lead.page_url ?? "",
      lead.referrer ?? "",
      lead.utm_source ?? "",
      lead.utm_medium ?? "",
      lead.utm_campaign ?? "",
      lead.utm_term ?? "",
      lead.utm_content ?? "",
      lead.consent_version,
      lead.message,
      lead.notes ?? "",
      lead.created_at,
    ]),
  ];
  const csv = rowsToCsv(rows);

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="ryan-stulp-leads-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
