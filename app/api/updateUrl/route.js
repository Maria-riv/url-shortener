import { urlService } from "../../../lib/urlService";

/**
 * Handles the HTTP PUT request to update a URL in the system.
 *
 * @async
 * @function PUT
 * @param {Request} req - The HTTP request object containing the JSON payload.
 * @returns {Promise<Response>} A Response object with the result of the update operation.
 *
 * @throws {Response} Returns a 400 status response if the `id` is missing or if the `shortUrl` is already in use.
 * @throws {Response} Returns a 500 status response if an internal error occurs during the update process.
 *
 * The JSON payload in the request body should have the following structure:
 * @typedef {Object} UpdateUrlPayload
 * @property {string} id - The unique identifier of the URL to update (required).
 * @property {string} [originalUrl] - The new original URL to associate with the short URL (optional).
 * @property {string} [shortUrl] - The custom short URL to update (optional).
 * @property {string} [expiryDate] - The new expiration date for the URL (optional).
 *
 * The response will have the following structure:
 * - On success (status 200):
 *   {
 *     "message": "The URL was successfully updated.",
 *     "updatedUrl": {Object} // The updated URL object.
 *   }
 * - On error (status 400 or 500):
 *   {
 *     "error": "Error message describing the issue."
 *   }
 */
export async function PUT(req) {
    const { id, originalUrl, shortUrl, expiryDate } = await req.json();

    if (!id) {
        return new Response(
            JSON.stringify({ error: "The ID is required to update the URL." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        if (shortUrl) {
            const existingShortUrl = await urlService.customShortUrlExists(shortUrl);
            if (existingShortUrl && existingShortUrl.id !== id) {
                return new Response(
                    JSON.stringify({ error: "The shortUrl is already in use. Please choose another." }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }
        }

        const updatedUrl = await urlService.updateUrl(id, { originalUrl, shortUrl, expiryDate });

        return new Response(
            JSON.stringify({
                message: "The URL was successfully updated.",
                updatedUrl,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error updating the URL:", error);
        return new Response(
            JSON.stringify({ error: "An internal error occurred while trying to update the URL." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
