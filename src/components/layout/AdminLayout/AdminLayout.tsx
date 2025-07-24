import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import NotificationModal from "../../Modal/NotificationModal";
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
} from "lucide-react";
import BackButton from "../../common/BackButtonComp/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../feature/user/userSlice";
import { RootState } from "../../../store/store";
import profileImage from "../../../assets/userlogo.png";
import { fetchNotifications } from "../../../api/notification";


const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const role = user?.role?.toLowerCase() || "guest";
  const userId = user?.userId
  const location = useLocation();

  const [pageTitle, setPageTitle] = useState("Dashboard");

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
        disabled: true,
      },
      { label: "Profile", path: "/admin/profile", icon: User },
      {
        label: "Payroll",
        path: "/admin/payroll",
        icon: HandCoins,
        disabled: true,
      },
      { label: "Reports", path: "/admin/reports", icon: Flag, disabled: true },
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
        disabled: true,
      },
      { label: "Profile", path: "/admin/profile", icon: User },
      {
        label: "Payroll",
        path: "/admin/payroll",
        icon: HandCoins,
        disabled: true,
      },
      { label: "Reports", path: "/admin/reports", icon: Flag, disabled: true },
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
        disabled: true,
      },
      { label: "Profile", path: "/admin/profile", icon: User },
      {
        label: "Payroll",
        path: "/admin/payroll",
        icon: HandCoins,
        disabled: true,
      },
      { label: "Reports", path: "/admin/reports", icon: Flag, disabled: true },
    ],
    employee: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Attendance", path: "/attendance", icon: UserCheck },
      { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },
      {
        label: "Approval History",
        path: "/approval-history",
        icon: Clock,
        disabled: true,
      },
      { label: "Profile", path: "/profile", icon: User },
    ],
  };

  const linksToShow = sidebarConfig[role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const [showNotification, setShowNotification] = useState(false);
const [notifications, setNotifications] = useState([])
useEffect(()=>{
    const fetchNotificationData = async ()=>{
      try{
          const notificationData = await fetchNotifications(userId)
          setNotifications(notificationData)
      }
      catch (error){
        console.log("Error in fetching noftication")
      }
    }
    fetchNotificationData()
  },[])

  return (
    <div className="flex h-screen bg-[#F3F9FB]">
      <aside className="w-72 bg-[#113F67] text-white flex flex-col p-4 shadow-lg">
        <div className="flex items-center gap-4 p-3 bg-gray-300 rounded-xl mb-6 font-bold text-[#113F67]">
          <img
            src={user?.profileImage || profileImage}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover p-0.5"
          />
          <div>
            <div className="text-lg capitalize font-extrabold text-[#113F67]">
              {user?.name}
            </div>
            <div className="text-sm font-bold text-[#113F67] capitalize">
              {role}
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-3 flex-grow">
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

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center cursor-pointer justify-center gap-3 px-4 py-3 bg-[#226597] hover:bg-[#87C0CD] text-white text-sm font-medium rounded-md"
        >
          <LogOut size={18} className="text-white" />
          Logout
        </button>
      </aside>

      <main className="flex-1 px-6 py-4 overflow-y-auto bg-[#F3F9FB]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#113F67]">
            Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}
          </h1>
          <div className="flex items-center gap-4">
           <button
  className="relative p-2 rounded-full bg-white hover:bg-[#87C0CD] shadow-sm cursor-pointer"
  onClick={() => setShowNotification((prev) => !prev)}>
  <Bell size={20} className="text-[#113F67]"
   />
  {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"> */}
   <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full text-white font-xs"></span>

</button>
            <button className="relative p-2 rounded-full bg-white hover:bg-[#87C0CD] shadow-sm cursor-pointer">
              <Mail size={20} className="text-[#113F67]" />
            </button>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-md p-4 min-h-[calc(100vh-160px)]">
          <header className={`mb-3 flex ${location.pathname === "/admin/dashboard" ? 'gap-4 mr-6' : 'gap-2'}`}>
           { location.pathname!=="/admin/dashboard"  && <BackButton />} 
            <h2 className="text-xl font-semibold text-[#113F67]">
              {pageTitle}
            </h2>
          </header>
          <Outlet />
        </section>
      </main>
       {showNotification && (
  <NotificationModal
    onClose={() => setShowNotification(false)}
    notifications={notifications}
  />
)}
    </div>
  );
};

export default AdminLayout;
