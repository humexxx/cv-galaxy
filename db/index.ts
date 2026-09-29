import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

type Database = PostgresJsDatabase<typeof schema>;

/**
 * Connection pooling on Vercel.
 *
 * Every serverless invocation gets its own Node process, so a "pool" here is
 * per-instance and they all stack up against the same Supabase connection
 * limit. Keep it at one connection per instance in production and let it be
 * reclaimed quickly; locally a handful is fine and avoids serialising the dev
 * server's parallel server-component fetches.
 */
const connectionOptions = {
  // One socket per lambda instance. Concurrency comes from instance count.
  max: env.VERCEL_ENV ? 1 : 5,
  // Hand the connection back to Supabase quickly once the request is done.
  idle_timeout: 20,
  // Fail loudly instead of hanging the whole function on its 10s/60s budget.
  connect_timeout: 10,
  // Required when the URL points at Supabase's transaction-mode pooler
  // (pgBouncer, port 6543), which cannot carry named prepared statements
  // across pooled sessions. Harmless on a direct connection (port 5432).
  prepare: false,
} as const;

// Built lazily: `next build` imports every route module, and opening a pool (or
// throwing on a missing DATABASE_URL) at import time would break builds that
// legitimately have no database — CI, for one.
let instance: Database | undefined;

function getDb(): Database {
  if (!instance) {
    instance = drizzle(postgres(env.DATABASE_URL, connectionOptions), { schema });
  }
  return instance;
}

export const db = new Proxy({} as Database, {
  get(_target, property) {
    const value = Reflect.get(getDb() as object, property);
    return typeof value === "function" ? value.bind(getDb()) : value;
  },
});
