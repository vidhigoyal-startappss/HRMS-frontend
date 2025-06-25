import { useEffect, useState } from "react";
import { Users, CalendarDays, Briefcase, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import userimg from "../assets/userimg.png";

import { getTodayAttendance } from "../api/attendance";
import { fetchEmployees } from "../api/auth";

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
  const role = user?.role || "guest";

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empData = await fetchEmployees();
        const formattedEmployees = empData.map((emp: any) => ({
          firstName: emp.firstName ?? "",
          lastName: emp.lastName ?? "",
          role: emp.role ?? "Employee", // Default fallback
          profileImg: emp.profileImg || userimg,
        }));
        setEmployees(formattedEmployees);

        // Sample Payrolls
        setPayrolls([{ name: "Sonia Patel", salary: "₹50,000", img: userimg }]);

        const today = await getTodayAttendance();
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

    fetchData();
  }, []);

  const visibleEmployees = showAllEmployees ? employees : employees.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Top Cards */}
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

      {/* Superadmin Panel */}
      {role === "superadmin" && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-4 text-black">Superadmin Panel</h3>
          <p className="text-gray-700">You have full control over users, roles, system settings, and analytics.</p>
        </div>
      )}

      {/* Employees Section */}
      {(role === "admin" || role === "HR" || role === "manager" || role === "superadmin") && (
        <div className="bg-white shadow-lg rounded-xl p-4 mt-4">
          <h3 className="text-lg font-bold mb-2 text-black">Employees</h3>
          <div className="space-y-3">
            {visibleEmployees.map((emp, index) => {
              const fullName = `${emp.firstName} ${emp.lastName}`.trim();
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    index % 2 === 0 ? "bg-blue-100" : ""
                  }`}
                >
                  <img
                    src={emp.profileImg}
                    alt={fullName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-black font-semibold">{fullName}</p>
                    <p className="text-xs text-gray-600">{emp.role}</p>
                  </div>
                </div>
              );
            })}

            {/* See More / See Less Button */}
            {employees.length > 5 && (
              <button
                onClick={() => setShowAllEmployees(!showAllEmployees)}
                className="text-blue-600 mt-2 flex items-center"
              >
                {showAllEmployees ? (
                  <>
                    Show Less <ChevronUp className="ml-1" size={16} />
                  </>
                ) : (
                  <>
                    See All ({employees.length}) <ChevronDown className="ml-1" size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Highlights Section (Birthdays, Festivals, Quote) */}
<div className="mt-4">
  <h3 className="text-lg font-bold mb-4 text-black">Highlights</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Birthday Card */}
    <div className="bg-pink-100 p-4 rounded-xl shadow flex items-start gap-3">
      <span className="text-3xl">🎂</span>
      <div>
        <h4 className="font-bold text-pink-800">Birthday Today</h4>
        <p className="text-gray-700">Meenal Joshi (UI Developer)</p>
      </div>
    </div>

    {/* Festival Card */}
    <div className="bg-yellow-100 p-4 rounded-xl shadow flex items-start gap-3">
      <span className="text-3xl">🎉</span>
      <div>
        <h4 className="font-bold text-yellow-800">Upcoming Festival</h4>
        <p className="text-gray-700">Rath Yatra - 7th July</p>
      </div>
    </div>

    {/* Motivational Quote Card (Optional) */}
    <div className="bg-blue-100 p-4 rounded-xl shadow flex items-start gap-3">
      <span className="text-3xl">🌟</span>
      <div>
        <h4 className="font-bold text-blue-800">Quote of the Day</h4>
        <p className="text-gray-700">“Great things never come from comfort zones.”</p>
      </div>
    </div>
  </div>
</div>


      {/* Payroll Section */}
      {(role === "HR" || role === "admin" || role === "superadmin") && (
        <div className="bg-white shadow-lg rounded-xl p-4 mt-4 col-span-2">
          <h3 className="text-lg font-bold mb-2 text-black">
            {new Date().toLocaleString("default", { month: "long" })} Payrolls
          </h3>
          <div className="space-y-3">
            {payrolls.map((p, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  idx % 2 === 0 ? "bg-blue-100" : ""
                }`}
              >
                <img src={p.img} alt={p.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-black font-semibold">{p.name}</p>
                  <p className="text-xs text-gray-600">Salary: {p.salary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
