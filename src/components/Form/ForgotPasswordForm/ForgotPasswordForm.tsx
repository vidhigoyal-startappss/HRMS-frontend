import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../../../api/auth";
import { toast } from "react-toastify";

// Define schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ email: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      await API.post("/api/users/forgot-password", { email: data.email });
      toast.success("Check your email for reset link");
      reset();
    } catch (error) {
      toast.error("Failed to send reset link");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-blue-400 flex justify-center items-center w-full min-h-screen">
        <div className="flex flex-col bg-white p-4 gap-4 w-96 rounded-sm">
          <input
            className="bg-gray-50 border border-gray-300 h-10 p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
            placeholder="Enter Your Registered Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <button
            type="submit"
            className="bg-blue-900 text-white cursor-pointer p-2 rounded-sm hover:bg-blue-800 transition-2"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </form>
  );
};
