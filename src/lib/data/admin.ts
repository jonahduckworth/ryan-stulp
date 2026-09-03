import "server-only";

import { cache } from "react";
import { verifyAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Lead,
  Listing,
  ListingMedia,
  MarketUpdate,
  NewsletterCampaign,
  NewsletterContact,
  NewsletterDelivery,
  SiteSettings,
} from "@/lib/types";

export const getAdminListings = cache(async (): Promise<Listing[]> => {
  await verifyAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error("Unable to load listings.");
  return (data ?? []) as Listing[];
});

export const getAdminListing = cache(
  async (id: string): Promise<Listing | null> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error("Unable to load listing.");
    return data as Listing | null;
  },
);

export const getAdminListingMedia = cache(
  async (listingId: string): Promise<ListingMedia[]> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("listing_media")
      .select("*")
      .eq("listing_id", listingId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error("Unable to load listing media.");
    return (data ?? []) as ListingMedia[];
  },
);

export const getAdminLeads = cache(async (): Promise<Lead[]> => {
  await verifyAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load leads.");
  return (data ?? []) as Lead[];
});

export const getAdminLead = cache(async (id: string): Promise<Lead | null> => {
  await verifyAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Unable to load lead.");
  return data as Lead | null;
});

export const getAdminSiteSettings = cache(
  async (): Promise<SiteSettings | null> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", true)
      .maybeSingle();
    if (error) throw new Error("Unable to load website settings.");
    return data as SiteSettings | null;
  },
);

export const getAdminMarketUpdates = cache(
  async (): Promise<MarketUpdate[]> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("market_updates")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error("Unable to load market updates.");
    return (data ?? []) as MarketUpdate[];
  },
);

export const getAdminMarketUpdate = cache(
  async (id: string): Promise<MarketUpdate | null> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("market_updates")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error("Unable to load the market update.");
    return data as MarketUpdate | null;
  },
);

export const getAdminNewsletterContacts = cache(
  async (): Promise<NewsletterContact[]> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("newsletter_contacts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error("Unable to load newsletter contacts.");
    return (data ?? []) as NewsletterContact[];
  },
);

export const getAdminNewsletterCampaigns = cache(
  async (): Promise<NewsletterCampaign[]> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("newsletter_campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Unable to load newsletter campaigns.");
    return (data ?? []) as NewsletterCampaign[];
  },
);

export const getAdminNewsletterCampaignForMarketUpdate = cache(
  async (marketUpdateId: string): Promise<NewsletterCampaign | null> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("newsletter_campaigns")
      .select("*")
      .eq("market_update_id", marketUpdateId)
      .maybeSingle();
    if (error) throw new Error("Unable to load the prepared email campaign.");
    return data as NewsletterCampaign | null;
  },
);

export const getAdminNewsletterCampaign = cache(
  async (id: string): Promise<NewsletterCampaign | null> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("newsletter_campaigns")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error("Unable to load the email campaign.");
    return data as NewsletterCampaign | null;
  },
);

export const getAdminNewsletterDeliveries = cache(
  async (campaignId?: string): Promise<NewsletterDelivery[]> => {
    await verifyAdmin();
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("newsletter_deliveries")
      .select("*")
      .order("status_at", { ascending: false });
    if (campaignId) query = query.eq("campaign_id", campaignId);
    const { data, error } = await query;
    if (error) throw new Error("Unable to load newsletter delivery statuses.");
    return (data ?? []) as NewsletterDelivery[];
  },
);

export async function getDashboardStats() {
  const [listings, leads, marketUpdates] = await Promise.all([
    getAdminListings(),
    getAdminLeads(),
    getAdminMarketUpdates(),
  ]);
  return {
    listings: listings.length,
    published: listings.filter(
      (listing) =>
        listing.published_at &&
        ["active", "pending", "sold"].includes(listing.status),
    ).length,
    newLeads: leads.filter((lead) => lead.status === "new").length,
    totalLeads: leads.length,
    marketUpdates: marketUpdates.length,
    publishedUpdates: marketUpdates.filter(
      (update) => update.status === "published" && update.published_at,
    ).length,
    draftUpdates: marketUpdates.filter((update) => update.status === "draft")
      .length,
    recentLeads: leads.slice(0, 5),
    listingStatuses: {
      active: listings.filter((listing) => listing.status === "active").length,
      draft: listings.filter((listing) => listing.status === "draft").length,
      pending: listings.filter((listing) => listing.status === "pending").length,
      sold: listings.filter((listing) => listing.status === "sold").length,
      archived: listings.filter((listing) => listing.status === "archived")
        .length,
    },
  };
}
