import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  getMyAttendance,
  getTodayAllAttendance,
  getAllAttendance,
} from "../api/attendance";
import Swal from "sweetalert2";

interface AttendanceRecord {
  checkInTime?: string;
  checkOutTime?: string;
  location?: string;
  user?: {
    name?: string;
    role?: string;
    email?: string;
    profileImg?: string;
  };
}

const AttendanceManagement = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [myAttendance, setMyAttendance] = useState<AttendanceRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [adminStatusFilter, setAdminStatusFilter] = useState("All");

  const isAdmin = ["HR", "Admin", "SuperAdmin", "Manager"].includes(user?.role);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const itemsPerPage = 5;
  const [myPage, setMyPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setHasError(false);

      try {
        if (isAdmin) {
          const all = await getAllAttendance();
          if (!all || all.length === 0) {
            Swal.fire({
              icon: "info",
              title: "No attendance found",
              text: "No attendance records available for any employees.",
              confirmButtonColor: "#226597",
            });
            setAllAttendance([]);
          } else {
            setAllAttendance(all);
          }
        }

        const mine = await getMyAttendance();
        if (!mine || mine.length === 0) {
          Swal.fire({
            icon: "info",
            title: "No personal attendance records",
            text: "You don't have any attendance records yet.",
            confirmButtonColor: "#226597",
          });
          setMyAttendance([]);
        } else {
          setMyAttendance(mine);
        }
      } catch (err) {
        console.error("Attendance Fetch Error:", err);
        setHasError(true);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to fetch attendance data.",
          confirmButtonColor: "#226597",
        });
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

  const filteredMyAttendance = myAttendance.filter((rec) => {
    const checkInDate = rec.checkInTime ? new Date(rec.checkInTime) : null;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchesDate =
      (!from || (checkInDate && checkInDate >= from)) &&
      (!to || (checkInDate && checkInDate <= to));
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Check-In Only" &&
        rec.checkInTime &&
        !rec.checkOutTime) ||
      (statusFilter === "Check-Out Only" && rec.checkOutTime);
    const matchesLocation =
      !locationFilter ||
      rec.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesDate && matchesStatus && matchesLocation;
  });

  const filteredTodayAttendance = allAttendance.filter((rec) => {
    const fullName = `${rec.user?.firstName || ""} ${rec.user?.lastName || ""}`;
    const matchesName = rec.user?.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesRole = roleFilter === "All" || rec.user?.role === roleFilter;
    const matchesStatus =
      adminStatusFilter === "All" ||
      (adminStatusFilter === "Checked-In Only" &&
        rec.checkInTime &&
        !rec.checkOutTime) ||
      (adminStatusFilter === "Checked-Out Only" && rec.checkOutTime);

    return matchesName && matchesRole && matchesStatus;
  });

  useEffect(
    () => setMyPage(1),
    [fromDate, toDate, statusFilter, locationFilter]
  );
  useEffect(() => setAdminPage(1), [searchName, roleFilter, adminStatusFilter]);

  const totalMyPages = Math.ceil(filteredMyAttendance.length / itemsPerPage);
  const totalAdminPages = Math.ceil(
    filteredTodayAttendance.length / itemsPerPage
  );

  const paginatedMyAttendance = filteredMyAttendance.slice(
    (myPage - 1) * itemsPerPage,
    myPage * itemsPerPage
  );

  const paginatedAdminAttendance = filteredTodayAttendance.slice(
    (adminPage - 1) * itemsPerPage,
    adminPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <svg
          className="animate-spin h-12 w-12 text-[#226597]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          />
        </svg>
        <p className="text-[#226597] font-medium text-lg">
          Fetching attendance...
        </p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-2">
        <p className="text-gray-500">
          We couldn’t load attendance data right now. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-semibold mb-4 text-[#113F67]">
          My Attendance History
        </h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option>All</option>
            <option>Check-In Only</option>
            <option>Check-Out Only</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setStatusFilter("All");
              setLocationFilter("");
            }}
            className="bg-[#113F67] text-white px-3 py-1 rounded hover:bg-[#226597] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full rounded-md text-sm">
            <thead className="bg-[#113F67] text-white text-left uppercase">
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
                  <td colSpan={4} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg
                        className="animate-spin h-10 w-10 text-[#226597]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                        ></path>
                      </svg>
                      <p className="text-[#226597] font-medium text-lg">
                        Loading data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredMyAttendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-[#226597]">
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedMyAttendance.map((emp, i) => (
                  <tr key={i} className="hover:bg-blue-50 text-[#226597]">
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

        {totalMyPages > 1 && (
          <div className="flex justify-end mt-2 space-x-2">
            <button
              disabled={myPage === 1}
              onClick={() => setMyPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              {myPage} / {totalMyPages}
            </span>
            <button
              disabled={myPage === totalMyPages}
              onClick={() => setMyPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#113F67]">
            Month Attendance – All Employees
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border p-2 rounded"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option>All</option>
              <option>Intern</option>
              <option>Employee</option>
              <option>Manager</option>
              <option>HR</option>
              <option>Admin</option>
              <option>SuperAdmin</option>
            </select>
            <select
              value={adminStatusFilter}
              onChange={(e) => setAdminStatusFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option>All</option>
              <option>Checked-In Only</option>
              <option>Checked-Out Only</option>
            </select>
            <button
              onClick={() => {
                setSearchName("");
                setRoleFilter("All");
                setAdminStatusFilter("All");
              }}
              className="bg-[#113F67] text-white px-3 py-1 rounded hover:bg-[#226597]"
            >
              Clear Filters
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-md text-sm">
              <thead className="bg-[#113F67] text-white text-left uppercase">
                <tr>
                  <th className="px-4 py-2">Day</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Check-In</th>
                  <th className="px-4 py-2">Check-Out</th>
                  <th className="px-4 py-2">Total Time Spent</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Flag</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <svg
                          className="animate-spin h-10 w-10 text-[#226597]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                          ></path>
                        </svg>
                        <p className="text-[#226597] font-medium text-lg">
                          Loading data...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTodayAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-[#226597]">
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedAdminAttendance.map((emp, i) => {
                    const checkIn = emp.checkInTime
                      ? new Date(emp.checkInTime)
                      : null;
                    const checkOut = emp.checkOutTime
                      ? new Date(emp.checkOutTime)
                      : null;

                    let totalTime = 0;
                    if (checkIn && checkOut) {
                      totalTime =
                        (checkOut.getTime() - checkIn.getTime()) /
                        1000 /
                        60 /
                        60;
                    }

                    let status = "--";
                    let flag = "Absent";

                    if (checkIn && !checkOut) {
                      status = "Working";
                      flag = "Online";
                    } else if (totalTime >= 8) {
                      status = "Full Day";
                      flag = "Present";
                    } else if (totalTime >= 6 && totalTime < 8) {
                      status = "Partial Day";
                      flag = "Present";
                    } else if (totalTime > 0 && totalTime < 6) {
                      status = "Absent";
                      flag = "Absent";
                    } else {
                      status = "--";
                      flag = "Absent";
                    }

                    return (
                      <tr key={i} className="hover:bg-blue-50 text-[#226597]">
                        <td className="px-4 py-2">
                          {checkIn
                            ? checkIn.toLocaleDateString("en-US", {
                                weekday: "long",
                              })
                            : "--"}
                        </td>
                        <td className="px-4 py-2">
                          {checkIn ? checkIn.toLocaleDateString() : "--"}
                        </td>
                        <td className="px-4 py-2">
                          {checkIn ? checkIn.toLocaleTimeString() : "--"}
                        </td>
                        <td className="px-4 py-2">
                          {checkOut ? checkOut.toLocaleTimeString() : "--"}
                        </td>
                        <td className="px-4 py-2">
                          {totalTime.toFixed(2)} hours
                        </td>
                        <td className="px-4 py-2">{status}</td>
                        <td
                          className="px-4 py-2 font-bold"
                          style={{
                            color:
                              flag === "Present"
                                ? "green"
                                : flag === "Online"
                                ? "orange"
                                : "red",
                          }}
                        >
                          {flag}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="relative flex items-center mt-2">
            {adminPage > 1 && (
              <button
                onClick={() => setAdminPage((prev) => prev - 1)}
                className="px-4 py-2 bg-[#226597] text-white rounded-md hover:bg-[#1c4c7a]"
              >
                Prev
              </button>
            )}

            <span className="absolute left-1/2 transform -translate-x-1/2 px-3 py-1 text-[#113F67] font-semibold">
              {adminPage} / {totalAdminPages}
            </span>

            {adminPage < totalAdminPages && (
              <button
                onClick={() => setAdminPage((prev) => prev + 1)}
                className="ml-auto px-4 py-2 bg-[#226597] text-white rounded-md hover:bg-[#1c4c7a]"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
