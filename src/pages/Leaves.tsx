import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import { getLeaves } from "../api/leave";
import LeaveDetailsModal from "../components/Modal/LeaveDetailsModal";
import { getEmployeeById } from "../api/auth";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

interface UserLeaves {
  wfhLeft: number;
  plLeft: number;
}

interface userId {
  firstName: string;
  lastName: string;
  leaves: UserLeaves;
}
interface LeaveRecord {
  startDate: string;
  endDate: string;
  noOfDays: number;
  paidDays: number;
  unpaidDays: number;
  leaveType: string;
  dayType: "fullday" | "halfday";
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  userId: userId;
}

const EmployeeLeaveDashboard: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  // const [userData, setUserData] = useState({});
  const { user } = useSelector((state: RootState) => state.user);
  const [userData, setUserData] = useState<userId | null>(null);
  const userId = user?.userId;
  const [leaveSummary, setLeaveSummary] = useState({
    paidUsed: 0,
    unpaidUsed: 0,
    paidLeft: 0,
    wfhLeft: 0,
  });

  useEffect(() => {
  const fetch = async () => {
    const data = await getLeaves();
    setLeaves(data);

    const user = await getEmployeeById(userId);
    setUserData(user);

    const joinDate = new Date(user?.createdAt || "2024-01-01");
    const now = new Date();

    let monthsWorked =
      (now.getFullYear() - joinDate.getFullYear()) * 12 +
      (now.getMonth() - joinDate.getMonth());

    if (now.getDate() < 15) {
      monthsWorked--;
    }

    if (monthsWorked > 12) {
      monthsWorked = 12;
    }

    const dynamicPlLeft = monthsWorked * 1.5;
    const dynamicWfhLeft = monthsWorked * 1;

    console.log("Months Worked:", monthsWorked);
    console.log("Dynamic PL Left:", dynamicPlLeft);
    console.log("Dynamic WFH Left:", dynamicWfhLeft);

    const summary = calculateLeaveSummary(
      data,
      dynamicPlLeft,
      dynamicWfhLeft
    );
         console.log("leaveSummary:", leaveSummary);
    setLeaveSummary(summary);

  };
  fetch();
}, []);

  const navigate = useNavigate();
  const handleNavigateLeaveForm = () => {
    console.log("leave");
    navigate("/employee/request-leave");
  };

const calculateLeaveSummary = (
  leaves: LeaveRecord[],
  plLeftInitial: number,
  wfhLeftInitial: number
) => {
  let paidUsedAllTime = 0;
  let paidUsedThisMonth = 0;
  let unpaidUsedThisMonth = 0;
  let wfhUsedAllTime = 0;
  let wfhUsedThisMonth = 0;
  let monthlyPlUsed = 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyPlCap = 1.5; 

  console.log('Initial Paid Leaves (Monthly):', monthlyPlCap);

  for (const leave of leaves) {
    if (leave.status !== "Approved") continue;

    const leaveDate = new Date(leave.startDate);
    const leaveMonth = leaveDate.getMonth();
    const leaveYear = leaveDate.getFullYear();
    const leaveDays = leave.dayType === "halfday" ? 0.5 : leave.noOfDays;

    console.log(`Leave ${leave.leaveType}: Days = ${leaveDays}, Month = ${leaveMonth}, Year = ${leaveYear}`);

    if (leave.leaveType === "work") {
      wfhUsedAllTime += leaveDays;
      if (leaveMonth === currentMonth && leaveYear === currentYear) {
        wfhUsedThisMonth += leaveDays;
      }
    } 
 
    else {
      paidUsedAllTime += leaveDays;

     
      if (leaveMonth === currentMonth && leaveYear === currentYear) {
        const availableThisMonth = monthlyPlCap - paidUsedThisMonth;

        console.log('Available this month:', availableThisMonth);

        if (availableThisMonth >= leaveDays) {
          paidUsedThisMonth += leaveDays;
        } else {
          paidUsedThisMonth += availableThisMonth;
          unpaidUsedThisMonth += leaveDays - availableThisMonth;
        }
      }
    }
  }

  
  const paidLeft = Math.max(plLeftInitial - paidUsedAllTime, 0);  

  console.log('Paid Leaves Used This Month:', paidUsedThisMonth);
  console.log('Paid Leaves Left:', paidLeft);

  return {
    paidUsed: parseFloat(paidUsedThisMonth.toFixed(2)),
    unpaidUsed: parseFloat(unpaidUsedThisMonth.toFixed(2)),
    paidLeft: parseFloat(paidLeft.toFixed(2)),
    wfhLeft: Math.max(parseFloat((wfhLeftInitial - wfhUsedAllTime).toFixed(2)), 0),
  };
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: "Paid Leaves Left (PL)",
            value: leaveSummary.paidLeft,
          },
          {
            label: "Unpaid Leaves (Monthly)",
            value: leaveSummary.unpaidUsed,
          },
          {
            label: "Paid Leaves (Monthly)",
               value: leaveSummary.paidUsed,
          },
          {
            label: "WFH",
            value: leaveSummary.wfhLeft,
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
   
      <div className="text-right">
        <button
          onClick={handleNavigateLeaveForm}
          className="bg-[#226597] hover:bg-[#113F67] text-white px-6 py-2 rounded-md text-sm font-medium shadow transition"
        >
          + Request Leave
        </button>
      </div>

      <div className="bg-white overflow-x-auto">
        <div className="p-2">
          <h2 className="text-lg font-semibold text-[#113F67]">
            Leave History
          </h2>
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
                    {leave.endDate !== null
                      ? new Date(leave.endDate).toLocaleDateString("en-IN")
                      : "Not Applicable"}
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
