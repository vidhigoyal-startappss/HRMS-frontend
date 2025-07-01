import React, { useEffect, useState } from "react";
import Calendar from "rc-calendar";
import "rc-calendar/assets/index.css"; // Correct CSS for rc-calendar
import dayjs from "dayjs";
import { markAttendance, getMyAttendance } from "../api/attendance";


const statusColors = {
  Present: "bg-green-500",
  Absent: "bg-red-500",
  Late: "bg-yellow-400",
};

const CalendarView = ({ onClose }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const data = await getMyAttendance();
      setAttendanceData(data);
    } catch (error) {
      showToast("Failed to load attendance data");
      console.error(error);
    }
  };

  const getStatusForDate = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const entry = attendanceData.find(
      (e) => dayjs(e.date).format("YYYY-MM-DD") === formattedDate
    );
    return entry?.status || null;
  };

  const getTileClass = ({ date, view }) => {
    if (view !== "month") return "";
    const status = getStatusForDate(date);
    return status ? `${statusColors[status]} text-white font-bold rounded-full` : "";
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
    const today = dayjs().startOf("day");
    const clicked = dayjs(date).startOf("day");

    if (!clicked.isSame(today)) {
      showToast("⚠️ You can only mark attendance for today!");
      return;
    }

    setSelectedDate(date);
  };

  const handleMarkAttendance = async () => {
    const today = dayjs().format("YYYY-MM-DD");

    const alreadyMarked = attendanceData.find(
      (entry) => dayjs(entry.date).format("YYYY-MM-DD") === today
    );

    if (alreadyMarked) {
      showToast("Attendance already marked for today.");
      return;
    }

    setLoading(true);

    try {
      const res = await markAttendance({
        date: today,
        status,
      });

      showToast("✅ Attendance marked successfully!");
      await fetchAttendanceData();
      setSelectedDate(null);
    } catch (error) {
      console.error("Error marking attendance", error);
      showToast("Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white rounded-xl relative">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 Mark Attendance</h2>

      <Calendar
        tileClassName={getTileClass}
        tileContent={getTileContent}
        onClickDay={handleClickDay}
        tileDisabled={({ date }) => {
          const day = dayjs(date).day();
          return day === 0 || day === 6;
        }}
        className="w-full"
      />

      {selectedDate && dayjs(selectedDate).isSame(dayjs(), "day") && (
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
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-3 text-center">
        You can only mark today's attendance, and only once.
      </p>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
