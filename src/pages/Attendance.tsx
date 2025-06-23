import React, { useState, useEffect } from "react";
import CalendarView from "./CalenderView";
import { markAttendance, getAllAttendance, updateAttendance } from "../api/attendance";
import dayjs from "dayjs";

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
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllAttendance();
      setAttendanceData(data);
    } catch (error) {
      console.error("Failed to fetch attendance", error);
      setError("Failed to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = async (date) => {
    setCalendarLoading(true);
    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      await markAttendance({ date: formattedDate });
      await fetchAttendance();
      setShowCalendar(false);
    } catch (error) {
      alert("Failed to mark attendance");
    } finally {
      setCalendarLoading(false);
    }
  };

  const filtered = attendanceData.filter((entry) => {
    const entryDate = entry.date.includes("T") ? entry.date.split("T")[0] : entry.date;
    const fullName = `${entry.userId?.firstName ?? ""} ${entry.userId?.lastName ?? ""}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) &&
      (!dateFilter || entryDate === dateFilter)
    );
  });

  const startEdit = (entry) => {
    setEditId(entry._id);
    setEditDate(entry.date.includes("T") ? entry.date.split("T")[0] : entry.date);
    setEditStatus(entry.status);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditDate("");
    setEditStatus("");
  };

  const saveEdit = async () => {
    try {
      await updateAttendance(editId, {
        date: editDate,
        status: editStatus,
      });
      cancelEdit();
      fetchAttendance();
    } catch (error) {
      console.error("Failed to update attendance", error);
      alert("Error updating attendance. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-10 min-h-screen text-[#212121]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Attendance Records</h1>
        <button
          onClick={() => setShowCalendar(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Mark Attendance
        </button>
      </div>

      {/* Filters */}
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-blue-900 text-white text-sm">
            <tr>
              <th className="py-3 px-4 uppercase">#</th>
              <th className="py-3 px-4 uppercase">Name</th>
              <th className="py-3 px-4 uppercase">Date</th>
              <th className="py-3 px-4 uppercase">Status</th>
              <th className="py-3 px-4 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-6">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-gray-500">No matching records found.</td></tr>
            ) : (
              filtered.map((entry, index) => (
                <tr
                  key={entry._id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-indigo-50 transition-all border-b border-gray-200`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 capitalize">{entry.userId?.firstName} {entry.userId?.lastName}</td>
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
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColor[entry.status]}`}>
                        {entry.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    {editId === entry._id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >Save</button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
                        >Cancel</button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(entry)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >Edit</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl relative">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Click a date to mark your attendance</h2>
            <CalendarView
              attendanceData={attendanceData}
              onDateClick={handleDateClick}
              key={attendanceData.length} // 👈 This will force re-render when new attendance is added
  tileClassName={getTileClass}
  tileContent={getTileContent}
  onClickDay={handleClickDay}
  className="w-full"
            />
            {calendarLoading && (
              <p className="text-sm text-gray-500 mt-2">Marking attendance...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
