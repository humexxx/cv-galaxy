import { z } from "zod";

/**
 * Environment access with fail-fast validation.
 *
 * Two constraints shape this file:
 *
 * 1. `NEXT_PUBLIC_*` variables must appear as literal `process.env.NEXT_PUBLIC_X`
 *    member expressions so Next can inline them into the client bundle. Nothing
 *    below may read them dynamically (no `process.env[key]`).
 * 2. This module is reachable from the browser (lib/services/auth-service.ts
 *    imports `getBaseUrl`), and it is evaluated during `next build`, where
 *    server-only secrets are legitimately absent. So the module-load check only
 *    validates the *shape* of whatever is present; `DATABASE_URL` — the one
 *    truly required variable — is enforced on first read via a getter, which
 *    still fails fast with a clear message instead of surfacing as an opaque
 *    driver error.
 */

// Treat "" the same as unset: an empty string in a .env file is not a value.
// `.optional()` has to live *inside* the pipe: an empty string is a defined
// input, so an outer ZodOptional would not short-circuit it.
const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().min(1).optional()
);

const envSchema = z.object({
  // Server-only
  OPENAI_API_KEY: optionalString,
  DATABASE_URL: optionalString,
  VERCEL_URL: optionalString,
  VERCEL_ENV: optionalString,
  VERCEL_PROJECT_PRODUCTION_URL: optionalString,
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  // Public (inlined at build time)
  NEXT_PUBLIC_BASE_URL: optionalString,
  NEXT_PUBLIC_SUPABASE_URL: optionalString,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
});

const parsed = envSchema.safeParse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${details}`);
}

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
}

const values = parsed.data;

export const env: Env = {
  OPENAI_API_KEY: values.OPENAI_API_KEY,
  NEXT_PUBLIC_BASE_URL: values.NEXT_PUBLIC_BASE_URL,
  VERCEL_URL: values.VERCEL_URL,
  VERCEL_ENV: values.VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL: values.VERCEL_PROJECT_PRODUCTION_URL,
  NODE_ENV: values.NODE_ENV,
  NEXT_PUBLIC_SUPABASE_URL: values.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: values.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  // Required, but only at the moment something actually needs a database.
  // Reading it without it being set throws here rather than 200 frames deep in
  // postgres.js with a "connection refused to localhost:5432".
  get DATABASE_URL(): string {
    if (!values.DATABASE_URL) {
      throw new Error(
        "Missing required environment variable: DATABASE_URL. " +
          "Set it to your Supabase Postgres connection string (see .env.example)."
      );
    }
    return values.DATABASE_URL;
  },
};

/** True when DATABASE_URL is configured, without throwing. */
export function hasDatabaseUrl(): boolean {
  return Boolean(values.DATABASE_URL);
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
