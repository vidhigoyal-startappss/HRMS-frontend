import React, { useState, useEffect } from "react";
import InputField from "../components/common/InputField";
import Button from "../components/common/ButtonComp";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader/Loader";
import { login } from "../feature/User/userSlice";
import axios from "axios";
import { useForm, FieldErrors } from "react-hook-form";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
<<<<<<< Updated upstream
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading ,setIsLoading]= useState<boolean>(false)
=======
  const [errorMsg, setErrorMsg] = useState<string>("");
>>>>>>> Stashed changes

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({ mode: "onChange" });

<<<<<<< Updated upstream
  const onSubmit = async (data: LoginFormInputs) => {
    setErrorMsg("");
    setIsLoading(true)
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", data);
      const token = response.data.accessToken;
=======
  const onSubmit = async (data: LoginFormInputs): Promise<void> => {
    setErrorMsg("");

    try {
      const response = await axios.post("http://localhost:3000/api/users/login", data);
      const token: string = response.data.accessToken;

>>>>>>> Stashed changes
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
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      } else if (role === "employee") {
        setTimeout(() => navigate("/employee"), 1000);
      } else {
        toast.error("Unknown role. Cannot redirect.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid credentials or server error.";
      setErrorMsg(msg);
      toast.error(msg); // moved toast here
    }finally{
      setIsLoading(false)
    }
  };

  const handleForgot = () =>{
   setTimeout(()=>
  navigate('forgot-password'),200)
  }

  return (
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

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <p className="text-gray-500 hover:underline cursor-pointer">
              Forgot password?
            </p>
          </div>

<<<<<<< Updated upstream
          {/* Submit Button */}
          <Button
            name="Login"
            isLoading={isLoading}
            cls="bg-blue-600 hover:bg-blue-900 text-white w-full py-2 cursor-pointer rounded-md transition"
          />
        </form>
=======
          {/* Login Button */}
          <Button
            name="Login"
            cls="bg-blue-600 hover:bg-blue-900 text-white w-full py-2 rounded-md transition"
          />
        </form>

        {/* Error Message */}
        {errorMsg && (
          <p className="text-red-500 mt-3 text-center font-medium">{errorMsg}</p>
        )}
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default Login;
