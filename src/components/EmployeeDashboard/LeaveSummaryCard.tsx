import React from "react";

interface CardProps {
  label: string;
  value: number | string;
}

const LeaveSummaryCard: React.FC<CardProps> = ({ label, value }) => {
  return (
    <div className="bg-[#113F67] p-3 rounded-xl shadow-md text-center text-white">
      <h2 className="text-base sm:text-lg font-medium mb-1">{label}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default LeaveSummaryCard;