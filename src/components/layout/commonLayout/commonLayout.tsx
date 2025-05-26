import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminLayout from "../AdminLayout/AdminLayout";
import EmployeeLayout from "../EmployeeLayout/EmployeeLayout";
import ProtectedRoute from "../../../routes/ProtectedRoutes";

const CommonLayout = ({ allowedRoles }) => {
  const role = localStorage.getItem("role"); 

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; 
  }

  // Render layout based on role
  if (role === "admin" || role === "superadmin" || role === "hr") {
    return (
      <ProtectedRoute allowedRoles={["admin", "superadmin", "hr", "employee"]}>
        <AdminLayout />
      </ProtectedRoute>
    );
  } else if (role === "employee") {
    return (
      <ProtectedRoute allowedRoles={["employee"]}>
        <EmployeeLayout />
      </ProtectedRoute>
    );
  }

  // fallback
  return <Navigate to="/" replace />;
};

export default CommonLayout;
