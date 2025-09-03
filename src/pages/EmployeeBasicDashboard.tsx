import React from "react";
import LeaveSummaryCard from "../components/EmployeeDashboard/LeaveSummaryCard";

interface LeaveSummaryProps {
  leaveSummary: {
    paidUsed: number;
    unpaidUsed: number;
    paidLeft: number;
    wfhLeft: number;
    totalPaidYearly: number;
    totalWfhYearly: number;
    totalPaidMonthly: number;
    totalWfhMonthly: number;
    monthlyApplied: number;
    approvedCount: number;
    pendingCount: number;
    earnedLeavesTillNow: number;
  };
}

const EmployeeBasicDashboard: React.FC<LeaveSummaryProps> = ({ leaveSummary }) => {
  const basicCards = [
    { label: "Paid Leaves Yearly", value: 18 }, 
    { label: "WFH Yearly", value: 12 }, 
    { label: "Approved Leaves", value: leaveSummary.approvedCount },
    { label: "Pending Leaves", value: leaveSummary.pendingCount },
    { label: "Paid Leaves Left (PL)", value: leaveSummary.paidLeft },
    { label: "WFH Left", value: leaveSummary.wfhLeft },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10 text-[#113F67]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {basicCards.map((card) => (
          <LeaveSummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeBasicDashboard;
