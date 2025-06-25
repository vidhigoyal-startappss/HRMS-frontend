import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LeaveRequestSchema } from "./LeaveRequestForm";
import { applyLeave } from "../../../api/leave";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface LeaveRequest {
  leaveType: "sick" | "casual";
  dayType: "fullday" | "halfday";
  startDate: string;
  endDate: string;
  reason: string;
}

const LeaveRequestForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeaveRequest>({
    resolver: yupResolver(LeaveRequestSchema),
  });

  const onSubmit = async (data: LeaveRequest) => {
    try {
      await applyLeave(data);
      toast.success("Leave request submitted successfully!");
      reset();
      navigate("/employee/leaves");
    } catch (error: any) {
      console.error("Leave submission error:", error);
      toast.error(error?.response?.data?.message || "Submission failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">Leave Request Form</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Leave Type</label>
          <select
            {...register("leaveType")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
          </select>
          {errors.leaveType && (
            <p className="text-red-500 text-sm">{errors.leaveType.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Day Type</label>
          <select
            {...register("dayType")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="fullday">Full Day</option>
            <option value="halfday">Half Day</option>
          </select>
          {errors.dayType && (
            <p className="text-red-500 text-sm">{errors.dayType.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            {...register("startDate")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            {...register("endDate")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Reason</label>
        <textarea
          {...register("reason")}
          rows={4}
          className="w-full border px-3 py-2 rounded"
          placeholder="Reason for leave..."
        />
        {errors.reason && (
          <p className="text-red-500 text-sm">{errors.reason.message}</p>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
};

export default LeaveRequestForm;
