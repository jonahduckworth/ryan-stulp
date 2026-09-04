"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/auth";
import {
  createNewsletterBroadcast,
  sendNewsletterBroadcast,
  sendNewsletterTest,
  syncSubscribedContactToResend,
  unsubscribeContactInResend,
} from "@/lib/newsletter-resend";
import {
  NEWSLETTER_CONSENT_VERSION,
  normalizeNewsletterEmail,
} from "@/lib/newsletter";
import {
  adminNewsletterContactSchema,
  newsletterCampaignActionSchema,
  newsletterContactStatusSchema,
  publicNewsletterSignupSchema,
} from "@/lib/schemas";
import { getRequestFingerprint, verifyTurnstile } from "@/lib/security";
import { resolveSiteIdentity } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasServiceSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  NewsletterCampaign,
  NewsletterContact,
  SiteSettings,
} from "@/lib/types";

export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
  values?: { firstName: string; lastName: string; email: string };
};

export type NewsletterCampaignActionState = {
  status: "idle" | "success" | "error";
  message: string;
  action?: "test" | "send";
};

type ContactDatabase = ReturnType<typeof createSupabaseAdminClient>;

async function persistSubscribedContact({
  supabase,
  firstName,
  lastName,
  email,
  consentSource,
  confirmedBy,
  actorId,
}: {
  supabase: ContactDatabase;
  firstName: string;
  lastName: string;
  email: string;
  consentSource: "public_signup" | "admin_added";
  confirmedBy: string;
  actorId?: string;
}) {
  const { data: existing, error: readError } = await supabase
    .from("newsletter_contacts")
    .select("id, subscription_status")
    .eq("email", email)
    .maybeSingle();
  if (readError) throw new Error("The subscriber record could not be checked.");
  if (existing?.subscription_status === "suppressed") {
    throw new Error("This email is suppressed after a delivery problem.");
  }

  const payload = {
    first_name: firstName,
    last_name: lastName,
    email,
    subscription_status: "subscribed",
    consent_source: consentSource,
    consent_confirmed_by: confirmedBy,
    consent_confirmed_at: new Date().toISOString(),
    consent_batch_id: null,
    unsubscribed_at: null,
    suppressed_at: null,
    suppression_reason: null,
    resend_sync_status: "pending",
    resend_sync_error: null,
    updated_by: actorId ?? null,
  };
  const result = existing
    ? await supabase
        .from("newsletter_contacts")
        .update(payload)
        .eq("id", existing.id)
    : await supabase.from("newsletter_contacts").insert({
        ...payload,
        created_by: actorId ?? null,
      });
  if (result.error) throw new Error("The subscriber record could not be saved.");
}

async function syncPreparedContact({
  supabase,
  firstName,
  lastName,
  email,
}: {
  supabase: ContactDatabase;
  firstName: string;
  lastName: string;
  email: string;
}) {
  try {
    const resendContactId = await syncSubscribedContactToResend({
      email,
      firstName,
      lastName,
    });
    const { error } = await supabase
      .from("newsletter_contacts")
      .update({
        resend_contact_id: resendContactId,
        resend_sync_status: "synced",
        resend_sync_error: null,
      })
      .eq("email", email);
    if (error) throw error;
  } catch (error) {
    await supabase
      .from("newsletter_contacts")
      .update({
        resend_sync_status: "failed",
        resend_sync_error: "Resend contact sync failed.",
      })
      .eq("email", email);
    throw error;
  }
}

export async function subscribeToMarketUpdates(
  _previousState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const values = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  const parsed = publicNewsletterSignupSchema.safeParse({
    ...values,
    website: formData.get("website") ?? "",
    turnstileToken: formData.get("cf-turnstile-response") || undefined,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }
  if (!hasServiceSupabaseEnv()) {
    return {
      status: "error",
      message: "Email updates are being connected. Please try again later.",
      values,
    };
  }
  if (!(await verifyTurnstile(parsed.data.turnstileToken))) {
    return {
      status: "error",
      message: "We could not verify this subscription. Please try again.",
      values,
    };
  }

  const email = normalizeNewsletterEmail(parsed.data.email);
  const supabase = createSupabaseAdminClient();
  try {
    const fingerprint = await getRequestFingerprint();
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count, error: rateLimitError } = await supabase
      .from("newsletter_signup_attempts")
      .select("id", { count: "exact", head: true })
      .eq("request_fingerprint", fingerprint)
      .gte("created_at", since);
    if (rateLimitError) throw rateLimitError;
    if ((count ?? 0) >= 5) {
      return {
        status: "error",
        message: "Too many recent subscription attempts. Please try again later.",
        values,
      };
    }
    const { error: attemptError } = await supabase
      .from("newsletter_signup_attempts")
      .insert({ request_fingerprint: fingerprint });
    if (attemptError) throw attemptError;

    await persistSubscribedContact({
      supabase,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email,
      consentSource: "public_signup",
      confirmedBy: `Website signup (${NEWSLETTER_CONSENT_VERSION})`,
    });
    await syncPreparedContact({
      supabase,
      email,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    });
    return {
      status: "success",
      message: "You're subscribed to Ryan's market updates.",
    };
  } catch {
    console.error("Newsletter signup failed.");
    return {
      status: "error",
      message: "We could not complete your subscription. Please try again.",
      values,
    };
  }
}

export async function addNewsletterContact(
  _previousState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const admin = await verifyAdmin();
  const values = {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  const parsed = adminNewsletterContactSchema.safeParse({
    ...values,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted subscriber fields.",
      errors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  const email = normalizeNewsletterEmail(parsed.data.email);
  const supabase = createSupabaseAdminClient();
  try {
    await persistSubscribedContact({
      supabase,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email,
      consentSource: "admin_added",
      confirmedBy: "Ryan Stulp",
      actorId: admin.id,
    });
    await syncPreparedContact({
      supabase,
      email,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    });
  } catch {
    console.error("Admin newsletter contact creation failed.");
    return {
      status: "error",
      message: "The subscriber could not be added. Check the Resend setup and try again.",
      values,
    };
  }

  revalidatePath("/admin/email-marketing");
  return { status: "success", message: "Subscriber added." };
}

export async function setNewsletterContactStatus(formData: FormData) {
  const admin = await verifyAdmin();
  const parsed = newsletterContactStatusSchema.safeParse({
    id: formData.get("id"),
    action: formData.get("action"),
  });
  if (!parsed.success) redirect("/admin/email-marketing?error=invalid-contact");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("newsletter_contacts")
    .select("*")
    .eq("id", parsed.data.id)
    .maybeSingle();
  if (error || !data) redirect("/admin/email-marketing?error=missing-contact");
  const contact = data as NewsletterContact;
  const invalidTransition =
    contact.subscription_status === "suppressed" ||
    (parsed.data.action === "subscribe" && contact.subscription_status !== "unsubscribed") ||
    (parsed.data.action === "unsubscribe" && contact.subscription_status !== "subscribed") ||
    (parsed.data.action === "sync" &&
      (contact.subscription_status !== "subscribed" || contact.resend_sync_status === "synced"));
  if (invalidTransition) {
    redirect("/admin/email-marketing?error=invalid-contact-state");
  }

  try {
    if (parsed.data.action === "unsubscribe") {
      await unsubscribeContactInResend(contact.email);
      const { error: updateError } = await supabase
        .from("newsletter_contacts")
        .update({
          subscription_status: "unsubscribed",
          unsubscribed_at: new Date().toISOString(),
          suppressed_at: null,
          suppression_reason: null,
          resend_sync_status: "synced",
          resend_sync_error: null,
          updated_by: admin.id,
        })
        .eq("id", contact.id);
      if (updateError) throw new Error("local-update-failed");
    } else {
      const restoredConsent = parsed.data.action === "subscribe"
        ? {
            consent_source: "admin_added",
            consent_confirmed_by: "Ryan Stulp",
            consent_confirmed_at: new Date().toISOString(),
          }
        : {};
      const resendContactId = await syncSubscribedContactToResend({
        email: contact.email,
        firstName: contact.first_name,
        lastName: contact.last_name,
      });
      const { error: updateError } = await supabase
        .from("newsletter_contacts")
        .update({
          subscription_status: "subscribed",
          unsubscribed_at: null,
          suppressed_at: null,
          suppression_reason: null,
          resend_contact_id: resendContactId,
          resend_sync_status: "synced",
          resend_sync_error: null,
          ...restoredConsent,
          updated_by: admin.id,
        })
        .eq("id", contact.id);
      if (updateError) throw new Error("local-update-failed");
    }
  } catch {
    console.error("Newsletter contact status update failed.");
    redirect("/admin/email-marketing?error=contact-sync");
  }

  revalidatePath("/admin/email-marketing");
  redirect(`/admin/email-marketing?contact=${parsed.data.action}`);
}

export async function runNewsletterCampaignAction(
  _previousState: NewsletterCampaignActionState,
  formData: FormData,
): Promise<NewsletterCampaignActionState> {
  const admin = await verifyAdmin();
  const parsed = newsletterCampaignActionSchema.safeParse({
    campaignId: formData.get("campaignId"),
    action: formData.get("action"),
  });
  if (!parsed.success) {
    return { status: "error", message: "The email campaign could not be identified." };
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: rawCampaign, error: campaignError }, { data: settings }] =
    await Promise.all([
      supabase
        .from("newsletter_campaigns")
        .select("*")
        .eq("id", parsed.data.campaignId)
        .maybeSingle(),
      supabase.from("site_settings").select("*").eq("id", true).maybeSingle(),
    ]);
  if (campaignError || !rawCampaign) {
    return { status: "error", message: "The email campaign was not found." };
  }
  const campaign = rawCampaign as NewsletterCampaign;
  const identity = resolveSiteIdentity(settings as SiteSettings | null);

  if (parsed.data.action === "test") {
    try {
      await sendNewsletterTest(campaign, identity);
      return {
        status: "success",
        action: "test",
        message: `Test sent to ${process.env.NEWSLETTER_REPLY_TO || identity.email}.`,
      };
    } catch {
      console.error("Newsletter test delivery failed.");
      return {
        status: "error",
        action: "test",
        message: "The test email could not be sent. Check the Resend setup and try again.",
      };
    }
  }

  if (!(["prepared", "failed"] as string[]).includes(campaign.status)) {
    return {
      status: "error",
      action: "send",
      message: campaign.status === "sent"
        ? "This campaign has already been sent."
        : "This campaign is already being sent.",
    };
  }

  const { count } = await supabase
    .from("newsletter_contacts")
    .select("id", { count: "exact", head: true })
    .eq("subscription_status", "subscribed")
    .eq("resend_sync_status", "synced");
  const recipientCount = count ?? 0;
  if (recipientCount === 0) {
    return {
      status: "error",
      action: "send",
      message: "There are no synced subscribers to email.",
    };
  }

  const { data: claimed, error: claimError } = await supabase
    .from("newsletter_campaigns")
    .update({
      status: "sending",
      failure_message: null,
      recipient_count: recipientCount,
      updated_by: admin.id,
    })
    .eq("id", campaign.id)
    .in("status", ["prepared", "failed"])
    .select("*")
    .maybeSingle();
  if (claimError || !claimed) {
    return {
      status: "error",
      action: "send",
      message: "Another send may already be in progress. Refresh before trying again.",
    };
  }

  let broadcastId = campaign.resend_broadcast_id;
  try {
    if (!broadcastId) {
      broadcastId = await createNewsletterBroadcast(
        claimed as NewsletterCampaign,
        identity,
      );
      const { error: storeError } = await supabase
        .from("newsletter_campaigns")
        .update({ resend_broadcast_id: broadcastId })
        .eq("id", campaign.id);
      if (storeError) throw new Error("broadcast-id-not-stored");
    }
    await sendNewsletterBroadcast(broadcastId);
    const { error: sentError } = await supabase
      .from("newsletter_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        failure_message: null,
        updated_by: admin.id,
      })
      .eq("id", campaign.id);
    if (sentError) throw new Error("sent-status-not-stored");
  } catch {
    console.error("Newsletter campaign send failed.");
    await supabase
      .from("newsletter_campaigns")
      .update({
        status: "failed",
        failure_message:
          "Resend did not confirm the campaign send. Review the Resend broadcast before retrying.",
        updated_by: admin.id,
      })
      .eq("id", campaign.id);
    revalidatePath("/admin/email-marketing");
    return {
      status: "error",
      action: "send",
      message:
        "Resend did not confirm the send. Review the campaign in Resend before retrying.",
    };
  }

  revalidatePath("/admin/email-marketing");
  revalidatePath("/admin/market-updates/[id]", "page");
  return {
    status: "success",
    action: "send",
    message: `Campaign sent to ${recipientCount.toLocaleString("en-CA")} subscribers.`,
  };
}
