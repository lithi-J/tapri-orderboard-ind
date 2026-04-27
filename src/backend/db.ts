import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.SUPABASE_HOST,
  port: parseInt(process.env.SUPABASE_PORT || '5432'),
  database: process.env.SUPABASE_DB,
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

export const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log('[db]: Starting auto-migrations...');

    // Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        group_name TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        items JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        pickup_time TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at BIGINT NOT NULL,
        urgent BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);

    // Notifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at BIGINT NOT NULL
      );
    `);

    console.log('[db]: Auto-migrations completed successfully.');
  } catch (err) {
    console.error('[db]: Migration error:', err);
    throw err;
  } finally {
    client.release();
  }
};
