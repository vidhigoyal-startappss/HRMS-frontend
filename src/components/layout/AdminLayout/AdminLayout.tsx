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
  HandCoins,
  Flag,
  FileText,
  Settings, 
  Repeat,
  BarChart2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../feature/user/userSlice";
import { RootState } from "../../../store/store";
import profileImage from "../../../assets/userlogo.png";

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const role = user?.role?.toLowerCase() || "guest";
  const location = useLocation();

  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

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
  { label: "Employee Management", path: "/admin/employee-management", icon: Users },
  { label: "Attendance Management", path: "/admin/attendance", icon: UserCheck },
  { label: "Leave Management", path: "/admin/leave-requests", icon: CalendarCheck },
  { label: "Payroll Management", path: "/admin/payroll", icon: HandCoins , disabled:true},
  { label: "Document Management", path: "/admin/documents", icon: FileText , disabled:true},
  { label: "Change Requests", path: "/admin/change-requests", icon: Repeat , disabled:true},
  { label: "Reports", path: "/admin/reports", icon: BarChart2 , disabled:true},
  { label: "Approval History", path: "/admin/approval-history", icon: Clock , disabled:true},
  { label: "Settings", path: "/admin/settings", icon: Settings , disabled:true},
  { label: "Profile", path: "/admin/profile", icon: User },
],
    admin: [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Employee Management", path: "/admin/employee-management", icon: Users },
  { label: "Attendance Management", path: "/admin/attendance", icon: UserCheck },
  { label: "Leave Management", path: "/admin/leave-requests", icon: CalendarCheck },
  { label: "Payroll Management", path: "/admin/payroll", icon: HandCoins },
  { label: "Document Management", path: "/admin/documents", icon: FileText ,disabled:true},
  { label: "Change Requests", path: "/admin/change-requests", icon: Repeat ,disabled:true},
  { label: "Reports", path: "/admin/reports", icon: BarChart2 ,disabled:true},
  { label: "Approval History", path: "/admin/approval-history", icon: Clock ,disabled:true},
  { label: "Profile", path: "/admin/profile", icon: User },
],
    hr: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Employee Management", path: "/admin/employee-management", icon: Users },
  { label: "Attendance Management", path: "/admin/attendance", icon: UserCheck },
  { label: "Leave Management", path: "/admin/leave-requests", icon: CalendarCheck },
  { label: "Payroll Management", path: "/admin/payroll", icon: HandCoins , disabled:true},
  { label: "Document Management", path: "/admin/documents", icon: FileText , disabled:true},
  { label: "Change Requests", path: "/admin/change-requests", icon: Repeat , disabled:true},
  { label: "Reports", path: "/admin/reports", icon: BarChart2 , disabled:true},
  { label: "Approval History", path: "/admin/approval-history", icon: Clock , disabled:true},
  { label: "Settings", path: "/admin/settings", icon: Settings , disabled:true},
  { label: "Profile", path: "/admin/profile", icon: User },
    ],
    employee: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Attendance", path: "/attendance", icon: UserCheck },
  { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },
  { label: "Document Upload", path: "/documents", icon: FileText ,disabled:true},
  { label: "Change Requests", path: "/change-requests", icon: Repeat ,disabled:true},
  { label: "Approval History", path: "/approval-history", icon: Clock ,disabled:true},
  { label: "Profile", path: "/profile", icon: User },
    ],
  };

  const linksToShow = sidebarConfig[role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#F3F9FB]">
  {/* Sidebar */}
  <aside className="w-72 bg-[#113F67] text-white flex flex-col p-4 shadow-lg">
    {/* Profile Header */}
    <div className="flex items-center gap-4 p-3 bg-gray-300 rounded-xl mb-6 font-bold text-[#113F67]">
      <img
        src={user?.profileImage || profileImage}
        alt="Profile"
        className="w-14 h-14 rounded-full object-cover p-0.5"
      />
      <div>
        <div className="text-lg capitalize font-extrabold text-[#113F67]">
          {user?.name || "User"}
        </div>
        <div className="text-sm font-bold text-[#113F67] capitalize">
          {role || "Role"}
        </div>
      </div>
    </div>

    {/* Sidebar Links */}
    {/* Sidebar Links */}
<nav className="flex flex-col gap-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
  {linksToShow.map(({ label, path, icon: Icon, disabled }) => (
    <div key={label} className="relative group">
      <NavLink
        to={disabled ? "#" : path}
        end={label === "Dashboard"}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            alert(`${label} is under progress 🚧`);
          } else {
            setPageTitle(label);
          }
        }}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition-all ${
            disabled
              ? "bg-gray-400 text-white cursor-not-allowed"
              : isActive
              ? "bg-[#226597] text-white font-semibold"
              : "hover:bg-[#226597] hover:text-white text-white"
          }`
        }
      >
        <Icon size={18} className="text-white" />
        {label}
        {disabled && (
          <span
            className="ml-2 text-xs bg-[#113F67] text-white font-semibold px-2 py-0.5 rounded-full"
            title="Under Progress"
          >
            i
          </span>
        )}
      </NavLink>
    </div>
  ))}
</nav>


    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="mt-6 flex items-center cursor-pointer justify-center gap-3 px-4 py-3 bg-[#226597] hover:bg-[#87C0CD] text-white text-sm font-medium rounded-md"
    >
      <LogOut size={18} className="text-white" />
      Logout
    </button>
  </aside>

  {/* Main Content Area */}
  <main className="flex-1 bg-[#F3F9FB]">
    <div className="px-6 py-4 h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
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

      {/* Page Content with Scroll */}
      <section className="bg-white rounded-xl shadow-md p-4 flex-1 overflow-y-auto">
        <header className="mb-3">
          <h2 className="text-xl font-semibold text-[#113F67]">
            {pageTitle}
          </h2>
        </header>
        <Outlet />
      </section>
    </div>
  </main>
</div>

  );
};

export default AdminLayout;
