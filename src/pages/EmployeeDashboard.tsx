import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useEmployeeLeaveStats } from "../hooks/useEmployeeLeaveStats";
import EmployeeBasicDashboard from "./EmployeeBasicDashboard";
import AttendanceTracker from "../components/Attendance/AttendanceTracker";
import Swal from "sweetalert2";

const EmployeeDashboard = () => {
  const { leaveSummary } = useSelector((state: RootState) => state.leave);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEmployeeLeaveStats(setLoading, setHasError);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3">
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          ></path>
        </svg>
        <p className="text-[#226597] font-medium text-lg">
          Fetching dashboard data...
        </p>
      </div>
    );
  }

  if (hasError) {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Failed to fetch leave data. Please try again later.",
      confirmButtonColor: "#226597",
    });

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-2">
        <p className="text-gray-500">
          We couldn’t load dashboard data right now. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-10 space-y-10">
      <div className="w-full flex justify-center">
        <div className="w-[500px]">
          <AttendanceTracker />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <EmployeeBasicDashboard leaveSummary={leaveSummary} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
