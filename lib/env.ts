import { z } from "zod";

// Detect if running DB tooling (drizzle-kit, seed scripts, etc.)
const isDbTooling = process.argv.some((arg) => 
  arg.includes("drizzle") || arg.includes("db/seed") || arg.includes("db\\seed")
);

const envSchema = z.object({
  OPENAI_API_KEY: isDbTooling 
    ? z.string().optional() 
    : z.string().min(1, "OPENAI_API_KEY is required"),
  NEXT_PUBLIC_BASE_URL: z.url().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_URL: isDbTooling
    ? z.string().optional()
    : z.url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: isDbTooling
    ? z.string().optional()
    : z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", z.treeifyError(parsed.error));
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = validateEnv();

export function getBaseUrl(): string {
  if (env.NEXT_PUBLIC_BASE_URL) {
    return env.NEXT_PUBLIC_BASE_URL;
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
