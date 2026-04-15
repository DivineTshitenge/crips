import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/load-local-env";

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`${name} manquant dans .env.local`);
  return value;
}

export function createSupabaseAnonClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", getSupabaseUrl());
  const anonKey = requireEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    getSupabaseAnonKey()
  );
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createSupabaseServiceRoleClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", getSupabaseUrl());
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY", getSupabaseServiceRoleKey());
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function isAdminUser(user: User): Promise<boolean> {
  if (user.app_metadata?.role === "admin") return true;

  const service = createSupabaseServiceRoleClient();

  const { data: existingProfile, error: profileErr } = await service
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profileErr && existingProfile?.role === "admin") return true;

  const { count, error: countErr } = await service
    .from("profiles")
    .select("*", { head: true, count: "exact" })
    .eq("role", "admin");
  if (countErr) return false;

  // Bootstrap: si aucun admin n'existe, le premier utilisateur connecté devient admin.
  if ((count ?? 0) === 0) {
    const { error: upsertErr } = await service.from("profiles").upsert(
      {
        id: user.id,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          "Admin CRIPS",
        avatar_url: user.user_metadata?.avatar_url ?? null,
        role: "admin",
      },
      { onConflict: "id" }
    );
    return !upsertErr;
  }

  return false;
}
