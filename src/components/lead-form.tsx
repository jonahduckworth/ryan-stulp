"use client";

import { useActionState, useEffect, useRef } from "react";
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
  id,
}: {
  state: LeadFormState;
  name: string;
  id: string;
}) {
  const message = state.errors?.[name]?.[0];
  return message ? (
    <span className="field-error" id={id}>
      {message}
    </span>
  ) : null;
}

export function LeadForm({
  source,
  defaultIntent = "general",
  includeAddress = false,
  defaultPropertyAddress = "",
  listingId = "",
  pageUrl,
  campaign = {},
}: {
  source: string;
  defaultIntent?: "buy" | "sell" | "invest" | "commercial" | "general";
  includeAddress?: boolean;
  defaultPropertyAddress?: string;
  listingId?: string;
  pageUrl?: string;
  campaign?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}) {
  const [state, formAction, pending] = useActionState(
    submitLead,
    initialLeadState,
  );
  const errorId = (name: string) => `${source}-${name}-error`;
  const hasError = (name: string) => Boolean(state.errors?.[name]?.length);
  const referrerInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (referrerInput.current) {
      referrerInput.current.value = document.referrer;
    }
  }, []);

  return (
    <form className="form-shell form-grid" action={formAction}>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      ) : null}
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="listingId" value={listingId} />
      <input
        type="hidden"
        name="pageUrl"
        value={pageUrl || `/${source}`}
      />
      <input ref={referrerInput} type="hidden" name="referrer" defaultValue="" />
      <input type="hidden" name="utmSource" value={campaign.source || ""} />
      <input type="hidden" name="utmMedium" value={campaign.medium || ""} />
      <input type="hidden" name="utmCampaign" value={campaign.campaign || ""} />
      <input type="hidden" name="utmTerm" value={campaign.term || ""} />
      <input type="hidden" name="utmContent" value={campaign.content || ""} />
      <input
        className="honeypot"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        hidden
      />
      {defaultPropertyAddress ? (
        <div className="form-context field-full">
          <span>You&apos;re asking about</span>
          <strong>{defaultPropertyAddress}</strong>
        </div>
      ) : null}
      <div className="field">
        <label htmlFor={`${source}-name`}>Name</label>
        <input
          id={`${source}-name`}
          name="name"
          type="text"
          defaultValue={state.values?.name}
          autoComplete="name"
          aria-invalid={hasError("name")}
          aria-describedby={hasError("name") ? errorId("name") : undefined}
          required
        />
        <FieldError state={state} name="name" id={errorId("name")} />
      </div>
      <div className="field">
        <label htmlFor={`${source}-email`}>Email</label>
        <input
          id={`${source}-email`}
          name="email"
          type="email"
          defaultValue={state.values?.email}
          autoComplete="email"
          aria-invalid={hasError("email")}
          aria-describedby={hasError("email") ? errorId("email") : undefined}
          required
        />
        <FieldError state={state} name="email" id={errorId("email")} />
      </div>
      <div className="field">
        <label htmlFor={`${source}-phone`}>Phone (optional)</label>
        <input
          id={`${source}-phone`}
          name="phone"
          type="tel"
          defaultValue={state.values?.phone}
          autoComplete="tel"
          aria-invalid={hasError("phone")}
          aria-describedby={hasError("phone") ? errorId("phone") : undefined}
        />
        <FieldError state={state} name="phone" id={errorId("phone")} />
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
            defaultValue={
              state.values?.propertyAddress ?? defaultPropertyAddress
            }
            autoComplete="street-address"
            aria-invalid={hasError("propertyAddress")}
            aria-describedby={
              hasError("propertyAddress")
                ? errorId("propertyAddress")
                : undefined
            }
          />
          <FieldError
            state={state}
            name="propertyAddress"
            id={errorId("propertyAddress")}
          />
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
          aria-invalid={hasError("message")}
          aria-describedby={
            hasError("message") ? errorId("message") : undefined
          }
          required
        />
        <FieldError state={state} name="message" id={errorId("message")} />
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
