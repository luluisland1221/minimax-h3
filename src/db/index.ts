/**
 * Connect to PostgreSQL Database (Supabase/Neon/Local PostgreSQL)
 * https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase
 */
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (db) return db;
  const connectionString =
    process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL or NEON_DATABASE_URL environment variable is required.'
    );
  }
  // Neon's serverless WebSocket pool works in Cloudflare Workers without raw
  // TCP and supports the transactions required by Stripe webhooks and credits.
  const client = new Pool({ connectionString });
  db = drizzle(client, { schema });
  return db;
}

/**
 * Connect to Neon Database
 * https://orm.drizzle.team/docs/tutorials/drizzle-with-neon
 */
// import { drizzle } from 'drizzle-orm/neon-http';
// const db = drizzle(process.env.DATABASE_URL!);

/**
 * Database connection with Drizzle
 * https://orm.drizzle.team/docs/connect-overview
 *
 * Drizzle <> PostgreSQL
 * https://orm.drizzle.team/docs/get-started-postgresql
 *
 * Get Started with Drizzle and Neon
 * https://orm.drizzle.team/docs/get-started/neon-new
 *
 * Drizzle with Neon Postgres
 * https://orm.drizzle.team/docs/tutorials/drizzle-with-neon
 *
 * Drizzle <> Neon Postgres
 * https://orm.drizzle.team/docs/connect-neon
 *
 * Drizzle with Supabase Database
 * https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase
 */
