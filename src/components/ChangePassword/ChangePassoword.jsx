import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import API from "../../api/auth";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});


export const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const onSubmit = async (data) => {
    try {
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }

      await API.post("/api/users/change-password", {
        token,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully!");
      reset();
      navigate(`/`);
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to change password";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col bg-white p-6 justify-center gap-4 w-full max-w-md rounded-lg shadow-md">
        <h1 className="text-2xl text-[#113F67] font-bold text-center cursor-pointer">
          Change Password
        </h1>

        <input
          type="password"
          placeholder="Old Password"
          {...register("oldPassword")}
          className="bg-gray-50 border border-gray-300 h-10 p-2 rounded-sm "
        />
        {errors.oldPassword && (
          <p className="text-red-500 text-sm -mt-2">
            {errors.oldPassword.message}
          </p>
        )}

        <input
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
          className="bg-gray-50 border border-gray-300 h-10 p-2 rounded-sm "
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm -mt-2">
            {errors.newPassword.message}
          </p>
        )}

        <input
          type="password"
          placeholder="Confirm New Password"
          {...register("confirmPassword")}
          className="bg-gray-50 border border-gray-300 h-10 p-2 rounded-sm "
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm -mt-2">
            {errors.confirmPassword.message}
          </p>
        )}

        <button
          type="submit"
          className="bg-[#226597] text-white cursor-pointer p-2 rounded-sm "
        >
          Set Password
        </button>
      </div>
    </form>
  );
};