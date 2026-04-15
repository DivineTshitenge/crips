/**
 * Variables admin lues depuis process.env (remplies par loadEnvConfig dans next.config.ts
 * + .env.local). Ne pas utiliser fs ici : ce module est importé par le middleware Edge.
 */
export function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD?.trim();
}

export function getAdminSessionSecret(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET?.trim();
}

export function getSupabaseUrl(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim()
  );
}

export function getSupabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}
