import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { EyeIcon, EyeClosedIcon, TrashIcon } from "lucide-react";
import { getLeaves } from "../api/leave";
import LeaveDetailsModal from "../components/Modal/LeaveDetailsModal";
import { getEmployeeById } from "../api/auth";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { deleteLeave } from "../api/leave";
import Swal from "sweetalert2";

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
    totalPaidYearly: 0,
    totalWfhYearly: 0,
    totalPaidMonthly: 0,
    totalWfhMonthly: 0,
    monthlyApplied: 0,
    approvedCount: 0,
    pendingCount: 0,
    earnedLeavesTillNow: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setHasError(false);
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

        const summary = calculateLeaveSummary(
          data,
          dynamicPlLeft,
          dynamicWfhLeft
        );

        setLeaveSummary(summary);
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId]);

  const navigate = useNavigate();
  const handleNavigateLeaveForm = () => {
    // console.log("leave");
    navigate("/employee/request-leave");
  };
  type LeaveRecord = {
    startDate: string;
    endDate: string | null;
    noOfDays: number;
    dayType: string;
    leaveType: string;
    status: string;
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
    let monthlyApplied = 0;
    let approvedCount = 0;
    let pendingCount = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyPlCap = 1.5;

    for (const leave of leaves) {
      const leaveDate = new Date(leave.startDate);
      const leaveMonth = leaveDate.getMonth();
      const leaveYear = leaveDate.getFullYear();
      const leaveDays = leave.dayType === "halfday" ? 0.5 : leave.noOfDays;

      if (leaveMonth === currentMonth && leaveYear === currentYear) {
        monthlyApplied += 1;
      }

      if (leave.status === "Approved") approvedCount++;
      if (leave.status === "Pending") pendingCount++;

      if (leave.status !== "Approved") continue;

      if (leave.leaveType === "work") {
        wfhUsedAllTime += leaveDays;
        if (leaveMonth === currentMonth && leaveYear === currentYear) {
          wfhUsedThisMonth += leaveDays;
        }
      } else {
        paidUsedAllTime += leaveDays;

        if (leaveMonth === currentMonth && leaveYear === currentYear) {
          const availableThisMonth = monthlyPlCap - paidUsedThisMonth;
          if (availableThisMonth >= leaveDays) {
            paidUsedThisMonth += leaveDays;
          } else {
            paidUsedThisMonth += availableThisMonth;
            unpaidUsedThisMonth += leaveDays - availableThisMonth;
          }
        }
      }
    }

    const startYear =
      leaves.length > 0
        ? new Date(leaves[0].startDate).getFullYear()
        : now.getFullYear();
    const startMonth =
      leaves.length > 0
        ? new Date(leaves[0].startDate).getMonth()
        : now.getMonth();
    const endYear = now.getFullYear();
    const endMonth = now.getMonth();

    function* monthGenerator(
      startY: number,
      startM: number,
      endY: number,
      endM: number
    ) {
      let y = startY;
      let m = startM;
      while (y < endY || (y === endY && m <= endM)) {
        yield { year: y, month: m };
        m++;
        if (m > 11) {
          m = 0;
          y++;
        }
      }
    }

    let carryForward = 0;

    for (const { year, month } of monthGenerator(
      startYear,
      startMonth,
      endYear,
      endMonth
    )) {
      const monthlyPaidLeaves = leaves.filter(
        (leave) =>
          leave.status === "Approved" &&
          leave.leaveType !== "work" &&
          new Date(leave.startDate).getFullYear() === year &&
          new Date(leave.startDate).getMonth() === month
      );

      const used = monthlyPaidLeaves.reduce((sum, leave) => {
        const days = leave.dayType === "halfday" ? 0.5 : leave.noOfDays;
        return sum + days;
      }, 0);

      carryForward = Math.max(carryForward + monthlyPlCap - used, 0);
    }

    const earnedLeavesTillNow = parseFloat(carryForward.toFixed(2));
    const paidLeft = Math.max(plLeftInitial - paidUsedAllTime, 0);

    return {
      paidUsed: parseFloat(paidUsedThisMonth.toFixed(2)),
      unpaidUsed: parseFloat(unpaidUsedThisMonth.toFixed(2)),
      paidLeft: parseFloat(paidLeft.toFixed(2)),
      wfhLeft: Math.max(
        parseFloat((wfhLeftInitial - wfhUsedAllTime).toFixed(2)),
        0
      ),
      totalPaidYearly: parseFloat(paidUsedAllTime.toFixed(2)),
      totalWfhYearly: parseFloat(wfhUsedAllTime.toFixed(2)),
      totalPaidMonthly: parseFloat(paidUsedThisMonth.toFixed(2)),
      totalWfhMonthly: parseFloat(wfhUsedThisMonth.toFixed(2)),
      monthlyApplied,
      approvedCount,
      pendingCount,
      earnedLeavesTillNow,
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
  const handleDeleteLeave = async (id: string) => {
    try {
      await deleteLeave(id);
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== id));
    } catch (error) {
      console.error("Error deleting leave:", error);
      alert(error.response?.data?.message || "Failed to delete leave");
    }
  };

  const cards = [
    // { label: "Paid Leaves Left (PL)", value: leaveSummary.paidLeft },
    { label: "Unpaid Leaves (Monthly)", value: leaveSummary.unpaidUsed },
    { label: "Paid Leaves (Monthly)", value: leaveSummary.paidUsed },
    // { label: "WFH Left", value: leaveSummary.wfhLeft },
    { label: "Paid Leaves Used (Yearly)", value: leaveSummary.totalPaidYearly },
    { label: "WFH Used (Yearly)", value: leaveSummary.totalWfhYearly },
    { label: "WFH Used (Monthly)", value: leaveSummary.totalWfhMonthly },
    { label: "Leaves Applied This Month", value: leaveSummary.monthlyApplied },
    // { label: "Approved Leaves", value: leaveSummary.approvedCount },
    // { label: "Pending Leaves", value: leaveSummary.pendingCount },
    {
      label: "Earned Leaves Till Now",
      value: leaveSummary.earnedLeavesTillNow,
    },
    // { label: "Paid Leaves Yearly", value: 18 },
    // { label: "WFH Yearly", value: 12 },
  ];
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          ></path>
        </svg>
        <p className="text-[#226597] font-medium text-lg">
          Fetching leave records...
        </p>
      </div>
    );
  }

  if (hasError) {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Failed to fetch leave data.",
      confirmButtonColor: "#226597",
    });

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-2">
        <p className="text-gray-500">
          Something went wrong while loading your leave data.
        </p>
        <p className="text-[#226597]">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10 text-[#113F67]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cards.map(({ label, value }) => (
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
                "Actions",
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
                  colSpan={9}
                  className="text-center px-4 py-10 text-gray-500 italic"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <svg
                      className="w-14 h-14 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 000 8h1a4 4 0 004-4v-2m8 4v-2a4 4 0 00-4-4h-1a4 4 0 000 8h1a4 4 0 004-4v-2"
                      />
                    </svg>
                    <p className="text-gray-700 text-lg font-medium">
                      Nothing to see here yet!
                    </p>
                    <p className="text-gray-500 text-sm">
                      Your leave history will appear here once you have
                      submitted requests.
                    </p>
                  </div>
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
                    {leave.endDate
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

                  <td className="px-4 py-3 text-center">
                    {leave.status?.toLowerCase() === "pending" ? (
                      <button
                        onClick={() => handleDeleteLeave(leave._id)}
                        className="text-red-500 hover:text-red-700 transition flex items-center space-x-2"
                      >
                        <TrashIcon size={20} />
                      </button>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
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
