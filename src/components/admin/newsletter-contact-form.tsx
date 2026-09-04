"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  addNewsletterContact,
  type NewsletterFormState,
} from "@/app/actions/newsletter";

const initialState: NewsletterFormState = { status: "idle", message: "" };

function ErrorText({ state, field }: { state: NewsletterFormState; field: string }) {
  const message = state.errors?.[field]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

export function NewsletterContactForm() {
  const [state, action, pending] = useActionState(
    addNewsletterContact,
    initialState,
  );
  const statusRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state.status]);

  return (
    <form className="admin-form newsletter-contact-form" action={action}>
      <div className="field">
        <label htmlFor="subscriber-first-name">First name</label>
        <input
          id="subscriber-first-name"
          name="firstName"
          defaultValue={state.values?.firstName}
          autoComplete="off"
          required
        />
        <ErrorText state={state} field="firstName" />
      </div>
      <div className="field">
        <label htmlFor="subscriber-last-name">Last name (optional)</label>
        <input
          id="subscriber-last-name"
          name="lastName"
          defaultValue={state.values?.lastName}
          autoComplete="off"
        />
      </div>
      <div className="field">
        <label htmlFor="subscriber-email">Email</label>
        <input
          id="subscriber-email"
          name="email"
          type="email"
          defaultValue={state.values?.email}
          autoComplete="off"
          required
        />
        <ErrorText state={state} field="email" />
      </div>
      <div className="admin-actions field-full">
        <button className="button button-primary" disabled={pending} type="submit">
          {pending ? "Adding…" : "Add subscriber"}
        </button>
        <p
          className="form-status"
          data-status={state.status}
          aria-live="polite"
          ref={statusRef}
          tabIndex={state.status === "idle" ? undefined : -1}
        >
          {state.message}
        </p>
      </div>
    </form>
  );
}
