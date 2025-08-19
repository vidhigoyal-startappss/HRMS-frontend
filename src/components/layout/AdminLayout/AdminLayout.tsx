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
  Shield
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../feature/user/userSlice";
import { RootState } from "../../../store/store";
import profileImage from "../../../assets/userlogo.png";
import { ChangePassword } from "../../ChangePassword/ChangePassoword";
import NotificationModal from "../../Modal/NotificationModal";
import { fetchNotifications } from "../../../api/notification";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from "../../../api/notification";

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const role = user?.role?.toLowerCase() || "guest";
  const id = user?.userId;
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("#settings-dropdown") &&
        !target.closest("#settings-btn")
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const current = linksToShow.find((link) =>
      location.pathname.startsWith(link.path)
    );
    if (current) {
      setPageTitle(current.label);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifiactionData = await fetchNotifications(id);
        setNotifications(notifiactionData);
        const unread = notifiactionData.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchData();
  }, [id]);

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

      { label: "Profile", path: "/admin/profile", icon: User },
       { label: "Company Policies", path: "/admin/company-policy", icon: Shield },
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

      { label: "Profile", path: "/admin/profile", icon: User },
       { label: "Company Policies", path: "/admin/company-policy", icon: Shield },
    ],
    hr: [
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

      { label: "Profile", path: "/admin/profile", icon: User },
       { label: "Company Policies", path: "/admin/company-policy", icon: Shield },
    ],
    employee: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Attendance", path: "/attendance", icon: UserCheck },
      { label: "Leave Requests", path: "/leave-requests", icon: CalendarCheck },

      { label: "Profile", path: "/profile", icon: User },
      
    ],
  };

  const linksToShow = sidebarConfig[role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };
  const formatRole = (role: string) => {
    if (role === "superadmin") return "Super-Admin";
    if (role === "admin") return "Admin";
    if (role === "hr") return "HR";
    if (role === "employee") return "Employee";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <>
      <div className="flex h-screen bg-[#F3F9FB]">
        <aside className="w-16 md:w-72 bg-[#113F67] text-white flex flex-col p-4 shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4 p-0 md:p-3 bg-transparent md:bg-gray-300 lg:rounded-xl mb-6 font-bold text-[#113F67]">
            <img
              src={user?.profileImage || profileImage}
              alt="Profile"
              className="w-10 h-10 md:w-10 md:h-10 lg:w-14 lg:h-14 rounded-full object-cover"
            />

            <div className="hidden md:block">
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
                      alert(`${label} is under progress `);
                    } else {
                      setPageTitle(label);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center md:justify-start justify-center gap-0 md:gap-3 px-2 md:px-4 py-2 rounded-md text-base font-medium transition-all ${
                      disabled
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : isActive
                        ? "bg-[#226597] text-white font-semibold"
                        : "hover:bg-[#226597] hover:text-white text-white"
                    }`
                  }
                >
                  <Icon size={18} className="text-white" />
                  <span className="hidden md:inline">{label}</span>

                  {disabled && (
                    <span
                      className="ml-2 text-xs bg-[#113F67] text-white font-semibold px-1 py-0.1 rounded-full"
                      title="Under Progress"
                    >
                      
                    </span>
                  )}
                </NavLink>
              </div>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-6 flex items-center cursor-pointer justify-center md:justify-start gap-3 px-0 md:px-4 py-3 bg-[#226597] hover:bg-[#87C0CD] text-white text-base font-medium rounded-md"
          >
            <LogOut size={20} className="text-white" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </aside>

        <main className="flex-1 px-6 py-4 overflow-y-auto bg-[#F3F9FB]">
          <div className="flex justify-between items-center mb-4">
            <h1 className="lg:text-2xl sm:text-xl font-bold text-[#113F67]">
              Welcome, {formatRole(role)}
            </h1>

            <div className="flex items-center gap-4">
              <button
                className="relative p-2 rounded-full bg-white hover:bg-[#87C0CD] shadow-sm cursor-pointer"
                onClick={() => setShowNotification((prev) => !prev)}
              >
                <Bell size={20} className="text-[#113F67]" />

                {unreadCount > 0 && (
                  <span
                    className="
          absolute top-1 left-5 
          text-xs sm:text-[10px] 
          bg-red-600 text-white font-bold 
          w-5 h-5 sm:w-4 sm:h-4 
          flex items-center justify-center 
          rounded-full
        "
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  id="settings-btn"
                  onClick={() => setShowSettings((prev) => !prev)}
                  className="relative p-2 rounded-full bg-white hover:bg-[#87C0CD] shadow-sm cursor-pointer"
                >
                  <Settings size={20} className="text-[#113F67]" />
                </button>

                {showSettings && (
                  <div
                    id="settings-dropdown"
                    className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50"
                  >
                    <button
                      onClick={() => {
                        setShowChangePasswordModal(true);
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#113F67]"
                    >
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <section className="bg-white rounded-xl shadow-md p-4 min-h-[calc(100vh-160px)]">
            <header className="mb-3">
              <h2 className="text-xl font-semibold text-[#113F67]">
                {pageTitle}
              </h2>
            </header>
            <Outlet />
          </section>
        </main>
      </div>

      {showChangePasswordModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md max-h-[600px] mx-5 bg-white rounded-2xl shadow-2xl p-0 animate-fadeIn overflow-hidden">
            <button
              onClick={() => setShowChangePasswordModal(false)}
              className="absolute top-3 right-4 text-gray-500 text-2xl hover:text-black focus:outline-none"
            >
              &times;
            </button>

            <div className="pt-2 h-full">
              <ChangePassword />
            </div>
          </div>
        </div>
      )}
      {showNotification && (
        <NotificationModal
          onClose={() => setShowNotification(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </>
  );
};

export default AdminLayout;
