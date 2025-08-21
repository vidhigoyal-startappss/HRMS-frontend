import React, { useEffect, useState } from "react";
import LocationMap from "../Location/LocationMap";
import { checkIn, checkOut, getMyTodayAttendance } from "../../api/attendance";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import userimg from "../../assets/userlogo.png";
import { toast } from "react-toastify";

interface AttendanceTrackerProps {
  showTimer?: boolean;
  showDate?: boolean;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  showTimer = true,
  showDate = true,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [status, setStatus] = useState("Out");
  const [location, setLocation] = useState("Fetching location...");
  const [locationLoading, setLocationLoading] = useState(true);
  const [, setTimerTick] = useState(0);
  const [attendanceDate, setAttendanceDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.userId) return;
    fetchTodayAttendance();
  }, [user?.userId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (checkInTime && status === "Checked In") {
      interval = setInterval(() => {
        setTimerTick((t) => t + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [checkInTime, status]);

  const fetchTodayAttendance = async () => {
    try {
      const res = await getMyTodayAttendance();

      if (res?.checkInTime && !res?.checkedOut) {
        const time = new Date(res.checkInTime);
        if (!isNaN(time.getTime())) {
          setCheckInTime(time);
          setIsCheckedIn(true);
          setStatus("Checked In");
          setAttendanceDate(time.toLocaleDateString());
        }
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

  const getTimer = () => {
    if (!checkInTime) return "00:00:00";
    const now = new Date().getTime();
    const diff = now - checkInTime.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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
        await checkOut();
        setCheckInTime(null);
        setIsCheckedIn(false);
        setStatus("Out");
        setAttendanceDate(null);

        try {
          await fetchTodayAttendance();
        } catch (innerErr) {
          console.warn("Post-checkout fetch failed:", innerErr);
        }
      }
    } catch (err: any) {
      console.error("Attendance error:", err);
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 w-full flex flex-col items-center h-[240px]">
      <img
        src={user?.profileImg || userimg}
        alt="User"
        className="w-10 h-10 sm:w-14 sm:h-14 rounded-full mb-2 object-cover"
      />
      <p className="text-[#113F67] font-semibold text-sm">
        {user?.firstName} {user?.lastName}
      </p>
      <p className="text-[#113F67] text-xs mb-1">{user?.role || "Employee"}</p>
      <p className="text-[#113F67] text-sm font-medium mt-2">
        Status: <span className="text-[#226597]">{status}</span>
      </p>

      {showDate && attendanceDate && (
        <p className="text-[#113F67] text-xs mt-1">Date: {attendanceDate}</p>
      )}

      <LocationMap
        onAddressFetched={(addr: string) => setLocation(addr)}
        setLoading={setLocationLoading}
      />

      {showTimer && isCheckedIn && (
        <div className="flex justify-center gap-2 text-black font-mono text-sm sm:text-lg mt-1">
          {getTimer()
            .split(":")
            .map((val, i) => (
              <React.Fragment key={i}>
                <div className="bg-[#F3F9FB] px-2 sm:px-3 py-1 rounded-md border border-[#87C0CD]">
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
        className="mt-2 px-3 py-1 sm:px-4 sm:py-1 rounded-md border cursor-pointer border-[#226597] text-[#226597] text-sm sm:text-base font-semibold hover:bg-[#87C0CD]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCheckedIn ? "Check-out" : "Check-in"}
      </button>
    </div>
  );
};

export default AttendanceTracker;
