"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/auth";
import { listingStoragePaths } from "@/lib/listing-storage";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  leadUpdateSchema,
  listingSchema,
  siteSettingsSchema,
} from "@/lib/schemas";

export type AdminFormState = {
  status: "idle" | "error";
  message: string;
  errors?: Record<string, string[]>;
};

function nullableNumber(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === "") return null;
  return String(value);
}

export async function saveListing(
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const admin = await verifyAdmin();
  const parsed = listingSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    address: formData.get("address"),
    addressLine2: formData.get("addressLine2"),
    city: formData.get("city"),
    province: formData.get("province"),
    postalCode: formData.get("postalCode"),
    price: nullableNumber(formData.get("price")),
    status: formData.get("status"),
    listingType: formData.get("listingType"),
    propertyType: formData.get("propertyType"),
    neighbourhood: formData.get("neighbourhood"),
    mlsNumber: formData.get("mlsNumber"),
    bedrooms: nullableNumber(formData.get("bedrooms")),
    bathrooms: nullableNumber(formData.get("bathrooms")),
    squareFeet: nullableNumber(formData.get("squareFeet")),
    yearBuilt: nullableNumber(formData.get("yearBuilt")),
    description: formData.get("description"),
    features: formData.get("features"),
    coverImageUrl: formData.get("coverImageUrl"),
    ctaLabel: formData.get("ctaLabel"),
    ctaDestination: formData.get("ctaDestination"),
    featured: formData.get("featured") === "on",
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    socialImageUrl: formData.get("socialImageUrl"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const listing = parsed.data;
  const storagePrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-media/`;
  if (
    listing.coverImageUrl &&
    !listing.coverImageUrl.startsWith(storagePrefix)
  ) {
    return {
      status: "error",
      message: "The cover image must come from the secure listing media bucket.",
      errors: {
        coverImageUrl: ["Upload the image using the cover image control."],
      },
    };
  }
  const shouldPublish = ["active", "pending", "sold"].includes(listing.status);
  const { data: existing } = listing.id
    ? await supabase
        .from("listings")
        .select("published_at")
        .eq("id", listing.id)
        .maybeSingle()
    : { data: null };
  const payload = {
    title: listing.title,
    slug: listing.slug,
    address: listing.address,
    address_line_2: listing.addressLine2,
    city: listing.city,
    province: listing.province,
    postal_code: listing.postalCode,
    price: listing.price,
    status: listing.status,
    listing_type: listing.listingType,
    property_type: listing.propertyType,
    neighbourhood: listing.neighbourhood,
    mls_number: listing.mlsNumber,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    square_feet: listing.squareFeet,
    year_built: listing.yearBuilt,
    description: listing.description,
    features: listing.features,
    cover_image_url: listing.coverImageUrl,
    cta_label: listing.ctaLabel,
    cta_destination: listing.ctaDestination,
    featured: listing.featured,
    seo_title: listing.seoTitle,
    seo_description: listing.seoDescription,
    social_image_url: listing.socialImageUrl,
    published_at: shouldPublish
      ? existing?.published_at || new Date().toISOString()
      : null,
    updated_by: admin.id,
  };

  const result = listing.id
    ? await supabase
        .from("listings")
        .update(payload)
        .eq("id", listing.id)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("listings")
        .insert({
          ...payload,
          created_by: admin.id,
        })
        .select("id")
        .single();

  if (result.error || !result.data) {
    return {
      status: "error",
      message:
        result.error?.code === "23505"
          ? "That listing URL is already in use."
          : "The listing could not be saved.",
    };
  }

  if (listing.coverImageUrl) {
    const storagePath = decodeURIComponent(
      listing.coverImageUrl.slice(storagePrefix.length),
    );
    await supabase
      .from("listing_media")
      .update({ is_featured: false })
      .eq("listing_id", result.data.id);
    await supabase.from("listing_media").upsert(
      {
        listing_id: result.data.id,
        storage_path: storagePath,
        public_url: listing.coverImageUrl,
        alt_text: `${listing.address} property photo`,
        sort_order: 0,
        is_featured: true,
      },
      { onConflict: "storage_path" },
    );
  }

  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  revalidatePath("/listings/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/");
  redirect(`/admin/listings/${result.data.id}?saved=1`);
}

export async function duplicateListing(formData: FormData) {
  const admin = await verifyAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  const [{ data: listing, error }, { data: media }] = await Promise.all([
    supabase.from("listings").select("*").eq("id", id).single(),
    supabase
      .from("listing_media")
      .select("*")
      .eq("listing_id", id)
      .order("sort_order"),
  ]);
  if (error || !listing) throw new Error("The listing could not be duplicated.");

  const uniqueSuffix = Date.now().toString(36).slice(-6);
  const copy = { ...listing };
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  delete copy.created_by;
  delete copy.updated_by;
  const { data: duplicated, error: duplicateError } = await supabase
    .from("listings")
    .insert({
      ...copy,
      title: `${listing.title} (copy)`,
      slug: `${listing.slug}-copy-${uniqueSuffix}`,
      status: "draft",
      featured: false,
      published_at: null,
      cover_image_url: null,
      created_by: admin.id,
      updated_by: admin.id,
    })
    .select("id")
    .single();
  if (duplicateError || !duplicated) {
    throw new Error("The listing could not be duplicated.");
  }

  let duplicatedCoverUrl: string | null = null;
  for (const item of media ?? []) {
    const extension = item.storage_path.split(".").pop() || "jpg";
    const destination = `${duplicated.id}/${crypto.randomUUID()}.${extension}`;
    const { error: copyError } = await supabase.storage
      .from("listing-media")
      .copy(item.storage_path, destination);
    if (copyError) continue;
    const { data: publicFile } = supabase.storage
      .from("listing-media")
      .getPublicUrl(destination);
    const publicUrl = publicFile.publicUrl;
    await supabase.from("listing_media").insert({
      listing_id: duplicated.id,
      storage_path: destination,
      public_url: publicUrl,
      alt_text: item.alt_text,
      caption: item.caption,
      sort_order: item.sort_order,
      is_featured: item.is_featured,
    });
    if (item.is_featured) duplicatedCoverUrl = publicUrl;
  }

  if (duplicatedCoverUrl) {
    await supabase
      .from("listings")
      .update({ cover_image_url: duplicatedCoverUrl })
      .eq("id", duplicated.id);
  }

  revalidatePath("/admin/listings");
  redirect(`/admin/listings/${duplicated.id}?duplicated=1`);
}

export async function deleteListing(formData: FormData) {
  await verifyAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const supabase = await createSupabaseServerClient();
  const [
    { data: listing, error: listingError },
    { data: media, error: mediaError },
  ] = await Promise.all([
    supabase
      .from("listings")
      .select("cover_image_url")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("listing_media").select("storage_path").eq("listing_id", id),
  ]);
  if (listingError || mediaError || !listing) {
    throw new Error("The listing media could not be prepared for deletion.");
  }

  const storagePaths = listingStoragePaths(
    (media ?? []).map((item) => item.storage_path),
    listing.cover_image_url,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("listing-media")
      .remove(storagePaths);
    if (storageError) {
      throw new Error("The listing images could not be deleted.");
    }
  }

  const { data, error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !data) throw new Error("The listing could not be deleted.");
  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  revalidatePath("/listings/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/");
  redirect("/admin/listings");
}

export async function updateLead(
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const admin = await verifyAdmin();
  const parsed = leadUpdateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "The lead update could not be validated.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .update({
      status: parsed.data.status,
      notes: parsed.data.notes,
      updated_by: admin.id,
    })
    .eq("id", parsed.data.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { status: "error", message: "The lead could not be updated." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}

export async function updateSiteSettings(
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const admin = await verifyAdmin();
  const parsed = siteSettingsSchema.safeParse({
    notificationEmail: formData.get("notificationEmail"),
    publicEmail: formData.get("publicEmail"),
    phoneDisplay: formData.get("phoneDisplay"),
    facebookUrl: formData.get("facebookUrl"),
    bookingUrl: formData.get("bookingUrl"),
    brokerageName: formData.get("brokerageName"),
    brokerageAddress: formData.get("brokerageAddress"),
    licensedName: formData.get("licensedName"),
    homepageEyebrow: formData.get("homepageEyebrow"),
    homepageTitle: formData.get("homepageTitle"),
    homepageDescription: formData.get("homepageDescription"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted website settings.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const settings = parsed.data;
  const { error } = await supabase
    .from("site_settings")
    .update({
      notification_email: settings.notificationEmail,
      public_email: settings.publicEmail,
      phone_display: settings.phoneDisplay,
      facebook_url: settings.facebookUrl,
      booking_url: settings.bookingUrl,
      brokerage_name: settings.brokerageName,
      brokerage_address: settings.brokerageAddress,
      licensed_name: settings.licensedName,
      homepage_eyebrow: settings.homepageEyebrow,
      homepage_title: settings.homepageTitle,
      homepage_description: settings.homepageDescription,
      updated_by: admin.id,
    })
    .eq("id", true);

  if (error) {
    return { status: "error", message: "Website settings could not be saved." };
  }

  revalidatePath("/(site)", "layout");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
