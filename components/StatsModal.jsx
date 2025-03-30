import React from "react";

/**
 * StatsModal Component
 *
 * This component renders a modal to display statistics for a shortened link.
 * It shows the total number of clicks and includes a button to close the modal.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isOpen - Determines if the modal is visible.
 * @param {function} props.onClose - Function to close the modal.
 * @param {number} props.clicks - The total number of clicks for the link.
 * @returns {JSX.Element|null} The rendered modal if `isOpen` is true, otherwise `null`.
 */
const StatsModal = ({ isOpen, onClose, clicks }) => {
  // If the modal is not open, return null to avoid rendering anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-80">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Link Statistics</h2>
        <p className="text-gray-700">
          Total Clicks: <span className="font-semibold">{clicks}</span>
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StatsModal;