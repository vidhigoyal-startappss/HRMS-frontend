import React from "react";
import { MoreVertical } from "lucide-react";

export interface LeaveType {
  type: "Sick Leave" | "Casual Leave" | "Annual Leave";
  used: number;
  total: number;
}

interface LeaveProgressBarProps {
  leaveData: LeaveType[];
}

const LeaveProgressBar: React.FC<LeaveProgressBarProps> = ({ leaveData }) => {
  return (
    <div className="space-y-6 w-full h-full bg-white py-10 px-5 shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold ">Available Leave Days</h1>
        <button>
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {leaveData.map((leave, index) => {
        const percent = Math.min((leave.used / leave.total) * 100, 100);

        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-800">
              <span>{leave.type}</span>
              <span>
                {leave.used}/{leave.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#253D90] transition-all duration-700 ease-in-out"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaveProgressBar;
