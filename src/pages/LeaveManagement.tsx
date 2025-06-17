import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

interface LeaveEntry {
  employeeName: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: "Approved" | "Rejected" | "Pending";
}

const leaveHeaders: string[] = [
  "Employee Name",
  "No. of Days",
  "Start Date",
  "End Date",
  "Leave Type",
  "Reason",
  "Status",
  "Actions",
];

const initialLeaveData: LeaveEntry[] = [
  {
    employeeName: "John Doe",
    numberOfDays: 3,
    startDate: "2025-06-10",
    endDate: "2025-06-12",
    leaveType: "Sick Leave",
    reason: "High fever and cold",
    status: "Approved",
  },
  {
    employeeName: "Priya Sharma",
    numberOfDays: 2,
    startDate: "2025-06-15",
    endDate: "2025-06-16",
    leaveType: "Casual Leave",
    reason: "Family function",
    status: "Pending",
  },
  {
    employeeName: "Amit Verma",
    numberOfDays: 1,
    startDate: "2025-06-11",
    endDate: "2025-06-11",
    leaveType: "Sick Leave",
    reason: "Migraine headache",
    status: "Pending",
  },
];

const getStatusStyle = (status: LeaveEntry["status"]) => {
  switch (status) {
    case "Approved":
      return "text-green-600 font-semibold";
    case "Pending":
      return "text-yellow-600 font-semibold";
    case "Rejected":
      return "text-red-600 font-semibold";
    default:
      return "";
  }
};

const LeaveManagement: React.FC = () => {
  const [leaveData, setLeaveData] = useState<LeaveEntry[]>(initialLeaveData);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const updateStatus = (index: number, newStatus: LeaveEntry["status"]) => {
    const updated = [...leaveData];
    updated[index].status = newStatus;
    setLeaveData(updated);
    setDropdownIndex(null);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Employee's Leave Requests</h2>

      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-900 text-white uppercase font-semibold text-sm">
          <tr>
            {leaveHeaders.map((header) => (
              <th key={header} className="px-4 py-3 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaveData.map((leave, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="px-4 py-3">{leave.employeeName}</td>
              <td className="px-4 py-3">{leave.numberOfDays}</td>
              <td className="px-4 py-3">{leave.startDate}</td>
              <td className="px-4 py-3">{leave.endDate}</td>
              <td className="px-4 py-3">{leave.leaveType}</td>
              <td className="px-4 py-3">{leave.reason}</td>
              <td className={`px-4 py-3 ${getStatusStyle(leave.status)}`}>
                {leave.status}
              </td>
              <td className="px-4 py-3 relative">
                {leave.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="p-1 rounded hover:bg-gray-300"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {dropdownIndex === index && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#001f3f] text-white rounded shadow-md z-50">
                        <ul>
                          <li
                            className="px-4 py-2 hover:bg-[#003366] cursor-pointer"
                            onClick={() => updateStatus(index, "Approved")}
                          >
                            Approve
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-[#003366] cursor-pointer"
                            onClick={() => updateStatus(index, "Rejected")}
                          >
                            Reject
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveManagement;
