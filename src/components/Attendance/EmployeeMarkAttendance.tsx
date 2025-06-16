import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { markAttendance } from "../../api/attendance";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const EmployeeMarkAttendance = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [status, setStatus] = useState("Present");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  console.log("Redux user:", user);

  const handleSubmit = async () => {
    if (!user || !user.id || !user.name) {
      setError("User not logged in or missing data.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];

    const data = {
      userId: user.id,
      name: user.name,
      date: formattedDate,
      status,
    };

    try {
      console.log("Sending data:", data); // ✅ debug log
      await markAttendance(data);
      setMessage("Attendance marked successfully!");
      setError("");
    } catch (err) {
      console.error("Full error:", err.response?.data);
      setError(
        err?.response?.data?.message?.join(", ") || "Could not mark attendance. Try again."
      );
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Mark Your Attendance
      </h2>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Select Date:</label>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="rounded-lg shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Select Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit Attendance
      </button>

      {message && <p className="text-green-600 text-center">{message}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default EmployeeMarkAttendance;
