import { initDB } from "../../../connect";

/**
 * Handles GET requests to retrieve information about a short URL by its ID.
 *
 * This function queries the database to fetch details about a short URL
 * based on the provided `id` parameter. If the `id` is invalid, not found,
 * or if there is a server error, it returns an appropriate error response.
 *
 * @async
 * @function GET
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<Response>} A JSON response with the URL details or an error message.
 *

 */
export async function GET(req) {
  const { searchParams } = new URL(req.url); 
  const id = searchParams.get("id"); 

  if (!id || isNaN(Number(id))) {
    return new Response(
      JSON.stringify({ error: "A valid numeric ID is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const db = await initDB();

  try {
    const result = await db.get(
      `SELECT id, original_url, short_url, expiry_date, clicks FROM urls WHERE id = ?`,
      [id]
    );

    if (!result) {
      return new Response(
        JSON.stringify({ error: "URL not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const responsePayload = {
      id: result.id,
      originalUrl: result.original_url,
      shortUrl: result.short_url,
      expiryDate: result.expiry_date,
      clicks: result.clicks,
    };

    return new Response(
      JSON.stringify(responsePayload),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching URL:", error);

    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}