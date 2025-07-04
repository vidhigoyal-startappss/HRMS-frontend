import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  Clock,
  User,
  LogOut,
  Bell,
  Mail,
  Search,
  HandCoins,
  Flag,
  Funnel,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../feature/user/userSlice";
import { RootState } from "../../../store/store";
import profileImage from "../../../assets/user-alt.svg";
import AdminDashboard from "../../../pages/AdminDashBoard";

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const role = user?.role?.toLowerCase() || "guest";
  const location = useLocation();
  useEffect(() => {
    const current = linksToShow.find((link) =>
      location.pathname.startsWith(link.path)
    );
    if (current) {
      setPageTitle(current.label);
    }
  }, [location.pathname]);

  const sidebarConfig: Record<
    string,
    { label: string; path: string; icon: React.ElementType }[]
  > = {
    superadmin: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      {
        label: "Employee Management",
        path: "/admin/employee-management",
        icon: Users,
      },
      {
        label: "Attendance Management",
        path: "/admin/attendance",
        icon: UserCheck,
      },
      {
        label: "Leave Management",
        path: "/admin/leave-requests",
        icon: CalendarCheck,
      },
      {
        label: "Approval History",
        path: "/admin/approval-history",
        icon: Clock,
      },
      { label: "Profile", path: "/admin/profile", icon: User },
      { label: "Payroll", path: "/admin/payroll", icon: HandCoins },
      { label: "Reports", path: "/admin/reports", icon: Flag },
    ],
    admin: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      {
        label: "Employee Management",
        path: "/admin/employee-management",
        icon: Users,
      },
      {
        label: "Attendance Management",
        path: "/admin/attendance",
        icon: UserCheck,
      },
      {
        label: "Leave Management",
        path: "/admin/leave-requests",
        icon: CalendarCheck,
      },
      {
        label: "Approval History",
        path: "/admin/approval-history",
        icon: Clock,
      },
      { label: "Profile", path: "/admin/profile", icon: User },
      { label: "Payroll", path: "/admin/payroll", icon: HandCoins },
      { label: "Reports", path: "/admin/reports", icon: Flag },
    ],
    hr: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      {
        label: "Employee Management",
        path: "/admin/employee-management",
        icon: Users,
      },
      {
        label: "Attendance Management ",
        path: "/admin/attendance",
        icon: UserCheck,
      },
      {
        label: "Leave Management",
        path: "/admin/leave-requests",
        icon: CalendarCheck,
      },
      {
        label: "Approval History",
        path: "/admin/approval-history",
        icon: Clock,
      },
      { label: "Profile", path: "/admin/profile", icon: User },
      { label: "Payroll", path: "/admin/payroll", icon: HandCoins },
      { label: "Reports", path: "/admin/reports", icon: Flag },
    ],
    employee: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Attendance", path: "/attendance", icon: UserCheck },
      { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },
      { label: "Approval History", path: "/approval-history", icon: Clock },
      { label: "Profile", path: "/profile", icon: User },
    ],
  };

  const linksToShow = sidebarConfig[role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const [pageTitle, setPageTitle] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-3 shadow-lg">
        {/* <div className="flex justify-center mb-2">
          <img src="/logo.jpg" alt="Logo" className="w-15 bg-amber-50 " />
        </div> */}

        {/* Profile Info */}
        <div className="flex items-center gap-4 p-2 bg-[#1e293b] rounded-xl mb-4 shadow relative">
          <img
            src={user?.profileImage || profileImage}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold capitalize">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-sm text-gray-300 capitalize">{role}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-grow">
          {linksToShow.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              end={label === "Dashboard"} // 👈 Only for dashboard, disable partial matching
              onClick={() => setPageTitle(label)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-yellow-500 text-black font-semibold"
                    : "hover:bg-yellow-600 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-4 py-3 cursor-pointer bg-red-500 hover:bg-red-700 text-white rounded-xl"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-x-auto w-310 bg-gray-100">
        {/* Navbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg w-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-500"
              size={18}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>
            <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Mail size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Page Content Wrapper */}

        <h1 className="text-2xl font-extrabold mb-2">
          Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6 w-full min-h-[calc(100vh-150px)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold mb-2 text-black">{pageTitle}</h2>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
