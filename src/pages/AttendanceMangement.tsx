import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  getMyAttendance,
  getAllAttendance,
  getTodayAttendance,
} from "../api/attendance";

const AttendanceManagement = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [myAttendance, setMyAttendance] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = ["HR", "Admin", "SuperAdmin", "Manager"].includes(user?.role);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const data = await getTodayAttendance();
          setTodayAttendance(data?.records || []);
        }
        const myData = await getMyAttendance();
        setMyAttendance(myData);
      } catch (err) {
        console.error("Attendance Fetch Error:", err);
      }
      setLoading(false);
    };

    fetchAttendance();
  }, []);

  return (
    <div className="p-3">
      {/* My Attendance */}
      <div className="bg-white rounded-xl p-4 mb-5">
        <h2 className="text-lg font-semibold mb-4 text-[#113F67]">
          My Attendance History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-md">
            <thead className="bg-[#113F67] text-white text-left text-base capitalize">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Check-In</th>
                <th className="px-4 py-2">Check-Out</th>
                <th className="px-4 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {myAttendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-[#226597]">
                    No records found
                  </td>
                </tr>
              ) : (
                myAttendance.map((record, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50 transition-colors text-[#226597] text-sm"
                  >
                    <td className="px-4 py-2 ">
                      {record.checkInTime ? new Date(record.checkInTime).toISOString().split("T")[0] : "--"}

                    </td>
                    <td className="px-4 py-2 ">
                      {record.checkInTime
                        ? new Date(record.checkInTime).toLocaleTimeString()
                        : "--"}
                    </td>
                    <td className="px-4 py-2">
                      {record.checkOutTime
                        ? new Date(record.checkOutTime).toLocaleTimeString()
                        : "--"}
                    </td>
                    <td className="px-4 py-2">
                      {record.location || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin View: Today's Attendance Summary */}
      {isAdmin && (
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4 text-[#113F67]">
            Today's Attendance (All Employees)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-md">
              <thead className="bg-[#113F67] text-white text-left">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Check-In</th>
                  <th className="px-4 py-2">
                    Check-Out
                  </th>
                  <th className="px-4 py-2 ">Location</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance.length === 0 ? (
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
                      <td className="px-4 py-2">
                        {emp.user?.firstName} {emp.user?.lastName}
                      </td>
                      <td className="px-4 py-2">
                        {emp.user?.role || "Employee"}
                      </td>
                      <td className="px-4 py-2">
                        {emp.checkInTime
                          ? new Date(emp.checkInTime).toLocaleTimeString()
                          : "--"}
                      </td>
                      <td className="px-4 py-2">
                        {emp.checkOutTime
                          ? new Date(emp.checkOutTime).toLocaleTimeString()
                          : "--"}
                      </td>
                      <td className="px-4 py-2">
                        {emp.location || "N/A"}
                      </td>
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
