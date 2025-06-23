import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { markAttendance, getAllAttendance, getMyAttendance } from "../api/attendance";

const statusColors = {
  Present: "bg-green-500",
  Absent: "bg-red-500",
  Late: "bg-yellow-400",
};

const CalendarView = ({ onClose }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  fetchAttendanceData();
}, []);

const fetchAttendanceData = async () => {
  try {
    const data = await getMyAttendance();  // 👈 Only current user's data
    setAttendanceData(data);
  } catch (error) {
    console.error("Failed to load attendance data", error);
  }
};

  const getStatusForDate = (date) => {
  const today = dayjs(date).format("YYYY-MM-DD");
  const entry = attendanceData.find(e => dayjs(e.date).format("YYYY-MM-DD") === today);
  return entry?.status || null;
};


  const getTileClass = ({ date, view }) => {
  if (view !== "month") return "";
  const status = getStatusForDate(date);
  return status
    ? `${statusColors[status]} text-white font-bold rounded-full`
    : "";
};


  const getTileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const entries = attendanceData.filter(
      (entry) => dayjs(entry.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")
    );

    if (!entries.length) return null;

    return (
      <div className="mt-1 text-[10px] text-gray-700 space-y-1">
    {entries.map((entry, idx) => (
  <div key={idx} className="bg-white rounded px-1 py-0.5 shadow text-[10px]">
    <span className="block">{entry.status}</span>
    {entry.time && (
      <span className="text-[9px] text-gray-500">
        {dayjs(entry.time, "HH:mm:ss").format("hh:mm A")}
      </span>
    )}
  </div>
))}

  </div>
    );
  };

  const handleClickDay = (date) => {
    setSelectedDate(date);
  };

  const handleMarkAttendance = async () => {
    if (!selectedDate || !status) return;
    setLoading(true);
    try {
      await markAttendance({ date: dayjs(selectedDate).format("YYYY-MM-DD"), status });
      await fetchAttendanceData(); 
      setSelectedDate(null);
    } catch (error) {
      console.error("Error marking attendance", error);
      alert("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 Mark Attendance</h2>

      <Calendar
        tileClassName={getTileClass}
        tileContent={getTileContent}
        onClickDay={handleClickDay}
        className="w-full"
      />

      {selectedDate && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-md font-medium text-gray-700 mb-2">
            Marking for: {dayjs(selectedDate).format("DD MMM YYYY")}
          </h3>
          <div className="flex items-center gap-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
            <button
              onClick={handleMarkAttendance}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-3 text-center">
        Click on a date to mark or update attendance.
      </p>
    </div>
  );
};

export default CalendarView;
