import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { getLeaves } from "../api/leave";
import { LeaveEntry } from "../api/leave";
import { updateStatus as updateLeaveStatusAPI } from "../api/leave";

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
  const [leaves, setLeaves] = useState<LeaveEntry[]>([]);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      const data = await getLeaves();
      setLeaves(data);
    };
    fetchLeaves();
  }, []);

  const toggleDropdown = (index: number) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const updateStatus = async (
    index: number,
    newStatus: LeaveEntry["status"]
  ) => {
    const leaveId = leaves[index]?._id;
    console.log(leaveId)
    try {
      const updatedLeave = await updateLeaveStatusAPI(leaveId, newStatus);
      const updated = [...leaves];
      updated[index] = { ...updated[index], status: updatedLeave.status };
      setLeaves(updated);
      setDropdownIndex(null);
    } catch (error) {
      console.error("Failed to update leave status:", error);
      alert("Failed to update leave status. Please try again.");
    }
  };
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN");

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
          {leaves.map((leave, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="px-4 py-3">
                {leave.userId.firstName + " " + leave.userId.lastName}
              </td>
              <td className="px-4 py-3">
               {leave?.noOfDays}
              </td>
              <td className="px-4 py-3">{formatDate(leave.startDate)}</td>
              <td className="px-4 py-3">{formatDate(leave.endDate)}</td>
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
