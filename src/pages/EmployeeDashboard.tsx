import React, { useEffect, useState } from "react";
import EmployeeCard from "../components/EmployeeCards";
import QuickBtnData from "../assets/data/QuickActionsBtn.json";
import Button from "../components/common/ButtonComp";
import LeaveProgressBar, { LeaveType } from "../components/LeaveProgressBar/LeaveProgressBar";
import TaskBox from "../components/TaskBox/TaskBox";
import AnnouncementBox from "../components/Announcement/Announcement";
import BirthdayBox from "../components/BirthdayBox/BirthdayBox";
import PayslipBreakdown from "../pages/PayslipBreakdown";
import LocationMap from "../components/Location/LocationMap";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
} from "../api/attendance";

// ✅ Get employee info from the correct source (likely auth.js or user.js)
import { getEmployeeById } from "../api/auth"; 
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const EmployeeDashboard = () => {
  const leaveStats: LeaveType[] = [
    { type: "Sick Leave", used: 4, total: 10 },
    { type: "Casual Leave", used: 2, total: 5 },
    { type: "Annual Leave", used: 8, total: 15 },
  ];

  const tasks = [
    "Design Login Page",
    "Set up Redux",
    "Implement JWT",
    "Write Tests",
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

  const handleSendWish = (name: string) => {
    alert(`🎉 Birthday wish sent to ${name}!`);
  };

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
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
        setTimerTick(t => t + 1);
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

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Dashboard</h1>

      {/* Location + Timer */}
      <LocationMap
        onAddressFetched={(addr: string) => setLocation(addr)}
        setLoading={setLocationLoading}
      />

      <div className="bg-white shadow rounded p-4 mt-4 flex flex-col items-center">
        <p className="text-sm text-gray-700">Status: {status}</p>
        {isCheckedIn && (
          <div className="flex gap-2 font-mono text-lg mt-1">
            {getTimer()
              .split(":")
              .map((val, i) => (
                <>
                  <span key={i} className="bg-gray-200 px-3 py-1 rounded">
                    {val}
                  </span>
                  {i < 2 && <span>:</span>}
                </>
              ))}
          </div>
        )}
        <button
          onClick={handleClick}
          disabled={locationLoading}
          className="mt-2 px-4 py-1 border border-green-600 text-green-700 rounded hover:bg-green-100 disabled:opacity-50"
        >
          {isCheckedIn ? "Check-out" : "Check-in"}
        </button>
      </div>

      {/* Leave + Payslip */}
      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        <div className="w-full lg:w-1/2">
          <LeaveProgressBar leaveData={leaveStats} />
        </div>
        <div className="w-full lg:w-1/2">
          <PayslipBreakdown month={currentMonth} />
        </div>
      </div>

      {/* Announcements + Birthdays */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <div className="w-full md:w-1/2">
          <AnnouncementBox announcements={announcements} />
        </div>
        <div className="w-full md:w-1/2">
          <BirthdayBox birthdays={birthdays} onSendWish={handleSendWish} />
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-6">
        <TaskBox tasks={tasks} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;