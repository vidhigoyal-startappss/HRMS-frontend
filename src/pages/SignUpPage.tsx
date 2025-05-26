import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import React, { useState } from "react";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const SignupPage = () => {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/signup", {
        ...data,
        role: "userAdmin", // optional, backend can enforce it
      });
      setMessage("Admin created successfully. Please login.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">SuperAdmin Signup</h2>

      <div className="mb-3">
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>

      <div className="mb-3">
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Signup
      </button>

      {message && <p className="mt-3 text-sm">{message}</p>}
    </form>
  );
};

export default SignupPage;
