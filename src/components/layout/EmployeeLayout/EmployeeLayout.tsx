import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck,
  Clock,
  User,
  LogOut,
  Bell,
  Mail,
  Search,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../feature/user/userSlice";
import { RootState } from "../../../store/store";
import profileImage from "../../../assets/user-alt.svg";
import { getProfileImage } from "../../../api/auth";
import { getEmployeeById } from "../../../api/auth";
const EmployeeLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user.user);

  const [employeeData, setEmployeeData] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
  const fetchEmployee = async () => {
    if (user?.userId) {
      try {
        const data = await getEmployeeById(user.userId);
        setEmployeeData(data?.employee || data); // adjust if API wraps response
        console.log("Fetched Employee:", data);
      } catch (err) {
        console.error("Error loading employee data:", err);
      }
    }
  };

  fetchEmployee();
}, [user]);

// useEffect(() => {
//   const getProfile = async () => {
//     if (user?.userId) {
//       try {
//         const data = await getProfileImage(user.userId);
//         setImageUrl(data); 
//         console.log("Fetched Employee profile image:", data);
//       } catch (err) {
//         console.error("Error loading employee data:", err);
//       }
//     }
//   };

//   getProfile();
// }, [user]);


  const fullName =
  employeeData?.firstName && employeeData?.lastName
    ? `${employeeData.firstName} ${employeeData.lastName}`
    : "Employee";

  const role = user?.role || "Employee";

  const sidebarLinks = [
    { label: "Dashboard", path: "/employee/", icon: LayoutDashboard },
    { label: "Attendance", path: "/employee/attendance", icon: UserCheck },
    {
      label: "Leaves",
      path: "/employee/leaves",
      icon: CalendarCheck,
    },
    {
      label: "Approval History",
      path: "/employee/approval-history",
      icon: Clock,
    },
    { label: "Profile", path: "/employee/profile", icon: User },
  ];

  // Find the currently active sidebar label based on current path
  const activeFeature =
    sidebarLinks.find((link) => location.pathname.startsWith(link.path))
      ?.label || "";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  console.log(imageUrl)

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-5">
        {/* Logo */}
        {/* <div className="flex justify-center mb-4">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-28 h-auto bg-white rounded-md"
          />
        </div> */}

        {/* Profile Info */}
        <div className="flex items-center gap-4 p-3 bg-[#1e293b] rounded-xl mb-6 shadow">
          <img
            src={imageUrl || profileImage}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500"
          />
          <div>
            <p className="text-lg font-semibold capitalize">{fullName}</p>
            <p className="text-sm text-gray-300 capitalize">{role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-grow">
          {sidebarLinks.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-yellow-500 text-black font-bold"
                    : "hover:bg-yellow-600 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-xl"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col p-4 md:p-6 bg-gray-100 min-h-screen">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-4">
          {/* Left: Active Feature */}
          <div className="text-xl font-semibold text-gray-800 capitalize mr-6 min-w-[150px]">
            {"Welcome"}
          </div>

    

          {/* Icons */}
          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 rounded-full bg-white hover:bg-gray-200">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 cursor-pointer rounded-full"></span>
            </button>
            <button className="p-2 rounded-full bg-white hover:bg-gray-200">
              <Mail size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="bg-white rounded-xl shadow p-6 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;
