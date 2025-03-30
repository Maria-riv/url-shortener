import prisma from "../lib/db.js";

/**
 * Service for managing URLs in the database.
 */
export const urlService = {
  /**
   * Retrieves a URL by its ID.
   * @async
   * @param {number} id - The ID of the URL to retrieve.
   * @returns {Promise<object|null>} The URL if found, or null if not.
   */
  async getUrlById(id) {
    return prisma.url.findUnique({ where: { id } });
  },

  /**
   * Retrieves a URL by its short code.
   * @async
   * @param {string} shortUrl - The short code of the URL.
   * @returns {Promise<object|null>} The URL if found, or null if not.
   */
  async getUrlByShortCode(shortUrl) {
    return prisma.url.findUnique({ where: { shortUrl } });
  },

  /**
   * Creates a new shortened URL.
   * @async
   * @param {string} originalUrl - The original URL.
   * @param {string} shortUrl - The short code for the URL.
   * @param {Date} expiryDate - The expiration date of the URL.
   * @returns {Promise<object>} The created URL.
   */
  async createShortUrl(originalUrl, shortUrl, expiryDate) {
    return prisma.url.create({
      data: { originalUrl, shortUrl, expiryDate },
    });
  },

  /**
   * Increments the click counter of a shortened URL.
   * @async
   * @param {string} shortUrl - The short code of the URL.
   * @returns {Promise<object>} The updated URL.
   */
  async incrementClick(shortUrl) {
    return prisma.url.update({
      where: { shortUrl },
      data: { clicks: { increment: 1 } },
    });
  },

  /**
   * Checks if a custom short code already exists.
   * @async
   * @param {string} customShortUrl - The custom short code.
   * @returns {Promise<object|null>} The URL if the code exists, or null if not.
   */
  async customShortUrlExists(customShortUrl) {
    return prisma.url.findUnique({ where: { shortUrl: customShortUrl } });
  },

  /**
   * Updates the short code of a URL.
   * @async
   * @param {number} id - The ID of the URL to update.
   * @param {string} newShortUrl - The new short code.
   * @returns {Promise<object>} The updated URL.
   */
  async updateShortUrl(id, newShortUrl) {
    return prisma.url.update({ where: { id }, data: { shortUrl: newShortUrl } });
  },

  /**
   * Updates a URL in the database.
   * @async
   * @param {number} id - The ID of the URL to update.
   * @param {object} data - The fields to update (originalUrl, shortUrl, expiryDate).
   * @returns {Promise<object>} The updated URL.
   */
  async updateUrl(id, data) {
    return prisma.url.update({
      where: { id },
      data,
    });
  },
};
