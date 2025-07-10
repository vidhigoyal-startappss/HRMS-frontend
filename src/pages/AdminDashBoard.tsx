import { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  Briefcase,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import userimg from "../assets/userlogo.png";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
} from "../api/attendance";
import { fetchEmployees } from "../api/auth";
import LocationMap from "../components/Location/LocationMap";

interface Employee {
  firstName: string;
  lastName: string;
  role: string;
  profileImg?: string;
}

interface Payroll {
  name: string;
  salary: string;
  img: string;
}

interface Attendance {
  date: string;
  present: number;
  absent: number;
  leaves: number;
}

const AdminDashboard = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [status, setStatus] = useState("Out");
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [location, setLocation] = useState("Fetching location...");
  const [locationLoading, setLocationLoading] = useState(true);

  // Timer updater
  const [, setTimerTick] = useState<number>(0);

  useEffect(() => {
    const storedCheckIn = localStorage.getItem("checkInTime");
    if (storedCheckIn) {
      const parsedTime = new Date(storedCheckIn);
      setCheckInTime(parsedTime);
      setIsCheckedIn(true);
      setStatus("Checked In");
    }

    fetchData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        setTimerTick((tick) => tick + 1); // Force re-render
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);

  const fetchData = async () => {
    try {
      const empData = await fetchEmployees();
      const formatted = empData.map((emp: any) => ({
        firstName: emp.firstName ?? "",
        lastName: emp.lastName ?? "",
        role: emp.role ?? "Employee",
        profileImg: emp.profileImg || userimg,
      }));
      setEmployees(formatted);

      setPayrolls([{ name: "Sonia Patel", salary: "₹50,000", img: userimg }]);

      const today = await getTodayAttendance();
      setAttendance({
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        }),
        present: today.presentCount || 0,
        absent: today.absentCount || 0,
        leaves: today.leaveCount || 0,
      });
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    }
  };

  const getTimer = () => {
    if (!checkInTime) return "00:00:00";
    const now = new Date();
    const diff = now.getTime() - checkInTime.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
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
      alert(
        "Attendance Error: " +
          (err?.response?.data?.message || err.message)
      );
    }
  };

  const visibleEmployees = showAllEmployees
    ? employees
    : employees.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
  {/* Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {[
    {
      label: "Employees",
      value: employees.length,
      icon: <Briefcase size={40} className="text-white" />,
      disabled: false,
    },
    {
      label: "Leaves Today",
      value: attendance?.leaves ?? 0,
      icon: <CalendarDays size={40} className="text-white" />,
      disabled: false,
    },
    {
      label: "Absent",
      value: attendance?.absent ?? 0,
      icon: <Users size={40} className="text-white" />,
      disabled: false,
    },
    {
      label: "Payrolls",
      value: "In Progress",
      icon: <DollarSign size={40} className="text-white" />,
      disabled: true,
    },
  ].map((card, idx) => (
    <div
      key={idx}
      className={`rounded-xl p-4 flex items-center justify-between ${
        card.disabled ? "bg-gray-300 cursor-not-allowed opacity-60" : "bg-[#113F67] text-white"
      }`}
      title={card.disabled ? "This module is under progress." : ""}
    >
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-1">
          {card.label}
          {card.disabled && <Info size={16} />}
        </h2>
        <p className="text-xl">{card.disabled ? "—" : card.value}</p>
      </div>
      {card.icon}
    </div>
  ))}
</div>

  {/* Employee List */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-white shadow rounded-xl p-4 max-h-60 overflow-y-auto">
      <h3 className="text-lg font-bold mb-2 text-[#113F67]">Employees</h3>
      <div className="space-y-2">
        {visibleEmployees.map((emp, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-2 rounded-md transition ${
              i % 2 === 0 ? "bg-[#F3F9FB]" : "bg-white"
            } hover:bg-[#87C0CD]/20`}
          >
            <img
              src={emp.profileImg}
              alt={`${emp.firstName} ${emp.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-[#226597] font-medium">
                {emp.firstName} {emp.lastName}
              </p>
              <p className="text-xs text-[#113F67]">{emp.role}</p>
            </div>
          </div>
        ))}
        {employees.length > 5 && (
          <button
            onClick={() => setShowAllEmployees(!showAllEmployees)}
            className="text-[#226597] mt-2 flex items-center text-sm font-semibold cursor-pointer hover:text-[#113F67]"
          >
            {showAllEmployees ? (
              <>
                Show Less <ChevronUp className="ml-1" size={16} />
              </>
            ) : (
              <>
                See All ({employees.length})
                <ChevronDown className="ml-1" size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>

    {/* Map and Profile */}
    <div>
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
          {attendance?.date && `Date: ${attendance.date}`}
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
                <>
                  <div
                    key={i}
                    className="bg-[#F3F9FB] px-3 py-1 rounded-md border border-[#87C0CD]"
                  >
                    {val}
                  </div>
                  {i < 2 && <span>:</span>}
                </>
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
    </div>
  </div>
</div>

  );
};

export default AdminDashboard;
