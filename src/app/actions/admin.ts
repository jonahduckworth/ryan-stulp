"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leadUpdateSchema, listingSchema } from "@/lib/schemas";

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
    city: formData.get("city"),
    province: formData.get("province"),
    postalCode: formData.get("postalCode"),
    price: nullableNumber(formData.get("price")),
    status: formData.get("status"),
    propertyType: formData.get("propertyType"),
    bedrooms: nullableNumber(formData.get("bedrooms")),
    bathrooms: nullableNumber(formData.get("bathrooms")),
    squareFeet: nullableNumber(formData.get("squareFeet")),
    description: formData.get("description"),
    features: formData.get("features"),
    coverImageUrl: formData.get("coverImageUrl"),
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
  const payload = {
    title: listing.title,
    slug: listing.slug,
    address: listing.address,
    city: listing.city,
    province: listing.province,
    postal_code: listing.postalCode,
    price: listing.price,
    status: listing.status,
    property_type: listing.propertyType,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    square_feet: listing.squareFeet,
    description: listing.description,
    features: listing.features,
    cover_image_url: listing.coverImageUrl,
    published_at: shouldPublish ? new Date().toISOString() : null,
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

  revalidatePath("/admin/listings");
  revalidatePath("/listings");
  revalidatePath("/listings/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/");
  redirect("/admin/listings");
}

export async function deleteListing(formData: FormData) {
  await verifyAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const supabase = await createSupabaseServerClient();
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
