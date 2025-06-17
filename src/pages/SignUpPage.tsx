import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [message, setMessage] = useState("");
  const [isFirstUser, setIsFirstUser] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6).required("Password is required"),
    ...(isFirstUser
      ? {} // skip role if first user
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
        const res = await axios.get(
          "http://localhost:3000/api/users/first-user-check"
        );
        setIsFirstUser(res.data.isFirst);
      } catch (err) {
        console.error("Error checking first user", err);
      }
    };
    checkFirstUser();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = isFirstUser ? { ...data, role: "SuperAdmin" } : data;

      await axios.post("http://localhost:3000/api/users/register", formData);
      setMessage("Account created successfully. Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        <div className="mb-4">
          <label>Email</label>
          <input {...register("email")} className="w-full border p-2 rounded" />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        {/* Show role dropdown ONLY if it's not first user */}
        {!isFirstUser && (
          <div className="mb-4">
            <label>Role</label>
            <select {...register("role")} className="w-full border p-2 rounded">
              <option value="">-- Select Role --</option>
              <option value="Admin">Admin</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
            <p className="text-red-500 text-sm">{errors.role?.message}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

        {message && (
          <p className="text-green-600 mt-4 text-center">{message}</p>
        )}
      </form>
    </div>
  );
};

export default SignUpPage;
