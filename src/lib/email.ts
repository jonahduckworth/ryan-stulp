import "server-only";

import { Resend } from "resend";
import { SITE } from "@/lib/site";
import type { LeadInput } from "@/lib/schemas";

export async function notifyRyanOfLead(lead: LeadInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  const to = process.env.LEAD_NOTIFICATION_EMAIL ?? SITE.email;
  if (!apiKey || !from) return;

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
      "",
      lead.message,
    ].join("\n"),
  });

  if (error) {
    throw new Error("Lead notification provider rejected the message.");
  }
}
