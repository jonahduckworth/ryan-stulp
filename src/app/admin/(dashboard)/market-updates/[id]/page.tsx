import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteMarketUpdateForm } from "@/components/admin/delete-market-update-form";
import { MarketUpdateCoverManager } from "@/components/admin/market-update-cover-manager";
import { MarketUpdateForm } from "@/components/admin/market-update-form";
import { NewsletterCampaignControls } from "@/components/admin/newsletter-campaign-controls";
import {
  getAdminMarketUpdate,
  getAdminNewsletterCampaignForMarketUpdate,
  getAdminNewsletterContacts,
} from "@/lib/data/admin";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Edit market update" };

export default async function EditMarketUpdatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string; published?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [marketUpdate, campaign, contacts] = await Promise.all([
    getAdminMarketUpdate(id),
    getAdminNewsletterCampaignForMarketUpdate(id),
    getAdminNewsletterContacts(),
  ]);
  if (!marketUpdate) notFound();
  const recipientCount = contacts.filter(
    (contact) => contact.subscription_status === "subscribed" && contact.resend_sync_status === "synced",
  ).length;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Edit market update</h1>
          <p>{marketUpdate.title}</p>
        </div>
        <div className="admin-header-actions">
          <Link
            className="button button-secondary"
            href={`/admin/preview/market-updates/${marketUpdate.id}`}
            target="_blank"
          >
            Preview
          </Link>
          {marketUpdate.status === "published" ? (
            <Link
              className="button button-secondary"
              href={`/market-updates/${marketUpdate.slug}`}
              target="_blank"
            >
              Public page ↗
            </Link>
          ) : null}
        </div>
      </header>
      {query.created === "1" ? (
        <div className="admin-success" role="status">
          <strong>Private draft created.</strong>
          <p>
            Add an optional cover image, preview the article, then change its
            status to Published when Ryan is happy with it.
          </p>
        </div>
      ) : query.saved === "1" ? (
        <div className="admin-success" role="status">
          Market update changes saved.
        </div>
      ) : null}
      {query.published === "1" && campaign && (campaign.status === "prepared" || campaign.status === "failed") ? (
        <NewsletterCampaignControls
          campaignId={campaign.id}
          title={campaign.market_update_title}
          recipientCount={recipientCount}
          sender={process.env.NEWSLETTER_EMAIL_FROM || "Ryan Stulp <updates@ryanstulp.ca>"}
          replyTo={process.env.NEWSLETTER_REPLY_TO || SITE.email}
          dialog
        />
      ) : null}
      <MarketUpdateForm marketUpdate={marketUpdate} />
      <MarketUpdateCoverManager
        marketUpdateId={marketUpdate.id}
        title={marketUpdate.title}
        initialCover={{
          cover_image_url: marketUpdate.cover_image_url,
          cover_image_path: marketUpdate.cover_image_path,
          cover_image_alt: marketUpdate.cover_image_alt,
        }}
      />
      <section className="danger-zone">
        <h2>Delete market update</h2>
        <p>
          This permanently removes the article and its cover image. Archiving
          is safer if Ryan may want to reuse it later.
        </p>
        <DeleteMarketUpdateForm id={marketUpdate.id} title={marketUpdate.title} />
      </section>
    </div>
  );
}
