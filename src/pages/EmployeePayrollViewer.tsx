import React, { useEffect, useState } from "react";
import API from "../api/auth";

interface PayrollEntry {
  month: string;
  payrollSlipUrl: string;
}

const EmployeePayrollViewer = () => {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [months, setMonths] = useState<PayrollEntry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const storedUser = stored ? JSON.parse(stored) : null;
    const id = storedUser?.userId;
    if (id) {
      console.log("Found employeeId in localStorage:", id);
      setEmployeeId(id);
    } else {
      console.warn("No user data found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (!employeeId) {
      console.log("employeeId is empty, skipping fetch");
      return;
    }

    const fetchPayrolls = async () => {
      try {
        const response = await API.get(`/api/payrolls/${employeeId}`);

        if (response.data) {
          if (Array.isArray(response.data.payrolls)) {
            console.log("Payrolls array:", response.data.payrolls);
            setMonths(response.data.payrolls);
          } else if (Array.isArray(response.data)) {
            console.log("Payrolls directly as array:", response.data);
            setMonths(response.data);
          } else {
            console.warn("Payrolls format unexpected:", response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching payrolls:", error);
      }
    };

    fetchPayrolls();
  }, [employeeId]);

  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = e.target.value;
    setSelectedMonth(m);
    const found = months.find((entry) => entry.month === m);
    if (found) {
      setSelectedSlipUrl(found.payrollSlipUrl);
    } else {
      setSelectedSlipUrl("");
    }
  };
  const downloadPayslip = async () => {
    try {
      const response = await fetch(selectedSlipUrl, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${selectedMonth}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download payslip:", error);
    }
  };

 return (
  <div className="max-w-md mx-auto mt-20 px-10 py-8 bg-white/70 backdrop-blur-md shadow-2xl rounded-3xl border border-blue-200 transition-all duration-300">
    <h2 className="text-2xl font-bold text-center text-[#113F67] mb-6">
       View Your Payslip
    </h2>

    <label
      htmlFor="month"
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      Select Uploaded Month:
    </label>

    <select
      id="month"
      className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226597] mb-6 transition"
      value={selectedMonth}
      onChange={handleMonthSelect}
    >
      <option value="">-- Select Month --</option>
      {months.length === 0 && (
        <option disabled>Loading months or no payslips</option>
      )}
      {months.map((m) => (
        <option key={m.month} value={m.month}>
          {m.month}
        </option>
      ))}
    </select>

    {selectedSlipUrl && (
      <button
        onClick={downloadPayslip}
        className="w-full text-white px-5 py-2.5 rounded-lg text-sm font-medium 
        bg-gradient-to-r from-[#226597] to-[#1b4e7a] 
        hover:from-[#1b4e7a] hover:to-[#113F67] 
        transition-all duration-300 shadow-md hover:shadow-xl"
      >
        ⬇Download Payslip
      </button>
    )}
  </div>
);

};

export default EmployeePayrollViewer;
