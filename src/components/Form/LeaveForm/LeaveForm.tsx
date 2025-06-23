import React, { useState } from "react";
import { toast } from "react-toastify";
import { applyLeave } from "../../../api/leave";
import { useNavigate } from "react-router-dom";

// Interface for leave request form data
interface LeaveRequest {
  leaveType: "sick" | "casual";
  dayType: "fullday" | "halfday";
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveRequestFormProps {
  onSubmit?: (data: LeaveRequest) => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<LeaveRequest>({
    leaveType: "sick",
    dayType: "fullday",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { startDate, endDate, reason } = formData;

    if (!startDate || !endDate || !reason) {
      toast.error("All fields are required");
      return;
    }

    try {
      await applyLeave(formData);

      toast.success("Leave request submitted successfully!");
      setFormData({
        leaveType: "sick",
        dayType: "fullday",
        startDate: "",
        endDate: "",
        reason: "",
      });
      navigate("/employee/leaves");
    } catch (error: any) {
      console.error("Leave submission error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to submit leave request"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">Leave Request Form</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Day Type</label>
          <select
            name="dayType"
            value={formData.dayType}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="fullday">Full Day</option>
            <option value="halfday">Half Day</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Reason</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={4}
          className="w-full border px-3 py-2 rounded"
          placeholder="Reason for leave..."
        />
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
