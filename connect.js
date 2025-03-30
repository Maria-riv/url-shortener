import { Pool } from "pg";
import "dotenv/config";
console.log({
  user: process.env.NEXT_PUBLIC_POSTGRES_USER,
  host: process.env.NEXT_PUBLIC_POSTGRES_HOST,
  database: process.env.NEXT_PUBLIC_POSTGRES_DB,
  password: process.env.NEXT_PUBLIC_POSTGRES_PASSWORD,
  port: process.env.NEXT_PUBLIC_POSTGRES_PORT,
  ca: process.env.NEXT_PUBLIC_DATABASE_CA,
});

const pool = new Pool({
  user: process.env.NEXT_PUBLIC_POSTGRES_USER,
  host: process.env.NEXT_PUBLIC_POSTGRES_HOST,
  database: process.env.NEXT_PUBLIC_POSTGRES_DB,
  password: process.env.NEXT_PUBLIC_POSTGRES_PASSWORD,
  port: parseInt(process.env.NEXT_PUBLIC_POSTGRES_PORT, 10),
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.NEXT_PUBLIC_DATABASE_CA, // Certificado leído desde la variable de entorno
  },
});

export async function initDB() {
  try {
    const client = await pool.connect();
    console.log("Conexión exitosa a la base de datos");

    // Crear la tabla 'urls' si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_url TEXT NOT NULL UNIQUE,
        expiry_date TIMESTAMP NOT NULL,
        clicks INTEGER DEFAULT 0
      )
    `);
    console.log("Tabla 'urls' verificada o creada exitosamente");

    client.release();
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
    throw error;
  }

  // Devuelve el pool para que pueda ser reutilizado
  return pool;
}
