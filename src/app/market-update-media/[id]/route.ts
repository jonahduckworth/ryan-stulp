import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return new NextResponse(null, { status: 404 });

  const supabase = await createSupabaseServerClient();
  const { data: update, error } = await supabase
    .from("market_updates")
    .select("cover_image_path, status, published_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !update?.cover_image_path) {
    return new NextResponse(null, { status: 404 });
  }

  const { data: signedFile, error: signedFileError } = await supabase.storage
    .from("market-update-media")
    .createSignedUrl(update.cover_image_path, 600);
  if (signedFileError || !signedFile?.signedUrl) {
    return new NextResponse(null, { status: 404 });
  }

  const isPublished = update.status === "published" && update.published_at;
  const response = NextResponse.redirect(signedFile.signedUrl, 307);
  response.headers.set(
    "Cache-Control",
    isPublished ? "public, max-age=300" : "private, no-store, max-age=0",
  );
  return response;
}
