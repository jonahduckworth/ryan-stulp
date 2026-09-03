import "server-only";

import { Resend, type WebhookEventPayload } from "resend";
import { SITE, type PublicSiteIdentity } from "@/lib/site";
import { buildNewsletterEmail } from "@/lib/newsletter";
import type { NewsletterCampaign } from "@/lib/types";

type NewsletterContactInput = {
  email: string;
  firstName: string;
  lastName: string;
};

function configuration() {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_MARKET_UPDATES_SEGMENT_ID;
  const topicId = process.env.RESEND_MARKET_UPDATES_TOPIC_ID;
  const from = process.env.NEWSLETTER_EMAIL_FROM;
  if (!apiKey || !segmentId || !topicId || !from) {
    throw new Error("Newsletter delivery is not fully configured.");
  }
  return {
    resend: new Resend(apiKey),
    segmentId,
    topicId,
    from,
    replyTo: process.env.NEWSLETTER_REPLY_TO || SITE.email,
  };
}

export function hasNewsletterResendEnv() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_MARKET_UPDATES_SEGMENT_ID &&
      process.env.RESEND_MARKET_UPDATES_TOPIC_ID &&
      process.env.NEWSLETTER_EMAIL_FROM,
  );
}

export function verifyResendWebhook({
  payload,
  id,
  timestamp,
  signature,
}: {
  payload: string;
  id: string;
  timestamp: string;
  signature: string;
}): WebhookEventPayload {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!apiKey || !webhookSecret) {
    throw new Error("Resend webhook verification is not configured.");
  }
  return new Resend(apiKey).webhooks.verify({
    payload,
    headers: { id, timestamp, signature },
    webhookSecret,
  });
}

export async function syncSubscribedContactToResend({
  email,
  firstName,
  lastName,
}: NewsletterContactInput) {
  const { resend, segmentId, topicId } = configuration();
  const existing = await resend.contacts.get({ email });
  if (existing.error && existing.error.name !== "not_found") {
    throw new Error(existing.error.message);
  }

  if (!existing.data) {
    const created = await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      segments: [{ id: segmentId }],
      topics: [{ id: topicId, subscription: "opt_in" }],
    });
    if (created.error) throw new Error(created.error.message);
    return created.data.id;
  }

  const [updated, segments, topics] = await Promise.all([
    resend.contacts.update({
      email,
      firstName,
      lastName,
      unsubscribed: false,
    }),
    resend.contacts.segments.list({ email }),
    resend.contacts.topics.update({
      email,
      topics: [{ id: topicId, subscription: "opt_in" }],
    }),
  ]);
  if (updated.error) throw new Error(updated.error.message);
  if (segments.error) throw new Error(segments.error.message);
  if (topics.error) throw new Error(topics.error.message);
  if (!segments.data.data.some((segment) => segment.id === segmentId)) {
    const added = await resend.contacts.segments.add({ email, segmentId });
    if (added.error) throw new Error(added.error.message);
  }
  return existing.data.id;
}

export async function unsubscribeContactInResend(email: string) {
  const { resend, topicId } = configuration();
  const result = await resend.contacts.topics.update({
    email,
    topics: [{ id: topicId, subscription: "opt_out" }],
  });
  if (result.error) throw new Error(result.error.message);
}

export async function getResendMarketUpdateSubscription(email: string) {
  const { resend, topicId } = configuration();
  const [contact, topics] = await Promise.all([
    resend.contacts.get({ email }),
    resend.contacts.topics.list({ email }),
  ]);
  if (contact.error) throw new Error(contact.error.message);
  if (topics.error) throw new Error(topics.error.message);
  const topic = topics.data.data.find((item) => item.id === topicId);
  return {
    contactId: contact.data.id,
    subscribed: !contact.data.unsubscribed && topic?.subscription === "opt_in",
  };
}

export async function createNewsletterBroadcast(
  campaign: NewsletterCampaign,
  identity: PublicSiteIdentity,
) {
  const { resend, segmentId, topicId, from, replyTo } = configuration();
  const content = buildNewsletterEmail({
    title: campaign.market_update_title,
    excerpt: campaign.article_excerpt,
    body: campaign.article_body,
    slug: campaign.market_update_slug,
    coverImageUrl: campaign.article_cover_image_url,
    identity,
  });
  const created = await resend.broadcasts.create({
    segmentId,
    topicId,
    from,
    replyTo,
    name: campaign.market_update_title,
    subject: campaign.subject,
    previewText: campaign.preview_text,
    html: content.html,
    text: content.text,
  });
  if (created.error) throw new Error(created.error.message);
  return created.data.id;
}

export async function sendNewsletterBroadcast(broadcastId: string) {
  const { resend } = configuration();
  const sent = await resend.broadcasts.send(broadcastId);
  if (sent.error) throw new Error(sent.error.message);
  return sent.data.id;
}

export async function sendNewsletterTest(
  campaign: NewsletterCampaign,
  identity: PublicSiteIdentity,
) {
  const { resend, from, replyTo } = configuration();
  const content = buildNewsletterEmail({
    title: campaign.market_update_title,
    excerpt: campaign.article_excerpt,
    body: campaign.article_body,
    slug: campaign.market_update_slug,
    coverImageUrl: campaign.article_cover_image_url,
    identity,
  });
  const testHtml = content.html.replaceAll(
    "{{{RESEND_UNSUBSCRIBE_URL}}}",
    content.articleUrl,
  );
  const testText = content.text.replaceAll(
    "{{{RESEND_UNSUBSCRIBE_URL}}}",
    "Unsubscribe links are generated for the live campaign.",
  );
  const result = await resend.emails.send(
    {
      from,
      to: replyTo,
      replyTo,
      subject: `[Test] ${campaign.subject}`,
      html: testHtml,
      text: testText,
    },
    { idempotencyKey: `newsletter-test/${campaign.id}/${crypto.randomUUID()}` },
  );
  if (result.error) throw new Error(result.error.message);
  return result.data.id;
}
