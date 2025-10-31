import React, { useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck,
  Clock,
  User,
  LogOut,
  Bell,
  Settings,
  FileText,
  Repeat,
  Mail,
  Shield,
  HandCoins,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../feature/user/userSlice";
import { RootState } from "../../../store/store";
import userProfile from "../../../assets/user-alt.svg";
import { getEmployeeById } from "../../../api/auth";
import { ChangePassword } from "../../ChangePassword/ChangePassoword";
import { fetchNotifications } from "../../../api/notification";
import NotificationModal from "../../Modal/NotificationModal";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from "../../../api/notification";
import BackButton from "../../common/BackButtonComp/BackButton";
import { getProfileImage } from "../../../api/auth";
import { Link } from "react-router-dom";

const EmployeeLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.user);

  const [employeeData, setEmployeeData] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const ChangePasswordModalRef = useRef<HTMLDivElement>(null);

  const role = user?.role || "Employee";
  const id = user?.userId;
  // useEffect(() => {
  //   const matched = linksToShow.find((link) =>
  //     location.pathname.startsWith(link.path)
  //   );
  //   setPageTitle(matched?.label || "Dashboard");
  // }, [location.pathname]);

  const routesTitles: Record<string, string> = {
    "/employee/dashboard": "Dashboard",
    "/employee/attendance": "Attendance",
    "/employee/leaves": "Leave Requests",
    "/employee/request-leave": "Leave Requests",
       "/employee/EmployeePayroll": "Payroll",
    "/employee/profile": "Profile",
    "/employee/company-policy": "Company Policies",
  };

  useEffect(() => {
    const path = location.pathname;
    const matched = Object.keys(routesTitles)
      .sort((a, b) => b.length - a.length)
      .find((route) => path.startsWith(route));

    setPageTitle(routesTitles[matched as string] || "Dashboard");
  }, [location.pathname]);

  const sidebarConfig: Record<
    string,
    { label: string; path: string; icon: React.ElementType }[]
  > = {
    Employee: [
      {
        label: "Dashboard",
        path: "/employee/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Attendance", path: "/employee/attendance", icon: UserCheck },
      {
        label: "Leave Requests",
        path: "/employee/leaves",
        icon: CalendarCheck,
      },
      {
        label: "Payroll",
        path: "/employee/EmployeePayroll",
        icon: HandCoins,
      },
      { label: "Profile", path: "/employee/profile", icon: User },
      {
        label: "Company Policies",
        path: "/employee/company-policy",
        icon: Shield,
      },
    ],
  };

  const linksToShow = sidebarConfig[role] || [];
  const fullName =
    employeeData?.firstName && employeeData?.lastName
      ? `${employeeData.firstName} ${employeeData.lastName}`
      : "Employee";

const handleLogout = () => {
  dispatch(logout());
  sessionStorage.removeItem("loggedInEmail");
  navigate("/");
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifiactionData = await fetchNotifications(id);
        setNotifications(notifiactionData);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchData();
  }, [id]);

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

  useEffect(() => {
    const getProfile = async (id: string) => {
      try {
        const imageURL = await getProfileImage(id);
        setProfileImage(imageURL);
      } catch (error) {
        console.log(error);
      }
    };
    getProfile(id);
  }, []);

  useEffect(() => {
    if (id) {
      const fetchemployee = async () => {
        try {
          const data = await getEmployeeById(id);
          setEmployeeData(data);
        } catch (error) {
          console.error("Failed to  fetch employee", error);
        }
      };
      fetchemployee();
    }
  }, [id]);

  const bellButtonRef = useRef();
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

  const shouldShowBackButton = (path: string) => {
    const alwaysShowBackButtonRoutes = [
      "/employee/request-leave",
      // "/admin/leave-apply"
    ];
    return (
      path.split("/").length > 3 ||
      alwaysShowBackButtonRoutes.some((route) => path.startsWith(route))
    );
  };

  return (
    <>
      <div className="flex h-screen bg-[#F3F9FB]">
        <aside className="w-16 md:w-72 bg-[#113F67] text-white flex flex-col items-center md:items-stretch p-4 shadow-lg transition-all duration-300">
          <Link
            to="/employee/profile"
            className="hidden md:flex items-center gap-4 p-3 bg-[#226597] rounded-xl mb-6"
          >
            <img
              src={profileImage || userProfile}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-white p-0.5"
            />
            <div>
              <div className="text-lg font-semibold capitalize">{fullName}</div>
              <div className="text-sm text-white capitalize">{role}</div>
            </div>
          </Link>

          <nav className="flex flex-col gap-3 flex-grow">
            {linksToShow.map(({ label, path, icon: Icon }) =>
              label === "Approval History" ? (
                <div
                  key={label}
                  className="flex items-center justify-between gap-2 bg-gray-400 text-white cursor-not-allowed px-4 py-2 rounded-md text-base font-medium"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-white" />
                    <span className="hidden md:inline">{label}</span>
                  </div>
                  <button
                    onClick={() => alert("This feature is under development.")}
                    className="hidden md:flex bg-[#113F67] text-white w-5 h-5 rounded-full text-xs font-semibold items-center justify-center hover:bg-[#226597]"
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
                    `flex items-center md:justify-start justify-center gap-3 px-1 md:px-4 py-2 rounded-md text-base font-medium transition-all ${
                      isActive
                        ? "bg-[#226597] text-white font-semibold"
                        : "hover:bg-[#226597] hover:text-white text-white"
                    }`
                  }
                >
                  <Icon size={20} className="text-white" />
                  <span className="hidden md:inline">{label}</span>
                </NavLink>
              )
            )}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center justify-center md:justify-start gap-3 px-0 md:px-4 py-2 
             bg-[#226597] hover:bg-[#87C0CD] text-white text-base font-medium rounded-md cursor-pointer"
          >
            <LogOut size={20} className="text-white cursor-pointer" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </aside>

        <main className="flex-1 px-6 py-4 overflow-y-auto bg-[#F3F9FB]">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#113F67]">
              Welcome, {fullName}
            </h1>
            <div className="flex items-center gap-4">
              <button
                className="relative p-2 rounded-full bg-white hover:bg-[#87C0CD] shadow-sm cursor-pointer"
                onClick={() => setShowNotification((prev) => !prev)}
                ref={bellButtonRef}
              >
                <Bell size={20} className="text-[#113F67]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
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
                      className="w-full z-50 px-4 py-2 text-left text-sm "
                    >
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <section className="bg-white rounded-xl shadow-md p-4 min-h-[calc(100vh-160px)]">
            <header
              className={`flex mb-3 ${
                location.pathname.split("/").length > 3 ? "gap-2" : "gap-4"
              }`}
            >
              {shouldShowBackButton(location.pathname) && <BackButton />}
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
          <div
            className="relative w-full max-w-md max-h-[600px] mx-5 bg-white rounded-2xl shadow-2xl p-0 animate-fadeIn overflow-hidden"
            ref={ChangePasswordModalRef}
          >
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

export default EmployeeLayout;
