import { initDB } from "../../../connect";
import crypto from "crypto";
/**
 * Handles POST requests to generate or update a short URL.
 *
 * This function checks if the provided URL already exists in the database.
 * If it exists, it either returns the existing short URL or updates it with a custom short URL.
 * If the URL does not exist, it generates a new short URL and stores it in the database.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<Response>} A JSON response with the short URL or an error message.
 */
export async function POST(req) {
  const { url, customShortUrl } = await req.json();

  if (!url) {
    return new Response(
      JSON.stringify({ error: "URL is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const pool = await initDB();

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

    await pool.query(
      `UPDATE urls SET short_url = $1 WHERE id = $2`,
      [customShortUrl, existingEntry.id]
    );

    return new Response(
      JSON.stringify({ id: existingEntry.id, shortUrl: customShortUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const shortUrl = customShortUrl || crypto.randomBytes(4).toString("hex");
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 3);

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