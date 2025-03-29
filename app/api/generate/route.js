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

  const db = await initDB();

  const existingEntry = await db.get(
    `SELECT id, short_url FROM urls WHERE original_url = ?`,
    [url]
  );

  if (existingEntry) {
    if (!customShortUrl || customShortUrl === existingEntry.short_url) {
      return new Response(
        JSON.stringify({ id: existingEntry.id, shortUrl: existingEntry.short_url }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const customUrlExists = await db.get(
      `SELECT id FROM urls WHERE short_url = ?`,
      [customShortUrl]
    );

    if (customUrlExists) {
      return new Response(
        JSON.stringify({ error: "Custom short URL is already in use." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await db.run(
      `UPDATE urls SET short_url = ? WHERE id = ?`,
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

  const result = await db.run(
    `INSERT INTO urls (original_url, short_url, expiry_date) VALUES (?, ?, ?)`,
    [url, shortUrl, expiryDate.toISOString()]
  );

  return new Response(
    JSON.stringify({ id: result.lastID, shortUrl }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}