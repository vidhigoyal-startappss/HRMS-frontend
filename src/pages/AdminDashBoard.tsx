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
import { fetchEmployees } from "../api/auth";
import AttendanceTracker from "../components/Attendance/AttendanceTracker";

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

const AdminDashboard = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  useEffect(() => {
    fetchData();
  }, []); 
  // Fetch employees and payrolls data
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
        } catch (err) {
      console.error("Dashboard Load Error:", err);
    }
  };

  const visibleEmployees = showAllEmployees ? employees : employees.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Cards Section */}
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
            value: "—",
            icon: <CalendarDays size={40} className="text-white" />,
            disabled: false,
          },
          {
            label: "Absent",
            value: "—",
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
              card.disabled
                ? "bg-gray-300 cursor-not-allowed opacity-60"
                : "bg-[#113F67] text-white"
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

      {/* Employee List Section */}
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
        {/* Attendance Section (with timer and date) */}
        <div>
          <AttendanceTracker showTimer={true} showDate={true} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
