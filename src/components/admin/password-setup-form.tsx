"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { passwordSetupSchema } from "@/lib/schemas";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PasswordSetupForm() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("Verifying your invitation…");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let active = true;

    async function prepareSession() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const code = new URL(window.location.href).searchParams.get("code");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) throw error;
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
      }

      window.history.replaceState({}, "", "/admin/set-password");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw userError ?? new Error("Missing user");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut();
        throw profileError ?? new Error("Not an administrator");
      }

      if (active) {
        setReady(true);
        setMessage("");
      }
    }

    prepareSession().catch(() => {
      if (active) {
        setMessage(
          "This invitation is invalid or expired. Request a new invitation.",
        );
      }
    });

    return () => {
      active = false;
    };
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const parsed = passwordSetupSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      setMessage("Check the password requirements.");
      setPending(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    if (error) {
      setMessage("The password could not be saved. Request a new invitation.");
      setPending(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field field-full">
        <label htmlFor="password">New password</label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          required
          disabled={!ready || pending}
        />
        {errors.password?.[0] ? (
          <span className="field-error">{errors.password[0]}</span>
        ) : null}
      </div>
      <div className="field field-full">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
          required
          disabled={!ready || pending}
        />
        {errors.confirmPassword?.[0] ? (
          <span className="field-error">{errors.confirmPassword[0]}</span>
        ) : null}
      </div>
      <button
        className="button button-primary field-full"
        disabled={!ready || pending}
      >
        {pending ? "Saving…" : "Save password"}
      </button>
      <p
        className="form-status field-full"
        data-status={message ? "error" : "idle"}
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
