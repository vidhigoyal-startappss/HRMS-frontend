import React from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
  Outlet,
} from "react-router-dom";

import Login from "../pages/LoginPage";
import ProtectedRoutes from "../routes/ProtectedRoutes";
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";
import EmployeeLayout from "../components/layout/employeeLayout/employeeLayout";
import AdminDashboard from "../pages/AdminDashBoard";
import Attendance from "../pages/Attendance";
import LeaveRequests from "../pages/LeaveManagement";
import ApprovalHistory from "../pages/ApprovalHistory";
import Profile from "../pages/ProfilePage";
import Payroll from "../pages/Payroll";
import Reports from "../pages/Reports";
import EmployeeManagement from "../pages/EmployeeManagement";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import EmployeeForm from "../components/Form/UserCreationForm/EmployeeForm/EmployeeForm";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoutes allowedRoles={["admin", "hr", "superadmin"]}>
              <AdminLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employee-management" element={<EmployeeManagement />} />
          <Route path="add-employee" element={<EmployeeForm></EmployeeForm>}></Route>
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="approval-history" element={<ApprovalHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="reports" element={<Reports />} />
          
        </Route>

        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            <ProtectedRoutes allowedRoles={["employee"]}>
              <EmployeeLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="approval-history" element={<ApprovalHistory />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
