import {
  parseMarketUpdateBody,
  parseMarketUpdateInline,
} from "@/lib/market-updates";
import type {
  NewsletterDeliveryStatus,
} from "@/lib/types";
import type { PublicSiteIdentity } from "@/lib/site";

export const NEWSLETTER_CONSENT_VERSION = "2026-09-03";

export function normalizeNewsletterEmail(email: string) {
  return email.trim().toLowerCase();
}

export function newsletterContactName(firstName: string, lastName: string) {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function absoluteUrl(href: string, siteUrl: string) {
  return href.startsWith("/") ? new URL(href, siteUrl).toString() : href;
}

function renderInlineHtml(text: string, siteUrl: string) {
  return parseMarketUpdateInline(text)
    .map((part) =>
      part.type === "text"
        ? escapeHtml(part.text)
        : `<a href="${escapeHtml(absoluteUrl(part.href, siteUrl))}" style="color:#a9152d;text-decoration:underline;text-underline-offset:3px">${escapeHtml(part.text)}</a>`,
    )
    .join("");
}

function renderArticleHtml(body: string, siteUrl: string) {
  return parseMarketUpdateBody(body)
    .map((block) => {
      if (block.type === "heading") {
        const size = block.level === 2 ? 24 : 20;
        return `<h${block.level} style="color:#111111;font-family:Arial,sans-serif;font-size:${size}px;line-height:1.3;margin:30px 0 12px">${renderInlineHtml(block.text, siteUrl)}</h${block.level}>`;
      }
      if (block.type === "list") {
        return `<ul style="color:#272727;font-family:Arial,sans-serif;font-size:17px;line-height:1.65;margin:0 0 22px;padding-left:24px">${block.items
          .map((item) => `<li style="margin:0 0 8px">${renderInlineHtml(item, siteUrl)}</li>`)
          .join("")}</ul>`;
      }
      return `<p style="color:#272727;font-family:Arial,sans-serif;font-size:17px;line-height:1.65;margin:0 0 22px">${renderInlineHtml(block.text, siteUrl)}</p>`;
    })
    .join("");
}

export function buildNewsletterEmail({
  title,
  excerpt,
  body,
  slug,
  coverImageUrl,
  identity,
}: {
  title: string;
  excerpt: string;
  body: string;
  slug: string;
  coverImageUrl: string | null;
  identity: PublicSiteIdentity;
}) {
  const articleUrl = new URL(`/market-updates/${slug}`, identity.url).toString();
  const image = coverImageUrl
    ? `<img src="${escapeHtml(absoluteUrl(coverImageUrl, identity.url))}" alt="" width="640" style="display:block;height:auto;margin:0 0 28px;max-width:100%;width:100%" />`
    : "";
  const html = `<!doctype html>
<html lang="en">
  <body style="background:#f8f6f2;margin:0;padding:0">
    <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(excerpt)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f6f2;padding:24px 12px">
      <tr><td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #d8d3cb;max-width:640px;width:100%">
          <tr><td style="border-top:5px solid #d51f3c;padding:32px 34px 14px">
            <p style="color:#a9152d;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:.12em;margin:0 0 14px;text-transform:uppercase">Calgary market update</p>
            <h1 style="color:#111111;font-family:Arial,sans-serif;font-size:34px;line-height:1.15;margin:0 0 16px">${escapeHtml(title)}</h1>
            <p style="color:#5a5a57;font-family:Arial,sans-serif;font-size:18px;line-height:1.55;margin:0 0 24px">${escapeHtml(excerpt)}</p>
          </td></tr>
          <tr><td style="padding:0 34px 34px">
            ${image}
            ${renderArticleHtml(body, identity.url)}
            <p style="margin:32px 0"><a href="${escapeHtml(articleUrl)}" style="background:#d51f3c;color:#ffffff;display:inline-block;font-family:Arial,sans-serif;font-size:16px;font-weight:700;padding:14px 20px;text-decoration:none">Read on Ryan's website</a></p>
          </td></tr>
          <tr><td style="background:#272727;color:#ffffff;padding:26px 34px">
            <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;line-height:1.5;margin:0 0 8px">${escapeHtml(identity.licensedName)} · ${escapeHtml(identity.brokerage)}</p>
            <p style="color:#e8e5df;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;margin:0 0 14px">${escapeHtml(identity.address)}<br><a href="mailto:${escapeHtml(identity.email)}" style="color:#ffffff">${escapeHtml(identity.email)}</a> · <a href="${escapeHtml(identity.url)}" style="color:#ffffff">${escapeHtml(identity.url.replace(/^https?:\/\//, ""))}</a></p>
            <p style="color:#c9c5bf;font-family:Arial,sans-serif;font-size:12px;line-height:1.5;margin:0">You are receiving Ryan's Calgary market updates. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#ffffff;text-decoration:underline">Unsubscribe</a>.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = [
    title,
    "",
    excerpt,
    "",
    body,
    "",
    `Read online: ${articleUrl}`,
    "",
    `${identity.licensedName} · ${identity.brokerage}`,
    identity.address,
    identity.email,
    identity.url,
    "",
    "Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}",
  ].join("\n");

  return { html, text, articleUrl };
}

export const NEWSLETTER_DELIVERY_LABELS: Record<NewsletterDeliveryStatus, string> = {
  scheduled: "Scheduled",
  sent: "Sent",
  delivered: "Delivered",
  delivery_delayed: "Delayed",
  bounced: "Bounced",
  failed: "Failed",
  suppressed: "Suppressed",
  complained: "Spam complaint",
};

export function newsletterDeliveryDetail(
  type: string,
  data: Record<string, unknown>,
) {
  if (type === "email.bounced") {
    const bounce = data.bounce as { message?: string } | undefined;
    return bounce?.message?.slice(0, 500) ?? null;
  }
  if (type === "email.failed") {
    const failed = data.failed as { reason?: string } | undefined;
    return failed?.reason?.slice(0, 500) ?? null;
  }
  if (type === "email.suppressed") {
    const suppressed = data.suppressed as { message?: string } | undefined;
    return suppressed?.message?.slice(0, 500) ?? null;
  }
  return null;
}

export function deliveryStatusFromWebhook(
  type: string,
): NewsletterDeliveryStatus | null {
  const value = type.replace("email.", "");
  return value in NEWSLETTER_DELIVERY_LABELS
    ? (value as NewsletterDeliveryStatus)
    : null;
}
