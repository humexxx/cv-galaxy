import { z } from "zod";

// Detect if running DB tooling (drizzle-kit, seed scripts, etc.)
const isDbTooling = typeof process !== 'undefined' && process.argv?.some((arg) => 
  arg.includes("drizzle") || arg.includes("db/seed") || arg.includes("db\\seed")
);

// Detect if running in browser
const isBrowser = typeof window !== 'undefined';

// Server-side env schema
const serverEnvSchema = z.object({
  OPENAI_API_KEY: isDbTooling 
    ? z.string().optional() 
    : z.string().min(1, "OPENAI_API_KEY is required"),
  NEXT_PUBLIC_BASE_URL: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_URL: isDbTooling
    ? z.string().optional()
    : z.string().min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: isDbTooling
    ? z.string().optional()
    : z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_AUTH_RETURN_URL: z.string().optional(),
});

// Client-side env schema (only NEXT_PUBLIC_* variables are available)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_AUTH_RETURN_URL: z.string().optional(),
});

export type Env = z.infer<typeof serverEnvSchema>;

let cachedEnv: Env | null = null;

function validateEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const schema = isBrowser ? clientEnvSchema : serverEnvSchema;
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment variables");
  }

  cachedEnv = parsed.data as Env;
  return cachedEnv;
}

export const env = new Proxy({} as Env, {
  get(_, prop: string) {
    const validated = validateEnv();
    return validated[prop as keyof Env];
  }
});

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
