import { initDB } from "../../../connect";
import crypto from "crypto";

export async function POST(req) {
  const { url, customShortUrl } = await req.json();

  if (!url) {
    return new Response(
      JSON.stringify({ error: "URL is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const pool = await initDB();

  // Verifica si la URL original ya existe en la base de datos
  const existingEntryResult = await pool.query(
    `SELECT id, short_url FROM urls WHERE original_url = $1`,
    [url]
  );

  const existingEntry = existingEntryResult.rows[0];

  if (existingEntry) {
    if (!customShortUrl || customShortUrl === existingEntry.short_url) {
      return new Response(
        JSON.stringify({ id: existingEntry.id, shortUrl: existingEntry.short_url }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verifica si el customShortUrl ya está en uso
    const customUrlExistsResult = await pool.query(
      `SELECT id FROM urls WHERE short_url = $1`,
      [customShortUrl]
    );

    if (customUrlExistsResult.rows.length > 0) {
      return new Response(
        JSON.stringify({ error: "Custom short URL is already in use." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Actualiza la URL corta existente con el customShortUrl
    await pool.query(
      `UPDATE urls SET short_url = $1 WHERE id = $2`,
      [customShortUrl, existingEntry.id]
    );

    return new Response(
      JSON.stringify({ id: existingEntry.id, shortUrl: customShortUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // Genera una nueva URL corta
  const shortUrl = customShortUrl || crypto.randomBytes(4).toString("hex");
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 3);

  // Inserta la nueva URL en la base de datos
  const insertResult = await pool.query(
    `INSERT INTO urls (original_url, short_url, expiry_date) VALUES ($1, $2, $3) RETURNING id`,
    [url, shortUrl, expiryDate.toISOString()]
  );

  const newId = insertResult.rows[0].id;

  return new Response(
    JSON.stringify({ id: newId, shortUrl }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}