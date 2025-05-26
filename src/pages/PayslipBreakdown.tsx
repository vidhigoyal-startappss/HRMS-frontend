import React from "react";

interface PayslipBreakdownProps {
  month: string;
}

const PayslipBreakdown: React.FC<PayslipBreakdownProps> = ({ month }) => {
  const breakdown = {
    Basic: 30000,
    HRA: 12000,
    Allowances: 5000,
    "Tax Deductions": -4000,
    "PF Contribution": -3600,
    "Net Salary": 39400,
  };

  return (
    <div className="space-y-6 w-full h-full bg-white py-10 px-6 shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">{month} Payslip Breakdown</h2>
      
      <table className="w-full text-sm text-gray-700 border-separate border-spacing-y-2">
        <thead>
          <tr className="text-[#0f172a] font-extrabold">
            <th className="py-2 px-4 text-left">Label</th>
            <th className="py-2 px-4 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(breakdown).map(([label, value]) => (
            <tr key={label} className="bg-blue-100">
              <td className="py-2 px-4 rounded-l-md">{label}</td>
              <td
                className={`py-2 px-4 text-right font-medium ${
                  value < 0 ? "text-red-600 rounded-r-md" : "text-green-700 rounded-r-md"
                }`}
              >
                ₹{Math.abs(value).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayslipBreakdown;
