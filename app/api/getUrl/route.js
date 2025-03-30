import { urlService } from "../../../lib/urlService";

/**
 * Handles GET requests to retrieve URL details by ID.
 *
 * @async
 * @function GET
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<Response>} A promise that resolves to an HTTP response:
 * - 200: Contains the URL details in JSON format.
 * - 400: If the ID is missing or invalid, returns an error message in JSON format.
 * - 404: If no URL is found for the given ID, returns an error message in JSON format.
 * - 500: If an internal server error occurs, returns an error message in JSON format.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return new Response(
      JSON.stringify({ error: "A valid numeric ID is required." }),
      { status: 400 }
    );
  }

  try {
    const urlDetails = await urlService.getUrlById(id);
    if (!urlDetails) {
      return new Response(JSON.stringify({ error: "URL not found." }), { status: 404 });
    }

    return new Response(JSON.stringify(urlDetails), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 });
  }
}
