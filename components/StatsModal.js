import React from "react";

const StatsModal = ({ isOpen, onClose, clicks }) => {
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