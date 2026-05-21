import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error("NEON_DATABASE_URL is not set in environment variables");
}

let pool: Pool | null = null;

function ensurePool() {
  if (!pool) {
    pool = new Pool({ connectionString });
  }
  return pool;
}

export async function getClient(): Promise<Pool> {
  return ensurePool();
}

export const db = drizzle(ensurePool());

export async function closeClient() {
  if (!pool) return;
  await pool.end();
  pool = null;
}
