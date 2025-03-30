'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * ErrorPage Component
 *
 * This component displays an error page when a user tries to access an expired or invalid URL.
 * It provides a message explaining the issue and a button to navigate back to the home page.
 *
 * @component
 * @returns {JSX.Element} The rendered error page.
 */
const ErrorPage = () => {
    const router = useRouter();

    /**
     * Handles the "Back to Home" button click.
     * Navigates the user back to the home page.
     */
    const handleGoBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center justify-center text-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg">
                <h1 className="text-4xl font-extrabold text-red-600 mb-4">
                    🚫 Expired URL
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    The address you tried to access has expired or is no longer valid.
                </p>
                <button
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium shadow-md"
                    onClick={handleGoBack}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;