import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  children,
  allowedRoles,
}) => {
  const user = useSelector((state: any) => state.user.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role;
    const allowed = allowedRoles.map((role) => role);

    if (!allowed.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoutes;
