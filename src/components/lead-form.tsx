"use client";

import { useActionState } from "react";
import Script from "next/script";
import {
  submitLead,
  type LeadFormState,
} from "@/app/actions/leads";

const initialLeadState: LeadFormState = {
  status: "idle",
  message: "",
};

function FieldError({
  state,
  name,
}: {
  state: LeadFormState;
  name: string;
}) {
  const message = state.errors?.[name]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

export function LeadForm({
  source,
  defaultIntent = "general",
  includeAddress = false,
}: {
  source: string;
  defaultIntent?: "buy" | "sell" | "invest" | "commercial" | "general";
  includeAddress?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    submitLead,
    initialLeadState,
  );

  return (
    <form className="form-shell form-grid" action={formAction}>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      ) : null}
      <input type="hidden" name="source" value={source} />
      <input
        className="honeypot"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        hidden
      />
      <div className="field">
        <label htmlFor={`${source}-name`}>Name</label>
        <input
          id={`${source}-name`}
          name="name"
          type="text"
          defaultValue={state.values?.name}
          autoComplete="name"
          required
        />
        <FieldError state={state} name="name" />
      </div>
      <div className="field">
        <label htmlFor={`${source}-email`}>Email</label>
        <input
          id={`${source}-email`}
          name="email"
          type="email"
          defaultValue={state.values?.email}
          autoComplete="email"
          required
        />
        <FieldError state={state} name="email" />
      </div>
      <div className="field">
        <label htmlFor={`${source}-phone`}>Phone (optional)</label>
        <input
          id={`${source}-phone`}
          name="phone"
          type="tel"
          defaultValue={state.values?.phone}
          autoComplete="tel"
        />
        <FieldError state={state} name="phone" />
      </div>
      <div className="field">
        <label htmlFor={`${source}-intent`}>I&apos;m looking to</label>
        <select
          id={`${source}-intent`}
          name="intent"
          defaultValue={state.values?.intent ?? defaultIntent}
        >
          <option value="buy">Buy a property</option>
          <option value="sell">Sell a property</option>
          <option value="invest">Invest</option>
          <option value="commercial">Discuss commercial real estate</option>
          <option value="general">Ask a general question</option>
        </select>
      </div>
      {includeAddress ? (
        <div className="field field-full">
          <label htmlFor={`${source}-propertyAddress`}>
            Property address (optional)
          </label>
          <input
            id={`${source}-propertyAddress`}
            name="propertyAddress"
            type="text"
            defaultValue={state.values?.propertyAddress}
            autoComplete="street-address"
          />
          <FieldError state={state} name="propertyAddress" />
        </div>
      ) : (
        <input type="hidden" name="propertyAddress" value="" />
      )}
      <div className="field field-full">
        <label htmlFor={`${source}-message`}>
          What would you like help with?
        </label>
        <textarea
          id={`${source}-message`}
          name="message"
          defaultValue={state.values?.message}
          placeholder="Share your timing, goals, and any questions you already have."
          required
        />
        <FieldError state={state} name="message" />
      </div>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
        <div
          className="cf-turnstile field-full"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        />
      ) : null}
      <p className="form-note field-full">
        By submitting, you agree that Ryan may contact you about this request.
        Your details are not added to a bulk marketing list.
      </p>
      <div className="field-full button-row">
        <button className="button button-primary" disabled={pending} type="submit">
          {pending ? "Sending…" : "Send to Ryan"}
        </button>
      </div>
      <p
        className="form-status field-full"
        data-status={state.status}
        aria-live="polite"
      >
        {state.message}
      </p>
    </form>
  );
}
