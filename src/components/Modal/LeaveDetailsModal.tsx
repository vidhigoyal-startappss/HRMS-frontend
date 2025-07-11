import React from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

interface Leave {
  startDate: string;
  endDate: string;
  noOfDays: number;
  leaveType: string;
  dayType: string;
  status: string;
  reason: string;
  approvedBy?: {
    firstName: string;
    lastName: string;
  };
}

interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: Leave | null;
}

const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  isOpen,
  onClose,
  leave,
}) => {
  const { user } = useSelector((state: RootState) => state.user);

  if (!isOpen || !leave) return null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md px-6 py-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold text-[#174EA6] mb-2">
          {user?.name ? `${user.name}'s Leave Details` : "Leave Details"}
        </h2>

        {/* Form Fields */}
        <div className="space-y-4">
          <label className="block">
            <span className="text-[#113F67] font-medium">Start Date</span>
            <input
              type="text"
              readOnly
              value={formatDate(leave.startDate)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 bg-gray-100 text-sm text-gray-700 mt-1"
            />
          </label>

          <label className="block">
            <span className="text-[#113F67] font-medium">End Date</span>
            <input
              type="text"
              readOnly
              value={formatDate(leave.endDate)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 bg-gray-100 text-sm text-gray-700 mt-1"
            />
          </label>

          <label className="block">
            <span className="text-[#113F67] font-medium">No. of Days</span>
            <input
              type="text"
              readOnly
              value={leave.noOfDays}
              className="w-full border border-gray-300 rounded-md px-3 py-1 bg-gray-100 text-sm text-gray-700 mt-1"
            />
          </label>

          <label className="block">
            <span className="text-[#113F67] font-medium">Leave Type</span>
            <input
              type="text"
              readOnly
              value={leave.leaveType}
              className="w-full border border-gray-300 rounded-md px-3 py-1 bg-gray-100 text-sm text-gray-700 mt-1 capitalize"
            />
          </label>

          <label className="block">
            <span className="text-[#113F67] font-medium">Day Type</span>
            <input
              type="text"
              readOnly
              value={leave.dayType}
              className="w-full border border-gray-300 rounded-md px-3 py-1 bg-gray-100 text-sm text-gray-700 mt-1 capitalize"
            />
          </label>

          <label className="block">
            <span className="text-[#113F67] font-medium">Status</span>
            <input
              type="text"
              readOnly
              value={leave.status}
              className={`inline-block ml-2 w-20 px-3 py-1 rounded-lg text-xs font-semibold mt-1 text-white cursor-default
      ${
        leave.status === "Approved"
          ? "bg-green-500"
          : leave.status === "Pending"
          ? "bg-yellow-500 text-black"
          : "bg-red-500"
      }
    `}
            />
          </label>

          {leave.reason && (
            <label className="block">
              <span className="text-[#113F67] font-medium">Reason</span>
              <textarea
                readOnly
                rows={2}
                value={leave.reason}
                className="w-full border border-gray-300 rounded-md px-3 py-1 bg-gray-100 text-sm text-gray-700 mt-1"
              />
            </label>
          )}

          <label className="block">
            <span className="text-[#113F67] font-medium">Approved By</span>
            <input
              type="text"
              readOnly
              value={
                leave?.approvedBy?.firstName && leave?.approvedBy?.lastName
                  ? `${leave.approvedBy.firstName} ${leave.approvedBy.lastName}`
                  : "N/A"
              }
              className="w-full border border-gray-300 rounded-md px-3 py-1 bg-gray-100 text-sm text-gray-700 mt-1"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailsModal;
