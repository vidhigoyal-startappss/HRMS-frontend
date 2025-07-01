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
  approvedBy?: string;
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-details-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 cursor-pointer right-4 text-gray-500 hover:text-black text-2xl focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2
          id="leave-details-title"
          className="text-2xl font-bold mb-5 text-gray-800"
        >
          {user?.name ? `${user.name}'s Leave Details` : "Leave Details"}
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-md">
          <div>
            <p className="font-extrabold text-md text-black">Start Date:</p>
            <div className="border-2 border-blue-950 p-2 rounded-sm ">{formatDate(leave.startDate)}</div>
          </div>
          <div>
            <strong>End Date:</strong>
            <div>{formatDate(leave.endDate)}</div>
          </div>
          <div>
            <strong>No. of Days:</strong>
            <div>{leave.noOfDays}</div>
          </div>
          <div>
            <strong>Leave Type:</strong>
            <div>{leave.leaveType}</div>
          </div>
          <div>
            <strong>Day Type:</strong>
            <div>{leave.dayType}</div>
          </div>
          <div>
            <strong>Status:</strong>
            <div
              className={`inline-block px-2 py-1 rounded-full text-white text-xs ${
                leave.status === "Approved"
                  ? "bg-green-500"
                  : leave.status === "Pending"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {leave.status}
            </div>
          </div>
          {leave.reason && (
            <div className="col-span-2">
              <strong>Reason:</strong>
              <div>{leave.reason}</div>
            </div>
          )}
          <div className="col-span-2">
            <strong>Approved By:</strong>
            <div>
  {leave?.approvedBy?.firstName && leave?.approvedBy?.lastName
    ? `${leave.approvedBy.firstName} ${leave.approvedBy.lastName}`
    : "N/A"}
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailsModal;
