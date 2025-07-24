import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck,
  Clock,
  User,
  LogOut,
  Bell,
  FileText,
  Repeat,
  Mail,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../feature/user/userSlice";
import { RootState } from "../../../store/store";
import profileImage from "../../../assets/user-alt.svg";
import { getEmployeeById } from "../../../api/auth";

const EmployeeLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.user);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const sidebarLinks = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Attendance", path: "/attendance", icon: UserCheck },
      { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },
      { label: "Document Upload", path: "/documents", icon: FileText ,disabled:true},
      { label: "Change Requests", path: "/change-requests", icon: Repeat ,disabled:true},
      { label: "Approval History", path: "/approval-history", icon: Clock ,disabled:true},
      { label: "Profile", path: "/profile", icon: User },
  ];

  useEffect(() => {
    const fetchEmployee = async () => {
      if (user?.userId) {
        try {
          const data = await getEmployeeById(user.userId);
          setEmployeeData(data?.employee || data);
        } catch (err) {
          console.error("Error loading employee data:", err);
        }
      }
    };

    fetchEmployee();
  }, [user]);

  useEffect(() => {
    const matched = sidebarLinks.find((link) =>
      link.path === "/employee/"
        ? location.pathname === "/employee/"
        : location.pathname.startsWith(link.path)
    );
    setPageTitle(matched?.label || "Dashboard");
  }, [location.pathname]);

  const fullName =
    employeeData?.firstName && employeeData?.lastName
      ? `${employeeData.firstName} ${employeeData.lastName}`
      : "Employee";

  const role = user?.role || "Employee";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F3F9FB] overflow-hidden">
  {/* Sidebar */}
  <aside className="w-72 bg-[#113F67] text-white flex flex-col p-4 shadow-lg">
    {/* Profile Header */}
    <div className="flex items-center gap-4 p-3 bg-[#226597] rounded-xl mb-6">
      <img
        src={employeeData?.profileImg || profileImage}
        alt="Profile"
        className="w-14 h-14 rounded-full object-cover border-2 border-white p-0.5"
      />
      <div>
        <div className="text-lg font-semibold capitalize">{fullName}</div>
        <div className="text-sm text-white capitalize">{role}</div>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex flex-col gap-3 flex-grow overflow-y-auto">
      {sidebarLinks.map(({ label, path, icon: Icon }) =>
        label === "Approval History" ? (
          <div
            key={label}
            className="flex items-center justify-between gap-2 bg-gray-400 text-white cursor-not-allowed px-4 py-2 rounded-md text-base font-medium"
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className="text-white" />
              {label}
            </div>
            <button
              onClick={() => alert("This feature is under development.")}
              className="bg-[#113F67] text-white w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center hover:bg-[#226597]"
              title="This section is in progress"
            >
              i
            </button>
          </div>
        ) : (
          <NavLink
            key={label}
            to={path}
            end={label === "Dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition-all ${
                isActive
                  ? "bg-[#226597] text-white font-semibold"
                  : "hover:bg-[#226597] hover:text-white text-white"
              }`
            }
          >
            <Icon size={18} className="text-white" />
            {label}
          </NavLink>
        )
      )}
    </nav>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="mt-6 flex items-center cursor-pointer justify-center gap-3 px-4 py-3 bg-[#226597] hover:bg-[#87C0CD] text-white text-base font-medium rounded-md"
    >
      <LogOut size={18} className="text-white" />
      Logout
    </button>
  </aside>

  {/* Main Content */}
  <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
    {/* Top Bar */}
    <div className="px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#113F67]">
        Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}
      </h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full bg-white hover:bg-[#87C0CD] shadow-sm cursor-pointer">
          <Bell size={20} className="text-[#113F67]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
        </button>
        <button className="relative p-2 rounded-full bg-white hover:bg-[#87C0CD] shadow-sm cursor-pointer">
          <Mail size={20} className="text-[#113F67]" />
        </button>
      </div>
    </div>

    {/* Scrollable Page Content */}
    <div className="flex-1 overflow-y-auto px-6 pb-4">
      <section className="bg-white rounded-xl shadow-md p-4 min-h-[calc(100vh-160px)]">
        <header className="mb-3">
          <h2 className="text-xl font-semibold text-[#113F67]">{pageTitle}</h2>
        </header>
        <Outlet />
      </section>
    </div>
  </main>
</div>

  );
};

export default EmployeeLayout;
