import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { applyLeave } from "../../../api/leave";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface LeaveRequest {
  leaveType: "sick" | "casual";
  dayType: "fullday" | "halfday";
  startDate: string;
  endDate?: string;
  reason: string;
}

const LeaveRequestForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    setValue,
  } = useForm<LeaveRequest>({
    mode: "onBlur",
  });

  const dayType = watch("dayType");

  useEffect(() => {
    if (dayType === "halfday") {
      setValue("endDate", "");
    }
  }, [dayType, setValue]);

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

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white p-4 space-y-8 text-[#113F67]"
    >
      <h2 className="text-2xl font-bold text-center">Leave Request Form</h2>

      {/* Leave Type & Day Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold">Leave Type</label>
          <select
            {...register("leaveType", { required: "Leave type is required" })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#226597]"
          >
            <option value="">Select Type</option>
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
          </select>
          {errors.leaveType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.leaveType.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Day Type</label>
          <select
            {...register("dayType", { required: "Day type is required" })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#226597]"
          >
            <option value="">Select Day Type</option>
            <option value="fullday">Full Day</option>
            <option value="halfday">Half Day</option>
          </select>
          {errors.dayType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dayType.message}
            </p>
          )}
        </div>
      </div>

      {/* Start Date & End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold">Start Date</label>
          <input
            type="date"
            {...register("startDate", {
              required: "Start date is required",
              validate: (startDate) => {
                const endDate = getValues("endDate");
                if (
                  dayType === "fullday" &&
                  endDate &&
                  new Date(startDate) > new Date(endDate)
                ) {
                  return "Start date cannot be after end date";
                }
                return true;
              },
            })}
            min={today}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#226597]"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>

        {dayType === "fullday" && (
          <div>
            <label className="block mb-2 font-semibold">End Date</label>
            <input
              type="date"
              {...register("endDate", {
                required: "End date is required",
                validate: (endDate) => {
                  const startDate = getValues("startDate");
                  if (
                    startDate &&
                    new Date(endDate) < new Date(startDate)
                  ) {
                    return "End date cannot be before start date";
                  }
                  return true;
                },
              })}
              min={today}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#226597]"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Reason */}
      <div>
        <label className="block mb-2 font-semibold">Reason</label>
        <textarea
          {...register("reason", {
            required: "Reason is required",
            minLength: {
              value: 5,
              message: "Reason must be at least 5 characters",
            },
          })}
          rows={4}
          placeholder="Reason for leave..."
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#226597] resize-none"
        />
        {errors.reason && (
          <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-[#113F67] hover:bg-[#226597] text-white px-6 py-2 rounded-md text-sm font-semibold transition shadow-sm"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
};

export default LeaveRequestForm;
