"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

export function MediaUpload({ initialUrl }: { initialUrl?: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [status, setStatus] = useState("");

  async function upload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setStatus("Choose a JPG, PNG, or WebP image under 10 MB.");
      return;
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      setStatus("Connect Supabase before uploading media.");
      return;
    }

    setStatus("Uploading…");
    const supabase = createBrowserClient(supabaseUrl, anonKey);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from("listing-media")
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (error) {
      setStatus("Upload failed. Confirm the storage bucket and permissions.");
      return;
    }

    const { data } = supabase.storage.from("listing-media").getPublicUrl(path);
    setUrl(data.publicUrl);
    setStatus("Image uploaded.");
  }

  return (
    <div className="upload-box">
      <input type="hidden" name="coverImageUrl" value={url} />
      {url ? (
        <div className="upload-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Listing cover preview" />
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="cover-file">Cover image</label>
        <input
          id="cover-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => void upload(event.target.files?.[0])}
        />
      </div>
      <p className="form-note" aria-live="polite">
        {status || "Use a landscape image. JPG, PNG, or WebP; maximum 10 MB."}
      </p>
      {url ? (
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            setUrl("");
            setStatus("Cover image removed from this listing.");
          }}
        >
          Remove cover
        </button>
      ) : null}
    </div>
  );
}
