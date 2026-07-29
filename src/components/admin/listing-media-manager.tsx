"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { isPublicListingStatus } from "@/lib/listing-options";
import type { ListingMedia, ListingStatus } from "@/lib/types";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export function ListingMediaManager({
  listingId,
  address,
  listingStatus,
  initialMedia,
}: {
  listingId: string;
  address: string;
  listingStatus: ListingStatus;
  initialMedia: ListingMedia[];
}) {
  const [media, setMedia] = useState(initialMedia);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    const supabase = getSupabase();
    if (!supabase) {
      setStatus("Supabase is not connected.");
      return;
    }

    const accepted = Array.from(files).filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
        file.size <= 10 * 1024 * 1024,
    );
    if (accepted.length !== files.length) {
      setStatus("Only JPG, PNG, and WebP images under 10 MB can be uploaded.");
      return;
    }

    setBusy(true);
    setStatus(`Uploading ${accepted.length} image${accepted.length === 1 ? "" : "s"}…`);
    const additions: ListingMedia[] = [];
    let nextOrder =
      media.reduce((highest, item) => Math.max(highest, item.sort_order), -1) + 1;

    for (const file of accepted) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const storagePath = `${listingId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-media")
        .upload(storagePath, file, {
          cacheControl: "31536000",
          upsert: false,
        });
      if (uploadError) continue;

      const { data: publicFile } = supabase.storage
        .from("listing-media")
        .getPublicUrl(storagePath);
      const isFeatured = media.length === 0 && additions.length === 0;
      const { data: row, error: rowError } = await supabase
        .from("listing_media")
        .insert({
          listing_id: listingId,
          storage_path: storagePath,
          public_url: publicFile.publicUrl,
          alt_text: `${address} property photo`,
          sort_order: nextOrder,
          is_featured: isFeatured,
        })
        .select("*")
        .single();

      if (rowError || !row) {
        await supabase.storage.from("listing-media").remove([storagePath]);
        continue;
      }
      additions.push(row as ListingMedia);
      nextOrder += 1;
      if (isFeatured) {
        await supabase
          .from("listings")
          .update({ cover_image_url: publicFile.publicUrl })
          .eq("id", listingId);
      }
    }

    setMedia((current) => [...current, ...additions]);
    setBusy(false);
    setStatus(
      additions.length === accepted.length
        ? "Images uploaded. Add accurate alt text before publishing."
        : `${additions.length} of ${accepted.length} images uploaded.`,
    );
  }

  function editLocal(id: string, changes: Partial<ListingMedia>) {
    setMedia((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }

  async function saveDetails(item: ListingMedia) {
    const supabase = getSupabase();
    if (!supabase) return;
    if (item.alt_text.trim().length < 3) {
      setStatus("Alt text must briefly describe the image.");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("listing_media")
      .update({
        alt_text: item.alt_text.trim(),
        caption: item.caption?.trim() || null,
      })
      .eq("id", item.id);
    setBusy(false);
    setStatus(error ? "Image details could not be saved." : "Image details saved.");
  }

  async function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= media.length) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const current = media[index];
    const target = media[targetIndex];
    const reordered = [...media];
    reordered[index] = { ...target, sort_order: current.sort_order };
    reordered[targetIndex] = { ...current, sort_order: target.sort_order };
    setMedia(reordered);
    const [first, second] = await Promise.all([
      supabase
        .from("listing_media")
        .update({ sort_order: target.sort_order })
        .eq("id", current.id),
      supabase
        .from("listing_media")
        .update({ sort_order: current.sort_order })
        .eq("id", target.id),
    ]);
    setStatus(
      first.error || second.error
        ? "Image order could not be saved."
        : "Image order updated.",
    );
  }

  async function makeFeatured(item: ListingMedia) {
    const supabase = getSupabase();
    if (!supabase || item.is_featured) return;
    setBusy(true);
    await supabase
      .from("listing_media")
      .update({ is_featured: false })
      .eq("listing_id", listingId);
    const [{ error: mediaError }, { error: listingError }] = await Promise.all([
      supabase
        .from("listing_media")
        .update({ is_featured: true })
        .eq("id", item.id),
      supabase
        .from("listings")
        .update({ cover_image_url: item.public_url })
        .eq("id", listingId),
    ]);
    setBusy(false);
    if (mediaError || listingError) {
      setStatus("The featured image could not be changed.");
      return;
    }
    setMedia((current) =>
      current.map((entry) => ({
        ...entry,
        is_featured: entry.id === item.id,
      })),
    );
    setStatus("Featured image updated.");
  }

  async function remove(item: ListingMedia) {
    const remaining = media.filter((entry) => entry.id !== item.id);
    if (
      item.is_featured &&
      remaining.length === 0 &&
      isPublicListingStatus(listingStatus)
    ) {
      setStatus(
        "A public listing must keep a featured image. Add a replacement or change the listing to Draft before deleting this photo.",
      );
      return;
    }
    if (!window.confirm(`Permanently delete this image from ${address}?`)) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setBusy(true);
    const { error: rowError } = await supabase
      .from("listing_media")
      .delete()
      .eq("id", item.id);
    if (rowError) {
      setBusy(false);
      setStatus("The image could not be deleted.");
      return;
    }
    const { error: storageError } = await supabase.storage
      .from("listing-media")
      .remove([item.storage_path]);

    let nextMedia = remaining;
    if (item.is_featured) {
      const replacement = remaining[0] ?? null;
      if (replacement) {
        await supabase
          .from("listing_media")
          .update({ is_featured: true })
          .eq("id", replacement.id);
      }
      await supabase
        .from("listings")
        .update({ cover_image_url: replacement?.public_url ?? null })
        .eq("id", listingId);
      nextMedia = remaining.map((entry) => ({
        ...entry,
        is_featured: entry.id === replacement?.id,
      }));
    }
    setMedia(nextMedia);
    setBusy(false);
    setStatus(
      storageError
        ? "Image removed from the gallery. The unused storage file could not be cleaned up."
        : "Image deleted.",
    );
  }

  return (
    <section className="admin-panel media-manager">
      <div className="admin-panel-header">
        <div>
          <h2>Property gallery</h2>
          <p>
            Upload multiple images, choose the featured image, order the gallery,
            and describe every photo.
          </p>
        </div>
        <label className="button button-secondary file-button">
          {busy ? "Working…" : "Add images"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={busy}
            onChange={(event) => void upload(event.target.files)}
          />
        </label>
      </div>

      {media.length ? (
        <div className="media-list">
          {media.map((item, index) => (
            <article className="media-editor" key={item.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.public_url} alt="" />
              <div className="media-editor-fields">
                <div className="field">
                  <label htmlFor={`alt-${item.id}`}>Image alt text</label>
                  <input
                    id={`alt-${item.id}`}
                    value={item.alt_text}
                    onChange={(event) =>
                      editLocal(item.id, { alt_text: event.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`caption-${item.id}`}>Caption (optional)</label>
                  <input
                    id={`caption-${item.id}`}
                    value={item.caption ?? ""}
                    onChange={(event) =>
                      editLocal(item.id, { caption: event.target.value })
                    }
                  />
                </div>
                <div className="media-actions">
                  <button
                    className="button button-secondary"
                    type="button"
                    disabled={busy}
                    onClick={() => void saveDetails(item)}
                  >
                    Save details
                  </button>
                  <button
                    className="button button-secondary"
                    type="button"
                    disabled={busy || index === 0}
                    onClick={() => void move(index, -1)}
                    aria-label={`Move image ${index + 1} earlier`}
                  >
                    Move up
                  </button>
                  <button
                    className="button button-secondary"
                    type="button"
                    disabled={busy || index === media.length - 1}
                    onClick={() => void move(index, 1)}
                    aria-label={`Move image ${index + 1} later`}
                  >
                    Move down
                  </button>
                  <button
                    className="button button-secondary"
                    type="button"
                    disabled={busy || item.is_featured}
                    onClick={() => void makeFeatured(item)}
                  >
                    {item.is_featured ? "Featured image" : "Make featured"}
                  </button>
                  <button
                    className="button button-danger"
                    type="button"
                    disabled={busy}
                    onClick={() => void remove(item)}
                  >
                    Delete image
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <h3>No gallery images yet</h3>
          <p>Add approved property photography before publishing the listing.</p>
        </div>
      )}
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </section>
  );
}
