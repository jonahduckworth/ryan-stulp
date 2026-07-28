import { verifyAdmin } from "@/lib/auth";
import { getAdminLeads } from "@/lib/data/admin";

function csvCell(value: string | null) {
  return `"${(value ?? "").replaceAll('"', '""').replaceAll(/\r?\n/g, " ")}"`;
}

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
      lead.message,
      lead.notes ?? "",
      lead.created_at,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");

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
