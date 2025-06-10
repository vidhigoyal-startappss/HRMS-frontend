import React, { useState, useEffect } from "react";
import { getAllAttendance, updateAttendance } from "../api/attendance";

const statusColor = {
  Present: "bg-green-100 text-green-700",
  Absent: "bg-red-100 text-red-700",
  Late: "bg-yellow-100 text-yellow-700",
};

const Attendance = () => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllAttendance(); // No role or userId params
      setAttendanceData(data);
    } catch (error) {
      console.error("Failed to fetch attendance", error);
      setError("Failed to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = attendanceData.filter((entry) => {
    const entryDate = entry.date.includes("T") ? entry.date.split("T")[0] : entry.date;

    return (
      entry.name.toLowerCase().includes(search.toLowerCase()) &&
      (!dateFilter || entryDate === dateFilter)
    );
  });

  const startEdit = (entry) => {
    setEditId(entry._id);
    setEditName(entry.name);
    setEditDate(entry.date.includes("T") ? entry.date.split("T")[0] : entry.date);
    setEditStatus(entry.status);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDate("");
    setEditStatus("");
  };

  const saveEdit = async () => {
    try {
      await updateAttendance(editId, {
        name: editName,
        date: editDate,
        status: editStatus,
      });
      cancelEdit();
      fetchAttendance(); // Just fetch again without params
    } catch (error) {
      console.error("Failed to update attendance", error);
      alert("Error updating attendance. Please try again.");
    }
  };

  // Since no role filter, allow edit unconditionally or you can remove edit check
  const canEdit = true;

  return (
    <div className="p-6 space-y-6 min-h-screen text-[#212121]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-56 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-blue-900 text-white text-sm">
            <tr>
              <th className="py-3 px-4 uppercase">#</th>
              <th className="py-3 px-4 uppercase">Name</th>
              <th className="py-3 px-4 uppercase">Date</th>
              <th className="py-3 px-4 uppercase">Status</th>
              {canEdit && <th className="py-3 px-4 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={canEdit ? 5 : 4} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 5 : 4} className="text-center py-6 text-gray-500">
                  No matching records found.
                </td>
              </tr>
            ) : (
              filtered.map((entry, index) => (
                <tr
                  key={entry._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-indigo-50 transition-all border-b border-gray-200`}
                >
                  <td className="py-3 px-4">{index + 1}</td>

                  <td className="py-3 px-4">
                    {editId === entry._id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-gray-300 rounded p-1 w-full"
                      />
                    ) : (
                      entry.name
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {editId === entry._id ? (
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="border border-gray-300 rounded p-1"
                      />
                    ) : (
                      entry.date.includes("T") ? entry.date.split("T")[0] : entry.date
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {editId === entry._id ? (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="border border-gray-300 rounded p-1"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    ) : (
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          statusColor[entry.status]
                        }`}
                      >
                        {entry.status}
                      </span>
                    )}
                  </td>

                  {canEdit && (
                    <td className="py-3 px-4 space-x-2">
                      {editId === entry._id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(entry)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
