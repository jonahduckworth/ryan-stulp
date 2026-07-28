"use client";

import { useActionState } from "react";
import {
  saveListing,
  type AdminFormState,
} from "@/app/actions/admin";
import type { Listing } from "@/lib/types";
import { MediaUpload } from "./media-upload";

const initialAdminState: AdminFormState = {
  status: "idle",
  message: "",
};

function ErrorText({
  state,
  field,
}: {
  state: AdminFormState;
  field: string;
}) {
  const message = state.errors?.[field]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

export function ListingForm({ listing }: { listing?: Listing | null }) {
  const [state, action, pending] = useActionState(
    saveListing,
    initialAdminState,
  );

  return (
    <form className="admin-form" action={action}>
      {listing ? <input type="hidden" name="id" value={listing.id} /> : null}
      <section className="admin-form-section">
        <h2>Property basics</h2>
        <div className="field">
          <label htmlFor="title">Listing title</label>
          <input
            id="title"
            name="title"
            defaultValue={listing?.title}
            placeholder="Bright family home in Altadore"
            required
          />
          <ErrorText state={state} field="title" />
        </div>
        <div className="field">
          <label htmlFor="slug">Page URL</label>
          <input
            id="slug"
            name="slug"
            defaultValue={listing?.slug}
            placeholder="123-main-street-calgary"
            required
          />
          <ErrorText state={state} field="slug" />
        </div>
        <div className="field field-full">
          <label htmlFor="address">Street address</label>
          <input
            id="address"
            name="address"
            defaultValue={listing?.address}
            required
          />
          <ErrorText state={state} field="address" />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            defaultValue={listing?.city ?? "Calgary"}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="province">Province</label>
          <input
            id="province"
            name="province"
            defaultValue={listing?.province ?? "AB"}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="postalCode">Postal code</label>
          <input
            id="postalCode"
            name="postalCode"
            defaultValue={listing?.postal_code ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="price">Price (CAD)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={listing?.price ?? ""}
          />
          <ErrorText state={state} field="price" />
        </div>
      </section>
      <section className="admin-form-section">
        <h2>Details</h2>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            defaultValue={listing?.status ?? "draft"}
          >
            <option value="draft">Draft (not public)</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived (not public)</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="propertyType">Property type</label>
          <input
            id="propertyType"
            name="propertyType"
            defaultValue={listing?.property_type ?? "Residential"}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="bedrooms">Bedrooms</label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            defaultValue={listing?.bedrooms ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="bathrooms">Bathrooms</label>
          <input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            step="0.5"
            defaultValue={listing?.bathrooms ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="squareFeet">Square feet</label>
          <input
            id="squareFeet"
            name="squareFeet"
            type="number"
            min="1"
            defaultValue={listing?.square_feet ?? ""}
          />
        </div>
      </section>
      <section className="admin-form-section">
        <h2>Marketing content</h2>
        <div className="field field-full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={listing?.description}
            required
          />
          <ErrorText state={state} field="description" />
        </div>
        <div className="field field-full">
          <label htmlFor="features">Highlights (one per line)</label>
          <textarea
            id="features"
            name="features"
            defaultValue={listing?.features.join("\n")}
          />
        </div>
        <div className="field field-full">
          <MediaUpload initialUrl={listing?.cover_image_url} />
        </div>
      </section>
      <p
        className="form-status field-full"
        data-status={state.status}
        aria-live="polite"
      >
        {state.message}
      </p>
      <div className="admin-actions">
        <span className="form-note">
          Active, pending, and sold listings are published immediately.
        </span>
        <button className="button button-primary" disabled={pending}>
          {pending ? "Saving…" : listing ? "Save changes" : "Create listing"}
        </button>
      </div>
    </form>
  );
}
