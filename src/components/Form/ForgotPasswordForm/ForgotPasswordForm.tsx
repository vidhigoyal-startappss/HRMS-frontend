import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import API from "../../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()
  const onSubmit = async (data: { email: string }) => {
    try {
      await API.post("/api/users/forgot-password", { email: data.email });
      toast.success("Check your email for reset link");
      setTimeout(() => {
        navigate('/reset-mail-message')
      }, 1000);
    } catch (error) {
      toast.error("Failed to send reset link");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-[#113F67] p-4 flex justify-center items-center w-full min-h-screen">
        <div className="flex flex-col bg-white p-6 justify-center gap-4 w-96 rounded-lg">
           <h1 className="text-2xl text-[#113F67] font-bold text-center">Reset Your Password</h1>
          <input
            className="bg-gray-50 border border-gray-300 h-10 p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#113F67]"
            placeholder="Enter Your Registered Email"
            {...register("email")}
          />
         <div className="m-2 h-1">
           {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
         </div>
          <button
            type="submit"
            className="bg-[#226597] text-white cursor-pointer p-2 rounded-sm hover:bg-[#113F67] transition-2"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </form>
  );
};
