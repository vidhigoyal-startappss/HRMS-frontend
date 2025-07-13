import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getMyAttendance, getTodayAllAttendance } from "../api/attendance";

interface AttendanceRecord {
  checkInTime?: string;
  checkOutTime?: string;
  location?: string;
  userId?: {
    firstName?: string;
    lastName?: string;
    role?: string;
  };
}

const AttendanceManagement = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [myAttendance, setMyAttendance] = useState<AttendanceRecord[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const isAdmin = ["HR", "Admin", "SuperAdmin", "Manager"].includes(user?.role);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const allToday = await getTodayAllAttendance();
          setTodayAttendance(allToday || []);
        }
        const mine = await getMyAttendance();
        setMyAttendance(mine || []);
      } catch (err) {
        console.error("Attendance Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAttendance();
  }, [user, isAdmin]);

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "--";

  const formatTime = (timeStr?: string) =>
    timeStr ? new Date(timeStr).toLocaleTimeString() : "--";

  return (
    <div className="p-4 space-y-8">
      {/* My Attendance */}
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-semibold mb-4 text-[#113F67]">
          My Attendance History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-md text-sm">
            <thead className="bg-[#113F67] text-white text-left">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Check-In</th>
                <th className="px-4 py-2">Check-Out</th>
                <th className="px-4 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-[#226597]">
                    Loading...
                  </td>
                </tr>
              ) : myAttendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-[#226597]">
                    No records found
                  </td>
                </tr>
              ) : (
                myAttendance.map((emp, i) => (
                  <tr
                    key={i}
                    className="hover:bg-blue-50 transition-colors text-[#226597]"
                  >
                    <td className="px-4 py-2">{formatDate(emp.checkInTime)}</td>
                    <td className="px-4 py-2">{formatTime(emp.checkInTime)}</td>
                    <td className="px-4 py-2">
                      {formatTime(emp.checkOutTime)}
                    </td>
                    <td className="px-4 py-2">{emp.location || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin View */}
      {isAdmin && (
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#113F67]">
            Today's Attendance (All Employees)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-md text-sm">
              <thead className="bg-[#113F67] text-white text-left">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Check-In</th>
                  <th className="px-4 py-2">Check-Out</th>
                  <th className="px-4 py-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-[#226597]">
                      Loading...
                    </td>
                  </tr>
                ) : todayAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-[#226597]">
                      No records found
                    </td>
                  </tr>
                ) : (
                  todayAttendance.map((emp, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50 transition-colors text-[#226597]"
                    >
                      <td className="px-4 py-2">{emp.user?.name || "N/A"}</td>
                      <td className="px-4 py-2">{emp.role || "Employee"}</td>
                      <td className="px-4 py-2">
                        {formatTime(emp.checkInTime)}
                      </td>
                      <td className="px-4 py-2">
                        {formatTime(emp.checkOutTime)}
                      </td>
                      <td className="px-4 py-2">{emp.location || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
