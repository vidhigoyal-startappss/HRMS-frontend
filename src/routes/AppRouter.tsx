import React, { useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import LeaveRequestForm from "../components/Form/LeaveForm/LeaveForm";
import SignUpPage from "../pages/SignUpPage";
import Login from "../pages/LoginPage";
import ProtectedRoutes from "../routes/ProtectedRoutes";
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";
import EmployeeLayout from "../components/layout/EmployeeLayout/EmployeeLayout";
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
import Unauthorized from "../pages/Unauthorised";
import ViewEmployee from "../pages/ViewEmployee";
import UpdateEmployee from "../pages/UpdateEmployee";
import AttendanceManagement from "../pages/AttendanceMangement";
import EmployeeLeaveDashboard from "../pages/Leaves";
import { ForgotPasswordForm } from "../components/Form/ForgotPasswordForm/ForgotPasswordForm";
import { ResetPasswordForm } from "../components/Form/ResetPasswordForm/ResetPasswordForm";
import EmailSentMessge from "../components/Messages/EmailSentMessge";
import RegisterPage from "../pages/RegisterPage";
import { useLocation } from "react-router-dom";
import { pushToHistory } from "../feature/navigation/navigationSlice";
import { useDispatch } from "react-redux";


const RouteTracker = () =>{
  const location = useLocation()
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(pushToHistory(location.pathname))
  },[location.pathname])
  return null
}

const AppRouter = () => {
  return (
    <BrowserRouter>
    <RouteTracker/>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/" element={<Login />} />
        <Route path="/reset-mail-message" element={<EmailSentMessge />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoutes
              allowedRoles={["SuperAdmin", "Admin", "HR", "Manager"]}
            >
              <AdminLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employee-management" element={<EmployeeManagement />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="add-employee" element={<RegisterPage />} />
          <Route
            path="/admin/add-employee-details/:id"
            element={<EmployeeForm />}
          />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="leave-apply" element={<LeaveRequestForm />} />
          <Route path="approval-history" element={<ApprovalHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="reports" element={<Reports />} />
          <Route path="/admin/employee/:id" element={<Profile />} />
          <Route path="/admin/employee/edit/:id" element={<Profile />} />
        </Route>

        <Route
          path="/employee"
          element={
            <ProtectedRoutes allowedRoles={["Employee"]}>
              <EmployeeLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="leaves" element={<EmployeeLeaveDashboard />} />
          <Route path="request-leave" element={<LeaveRequestForm />} />

          <Route path="approval-history" element={<ApprovalHistory />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
