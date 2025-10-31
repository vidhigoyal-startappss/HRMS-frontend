import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { RootState } from "../store/store";

interface ProtectedRoutesProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  allowedRoles,
  children,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [unauthorizedOnce, setUnauthorizedOnce] = useState(false);

  useEffect(() => {
    if (!user || !user.email) return;

    const storedEmail = sessionStorage.getItem("loggedInEmail");

    if (storedEmail && storedEmail !== user.email) {
      setUnauthorizedOnce(true);
    } else if (!storedEmail) {
      sessionStorage.setItem("loggedInEmail", user.email);
    }
  }, [user]);

  if (!user) return <Navigate to="/" replace />;

  if (unauthorizedOnce) {
    Swal.fire({
      icon: "warning",
      title: "Unauthorized Access",
      text: "You are already logged in with another account in this browser. Please use incognito mode or another browser.",
      confirmButtonText: "OK",
      confirmButtonColor: "#113F67",
    });
    setUnauthorizedOnce(false);
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedRoutes;
