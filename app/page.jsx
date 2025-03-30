"use client";
import React, { useState } from "react";
import StatsModal from "@/components/StatsModal";

/**
 * Home Component
 *
 * This is the main page of the URL Shortener app. It allows users to:
 * - Enter a long URL to shorten.
 * - Optionally provide a custom short URL.
 * - Generate a shortened URL and display it.
 * - View statistics for the generated URL (e.g., number of clicks).
 *
 * The page is styled with Tailwind CSS for a clean and responsive design.
 *
 * @component
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  const [url, setUrl] = useState("");
  const [customShortUrl, setCustomShortUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [generatedId, setGeneratedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [linkData, setLinkData] = useState(null);

  /**
   * Validates if the input is a valid URL.
   *
   * @param {string} input - The URL to validate.
   * @returns {boolean} True if the URL is valid, false otherwise.
   */
  const isValidUrl = (input) => {
    try {
      new URL(input);
      return true;
    } catch (_) {
      return false;
    }
  };

  /**
   * Handles the "Shorten" button click.
   * Sends a POST request to the `/api/generate` endpoint to create a short URL.
   */
  const handleShorten = async () => {
    if (!url.trim()) {
      setError("⚠️ Please enter a URL.");
      return;
    }

    if (!isValidUrl(url)) {
      setError("⚠️ Invalid URL format. Please enter a valid URL.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          customShortUrl: customShortUrl.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(`${window.location.origin}/api/${data.shortUrl}`);
        setGeneratedId(data.id);
      } else {
        setError(data.error || "An unexpected error occurred.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches statistics for the generated short URL.
   * Sends a GET request to the `/api/getUrl` endpoint to retrieve link data.
   */
  const fetchLinkData = async () => {
    if (!generatedId) {
      setError("No link has been generated yet.");
      return;
    }

    try {
      const response = await fetch(`/api/getUrl?id=${generatedId}`);
      const data = await response.json();

      if (response.ok) {
        setLinkData(data);
        setShowModal(true);
      } else {
        setError(data.error || "Failed to fetch link data.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <main className="flex flex-col h-220 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-800">
      <div className="flex-grow flex justify-center items-center">
        <div className="p-10 bg-white rounded-lg shadow-lg space-y-6 flex flex-col items-center w-full max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">
              URL Shortener
            </h1>
            <p className="mt-3 text-gray-600 text-lg">
              Shorten your long URLs quickly and easily!
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="flex flex-row items-center space-x-3 w-full">
              <input
                type="url"
                placeholder="Enter your long URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg outline-none text-base w-full focus:ring-4 focus:ring-blue-400 placeholder-gray-400 text-gray-800"
              />
              <input
                type="text"
                placeholder="Enter a custom short URL (optional)"
                value={customShortUrl}
                onChange={(e) => setCustomShortUrl(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg outline-none text-base w-full focus:ring-4 focus:ring-blue-400 placeholder-gray-400 text-gray-800"
              />
              <button
                onClick={handleShorten}
                className={`px-5 py-3 text-white font-semibold rounded-lg transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 transform hover:scale-105"
                }`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Shorten"}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {shortUrl && (
              <div className="text-center mt-4">
                <p className="text-gray-600 mb-2 text-lg">
                  Here is your shortened URL (valid for 3 days):
                </p>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline font-medium hover:text-blue-700"
                >
                  {shortUrl}
                </a>
              </div>
            )}
          </div>
          {generatedId && (
            <button
              onClick={fetchLinkData}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
            >
              View Link Stats
            </button>
          )}
        </div>
      </div>

      <StatsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        clicks={linkData?.clicks || 0}
      />

      <footer className="p-6 mt-auto text-center text-gray-600 bg-gray-200">
        <p>&copy; 2025 URL Shortener by María Rivera.</p>
      </footer>
    </main>
  );
}
