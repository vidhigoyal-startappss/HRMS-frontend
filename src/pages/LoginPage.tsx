import React, { useState } from "react";
import InputField from "../components/common/InputField";
import Button from "../components/common/ButtonComp";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { toast } from "react-toastify";
import { login } from "../feature/user/userSlice";
import axios from "axios";
import { useForm } from "react-hook-form";
import { login as LoginAPI } from "../api/auth";
import { signup } from "../api/auth";
import loginBg from "../assets/loginBg.jpg";
import { Link } from "react-router-dom";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ mode: "onChange" });

  const onSubmit = async (data: LoginFormInputs) => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const response = await LoginAPI(data);
      const token = response.accessToken;
      if (!token) throw new Error("Token not found in response.");

      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));

      const user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        employeeId: payload.employeeId,
        // customPermissions: payload.customPermissions,
        name: payload.name,
      };

      localStorage.setItem("user", JSON.stringify(user));
      dispatch(login(user));
      toast.success("Login successful!");

      const role = user.role?.toLowerCase();
      if (["superadmin", "admin", "manager", "hr"].includes(role)) {
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      } else if (role === "employee") {
        setTimeout(() => navigate("/employee"), 1000);
      } else {
        toast.error("Unknown role. Cannot redirect.");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Invalid credentials or server error.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = () => {
    setTimeout(() => navigate("forgot-password"), 200);
  };
  const handleSignup = () => {
    setTimeout(() => navigate("/signup"), 200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-10 bg-white relative">
        {/* Logo Heading top-left */}
        <h1 className="absolute top-6 left-6 text-xl font-bold text-[#113F67]">
          STARTAPPSS
        </h1>

        {/* Form */}
        <div className="w-full max-w-md mx-auto mt-6">
          <h2 className="text-3xl font-extrabold text-[#113F67] mb-6 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField
              type="email"
              name="email"
              placeholder="Enter your email"
              register={register}
              validation={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
                maxLength: {
                  value: 32,
                  message: "Maximum 32 characters allowed",
                },
              }}
              error={errors.email}
            />

            <InputField
              type="password"
              name="password"
              placeholder="Enter your password"
              register={register}
              validation={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
                maxLength: {
                  value: 32,
                  message: "Maximum 32 characters allowed",
                },
              }}
              error={errors.password}
            />

            <div className="text-right text-sm">
              <p
                onClick={handleForgot}
                className="text-[#226597] hover:underline cursor-pointer"
              >
                Forgot password?
              </p>
            </div>

            <Button
              name="Login"
              isLoading={isLoading}
              cls="bg-[#113F67] hover:bg-[#226597] text-white w-full py-2 rounded-md transition font-medium"
            />
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={handleSignup}
              className="text-[#113F67] font-semibold cursor-pointer hover:underline"
            >
              Sign up for free
            </span>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden md:block md:w-1/2 relative text-white">
        {/* Background */}
        <img
          src={loginBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#226597] opacity-80"></div>

        {/* Text Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end items-start px-10 pb-20">
          <div className="max-w-md">
            <h1 className="text-xl lg:text-3xl font-semibold leading-snug text-left">
              Manage all{" "}
              <span className="text-[#113F67] font-bold">HR Operations</span>{" "}
              <br />
              from the comfort of your home.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
