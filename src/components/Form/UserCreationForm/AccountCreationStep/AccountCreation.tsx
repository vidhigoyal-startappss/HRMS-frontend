import React from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
  role: string;
};

type Props = {
  onSubmit: (data: FormValues) => void;
  defaultValues?: FormValues;
};

const UserAccountCreationForm: React.FC<Props> = ({ onSubmit, defaultValues }) =>  {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message as string}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message as string}</p>
        )}
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          {...register("role", { required: "Role is required" })}
          className="w-full border border-gray-300 px-4 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="manager">HR</option>
          <option value="user">Employee</option>
        </select>
        {errors.role && (
          <p className="text-sm text-red-500 mt-1">{errors.role.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default UserAccountCreationForm;
