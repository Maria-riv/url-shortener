import { initDB } from "../../../connect";

/**
 * Handles GET requests for the short URL redirection API.
 *
 * This function retrieves the original URL associated with a given short URL
 * from the database, checks its validity and expiration, increments the click
 * counter, and redirects the user to the original URL. If the short URL is
 * invalid, expired, or not found, the user is redirected to an error page.
 *
 * @async
 * @function GET
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<Response>} A response object that either redirects to the
 * original URL or an error page.
 *
 * @throws {Error} If there is an issue with the database query or other unexpected errors.
 *
 * @example
 * const response = await GET(request);
 * console.log(response.status); // 302 (redirect)
 */
export async function GET(req) {
  const db = await initDB();
  const shortUrl = req.nextUrl.pathname.split("/").pop();

  if (!shortUrl) {
    console.error("Short URL is missing in the request.");
    const errorPageURL = new URL("/errorPage", req.url);
    return Response.redirect(errorPageURL, 302);
  }

  try {
    const result = await db.get(`SELECT * FROM urls WHERE short_url = ?`, [shortUrl]);

    if (!result) {
      console.warn(`Short URL not found: ${shortUrl}`);
      const errorPageURL = new URL("/errorPage", req.url);
      return Response.redirect(errorPageURL, 302);
    }

    const now = new Date();
    const expiryDate = new Date(result.expiry_date);

    if (now > expiryDate) {
      console.info(`Short URL expired: ${shortUrl}`);
      const errorPageURL = new URL("/errorPage", req.url);
      return Response.redirect(errorPageURL, 302);
    }

    await db.run(`UPDATE urls SET clicks = clicks + 1 WHERE short_url = ?`, [shortUrl]);

    return Response.redirect(result.original_url, 302);
  } catch (error) {
    console.error("Error handling request:", error);
    const errorPageURL = new URL("/errorPage", req.url);
    return Response.redirect(errorPageURL, 302);
  }
}
