"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasServiceSupabaseEnv } from "@/lib/supabase/env";
import { leadSchema } from "@/lib/schemas";
import { getRequestFingerprint, verifyTurnstile } from "@/lib/security";
import { notifyRyanOfLead } from "@/lib/email";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
  values?: {
    name: string;
    email: string;
    phone: string;
    intent: string;
    message: string;
    propertyAddress: string;
  };
};

export async function submitLead(
  _previousState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    intent: String(formData.get("intent") ?? ""),
    message: String(formData.get("message") ?? ""),
    propertyAddress: String(formData.get("propertyAddress") ?? ""),
  };
  const parsed = leadSchema.safeParse({
    ...values,
    source: formData.get("source"),
    website: formData.get("website"),
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
      message:
        "The contact service is being connected. Please call or email Ryan directly.",
      values,
    };
  }

  const turnstileValid = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstileValid) {
    return {
      status: "error",
      message: "We could not verify this submission. Please try again.",
      values,
    };
  }

  let fingerprint: string;
  try {
    fingerprint = await getRequestFingerprint();
  } catch {
    console.error("Lead fingerprint protection is not configured.");
    return {
      status: "error",
      message:
        "The contact service is being connected. Please call or email Ryan directly.",
      values,
    };
  }
  const supabase = createSupabaseAdminClient();
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("request_fingerprint", fingerprint)
    .gte("created_at", since);

  if ((count ?? 0) >= 4) {
    return {
      status: "error",
      message: "Too many recent submissions. Please call Ryan directly.",
      values,
    };
  }

  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    intent: parsed.data.intent,
    message: parsed.data.message,
    property_address: parsed.data.propertyAddress,
    source: parsed.data.source,
    request_fingerprint: fingerprint,
  });

  if (error) {
    console.error("Lead submission failed:", error.code);
    return {
      status: "error",
      message: "Something went wrong. Please call or email Ryan directly.",
      values,
    };
  }

  try {
    await notifyRyanOfLead(parsed.data);
  } catch {
    // The lead is safely stored even if email delivery is temporarily unavailable.
    console.error("Lead notification delivery failed.");
  }

  return {
    status: "success",
    message: "Thanks — Ryan will follow up personally.",
  };
}
