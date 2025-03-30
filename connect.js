import { Pool } from "pg";
import "dotenv/config";

/**
 * Database connection pool
 *
 * This pool is used to manage connections to the PostgreSQL database.
 * It uses environment variables to configure the connection details.
 */
const pool = new Pool({
  user: process.env.NEXT_PUBLIC_POSTGRES_USER,
  host: process.env.NEXT_PUBLIC_POSTGRES_HOST, 
  database: process.env.NEXT_PUBLIC_POSTGRES_DB, 
  password: process.env.NEXT_PUBLIC_POSTGRES_PASSWORD, 
  port: parseInt(process.env.NEXT_PUBLIC_POSTGRES_PORT, 10), 
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.NEXT_PUBLIC_DATABASE_CA, 
  },
});

/**
 * Initializes the database
 *
 * This function connects to the database and ensures that the required table (`urls`) exists.
 * If the table does not exist, it creates it with the following columns:
 * - `id`: Primary key (auto-incremented).
 * - `original_url`: The original long URL.
 * - `short_url`: The shortened URL (unique).
 * - `expiry_date`: The expiration date of the shortened URL.
 * - `clicks`: The number of times the shortened URL has been accessed (default is 0).
 *
 * @async
 * @function initDB
 * @returns {Pool} The database connection pool.
 * @throws {Error} If there is an issue connecting to the database or creating the table.
 */
export async function initDB() {
  try {
    const client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_url TEXT NOT NULL UNIQUE,
        expiry_date TIMESTAMP NOT NULL,
        clicks INTEGER DEFAULT 0
      )
    `);

    client.release();
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
    throw error; 
  }

  return pool; 
}
