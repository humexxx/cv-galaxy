import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please check your .env file."
    );
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please check your .env file."
    );
  }
  return key;
}

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop: string | symbol) {
    if (!supabaseInstance) {
      supabaseInstance = createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey());
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (supabaseInstance as any)[prop];
  }
});

export function createClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey());
}
