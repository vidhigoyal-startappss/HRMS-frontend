import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store"; // import correct RootState

interface ProtectedRoutesProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  children,
  allowedRoles,
}) => {
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoutes;
