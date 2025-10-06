import React from "react";
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
import CompanyPolicypage from "../pages/CompanyPolicypage";
import OnboardingForm from "../pages/Onboarding/OnboardingForm";
import SendOnboardingForm from "../pages/HR/SendOnboardingForm";
import SubmittedFormsList from "../pages/HR/SubmittedFormsList";
import OnboardingFormDetails from "../pages/HR/OnboardingFormDetails";
import FormSuccess from "../pages/Onboarding/FormSuccess";
import SignLetterPageWrapper from "../pages/SignLetterPageWrapper";
import PayrollManagement from "../pages/PayrollManagement";
import EmployeePayrollViewer from "../pages/EmployeePayrollViewer";
import SignedUploadSuccess from "../pages/SignedUploadSuccess";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/" element={<Login />} />
        <Route path="/reset-mail-message" element={<EmailSentMessge />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/onboarding/:token" element={<OnboardingForm />} />
        <Route path="/form-success" element={<FormSuccess />} />
        <Route path="/Signed-Sucess" element={<SignedUploadSuccess />} />
        <Route
          path="/sign-letter/:userId/:filename"
          element={<SignLetterPageWrapper />}
        />

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
          <Route path="add-employee-details/:id" element={<EmployeeForm />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="leave-apply" element={<LeaveRequestForm />} />
          <Route path="approval-history" element={<ApprovalHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payroll" element={<PayrollManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="/admin/employee/:id" element={<Profile />} />
          <Route path="/admin/employee/edit/:id" element={<Profile />} />
          <Route path="company-policy" element={<CompanyPolicypage />} />
          <Route
            path="/admin/send-onboarding"
            element={<SendOnboardingForm />}
          />
          <Route path="/admin/onboarding" element={<SubmittedFormsList />} />
          <Route
            path="/admin/onboarding/:token"
            element={<OnboardingFormDetails />}
          />
        </Route>

        <Route
          path="/employee"
          element={
            <ProtectedRoutes allowedRoles={["Employee"]}>
              <EmployeeLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="leaves" element={<EmployeeLeaveDashboard />} />
          <Route path="request-leave" element={<LeaveRequestForm />} />

          <Route path="approval-history" element={<ApprovalHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="company-policy" element={<CompanyPolicypage />} />
          <Route path="EmployeePayroll" element={<EmployeePayrollViewer />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
