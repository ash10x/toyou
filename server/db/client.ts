import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

let pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function ensurePool() {
  if (!pool) {
    const connectionString = process.env.NEON_DATABASE_URL;
    if (!connectionString) {
      throw new Error("NEON_DATABASE_URL is not set in environment variables");
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

function ensureDb() {
  if (!_db) {
    _db = drizzle(ensurePool());
  }
  return _db;
}

// Proxy defers pool/db initialization until a query method is actually called,
// so importing this module during Next.js build does not require NEON_DATABASE_URL.
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    return Reflect.get(ensureDb(), prop as string);
  },
});

export async function getClient(): Promise<Pool> {
  return ensurePool();
}

export async function closeClient() {
  if (!pool) return;
  await pool.end();
  pool = null;
}
