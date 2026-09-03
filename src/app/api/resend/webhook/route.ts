import { NextResponse } from "next/server";
import {
  getResendMarketUpdateSubscription,
  verifyResendWebhook,
} from "@/lib/newsletter-resend";
import {
  deliveryStatusFromWebhook,
  newsletterDeliveryDetail,
  normalizeNewsletterEmail,
} from "@/lib/newsletter";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function invalidWebhook() {
  return NextResponse.json({ error: "Invalid webhook." }, { status: 400 });
}

export async function POST(request: Request) {
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!id || !timestamp || !signature) return invalidWebhook();

  const payload = await request.text();
  let event;
  try {
    event = verifyResendWebhook({ payload, id, timestamp, signature });
  } catch {
    return invalidWebhook();
  }

  const supabase = createSupabaseAdminClient();
  const { data: existing } = await supabase
    .from("resend_webhook_events")
    .select("processing_status")
    .eq("event_id", id)
    .maybeSingle();
  if (existing?.processing_status === "processed") {
    return NextResponse.json({ received: true });
  }

  const eventAt = event.created_at || new Date().toISOString();
  const { error: eventError } = await supabase
    .from("resend_webhook_events")
    .upsert({
      event_id: id,
      event_type: event.type,
      event_at: eventAt,
      processing_status: "processing",
      failure_message: null,
      processed_at: null,
    });
  if (eventError) {
    return NextResponse.json({ error: "Webhook could not be recorded." }, { status: 500 });
  }

  try {
    const deliveryStatus = deliveryStatusFromWebhook(event.type);
    if (deliveryStatus && "broadcast_id" in event.data && event.data.broadcast_id) {
      for (const recipient of event.data.to) {
        const { error } = await supabase.rpc("record_newsletter_delivery_event", {
          p_broadcast_id: event.data.broadcast_id,
          p_resend_email_id: event.data.email_id,
          p_recipient_email: normalizeNewsletterEmail(recipient),
          p_status: deliveryStatus,
          p_status_at: event.data.created_at || eventAt,
          p_detail: newsletterDeliveryDetail(
            event.type,
            event.data as unknown as Record<string, unknown>,
          ),
        });
        if (error) throw error;
      }
    }

    if (event.type === "contact.created" || event.type === "contact.updated") {
      const email = normalizeNewsletterEmail(event.data.email);
      const { data: contact, error: contactError } = await supabase
        .from("newsletter_contacts")
        .select("id, subscription_status")
        .eq("email", email)
        .maybeSingle();
      if (contactError) throw contactError;
      if (contact) {
        const preference = await getResendMarketUpdateSubscription(email);
        const remainsSuppressed = contact.subscription_status === "suppressed";
        const subscribed = preference.subscribed && !remainsSuppressed;
        const { error: updateError } = await supabase
          .from("newsletter_contacts")
          .update({
            subscription_status: remainsSuppressed
              ? "suppressed"
              : subscribed
                ? "subscribed"
                : "unsubscribed",
            unsubscribed_at: remainsSuppressed || subscribed ? null : eventAt,
            resend_contact_id: preference.contactId,
            resend_sync_status: "synced",
            resend_sync_error: null,
          })
          .eq("id", contact.id);
        if (updateError) throw updateError;
      }
    }

    if (event.type === "contact.deleted") {
      const email = normalizeNewsletterEmail(event.data.email);
      const { error } = await supabase
        .from("newsletter_contacts")
        .update({
          subscription_status: "unsubscribed",
          unsubscribed_at: eventAt,
          suppressed_at: null,
          suppression_reason: null,
          resend_contact_id: null,
          resend_sync_status: "pending",
          resend_sync_error: "Contact was deleted in Resend.",
        })
        .eq("email", email)
        .neq("subscription_status", "suppressed");
      if (error) throw error;
    }

    await supabase
      .from("resend_webhook_events")
      .update({
        processing_status: "processed",
        processed_at: new Date().toISOString(),
      })
      .eq("event_id", id);
    return NextResponse.json({ received: true });
  } catch {
    console.error("Resend webhook processing failed.");
    await supabase
      .from("resend_webhook_events")
      .update({
        processing_status: "failed",
        failure_message: "Webhook processing failed and is safe to retry.",
      })
      .eq("event_id", id);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
