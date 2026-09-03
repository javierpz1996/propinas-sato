import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let anonClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Faltan variables de entorno de Supabase. Define ${name} en tu .env.local.`
    );
  }
  return value;
}

export function getSupabaseAnonServerClient(): SupabaseClient {
  if (!anonClient) {
    const url = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL");
    const anonKey = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_ANON_KEY");

    anonClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return anonClient;
}

/**
 * Cliente "admin" usando SERVICE_ROLE_KEY.
 *
 * Úsalo solo en el servidor (por ejemplo, en rutas API). No lo uses en el cliente.
 */
export function getSupabaseAdminServerClient(): SupabaseClient {
  if (!adminClient) {
    const url = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL");
    const serviceRoleKey = getEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY");

    adminClient = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return adminClient;
}

