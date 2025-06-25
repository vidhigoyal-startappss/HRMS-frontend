import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { EyeIcon,EyeClosedIcon } from "lucide-react";
import { getLeaves } from "../api/leave";
import LeaveDetailsModal from "../components/Modal/LeaveDetailsModal";
interface LeaveRecord {
  startDate: string;
  endDate: string;
  noOfDays: number;
  leaveType: string;
  dayType: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

const EmployeeLeaveDashboard: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const data = await getLeaves();
      setLeaves(data);
    };
    fetch();
  }, []);
  const navigate = useNavigate();
  const handleNavigateLeaveForm = () => {
    console.log("leave");
    navigate("/employee/request-leave");
  };
  const calculateLeaveDays = (
    startDate: string,
    endDate: string,
    dayType: string
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let dayDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    dayDiff += 1;
    if (dayType === "halfday") {
      return 0.5;
    }
    return dayDiff;
  };
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

const openModal = (leave: LeaveRecord) => {
  setSelectedLeave(leave);
  setIsModalOpen(true);
};

const closeModal = () => {
  setSelectedLeave(null);
  setIsModalOpen(false);
};

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Leave Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-blue-100 p-2 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold">Total Leaves</h2>
          <p className="text-lg font-bold"></p>
        </div>
        <div className="bg-green-100 p-2 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold">Paid Leaves</h2>
          <p className="text-lg font-bold"></p>
        </div>
        <div className="bg-red-100 p-2 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold">Unpaid Leaves</h2>
          <p className="text-lg font-bold"></p>
        </div>
        <div className="bg-yellow-100 p-2 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold">WFH</h2>
          <p className="text-lg font-bold"></p>
        </div>
      </div>

      {/* Leave Request Button */}
      <div className="text-right">
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          onClick={handleNavigateLeaveForm}
        >
          + Request Leave
        </button>
      </div>

      {/* Leave History Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <h2 className="text-xl font-semibold p-4 border-b">Leave History</h2>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-950  text-white">
            <tr>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">No. of Days</th>
              <th className="px-4 py-2">Leave Type</th>
              <th className="px-4 py-2">Day Type</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">View Details</th>

            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {leave.noOfDays}
                </td>
                <td className="px-4 py-2">{leave.leaveType}</td>
                <td className="px-4 py-2">{leave.dayType}</td>
                <td className="px-4 py-2">{leave.reason}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      leave.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : leave.status === "Rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td className="px-4 py-2 cursor-pointer" onClick={()=>openModal(leave)}><EyeIcon size={20}/></td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center px-4 py-4 text-gray-500">
                  No leave history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
      </div>
      <div>
      <LeaveDetailsModal
  isOpen={isModalOpen}
  onClose={closeModal}
  leave={selectedLeave}
/>
      </div>
      <Outlet />
    </div>
  );
};

export default EmployeeLeaveDashboard;
