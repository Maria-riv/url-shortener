import prisma from "../lib/db.js";

/**
 * Service for managing URLs in the database.
 */
export const urlService = {
  /**
   * Obtiene una URL por su ID.
   * @async
   * @param {number} id - El ID de la URL a obtener.
   * @returns {Promise<object|null>} La URL si se encuentra, o null si no.
   */
  async getUrlById(id) {
    return prisma.url.findUnique({ where: { id } });
  },

  /**
   * Obtiene una URL por su código corto.
   * @async
   * @param {string} shortUrl - El código corto de la URL.
   * @returns {Promise<object|null>} La URL si se encuentra, o null si no.
   */
  async getUrlByShortCode(shortUrl) {
    return prisma.url.findUnique({ where: { shortUrl } });
  },

  /**
   * Crea una nueva URL acortada.
   * @async
   * @param {string} originalUrl - La URL original.
   * @param {string} shortUrl - El código corto para la URL.
   * @param {Date} expiryDate - La fecha de expiración de la URL.
   * @returns {Promise<object>} La URL creada.
   */
  async createShortUrl(originalUrl, shortUrl, expiryDate) {
    return prisma.url.create({
      data: { originalUrl, shortUrl, expiryDate },
    });
  },

  /**
   * Incrementa el contador de clics de una URL acortada.
   * @async
   * @param {string} shortUrl - El código corto de la URL.
   * @returns {Promise<object>} La URL actualizada.
   */
  async incrementClick(shortUrl) {
    return prisma.url.update({
      where: { shortUrl },
      data: { clicks: { increment: 1 } },
    });
  },

  /**
   * Verifica si un código corto personalizado ya existe.
   * @async
   * @param {string} customShortUrl - El código corto personalizado.
   * @returns {Promise<object|null>} La URL si el código existe, o null si no.
   */
  async customShortUrlExists(customShortUrl) {
    return prisma.url.findUnique({ where: { shortUrl: customShortUrl } });
  },

  /**
   * Actualiza un código corto de una URL.
   * @async
   * @param {number} id - El ID de la URL a actualizar.
   * @param {string} newShortUrl - El nuevo código corto.
   * @returns {Promise<object>} La URL actualizada.
   */
  async updateShortUrl(id, newShortUrl) {
    return prisma.url.update({ where: { id }, data: { shortUrl: newShortUrl } });
  },

  /**
   * Actualiza una URL en la base de datos.
   * @async
   * @param {number} id - El ID de la URL a actualizar.
   * @param {object} data - Los campos a actualizar (originalUrl, shortUrl, expiryDate).
   * @returns {Promise<object>} La URL actualizada.
   */
  async updateUrl(id, data) {
    return prisma.url.update({
      where: { id },
      data,
    });
  },
};
