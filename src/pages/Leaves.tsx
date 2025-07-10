import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { EyeIcon,EyeClosedIcon } from "lucide-react";
import { getLeaves } from "../api/leave";
import LeaveDetailsModal from "../components/Modal/LeaveDetailsModal";
import { getEmployeeById } from "../api/auth";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

interface UserLeaves{
  wfhLeft: number;
  plLeft: number;
}

interface userId{
  firstName:string;
  lastName:string;
  leaves: UserLeaves;
}
interface LeaveRecord {
  startDate: string;
  endDate: string;
  noOfDays: number;
  leaveType: string;
  dayType: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  userId: userId
}


const EmployeeLeaveDashboard: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [userData, setUserData] = useState({});
  const { user } = useSelector((state: RootState) => state.user);
    const userId =  user?.userId;
  useEffect(() => {
    const fetch = async () => {
      const data = await getLeaves();
      console.log(data)
      setLeaves(data);
      const user = await getEmployeeById(userId)
      setUserData(user)
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
    <div className="max-w-6xl mx-auto p-4 space-y-10 text-[#113F67]">
  {/* Summary Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {[
      {
        label: "Paid Leaves Left (PL)",
        value: userData?.leaves?.plLeft || 'Not Available',
      },
      {
        label: "Unpaid Leaves (Monthly)",
        value: 0,
      },
      {
        label: "WFH",
        value: userData?.leaves?.wfhLeft || 'Not Available',
      },
    ].map(({ label, value }) => (
      <div
        key={label}
        className="bg-[#113F67] p-3 rounded-xl shadow-md text-center text-white"
      >
        <h2 className="text-base sm:text-lg font-medium mb-1">{label}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    ))}
  </div>

  {/* Request Leave Button */}
  <div className="text-right">
    <button
      onClick={handleNavigateLeaveForm}
      className="bg-[#226597] hover:bg-[#113F67] text-white px-6 py-2 rounded-md text-sm font-medium shadow transition"
    >
      + Request Leave
    </button>
  </div>

  {/* Leave History Table */}
  <div className="bg-white overflow-x-auto">
    <div className="p-2">
      <h2 className="text-lg font-semibold text-[#113F67]">Leave History</h2>
    </div>
    <table className="min-w-full text-sm text-left text-[#113F67]">
      <thead className="bg-[#113F67] text-white text-xs uppercase">
        <tr>
          {[
            "Start Date",
            "End Date",
            "No. of Days",
            "Leave Type",
            "Day Type",
            "Reason",
            "Status",
            "Details",
          ].map((head) => (
            <th key={head} className="px-4 py-3 whitespace-nowrap">
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {leaves.length === 0 ? (
          <tr>
            <td
              colSpan={8}
              className="text-center px-4 py-6 text-gray-500 italic"
            >
              No leave history found.
            </td>
          </tr>
        ) : (
          leaves.map((leave, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-[#F3F9FB]"
              } hover:bg-[#E6F0F5] transition`}
            >
              <td className="px-4 py-3">
                {new Date(leave.startDate).toLocaleDateString("en-IN")}
              </td>
              <td className="px-4 py-3">
                {new Date(leave.endDate).toLocaleDateString("en-IN")}
              </td>
              <td className="px-4 py-3">{leave.noOfDays}</td>
              <td className="px-4 py-3 capitalize">{leave.leaveType}</td>
              <td className="px-4 py-3 capitalize">{leave.dayType}</td>
              <td className="px-4 py-3">{leave.reason}</td>
              <td className="px-4 py-3">
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
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => openModal(leave)}
                  className="text-[#113F67] hover:text-[#226597] transition"
                >
                  <EyeIcon size={20} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Modal */}
  <LeaveDetailsModal
    isOpen={isModalOpen}
    onClose={closeModal}
    leave={selectedLeave}
  />

  <Outlet />
</div>


  );
};

export default EmployeeLeaveDashboard;
