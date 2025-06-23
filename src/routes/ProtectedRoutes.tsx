import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";

interface ProtectedRoutesProps {
  allowedRoles?: string[];
  children?: React.ReactNode; // optional, in case someone uses <ProtectedRoutes><Component /></ProtectedRoutes>
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  allowedRoles,
  children,
}) => {
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role;
  console.log("Current Role:", user.role);

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoutes;
