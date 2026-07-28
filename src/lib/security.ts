import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

export async function getRequestFingerprint() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headerStore.get("x-real-ip") || "unknown";
  const salt = process.env.LEAD_FINGERPRINT_SALT;
  if (!salt && process.env.NODE_ENV === "production") {
    throw new Error("Lead fingerprint protection is not configured.");
  }
  const effectiveSalt = salt ?? "development-only-salt";
  return createHash("sha256").update(`${effectiveSalt}:${ip}`).digest("hex");
}

export async function verifyTurnstile(token?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
