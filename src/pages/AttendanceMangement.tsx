import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  getMyAttendance,
  getTodayAllAttendance,
  getAllAttendance,
} from "../api/attendance";

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
  // const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>(
  //   []
  // );
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  const [searchName, setSearchName] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [adminStatusFilter, setAdminStatusFilter] = useState("All");

  const isAdmin = ["HR", "Admin", "SuperAdmin", "Manager"].includes(user?.role);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      if (isAdmin) {
        try {
          const allAttendance = await getAllAttendance();
          setAllAttendance(allAttendance || []);
        } catch (err) {
          console.error("All Attendance Fetch Error:", err);
        }
      }

      try {
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

  // useEffect(() => {
  //   const generateDummyData = () => {
  //     const dummyData: AttendanceRecord[] = [];
  //     const today = new Date();

  //     const employees = [
  //       { name: "John Doe", role: "Employee" },
  //       { name: "Alice Smith", role: "Manager" },
  //       { name: "Bob Johnson", role: "Intern" },
  //       { name: "Emma Wilson", role: "HR" },
  //     ];

  //     for (let day = 0; day < 15; day++) {
  //       const date = new Date(today);
  //       date.setDate(today.getDate() - day);

  //       employees.forEach((emp) => {
  //         const isPresent = Math.random() > 0.2;

  //         if (isPresent) {
  //           const checkInTime = new Date(date);
  //           checkInTime.setHours(9, 0, 0);

  //           const checkOutTime = new Date(date);
  //           const randomHours = Math.floor(Math.random() * (9 - 4) + 4);
  //           checkOutTime.setHours(checkInTime.getHours() + randomHours, 0, 0);

  //           dummyData.push({
  //             checkInTime: checkInTime.toISOString(),
  //             checkOutTime: checkOutTime.toISOString(),
  //             location: "Office",
  //             user: {
  //               name: emp.name,
  //               role: emp.role,
  //             },
  //             status: "Present",
  //           });
  //         } else {
  //           dummyData.push({
  //             location: "Office",
  //             user: {
  //               name: emp.name,
  //               role: emp.role,
  //             },
  //             status: "Absent",
  //           });
  //         }
  //       });
  //     }

  //     setTodayAttendance(dummyData);
  //     setLoading(false);
  //   };

  //   generateDummyData();
  // }, []);

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
            className="bg-[#113F67] text-white px-3 py-1 rounded hover:bg-[#226597]"
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
                  <td colSpan={4} className="text-center py-4 text-[#226597]">
                    Loading...
                  </td>
                </tr>
              ) : filteredMyAttendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-[#226597]">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredMyAttendance.map((emp, i) => (
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
      </div>

      {isAdmin && (
        //     <div className="bg-white rounded-xl p-4 shadow">
        //       <h2 className="text-lg font-semibold mb-4 text-[#113F67]">
        //         Today's Attendance (All Employees)
        //       </h2>

        //       <div className="flex flex-wrap gap-4 mb-4">
        //         <input
        //           type="text"
        //           placeholder="Search by name"
        //           value={searchName}
        //           onChange={(e) => setSearchName(e.target.value)}
        //           className="border p-2 rounded"
        //         />
        //         <select
        //           value={roleFilter}
        //           onChange={(e) => setRoleFilter(e.target.value)}
        //           className="border p-2 rounded"
        //         >
        //           <option>All</option>
        //           <option>Intern</option>
        //           <option>Employee</option>
        //           <option>Manager</option>
        //           <option>HR</option>
        //           <option>Admin</option>
        //           <option>SuperAdmin</option>
        //         </select>
        //         <select
        //           value={adminStatusFilter}
        //           onChange={(e) => setAdminStatusFilter(e.target.value)}
        //           className="border p-2 rounded"
        //         >
        //           <option>All</option>
        //           <option>Checked-In Only</option>
        //           <option>Checked-Out Only</option>
        //         </select>
        //         <button
        //           onClick={() => {
        //             setSearchName("");
        //             setRoleFilter("All");
        //             setAdminStatusFilter("All");
        //           }}
        //           className="bg-[#113F67] text-white px-3 py-1 rounded hover:bg-[#226597]"
        //         >
        //           Clear Filters
        //         </button>
        //       </div>

        //       <div className="overflow-x-auto">
        //         <table className="min-w-full rounded-md text-sm">
        //           <thead className="bg-[#113F67] text-white text-left uppercase">
        //             <tr>
        //               <th className="px-4 py-2">Name</th>
        //               <th className="px-4 py-2">Role</th>
        //               <th className="px-4 py-2">Check-In</th>
        //               <th className="px-4 py-2">Check-Out</th>
        //               <th className="px-4 py-2">Location</th>
        //             </tr>
        //           </thead>
        //           <tbody>
        //             {loading ? (
        //               <tr>
        //                 <td colSpan={5} className="text-center py-4 text-[#226597]">
        //                   Loading
        //                 </td>
        //               </tr>
        //             ) : filteredTodayAttendance.length === 0 ? (
        //               <tr>
        //                 <td colSpan={5} className="text-center py-4 text-[#226597]">
        //                   No records found
        //                 </td>
        //               </tr>
        //             ) : (
        //               filteredTodayAttendance.map((emp, i) => (
        //                 <tr key={i} className="hover:bg-blue-50 text-[#226597]">
        //                   <td className="px-4 py-2">
        //                     {emp.user?.name || "Unknown"}
        //                   </td>
        //                   <td className="px-4 py-2">
        //                     {emp.user?.role || "Employee"}
        //                   </td>
        //                   <td className="px-4 py-2">
        //                     {formatTime(emp.checkInTime)}
        //                   </td>
        //                   <td className="px-4 py-2">
        //                     {formatTime(emp.checkOutTime)}
        //                   </td>
        //                   <td className="px-4 py-2">{emp.location || "N/A"}</td>
        //                 </tr>
        //               ))
        //             )}
        //           </tbody>
        //         </table>
        //       </div>
        //     </div>
        //   )}
        // </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#113F67]">
            Month attendance All Employees
          </h2>

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
                    <td colSpan={7} className="text-center py-4 text-[#226597]">
                      Loading...
                    </td>
                  </tr>
                ) : filteredTodayAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-[#226597]">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredTodayAttendance.map((emp, i) => {
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

                    const status =
                      totalTime >= 8
                        ? "Full Day"
                        : totalTime >= 4
                        ? "Half Day"
                        : "--";

                    let flag = "Absent";
                    if (checkIn && !checkOut) {
                      flag = "Online";
                    } else if (totalTime >= 4) {
                      flag = "Present";
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
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
