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
 */
export async function GET(req) {
  const pool = await initDB();
  const shortUrl = req.nextUrl.pathname.split("/").pop();

  if (!shortUrl) {
    console.error("Short URL is missing in the request.");
    const errorPageURL = new URL("/errorPage", req.url);
    return Response.redirect(errorPageURL, 302);
  }
  try {
    const result = await pool.query(
      `SELECT * FROM urls WHERE short_url = $1`,
      [shortUrl]
    );

    if (result.rows.length === 0) {
      console.warn(`Short URL not found: ${shortUrl}`);
      const errorPageURL = new URL("/errorPage", req.url);
      return Response.redirect(errorPageURL, 302);
    }

    const urlData = result.rows[0];
    const now = new Date();
    const expiryDate = new Date(urlData.expiry_date);

    if (now > expiryDate) {
      console.info(`Short URL expired: ${shortUrl}`);
      const errorPageURL = new URL("/errorPage", req.url);
      return Response.redirect(errorPageURL, 302);
    }

    await pool.query(
      `UPDATE urls SET clicks = clicks + 1 WHERE short_url = $1`,
      [shortUrl]
    );

    return Response.redirect(urlData.original_url, 302);
  } catch (error) {
    console.error("Error handling request:", error);
    const errorPageURL = new URL("/errorPage", req.url);
    return Response.redirect(errorPageURL, 302);
  } 
}
