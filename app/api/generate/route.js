import { urlService } from "../../../lib/urlService";
import crypto from "crypto";

/**
 * Handles the POST request to generate a shortened URL.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<Response>} A promise that resolves to an HTTP response object.
 *
 * @description
 * This function processes a POST request to create a shortened URL. It accepts a JSON payload
 * containing the following properties:
 * - `url` (string): The original URL to be shortened. This field is required.
 * - `customShortUrl` (string, optional): A custom short URL provided by the user.
 *
 * The function performs the following steps:
 * 1. Validates the presence of the `url` field in the request body.
 * 2. Checks if the URL already exists in the database:
 *    - If it exists and no custom short URL is provided, the existing entry is returned.
 *    - If a custom short URL is provided and it matches the existing entry, the existing entry is returned.
 *    - If a custom short URL is provided but already in use, an error response is returned.
 *    - Otherwise, the existing entry is updated with the custom short URL and returned.
 * 3. If the URL does not exist, a new shortened URL is generated:
 *    - A random short URL is created if no custom short URL is provided.
 *    - The new entry is saved in the database with an expiry date set to 3 days from creation.
 * 4. Handles potential errors, including unique constraint violations (e.g., duplicate custom short URLs).
 *
 * @throws {Response} Returns an HTTP response with appropriate status codes and error messages:
 * - 400: If the `url` field is missing or the custom short URL is already in use.
 * - 500: If an internal error occurs during URL creation.
 *
 * @example
 * // Request payload
 * {
 *   "url": "https://example.com",
 *   "customShortUrl": "example123"
 * }
 *
 * // Successful response
 * {
 *   "message": "Shortened URL successfully created.",
 *   "id": "12345",
 *   "shortUrl": "example123"
 * }
 *
 * // Error response (missing URL)
 * {
 *   "error": "The URL is required. Please provide a valid URL."
 * }
 */
export async function POST(req) {
  const { url, customShortUrl } = await req.json();

  if (!url) {
    return new Response(
      JSON.stringify({ error: "The URL is required. Please provide a valid URL." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let existingEntry = await urlService.getUrlByShortCode(url);

  if (existingEntry) {
    if (!customShortUrl || customShortUrl === existingEntry.short_url) {
      return new Response(JSON.stringify(existingEntry), { status: 200 });
    }

    let customExists = await urlService.customShortUrlExists(customShortUrl);
    if (customExists) {
      return new Response(
        JSON.stringify({ error: "The custom URL is already in use. Please choose another one." }),
        { status: 400 }
      );
    }

    existingEntry = await urlService.updateShortUrl(existingEntry.id, customShortUrl);
    return new Response(JSON.stringify(existingEntry), { status: 200 });
  }

  const shortUrl = customShortUrl || crypto.randomBytes(4).toString("hex");
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 3);

  try {
    const newEntry = await urlService.createShortUrl(url, shortUrl, expiryDate);
    return new Response(
      JSON.stringify({
        message: "Shortened URL successfully created.",
        id: newEntry.id,
        shortUrl: newEntry.shortUrl,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating the URL:", error);

    if (error.code === "P2002" && error.meta && error.meta.target.includes("shortUrl")) {
      return new Response(
        JSON.stringify({
          error: "The custom name is already in use. Please choose another name.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        error: "An internal error occurred while trying to create the URL. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
