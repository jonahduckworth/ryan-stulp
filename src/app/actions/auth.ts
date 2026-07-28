"use server";

import { redirect } from "next/navigation";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/schemas";

export type LoginState = {
  status: "idle" | "error";
  message: string;
  errors?: Record<string, string[]>;
};

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check your login details.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!hasPublicSupabaseEnv()) {
    return {
      status: "error",
      message: "Supabase must be connected before admin sign-in is available.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return {
      status: "error",
      message: "The email or password was not accepted.",
    };
  }

  redirect("/admin");
}

export async function logout() {
  if (hasPublicSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
