import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  role: yup.string().oneOf(["superAdmin", "hr", "employee"]).required("Role is required"),
});

const SignUpPage = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3001/api/auth/signup", data);
      setMessage("Account created successfully. Please login.");
    }catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <>
      {/* Logo */}
      <img src="/logo.webp" alt="Logo" className="fixed top-4 left-4 w-20 h-20" />

      <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg.jpg')" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Create an Account</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Role</label>
            <select
              {...register("role")}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Role</option>
              <option value="superAdmin">Super Admin</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
            <p className="text-red-500 text-sm mt-1">{errors.role?.message}</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Sign Up
          </button>

          {/* Login Redirect */}
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}
        </form>
      </div>
    </>
  );
};

export default SignUpPage;
