import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const verifyAdmin = cache(async () => {
  if (!hasPublicSupabaseEnv()) redirect("/admin/login?setup=required");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return {
    id: user.id,
    email: user.email ?? "",
    displayName: profile.display_name as string,
    role: profile.role as "admin",
  };
});
