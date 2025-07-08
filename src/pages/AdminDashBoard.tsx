import { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  Briefcase,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import userimg from "../assets/userimg.png";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyAttendance,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await fetchEmployees();
        const formattedEmployees = empData.map((emp: any) => ({
          firstName: emp.firstName ?? "",
          lastName: emp.lastName ?? "",
          role: emp.role ?? "Employee",
          profileImg: emp.profileImg || userimg,
        }));
        setEmployees(formattedEmployees);

        setPayrolls([{ name: "Sonia Patel", salary: "₹50,000", img: userimg }]);

        const today = await getTodayAttendance();
        if (today?.checkInTime && !today?.checkOutTime) {
          setStatus("Checked In");
          setIsCheckedIn(true);
          setCheckInTime(new Date(today.checkInTime));
        } else {
          setStatus("Out");
          setIsCheckedIn(false);
          setCheckInTime(null);
        }

        setAttendance({
          date: new Date().toDateString(),
          present: today.presentCount || 0,
          absent: today.absentCount || 0,
          leaves: today.leaveCount || 0,
        });
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      }
    };

    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const loc = data.display_name || `${latitude}, ${longitude}`;
            setLocation(loc);
          },
          (err) => {
            setLocation("Unable to fetch location");
          }
        );
      }
    };

    fetchData();
    fetchLocation();
  }, []);

  const getTimer = () => {
    if (!checkInTime) return "00:00:00";
    const diff = new Date().getTime() - checkInTime.getTime();
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleClick = async () => {
    try {
      if (!isCheckedIn) {
        const res = await checkIn(location);
        setStatus("Checked In");
        setIsCheckedIn(true);
        setCheckInTime(new Date(res.checkInTime));
      } else {
        await checkOut();
        setStatus("Out");
        setIsCheckedIn(false);
        setCheckInTime(null);
      }
    } catch (err) {
      alert("Attendance Error: " + err?.response?.data?.message || err.message);
    }
  };

  const visibleEmployees = showAllEmployees ? employees : employees.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-green-500 p-4 rounded-xl text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Employees</h2>
            <p className="text-2xl">{employees.length}</p>
          </div>
          <Briefcase size={40} />
        </div>
        <div className="bg-yellow-500 p-4 rounded-xl text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Leaves Today</h2>
            <p className="text-2xl">{attendance?.leaves ?? 0}</p>
          </div>
          <CalendarDays size={40} />
        </div>
        <div className="bg-red-500 p-4 rounded-xl text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Absent</h2>
            <p className="text-2xl">{attendance?.absent ?? 0}</p>
          </div>
          <Users size={40} />
        </div>
        <div className="bg-blue-800 p-4 rounded-xl text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Payrolls</h2>
            <p className="text-2xl">{payrolls.length}</p>
          </div>
          <DollarSign size={40} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-lg rounded-xl p-4 max-h-60 overflow-y-auto">
          <h3 className="text-lg font-bold mb-2 text-black">Employees</h3>
          <div className="space-y-2">
            {visibleEmployees.map((emp, index) => {
              const fullName = `${emp.firstName} ${emp.lastName}`.trim();
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-md hover:bg-blue-50 transition ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <img
                    src={emp.profileImg}
                    alt={fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-black font-medium">{fullName}</p>
                    <p className="text-xs text-gray-500">{emp.role}</p>
                  </div>
                </div>
              );
            })}
            {employees.length > 5 && (
              <button
                onClick={() => setShowAllEmployees(!showAllEmployees)}
                className="text-blue-600 mt-2 flex items-center text-sm font-medium"
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

        <div className="bg-white shadow-lg rounded-xl p-4 w-full md:w-64 mx-auto flex flex-col items-center">
          <img
            src={user?.profileImg || userimg}
            alt={`${user?.firstName} ${user?.lastName}`}
            className="w-14 h-14 rounded-full mb-2 object-cover"
          />
          <p className="text-gray-800 font-semibold text-sm">
            {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
          </p>
          <p className="text-gray-500 text-xs mb-1">{user?.role || "Employee"}</p>

          <p className="text-gray-600 text-sm font-medium mt-2">
            Status: <span className="text-gray-700">{status}</span>
          </p>

          {isCheckedIn && (
            <div className="flex justify-center gap-2 text-black font-mono text-lg mt-1">
              {getTimer().split(":" as const).map((val, idx) => (
                <>
                  <div
                    key={idx}
                    className="bg-gray-200 px-3 py-1 rounded-md"
                  >
                    {val}
                  </div>
                  {idx < 2 && <span>:</span>}
                </>
              ))}
            </div>
          )}

          <button
            onClick={handleClick}
            className="mt-4 px-4 py-1 rounded-md border border-green-600 text-green-700 font-semibold hover:bg-green-100 transition-all duration-200"
          >
            {isCheckedIn ? "Check-out" : "Check-in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
