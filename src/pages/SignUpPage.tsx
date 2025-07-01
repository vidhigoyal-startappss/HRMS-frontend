import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/auth";
import { Loader } from "../components/Loader/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstUser, setIsFirstUser] = useState<boolean>(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
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
        const res = await axios.get("http://localhost:3000/api/users/first-user-check");
        setIsFirstUser(res.data.isFirst);
      } catch (err) {
        console.error("Error checking first user", err);
        toast.error("Failed to check user status");
      }
    };
    checkFirstUser();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = isFirstUser ? { ...data, role: "SuperAdmin" } : data;
      const res = await API.post("http://localhost:3000/api/users/register", formData);

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
    <div className="flex items-center justify-center px-4 min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg shadow-blue-900 p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              {...register("email")}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          {/* Role (if not first user) */}
          {!isFirstUser && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Role</label>
              <select
                {...register("role")}
                className="w-full border cursor-pointer border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Role --</option>
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
              <p className="text-red-500 text-sm mt-1">{errors.role?.message}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-900 transition"
          >
            {isLoading ? <Loader /> : "Sign Up"}
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
