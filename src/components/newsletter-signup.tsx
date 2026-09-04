"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef } from "react";
import {
  subscribeToMarketUpdates,
  type NewsletterFormState,
} from "@/app/actions/newsletter";

const initialState: NewsletterFormState = { status: "idle", message: "" };

function FieldError({ state, name }: { state: NewsletterFormState; name: string }) {
  const message = state.errors?.[name]?.[0];
  return message ? (
    <span className="field-error" id={`newsletter-${name}-error`}>
      {message}
    </span>
  ) : null;
}

export function NewsletterSignup() {
  const [state, action, pending] = useActionState(
    subscribeToMarketUpdates,
    initialState,
  );
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <section className="newsletter-signup newsletter-signup-success" aria-labelledby="newsletter-title">
        <p className="eyebrow">Market updates</p>
        <h2 id="newsletter-title">You&apos;re on the list.</h2>
        <p ref={statusRef} tabIndex={-1}>
          {state.message} You can unsubscribe from any email.
        </p>
      </section>
    );
  }

  const hasError = (name: string) => Boolean(state.errors?.[name]?.length);
  return (
    <section className="newsletter-signup" aria-labelledby="newsletter-title">
      <div className="newsletter-signup-copy">
        <p className="eyebrow">Stay current</p>
        <h2 id="newsletter-title">Get Ryan&apos;s market updates by email.</h2>
        <p>
          Clear Calgary-area real estate context when Ryan publishes something
          worth knowing. Unsubscribe anytime.
        </p>
      </div>
      <form className="newsletter-signup-form" action={action}>
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="lazyOnload"
          />
        ) : null}
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
          <label htmlFor="newsletter-first-name">First name</label>
          <input
            id="newsletter-first-name"
            name="firstName"
            defaultValue={state.values?.firstName}
            autoComplete="given-name"
            aria-invalid={hasError("firstName") || undefined}
            aria-describedby={hasError("firstName") ? "newsletter-firstName-error" : undefined}
            required
          />
          <FieldError state={state} name="firstName" />
        </div>
        <div className="field">
          <label htmlFor="newsletter-last-name">Last name (optional)</label>
          <input
            id="newsletter-last-name"
            name="lastName"
            defaultValue={state.values?.lastName}
            autoComplete="family-name"
          />
        </div>
        <div className="field newsletter-signup-email">
          <label htmlFor="newsletter-email">Email</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            defaultValue={state.values?.email}
            autoComplete="email"
            aria-invalid={hasError("email") || undefined}
            aria-describedby={hasError("email") ? "newsletter-email-error" : undefined}
            required
          />
          <FieldError state={state} name="email" />
        </div>
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
          <div
            className="cf-turnstile newsletter-turnstile"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        ) : null}
        <button className="button button-primary" disabled={pending} type="submit">
          {pending ? "Subscribing…" : "Send me market updates"}
        </button>
        <p className="form-note">By subscribing, you agree to receive these emails. Unsubscribe anytime.</p>
        <p
          className="form-status"
          data-status={state.status}
          aria-live="polite"
          ref={statusRef}
          tabIndex={state.status === "error" ? -1 : undefined}
        >
          {state.message}
        </p>
      </form>
    </section>
  );
}
