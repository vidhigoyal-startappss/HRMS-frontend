import React, { useState } from "react";
import InputField from "../components/common/InputField";
import Button from "../components/common/ButtonComp";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { toast } from "react-toastify";
import { login } from "../feature/User/userSlice";
import axios from "axios";

import { useForm ,RegisterOptions, FieldError } from "react-hook-form";
interface LoginFormInputs {
  email: string;
  password: string;
}


const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    mode: "onChange", // Instant validation
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setErrorMsg("");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        data
      );

      const token = response.data.accessToken;
      if (!token) throw new Error("Token not found in response.");

      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));

      const user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        employeeId: payload.employeeId,
        customPermissions: payload.customPermissions,
        name: payload.name,
      };

      localStorage.setItem("user", JSON.stringify(user));
      dispatch(login(user));
      toast.success("Login successful!");

      const role = user.role?.toLowerCase();
      if (["superadmin", "admin", "manager", "hr"].includes(role)) {
        navigate("/admin/dashboard");
      } else if (role === "employee") {
        navigate("/employee");
      } else {
        toast.error("Unknown role. Cannot redirect.");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Invalid credentials or server error.";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen p-4 bg-image">
  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Login</h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <InputField
        type="email"
        name="email"
        placeholder="Email"
        register={register}
        validation={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Invalid email format",
          },
          minLength: {
            value: 6,
            message: "Email must be at least 6 characters",
          },
          maxLength: {
            value: 32,
            message: "Email cannot exceed 32 characters",
          },
        }}
        error={errors.email}
      />

      {/* Password Field */}
      <InputField
        type="password"
        name="password"
        placeholder="Password"
        register={register}
        validation={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
          maxLength: {
            value: 32,
            message: "Password cannot exceed 32 characters",
          },
        }}
        error={errors.password}
      />

      {/* Forgot Password Link */}
      <div className="text-right text-sm">
        <p className="text-gray-500 hover:underline cursor-pointer">
          Forgot password?
        </p>
             {errorMsg && (
             toast.error(errorMsg)
            )}

            <Button
              name="Login"
              cls="bg-blue-600 hover:bg-blue-900 text-white w-full py-2 cursor-pointer rounded-md transition"
            />
          </form>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <p className="text-red-500 text-center font-medium">{errorMsg}</p>
      )}

      {/* Login Button */}
      <Button
        name="Login"
        cls="bg-blue-600 hover:bg-blue-900 text-white w-full py-2 rounded-md transition"
      />
    </form>
  </div>
</div>

    </>
  );
};

export default Login;
