"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * Navbar Component
 *
 * This component renders the navigation bar for the application.
 * It includes:
 * - A clickable logo that redirects to the home page.
 * - A title for the application.
 * - A "More Info" button that navigates to the informational page.
 *
 * The navigation bar is styled with Tailwind CSS for a clean and responsive design.
 *
 * @component
 * @returns {JSX.Element} The rendered navigation bar.
 */
export const Navbar = () => {
    const router = useRouter();

    /**
     * Navigates the user to the "More Info" page.
     */
    const handleMoreInfo = () => {
        router.push('/moreInfo'); 
    };

    /**
     * Navigates the user to the home page when the logo is clicked.
     */
    const handleLogoClick = () => {
        router.push('/'); 
    };

    return (
        <nav className="h-16 flex justify-between items-center px-8 bg-gradient-to-r from-gray-100 to-gray-200 shadow-md">
            <div className="flex items-center space-x-4">
                <div
                    onClick={handleLogoClick}
                    className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-blue-600 transition-all"
                >
                    LS
                </div>
                <h1 className="text-gray-800 text-3xl font-semibold tracking-wide">
                    Link Shortener
                </h1>
            </div>
            <div>
                <button
                    onClick={handleMoreInfo}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium shadow-md"
                >
                    More Info
                </button>
            </div>
        </nav>
    );
};
