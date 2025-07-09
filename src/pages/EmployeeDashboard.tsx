import React, { useEffect, useState } from "react";
import LocationMap from "../components/Location/LocationMap";
import AnnouncementBox from "../components/Announcement/Announcement";
import BirthdayBox from "../components/BirthdayBox/BirthdayBox";
import LeaveProgressBar, { LeaveType } from "../components/LeaveProgressBar/LeaveProgressBar";
import { checkIn, checkOut } from "../api/attendance";
import { getEmployeeById } from "../api/auth";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const EmployeeDashboard = () => {
  const leaveStats: LeaveType[] = [
    { type: "Sick Leave", used: 4, total: 10 },
    { type: "Casual Leave", used: 2, total: 5 },
    { type: "Annual Leave", used: 8, total: 15 },
  ];

  const birthdays = [
    { name: "Aisha Khan", date: "2025-04-28" },
    { name: "Ravi Patel", date: "2025-05-26" },
  ];

  const announcements = [
    {
      title: "New Leave Policy",
      content: "We’ve updated our leave policy effective May 1st.",
    },
    {
      title: "System Downtime",
      content: "The HR portal will be under maintenance on Sunday from 2am to 4am.",
    },
    {
      title: "Monthly Meetup",
      content: "Join us for the virtual town hall meeting this Friday at 3 PM.",
    },
  ];

  const { user } = useSelector((state: RootState) => state.user);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [status, setStatus] = useState("Out");
  const [location, setLocation] = useState("Fetching location...");
  const [locationLoading, setLocationLoading] = useState(true);
  const [, setTimerTick] = useState<number>(0);

  useEffect(() => {
    const storedCheckIn = localStorage.getItem("checkInTime");
    if (storedCheckIn) {
      const parsed = new Date(storedCheckIn);
      setCheckInTime(parsed);
      setIsCheckedIn(true);
      setStatus("Checked In");
    }
    fetchEmployee();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        setTimerTick((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  const fetchEmployee = async () => {
    try {
      const data = await getEmployeeById(user.userId);
      setEmployeeData(data);
    } catch (err) {
      console.error("Error loading employee data:", err);
    }
  };

  const getTimer = () => {
    if (!checkInTime) return "00:00:00";
    const now = new Date();
    const diff = now.getTime() - checkInTime.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
        const time = new Date(res.checkInTime);
        localStorage.setItem("checkInTime", time.toISOString());
        setCheckInTime(time);
        setStatus("Checked In");
        setIsCheckedIn(true);
      } else {
        await checkOut();
        localStorage.removeItem("checkInTime");
        setStatus("Out");
        setIsCheckedIn(false);
        setCheckInTime(null);
      }
    } catch (err) {
      alert("Attendance Error: " + (err?.response?.data?.message || err.message));
    }
  };

  const handleSendWish = (name: string) => {
    alert(`🎉 Birthday wish sent to ${name}!`);
  };

  return (
    <div className="w-full px-4 py-4">
      {/* Grid Row: Location + Leave Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-2 rounded-md shadow-md border border-[#dbe9f1]">
          <LocationMap
            onAddressFetched={(addr: string) => setLocation(addr)}
            setLoading={setLocationLoading}
          />
          <div className="rounded p-3 mt-2 flex flex-col items-center">
            <p className="text-sm text-[#113F67] font-medium mb-2">Status: {status}</p>
            {isCheckedIn && (
              <div className="flex gap-2 font-mono text-lg mt-1">
                {getTimer()
                  .split(":")
                  .map((val, i) => (
                    <React.Fragment key={i}>
                      <span className="px-3 py-1 bg-gray-200 rounded">{val}</span>
                      {i < 2 && <span>:</span>}
                    </React.Fragment>
                  ))}
              </div>
            )}
            <button
              onClick={handleClick}
              disabled={locationLoading}
              className="m-2 px-4 py-1 text-white rounded bg-[#113F67] hover:bg-[#87C0CD]"
            >
              {isCheckedIn ? "Check-out" : "Check-in"}
            </button>
          </div>
        </div>

        <div className="w-full">
          <LeaveProgressBar leaveData={leaveStats} />
        </div>
      </div>

      {/* Grid Row: Announcements + Birthdays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <AnnouncementBox announcements={announcements} />
        <BirthdayBox birthdays={birthdays} onSendWish={handleSendWish} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
