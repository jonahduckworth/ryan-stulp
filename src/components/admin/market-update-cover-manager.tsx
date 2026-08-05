"use client";

import { useState } from "react";
import {
  removeMarketUpdateCover,
  saveMarketUpdateCover,
} from "@/app/actions/admin";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MarketUpdate } from "@/lib/types";

type Cover = Pick<
  MarketUpdate,
  "cover_image_url" | "cover_image_path" | "cover_image_alt"
>;

export function MarketUpdateCoverManager({
  marketUpdateId,
  title,
  initialCover,
}: {
  marketUpdateId: string;
  title: string;
  initialCover: Cover;
}) {
  const [cover, setCover] = useState(initialCover);
  const [altText, setAltText] = useState(initialCover.cover_image_alt ?? "");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (altText.trim().length < 3) {
      setStatus("Add at least three characters of image alt text before uploading.");
      return;
    }
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setStatus("Choose a JPG, PNG, or WebP image under 10 MB.");
      return;
    }

    setBusy(true);
    setStatus("Uploading cover image…");
    const supabase = createSupabaseBrowserClient();
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `${marketUpdateId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("market-update-media")
      .upload(storagePath, file, {
        cacheControl: "31536000",
        upsert: false,
      });
    if (uploadError) {
      setBusy(false);
      setStatus("The cover image could not be uploaded.");
      return;
    }

    let result;
    try {
      result = await saveMarketUpdateCover({
        marketUpdateId,
        storagePath,
        altText,
      });
    } catch {
      await supabase.storage.from("market-update-media").remove([storagePath]);
      setBusy(false);
      setStatus("The cover image could not be saved.");
      return;
    }
    setBusy(false);
    setStatus(result.message);
    if (result.status === "success") {
      setCover({
        cover_image_url: result.coverImageUrl,
        cover_image_path: result.coverImagePath,
        cover_image_alt: result.coverImageAlt,
      });
      setAltText(result.coverImageAlt ?? "");
    } else {
      await supabase.storage.from("market-update-media").remove([storagePath]);
    }
  }

  async function saveAltText() {
    if (!cover.cover_image_path) return;
    setBusy(true);
    let result;
    try {
      result = await saveMarketUpdateCover({
        marketUpdateId,
        storagePath: cover.cover_image_path,
        altText,
      });
    } catch {
      setBusy(false);
      setStatus("The image description could not be saved.");
      return;
    }
    setBusy(false);
    setStatus(result.message);
    if (result.status === "success") {
      setCover((current) => ({
        ...current,
        cover_image_alt: result.coverImageAlt,
      }));
    }
  }

  async function remove() {
    if (!window.confirm(`Permanently remove the cover image from “${title}”?`)) {
      return;
    }
    setBusy(true);
    let result;
    try {
      result = await removeMarketUpdateCover({ marketUpdateId });
    } catch {
      setBusy(false);
      setStatus("The cover image could not be removed.");
      return;
    }
    setBusy(false);
    setStatus(result.message);
    if (result.status === "success") {
      setCover({
        cover_image_url: null,
        cover_image_path: null,
        cover_image_alt: null,
      });
      setAltText("");
    }
  }

  return (
    <section className="admin-panel market-update-cover-manager">
      <div className="admin-panel-header">
        <div>
          <h2>Cover image</h2>
          <p>
            Optional, but recommended for sharing and a stronger article page.
          </p>
        </div>
        <label className="button button-secondary file-button">
          {busy ? "Working…" : cover.cover_image_url ? "Replace image" : "Add image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(event) => void upload(event.target.files?.[0])}
          />
        </label>
      </div>
      <div className="market-update-cover-editor">
        {cover.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.cover_image_url} alt="" />
        ) : (
          <div className="market-update-cover-placeholder" aria-hidden="true">
            RS
          </div>
        )}
        <div className="stack">
          <div className="field">
            <label htmlFor="market-update-cover-alt">Image alt text</label>
            <input
              id="market-update-cover-alt"
              value={altText}
              maxLength={180}
              placeholder="Ryan reviewing Calgary housing market data"
              onChange={(event) => setAltText(event.target.value)}
            />
            <span className="field-help">
              Describe what the image shows for accessibility and search.
            </span>
          </div>
          <div className="button-row">
            {cover.cover_image_path ? (
              <>
                <button
                  className="button button-secondary"
                  type="button"
                  disabled={busy}
                  onClick={() => void saveAltText()}
                >
                  Save description
                </button>
                <button
                  className="button button-danger"
                  type="button"
                  disabled={busy}
                  onClick={() => void remove()}
                >
                  Remove image
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <p className="form-status" aria-live="polite">
        {status}
      </p>
    </section>
  );
}
