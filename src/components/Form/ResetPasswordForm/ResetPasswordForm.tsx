import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import API from "../../../api/auth";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  password: yup.string().min(6).required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  console.log(token)
  // const token = queryParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { password: string }) => {
    try {
      await API.post("/api/users/reset-password", {
        token,
        newPassword: data.password,
      });

      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to reset password");
    }
  };

  if (!token) return <p className="text-center mt-20 text-red-600">Invalid or missing token</p>;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-blue-400 flex justify-center items-center w-full min-h-screen">
        <div className="flex flex-col bg-white p-4 gap-4 w-96 rounded-sm">
          <input
            type="password"
            placeholder="New Password"
            className="p-2 border border-gray-300 rounded-sm"
            {...register("password")}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            className="p-2 border border-gray-300 rounded-sm"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}

          <button
            type="submit"
            className="bg-blue-900 text-white p-2 rounded-sm hover:bg-blue-800"
          >
            Reset Password
          </button>
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
