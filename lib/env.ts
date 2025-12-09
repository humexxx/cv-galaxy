export interface Env {
  OPENAI_API_KEY?: string;
  NEXT_PUBLIC_BASE_URL?: string;
  VERCEL_URL?: string;
  VERCEL_ENV?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  NODE_ENV?: "development" | "production" | "test";
  DATABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  NEXT_PUBLIC_AUTH_RETURN_URL?: string;
}

export const env: Env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
  DATABASE_URL: process.env.DATABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_AUTH_RETURN_URL: process.env.NEXT_PUBLIC_AUTH_RETURN_URL,
};

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
