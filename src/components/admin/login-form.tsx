"use client";

import { useActionState } from "react";
import {
  login,
  type LoginState,
} from "@/app/actions/auth";

const initialLoginState: LoginState = { status: "idle", message: "" };

function LoginError({ state, field }: { state: LoginState; field: string }) {
  const message = state.errors?.[field]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialLoginState);
  return (
    <form className="form-grid" action={action}>
      <div className="field field-full">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
        <LoginError state={state} field="email" />
      </div>
      <div className="field field-full">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <LoginError state={state} field="password" />
      </div>
      <button className="button button-primary field-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="form-status field-full" data-status={state.status} aria-live="polite">
        {state.message}
      </p>
    </form>
  );
}
