import { urlService } from "../../../lib/urlService";
import crypto from "crypto";

/**
 * Handles GET requests for retrieving the original URL associated with a short URL.
 * 
 * @async
 * @function GET
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<Response>} A redirect response to the original URL if found, 
 * or a redirect to an error page if the short URL is invalid, expired, or not found.
 * 
 * @description
 * - Extracts the short URL from the request path.
 * - Redirects to an error page if the short URL is missing or invalid.
 * - Checks if the short URL exists in the database.
 * - Verifies if the short URL has expired.
 * - Increments the click count for the short URL.
 * - Redirects to the original URL if all checks pass.
 * - Handles errors and redirects to an error page in case of failure.
 */

/**
 * Handles POST requests for creating a new short URL.
 * 
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<Response>} A JSON response containing the created short URL 
 * or an error message if the request fails.
 * 
 * @description
 * - Parses the request body to extract the original URL and optional custom short URL.
 * - Validates that the original URL is provided.
 * - Checks if the custom short URL is already in use.
 * - Generates a unique short URL if no custom short URL is provided.
 * - Ensures the generated short URL does not already exist in the database.
 * - Creates a new short URL entry in the database with a 3-day expiry date.
 * - Returns the created short URL and its ID in the response.
 * - Handles errors and returns appropriate error messages in case of failure.
 */

export async function GET(req) {
  const shortUrl = req.nextUrl.pathname.split("/").pop();

  if (!shortUrl) {
    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    return Response.redirect(`${baseUrl}/errorPage`, 302);
  }

  try {
    const urlData = await urlService.getUrlByShortCode(shortUrl);

    if (!urlData) {
      const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      return Response.redirect(`${baseUrl}/errorPage`, 302);
    }

    const now = new Date();
    const expiryDate = new Date(urlData.expiryDate); 
    if (now > expiryDate) {
      console.info(`Short URL expired: ${shortUrl}`);
      const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      return Response.redirect(`${baseUrl}/errorPage`, 302);
    }

    await urlService.incrementClick(shortUrl);

    return Response.redirect(urlData.originalUrl, 302);
  } catch (error) {
    console.error("Error handling request:", error);
    const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    return Response.redirect(`${baseUrl}/errorPage`, 302);
  }
}

export async function POST(req) {
  const { url, customShortUrl } = await req.json();

  if (!url) {
    return new Response(
      JSON.stringify({ error: "La URL es obligatoria. Por favor, proporciona una URL válida." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Verificar si el customShortUrl ya está en uso
    if (customShortUrl) {
      const customExists = await urlService.getUrlByShortCode(customShortUrl);
      if (customExists) {
        return new Response(
          JSON.stringify({ error: "La URL personalizada ya está en uso. Por favor, elige otra." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Generar un shortUrl único si no se proporciona uno personalizado
    let shortUrl = customShortUrl || crypto.randomBytes(4).toString("hex");

    // Verificar si el shortUrl generado ya existe
    let shortUrlExists = await urlService.getUrlByShortCode(shortUrl);
    while (shortUrlExists) {
      shortUrl = crypto.randomBytes(4).toString("hex");
      shortUrlExists = await urlService.getUrlByShortCode(shortUrl);
    }

    // Crear la nueva URL
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    const newEntry = await urlService.createShortUrl(url, shortUrl, expiryDate);

    return new Response(
      JSON.stringify({
        message: "URL acortada creada con éxito.",
        id: newEntry.id,
        shortUrl: newEntry.shortUrl,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al crear la URL:", error);
    return new Response(
      JSON.stringify({
        error: "Ocurrió un error interno al intentar crear la URL. Por favor, inténtalo de nuevo más tarde.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
