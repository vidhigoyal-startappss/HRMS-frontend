import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/auth";
import { Loader } from "../components/Loader/Loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import "react-toastify/dist/ReactToastify.css";
import loginBg from "../assets/loginBg.jpg"; 
import logo from "../assets/startappssLogo.png";

interface FormData {
  email: string;
  password: string;
  role?: "Admin" | "HR" | "Employee" | "Manager";
}

const SignUpPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const role = user?.role;

  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    ...(isFirstUser
      ? {}
      : {
          role: yup
            .string()
            .oneOf(["Admin", "HR", "Employee", "Manager"], "Invalid role")
            .required("Role is required"),
        }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    const checkFirstUser = async () => {
      try {
        const res = await axios.get("/api/users/first-user-check");
        setIsFirstUser(res.data.isFirst);
      } catch (err) {
        console.error("Error checking first user", err);
        toast.error("Failed to check user status");
      }
    };
    checkFirstUser();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const formData = isFirstUser ? { ...data, role: "SuperAdmin" } : data;
      const res = await API.post("/api/users/register", formData);
      toast.success("Account created successfully!");
      const userId = res.data.userId;
      setTimeout(() => navigate(`/admin/add-employee-details/${userId}`), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
  {/* Left Panel */}
<div className="md:w-1/2 relative text-white overflow-hidden flex flex-col">
  {/* Background Image with Overlay */}
  <div className="absolute inset-0 z-0">
    <img
      src={loginBg}
      alt="Background"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-[#226597] opacity-80"></div>
  </div>

  {/* Logo Top Left */}
  <div className="relative z-10 px-4">
    {/* <img src={logo} alt="Logo" className="w-40" /> */}
    <h1 className="text-xl text-white font-extrabold px-2 pt-4">STARTAPPSS</h1>
  </div>

  {/* Centered Content Block */}
  <div className="relative z-6 flex flex-1 items-center justify-center px-10">
    <div className="max-w-sm w-full text-left">
      <h1 className="text-3xl font-extrabold mb-3"><strong>HR Management Platform</strong></h1>
      <p className="text-l mb-10">
        Manage all employees, payrolls, and other human resource operations.
      </p>
      {/* <div className="flex gap-3">
        <button className="hover:bg-[#226597] bg-[#113F67] text-white px-4 py-2 rounded font-semibold cursor-pointer">
          Learn More
        </button>
        <button className="border-2 border-white px-4 py-2 rounded font-semibold cursor-pointer">
          Our Features
        </button>
      </div> */}
    </div>
  </div>
</div>


  {/* Right Panel - Signup Form */}
  <div className="md:w-1/2 flex items-center justify-center p-8 bg-white">
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-extrabold text-[#113F67] mb-6">
        Welcome to STARTAPPSS
      </h2>
      <p className="mb-4 text-gray-600">Register your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <input
            {...register("email")}
            placeholder="E-mail Address"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#87C0CD] cursor-pointer"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#87C0CD] cursor-pointer"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Role */}
        {!isFirstUser && (
          <div>
            <select
              {...register("role")}
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#87C0CD] cursor-pointer"
            >
              <option value="">-- Select Role --</option>
              <option value="Admin">Superadmin</option>
              {(role === "HR" || role === "SuperAdmin") && (
                <option value="HR">HR</option>
              )}
              
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.role.message}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#113F67] text-white py-2 rounded hover:bg-[#22577A] transition font-semibold cursor-pointer"
        >
          {isLoading ? <Loader /> : "Create Account"}
        </button>
      </form>

      {/* Redirect */}
      <p className="text-center mt-4 text-gray-600 text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#226597] font-semibold hover:underline cursor-pointer"
        >
          Login
        </Link>
      </p>
    </div>
  </div>
</div>

  );
};

export default SignUpPage;
