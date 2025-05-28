// src/components/ProtectedRoutes.tsx
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

  console.log("ProtectedRoutes: user from Redux =>", user);

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // Normalize roles to lowercase & trim to avoid mismatch
    const userRole = user.role?.toLowerCase().trim();
    const allowed = allowedRoles.map((role) => role.toLowerCase().trim());

    if (!allowed.includes(userRole)) {
      // User role not authorized for this route
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Authorized: render child routes
  return children;
};

export default ProtectedRoutes;
