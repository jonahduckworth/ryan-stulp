import "server-only";

import { cache } from "react";
import type {
  Listing,
  ListingMedia,
  MarketUpdate,
  PublicSiteSettings,
} from "@/lib/types";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export const getPublishedListings = cache(async (): Promise<Listing[]> => {
  if (!hasPublicSupabaseEnv()) return [];

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .in("status", ["active", "pending", "sold"])
    .not("published_at", "is", null)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Unable to load published listings:", error.code);
    return [];
  }

  return (data ?? []) as Listing[];
});

export const getPublishedListingBySlug = cache(
  async (slug: string): Promise<Listing | null> => {
    if (!hasPublicSupabaseEnv()) return null;

    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("slug", slug)
      .in("status", ["active", "pending", "sold"])
      .not("published_at", "is", null)
      .maybeSingle();

    if (error) {
      console.error("Unable to load listing:", error.code);
      return null;
    }

    return data as Listing | null;
  },
);

export const getPublishedListingMedia = cache(
  async (listingId: string): Promise<ListingMedia[]> => {
    if (!hasPublicSupabaseEnv()) return [];

    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("listing_media")
      .select("*")
      .eq("listing_id", listingId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Unable to load listing media:", error.code);
      return [];
    }

    return (data ?? []) as ListingMedia[];
  },
);

export const getPublicSiteSettings = cache(
  async (): Promise<PublicSiteSettings | null> => {
    if (!hasPublicSupabaseEnv()) return null;

    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "id, public_email, phone_display, facebook_url, booking_url, brokerage_name, brokerage_address, licensed_name, homepage_eyebrow, homepage_title, homepage_description",
      )
      .eq("id", true)
      .maybeSingle();

    if (error) {
      console.error("Unable to load website settings:", error.code);
      return null;
    }

    return data as PublicSiteSettings | null;
  },
);

export const getPublishedMarketUpdates = cache(
  async (): Promise<MarketUpdate[]> => {
    if (!hasPublicSupabaseEnv()) return [];

    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("market_updates")
      .select("*")
      .eq("status", "published")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Unable to load market updates:", error.code);
      return [];
    }

    return (data ?? []) as MarketUpdate[];
  },
);

export const getPublishedMarketUpdateBySlug = cache(
  async (slug: string): Promise<MarketUpdate | null> => {
    if (!hasPublicSupabaseEnv()) return null;

    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("market_updates")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .not("published_at", "is", null)
      .maybeSingle();

    if (error) {
      console.error("Unable to load market update:", error.code);
      return null;
    }

    return data as MarketUpdate | null;
  },
);
