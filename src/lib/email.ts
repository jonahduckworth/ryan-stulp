import "server-only";

import { Resend } from "resend";
import { SITE } from "@/lib/site";
import type { LeadInput } from "@/lib/schemas";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function notifyRyanOfLead(lead: LeadInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  if (!apiKey || !from) return;
  const supabase = createSupabaseAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("notification_email")
    .eq("id", true)
    .maybeSingle();
  const to =
    settings?.notification_email ||
    process.env.LEAD_NOTIFICATION_EMAIL ||
    SITE.email;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: lead.email,
    subject: `New ${lead.intent} inquiry from ${lead.name}`,
    text: [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone ?? "Not provided"}`,
      `Intent: ${lead.intent}`,
      `Property: ${lead.propertyAddress ?? "Not provided"}`,
      `Source: ${lead.source}`,
      `Page: ${lead.pageUrl ?? "Not captured"}`,
      `Referrer: ${lead.referrer ?? "Direct or unavailable"}`,
      `Campaign: ${
        [lead.utmSource, lead.utmMedium, lead.utmCampaign]
          .filter(Boolean)
          .join(" / ") || "None"
      }`,
      "",
      lead.message,
    ].join("\n"),
  });

  if (error) {
    throw new Error("Lead notification provider rejected the message.");
  }
}
