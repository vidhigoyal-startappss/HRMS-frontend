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

interface FormData {
  email: string;
  password: string;
  role?: "Admin" | "HR" | "Employee" | "Manager";
}

const RegisterPage: React.FC = () => {
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

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const formData = data;
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
    <div className="max-h-screen flex items-center justify-center px-4 py-2">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 border border-[#87C0CD]">
        <h2 className="text-3xl font-extrabold text-center text-[#113F67] mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#87C0CD]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#87C0CD]"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {!isFirstUser && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full p-2 rounded-md border border-[#87C0CD] bg-[#F3F9FB] text-[#113F67] font-medium focus:outline-none focus:ring-2 focus:ring-[#226597] transition-all"
              >
                <option value="">-- Select Role --</option>
                <option value="Admin">Admin</option>
                {(role === "HR" || role === "SuperAdmin") && (
                  <option value="HR">HR</option>
                )}
              
                {(role === "HR" || role === "SuperAdmin") && (
                  <option value="Employee">Employee</option>
                )}
              </select>

              {errors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#113F67] text-white py-2 rounded-lg hover:bg-[#226597] transition font-semibold"
          >
            {isLoading ? <Loader /> : "Sign Up"}
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default RegisterPage;
