import React, { useEffect, useState, useRef } from "react";
import { MoreVertical, ListFilter, ChevronDown } from "lucide-react";
import { getLeaves, updateStatus as updateLeaveStatusAPI } from "../api/leave";
import { LeaveEntry } from "../api/leave";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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

const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveEntry[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<LeaveEntry[]>([]);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    leaveType: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const dropdownRef = useRef(null);
  const user = useSelector((state: RootState) => state.user);
  const role = user?.role;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      const data = await getLeaves();
      setLeaves(data);
      setFilteredLeaves(data);
    };
    fetchLeaves();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(e.target)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let filtered = leaves;

    if (filters.leaveType) {
      filtered = filtered.filter((l) =>
        l.leaveType.toLowerCase().includes(filters.leaveType.toLowerCase())
      );
    }
    if (filters.status) {
      filtered = filtered.filter((l) => l.status === filters.status);
    }
    if (filters.startDate) {
      filtered = filtered.filter(
        (l) => new Date(l.startDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (l) => new Date(l.endDate) <= new Date(filters.endDate)
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          `${l.userId.firstName} ${l.userId.lastName}`
            .toLowerCase()
            .includes(query) || l.leaveType.toLowerCase().includes(query)
      );
    }

    setFilteredLeaves(filtered);
  }, [filters, leaves, searchQuery]);

  const toggleDropdown = (index: number) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const updateStatus = async (
    index: number,
    newStatus: LeaveEntry["status"]
  ) => {
    const leaveId = filteredLeaves[index]?._id;
    try {
      const updatedLeave = await updateLeaveStatusAPI(leaveId, newStatus);
      const updated = [...leaves];
      const leaveIdx = updated.findIndex((l) => l._id === leaveId);
      updated[leaveIdx] = { ...updated[leaveIdx], status: updatedLeave.status };
      setLeaves(updated);
      setDropdownIndex(null);
    } catch (error) {
      console.error("Failed to update leave status:", error);
      alert("Failed to update leave status. Please try again.");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN");

  const handleNavigateLeaveForm = () => {
    navigate("/admin/leave-apply");
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeaves = filteredLeaves.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);

  return (
    <div className="overflow-x-auto p-2 min-h-[600px]">
      <div className="flex items-center justify-between">
        <button
          onClick={handleNavigateLeaveForm}
          className="bg-[#226597] hover:bg-[#113F67] cursor-pointer text-white px-6 py-2 rounded-md text-sm font-medium shadow transition"
        >
          + Request Leave
        </button>

        <div className="relative" ref={dropdownRef}>
          <div className="flex justify-end items-center gap-4 mt-4">
            <input
              type="text"
              placeholder="Search by name or leave type..."
              className="border px-3 py-2 rounded-md w-60 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-[#226597] text-white px-4 py-2 rounded hover:bg-[#1c4c7a]"
            >
              <ListFilter size={20} /> Filters <ChevronDown size={16} />
            </button>
          </div>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded z-50 p-4 space-y-3">
              <div>
                <label className="block text-sm mb-1">Leave Type</label>
                <input
                  type="text"
                  value={filters.leaveType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      leaveType: e.target.value,
                    }))
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="">All</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Start Date From</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">End Date Until</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <button
                onClick={() =>
                  setFilters({
                    leaveType: "",
                    status: "",
                    startDate: "",
                    endDate: "",
                  })
                }
                className="w-full mt-2 bg-gray-200 text-black py-1 rounded hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <table className="w-full text-sm text-left text-[#113F67] mt-4">
        <thead className="bg-[#113F67] text-white uppercase text-sm">
          <tr>
            {leaveHeaders.map((header) => (
              <th
                key={header}
                className="px-4 py-3 font-semibold whitespace-nowrap text-[13px]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentLeaves.map((leave, index) => (
            <tr
              key={index}
              className={`$${
                index % 2 === 0 ? "bg-white" : "bg-[#F3F9FB]"
              } hover:bg-[#E6F0F5] transition duration-200`}
            >
              <td className="px-4 py-3 capitalize font-medium">
                {leave.userId.firstName + " " + leave.userId.lastName}
              </td>
              <td className="px-4 py-3">{leave.noOfDays}</td>
              <td className="px-4 py-3">{formatDate(leave.startDate)}</td>
              <td className="px-4 py-3">{formatDate(leave.endDate)}</td>
              <td className="px-4 py-3 capitalize">{leave.leaveType}</td>
              <td className="px-4 py-3">{leave.reason}</td>
              <td
                className={`px-4 py-3 font-semibold ${
                  leave.status === "Approved"
                    ? "text-green-600"
                    : leave.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {leave.status}
              </td>
              <td className="px-4 py-3 relative">
                {leave.status === "Pending" ? (
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="p-1 rounded-full hover:bg-[#87C0CD] transition"
                    >
                      <MoreVertical size={20} color="#113F67" />
                    </button>
                    {dropdownIndex === index && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#226597] text-white rounded-md shadow-md z-50">
                        <ul className="divide-y divide-[#1b4f74] text-sm">
                          <li
                            className="px-4 py-2 hover:bg-[#87C0CD] cursor-pointer"
                            onClick={() => updateStatus(index, "Approved")}
                          >
                            Approve
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-[#87C0CD] cursor-pointer"
                            onClick={() => updateStatus(index, "Rejected")}
                          >
                            Reject
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 flex justify-center">—</span>
                )}
              </td>
            </tr>
          ))}
          {filteredLeaves.length === 0 && (
            <tr>
              <td
                colSpan={leaveHeaders.length}
                className="text-center py-40 text-gray-500"
              >
                No users found matching the filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {filteredLeaves.length > 0 && (
        <div className="flex justify-between mt-6 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#226597] cursor-pointer text-white rounded-md hover:bg-[#1c4c7a] disabled:opacity-0"
          >
            Prev
          </button>

          <span className="text-sm text-[#113F67]">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#226597] cursor-pointer text-white rounded-md hover:bg-[#1c4c7a] disabled:opacity-0"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
