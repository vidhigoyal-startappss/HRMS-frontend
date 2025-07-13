import React, { useEffect, useState } from "react";
import LocationMap from "../Location/LocationMap";
import { checkIn, checkOut, getTodayAttendance } from "../../api/attendance";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import userimg from "../../assets/userlogo.png";

const AttendanceTracker = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [status, setStatus] = useState("Out");
  const [location, setLocation] = useState("Fetching location...");
  const [locationLoading, setLocationLoading] = useState(true);
  const [, setTimerTick] = useState(0);
  const [attendanceDate, setAttendanceDate] = useState<string | null>(null);

  // 🟢 Fetch current attendance state on load/login
    useEffect(() => {
    if (!user?.userId) return;
    fetchTodayAttendance(); // Load user's attendance status
  }, [user?.userId]);

    useEffect(() => {
    let interval: NodeJS.Timeout;

    // Only start timer if checkInTime is valid and user is not checked out
    if (checkInTime && status === "Checked In") {
      interval = setInterval(() => {
        setTimerTick((t) => t + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [checkInTime, status]);


  // ✅ Fetch attendance status from backend
  const fetchTodayAttendance = async () => {
    try {
      const res = await getTodayAttendance();
      if (res?.checkInTime && !res?.checkedOut) {
        const time = new Date(res.checkInTime);
        setCheckInTime(time);
        setIsCheckedIn(true);
        setStatus("Checked In");
        setAttendanceDate(time.toLocaleDateString());
      } else {
        setCheckInTime(null);
        setIsCheckedIn(false);
        setStatus("Out");
        setAttendanceDate(null);
      }
    } catch (err) {
      console.error("Error fetching today's attendance:", err);
      setCheckInTime(null);
      setIsCheckedIn(false);
      setStatus("Out");
      setAttendanceDate(null);
    }
  };

  // ✅ Timer string generator
  const getTimer = () => {
    if (!checkInTime) return "00:00:00";
    const now = new Date().getTime();
    const diff = now - checkInTime.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ✅ Handle check-in / check-out
  const handleClick = async () => {
  if (
    locationLoading ||
    location === "Fetching location..." ||
    location === "Unable to fetch location"
  ) {
    alert("Please wait, location is still loading or failed.");
    return;
  }

  try {
    if (!isCheckedIn) {
      // 🔹 Check-in logic
      const res = await checkIn(location);
      if (res?.checkInTime && !res?.checkedOut) {
        const time = new Date(res.checkInTime);
        setCheckInTime(time);
        setIsCheckedIn(true);
        setStatus("Checked In");
        setAttendanceDate(time.toLocaleDateString());
      } else {
        alert("Unable to check in. You may have already checked out.");
      }
    } else {
      // 🔹 Check-out logic
      await checkOut(); // ✅ no need to store res
      // ✅ Update UI state regardless of getTodayAttendance
      setCheckInTime(null);
      setIsCheckedIn(false);
      setStatus("Out");
      setAttendanceDate(null);

      // Optional: refetch for backend confirmation
      try {
        await fetchTodayAttendance();
      } catch (innerErr) {
        console.warn("Post-checkout fetch failed:", innerErr);
        // still proceed — user has been checked out already
      }
    }
  } catch (err: any) {
    console.error("Attendance error:", err);
    alert("Attendance Error: " + (err?.response?.data?.message || err.message));
  }
};

  return (
    <div className="bg-white shadow rounded-xl p-1 w-full flex flex-col items-center">
      <img
        src={user?.profileImg || userimg}
        alt="User"
        className="w-14 h-14 rounded-full mb-2 object-cover"
      />
      <p className="text-[#113F67] font-semibold text-sm">
        {user?.firstName} {user?.lastName}
      </p>
      <p className="text-[#113F67] text-xs mb-1">
        {user?.role || "Employee"}
      </p>
      <p className="text-[#113F67] text-sm font-medium mt-2">
        Status: <span className="text-[#226597]">{status}</span>
      </p>
      <p className="text-[#113F67] text-xs mt-1">
        {attendanceDate && `Date: ${attendanceDate}`}
      </p>

      <LocationMap
        onAddressFetched={(addr: string) => setLocation(addr)}
        setLoading={setLocationLoading}
      />

      {isCheckedIn && (
        <div className="flex justify-center gap-2 text-black font-mono text-lg mt-1">
          {getTimer()
            .split(":")
            .map((val, i) => (
              <React.Fragment key={i}>
                <div className="bg-[#F3F9FB] px-3 py-1 rounded-md border border-[#87C0CD]">
                  {val}
                </div>
                {i < 2 && <span>:</span>}
              </React.Fragment>
            ))}
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={locationLoading}
        className="mt-2 px-4 py-1 rounded-md border cursor-pointer border-[#226597] text-[#226597] font-semibold hover:bg-[#87C0CD]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCheckedIn ? "Check-out" : "Check-in"}
      </button>
    </div>
  );
};

export default AttendanceTracker;
