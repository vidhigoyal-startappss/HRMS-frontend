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
import { getLeaves } from "../api/leave";

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
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const empData = await fetchEmployees();
      const leaveData = await getLeaves();
      const formatted = empData.map((emp: any) => ({
        firstName: emp.firstName ?? "",
        lastName: emp.lastName ?? "",
        role: emp.role ?? "Employee",
        profileImg: emp.profileImg || userimg,
      }));
      setEmployees(formatted);
      setLeaves(leaveData);

      setPayrolls([{ name: "Sonia Patel", salary: "₹50,000", img: userimg }]);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    }
  };

  const visibleEmployees = showAllEmployees ? employees : employees.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Employees",
            value: employees.length,
            icon: <Briefcase className="text-white w-6 h-6 sm:w-10 sm:h-10" />,
            disabled: false,
          },
          {
            label: "Leaves",
            value: leaves.length,
            icon: (
              <CalendarDays className="text-white w-6 h-6 sm:w-10 sm:h-10" />
            ),
            disabled: false,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-2 sm:p-4 flex items-center justify-between min-h-[64px] sm:min-h-[100px] ${
              card.disabled
                ? "bg-gray-300 cursor-not-allowed opacity-60"
                : "bg-[#113F67] text-white"
            }`}
            title={card.disabled ? "This module is under progress." : ""}
          >
            <div>
              <h2 className="text-sm sm:text-xl font-semibold flex items-center gap-1">
                {card.label}
                {card.disabled && <Info size={16} />}
              </h2>
              <p className="text-sm sm:text-xl">
                {card.disabled ? "—" : card.value}
              </p>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-xl p-2 w-full max-h-full sm:max-h-60 overflow-y-auto">
          <h3 className="text-base sm:text-lg font-bold mb-3 text-[#113F67]">
            Employees
          </h3>

          <div className="space-y-2 max-h-[240px] overflow-y-auto sm:max-h-full sm:overflow-visible">
            {visibleEmployees.map((emp, i) => (
              <div
                key={i}
                className={`flex items-center p-2 rounded-md transition ${
                  i % 2 === 0 ? "bg-[#F3F9FB]" : "bg-white"
                } hover:bg-[#87C0CD]/20 w-[95vw] sm:w-auto`}
              >
                <img
                  src={emp.profileImg}
                  alt={`${emp.firstName} ${emp.lastName}`}
                  className="w-7 h-7 sm:w-10 sm:h-10 rounded-full object-cover"
                />

                <div
                  className="
    ml-3
    flex flex-col
    justify-center
    text-[12px] sm:text-sm
  "
                >
                  <p className="text-[#226597] font-medium truncate max-w-[120px] sm:max-w-none">
                    {emp.firstName} {emp.lastName}
                  </p>

                  <p className="text-[#113F67] text-[10px] sm:text-xs truncate max-w-[80px] sm:max-w-none">
                    {emp.role}
                  </p>
                </div>
              </div>
            ))}

            {employees.length > 5 && (
              <button
                onClick={() => setShowAllEmployees(!showAllEmployees)}
                className="w-full text-[#226597] mt-2 flex items-center justify-center text-sm font-semibold cursor-pointer hover:text-[#113F67]"
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

        <div>
          <AttendanceTracker showTimer={true} showDate={true} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
