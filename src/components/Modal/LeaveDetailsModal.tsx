import React from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
interface LeaveDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: any;
}

const LeaveDetailsModal: React.FC<LeaveDetailsModalProps> = ({
  isOpen,
  onClose,
  leave,
}) => {
      const { user } = useSelector((state: RootState) => state.user);
    
  if (!isOpen || !leave) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Leave Details</h2>
        <ul className="space-y-2 text-gray-800">
          <li><strong>Employee:</strong>{user}</li>
          <li><strong>Start Date:</strong> {new Date(leave?.startDate).toLocaleDateString()}</li>
          <li><strong>End Date:</strong> {new Date(leave?.endDate).toLocaleDateString()}</li>
          <li><strong>No. of Days:</strong> {leave?.noOfDays}</li>
          <li><strong>Leave Type:</strong> {leave?.leaveType}</li>
          <li><strong>Day Type:</strong> {leave?.dayType}</li>
          <li><strong>Status:</strong> {leave?.status}</li>
          <li><strong>Reason:</strong> {leave?.reason}</li>
          <li><strong>Approved By:</strong> {leave?.approvedBy || "N/A"}</li>
        </ul>
      </div>
    </div>
  );
};

export default LeaveDetailsModal;
