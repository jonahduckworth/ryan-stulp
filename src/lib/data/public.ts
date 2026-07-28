import "server-only";

import { cache } from "react";
import type { Listing } from "@/lib/types";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const getPublishedListings = cache(async (): Promise<Listing[]> => {
  if (!hasPublicSupabaseEnv()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .in("status", ["active", "pending", "sold"])
    .not("published_at", "is", null)
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

    const supabase = await createSupabaseServerClient();
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
