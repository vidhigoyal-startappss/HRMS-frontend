// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import React from "react";
// import Login from "./pages/LoginPage";
// import Dashboard from "./components/layout/AdminLayout/AdminLayout";
// import EmployeeManagement from "./pages/EmployeeManagement";
// import PrivateRoute from "./routes/ProtectedRoutes";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRouter";

function App() {
  return (
    <AppRoutes></AppRoutes>
  );
}

export default App;
