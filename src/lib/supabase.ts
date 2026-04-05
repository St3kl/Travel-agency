import "server-only";

import { createClient } from "@supabase/supabase-js";

function readSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function isSupabaseConfigured() {
  const { url, serviceRoleKey } = readSupabaseConfig();
  return Boolean(url && serviceRoleKey);
}

export function getSupabaseServerClient() {
  const { url, serviceRoleKey } = readSupabaseConfig();

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
