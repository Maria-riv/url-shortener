import { initDB } from "../../../connect";

/**
 * Cleans up expired URLs from the database.
 *
 * This function deletes all URLs from the database where the expiry date
 * has passed. It returns the number of deleted records and a timestamp.
 *
 * @async
 * @function DELETE
 * @returns {Response} A JSON response with the cleanup result or an error message.
 */
export async function DELETE() {
  const db = await initDB();
  const now = new Date().toISOString();

  try {
    // Eliminar URLs expiradas
    const { changes } = await db.run(`DELETE FROM urls WHERE expiry_date < ?`, [now]);

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        message: `${changes} expired URLs deleted.`,
        timestamp: now,
        status: "success",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Registro del error
    console.error("Error during cleanup:", error);

    // Respuesta de error
    return new Response(
      JSON.stringify({
        error: "Failed to delete expired URLs.",
        status: "error",
        timestamp: now,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
