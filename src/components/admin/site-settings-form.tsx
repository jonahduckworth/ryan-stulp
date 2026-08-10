"use client";

import { useActionState } from "react";
import {
  updateSiteSettings,
  type AdminFormState,
} from "@/app/actions/admin";
import type { PublicSiteIdentity } from "@/lib/site";

const initialState: AdminFormState = { status: "idle", message: "" };

function ErrorText({
  state,
  field,
}: {
  state: AdminFormState;
  field: string;
}) {
  const message = state.errors?.[field]?.[0];
  return message ? (
    <span className="field-error" id={`${field}-error`}>
      {message}
    </span>
  ) : null;
}

function errorProps(state: AdminFormState, field: string) {
  const hasError = Boolean(state.errors?.[field]?.[0]);
  return {
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? `${field}-error` : undefined,
  };
}

export function SiteSettingsForm({
  identity,
  notificationEmail,
}: {
  identity: PublicSiteIdentity;
  notificationEmail: string;
}) {
  const [state, action, pending] = useActionState(
    updateSiteSettings,
    initialState,
  );

  return (
    <form className="admin-form" action={action}>
      <section className="admin-form-section">
        <h2>Contact and lead delivery</h2>
        <div className="field">
          <label htmlFor="publicEmail">Public email</label>
          <input
            id="publicEmail"
            name="publicEmail"
            type="email"
            defaultValue={identity.email}
            required
            {...errorProps(state, "publicEmail")}
          />
          <ErrorText state={state} field="publicEmail" />
        </div>
        <div className="field">
          <label htmlFor="notificationEmail">Lead notification email</label>
          <input
            id="notificationEmail"
            name="notificationEmail"
            type="email"
            defaultValue={notificationEmail}
            required
            {...errorProps(state, "notificationEmail")}
          />
          <ErrorText state={state} field="notificationEmail" />
        </div>
        <div className="field">
          <label htmlFor="phoneDisplay">Public phone</label>
          <input
            id="phoneDisplay"
            name="phoneDisplay"
            defaultValue={identity.phoneDisplay}
            required
            {...errorProps(state, "phoneDisplay")}
          />
          <ErrorText state={state} field="phoneDisplay" />
        </div>
        <div className="field">
          <label htmlFor="facebookUrl">Facebook URL</label>
          <input
            id="facebookUrl"
            name="facebookUrl"
            type="url"
            defaultValue={identity.facebook}
            {...errorProps(state, "facebookUrl")}
          />
          <ErrorText state={state} field="facebookUrl" />
        </div>
        <div className="field field-full">
          <label htmlFor="bookingUrl">Booking link (optional)</label>
          <input
            id="bookingUrl"
            name="bookingUrl"
            type="url"
            defaultValue={identity.bookingUrl ?? ""}
            placeholder="https://calendly.com/…"
            {...errorProps(state, "bookingUrl")}
          />
          <ErrorText state={state} field="bookingUrl" />
        </div>
      </section>
      <section className="admin-form-section">
        <h2>Licensed identity</h2>
        <div className="field">
          <label htmlFor="licensedName">Licensed name</label>
          <input
            id="licensedName"
            name="licensedName"
            defaultValue={identity.licensedName}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="brokerageName">Brokerage display name</label>
          <input
            id="brokerageName"
            name="brokerageName"
            defaultValue={identity.brokerage}
            required
          />
        </div>
        <div className="field field-full">
          <label htmlFor="brokerageAddress">Brokerage office address</label>
          <input
            id="brokerageAddress"
            name="brokerageAddress"
            defaultValue={identity.address}
            required
          />
        </div>
      </section>
      <section className="admin-form-section">
        <h2>Homepage introduction</h2>
        <div className="field field-full">
          <label htmlFor="homepageEyebrow">Eyebrow</label>
          <input
            id="homepageEyebrow"
            name="homepageEyebrow"
            defaultValue={identity.homepageEyebrow}
            required
          />
        </div>
        <div className="field field-full">
          <label htmlFor="homepageTitle">Main headline</label>
          <input
            id="homepageTitle"
            name="homepageTitle"
            defaultValue={identity.homepageTitle}
            required
          />
        </div>
        <div className="field field-full">
          <label htmlFor="homepageDescription">Introduction</label>
          <textarea
            id="homepageDescription"
            name="homepageDescription"
            defaultValue={identity.homepageDescription}
            required
          />
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
          Changes update the public website immediately.
        </span>
        <button className="button button-primary" disabled={pending}>
          {pending ? "Saving…" : "Save website settings"}
        </button>
      </div>
    </form>
  );
}
