import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LeaveManagementNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleNavigate = (path: string) => navigate(path);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      setError(false);

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.2;
          success ? resolve(true) : reject("API failed");
        }, 1000);
      });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <svg
          className="animate-spin h-12 w-12 text-[#226597]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          />
        </svg>
        <p className="text-[#226597] font-medium text-lg">Fetching Leave...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <h2 className="text-2xl font-bold text-red-600">Oops!</h2>
        <p className="text-gray-700 text-center max-w-sm">
          Something went wrong while fetching the leave data. Please try again
          later.
        </p>
        <button
          onClick={fetchLeaveData}
          className="mt-4 px-6 py-2 bg-[#113F67] text-white rounded-lg hover:bg-[#0d2e4f] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 mt-40">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl text-center border border-gray-100 transform transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <h1 className="text-3xl font-bold text-[#113F67] mb-3 tracking-tight">
          Leave Management
        </h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
          Manage and review employee leave requests effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => handleNavigate("/admin/leaves")}
            className="flex-1 bg-[#113F67] text-white font-semibold py-3 rounded-lg shadow-md
                       hover:bg-[#0d2e4f] hover:scale-[1.02] transition-all duration-200 text-base sm:text-lg"
          >
            View Your Leave History
          </button>

          <button
            onClick={() => handleNavigate("/admin/leave-requests")}
            className="flex-1 bg-[#226597] text-white font-semibold py-3 rounded-lg shadow-md
                       hover:bg-[#1b4e73] hover:scale-[1.02] transition-all duration-200 text-base sm:text-lg"
          >
            Manage Employee Leave Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementNavigation;
