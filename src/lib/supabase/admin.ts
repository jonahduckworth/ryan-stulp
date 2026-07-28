import "server-only";

import { createClient } from "@supabase/supabase-js";
import { hasServiceSupabaseEnv } from "./env";

export function createSupabaseAdminClient() {
  if (!hasServiceSupabaseEnv()) {
    throw new Error("Supabase service environment variables are not configured.");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
