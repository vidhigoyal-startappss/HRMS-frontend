import React, { useEffect, useState } from "react";
import API from "../api/auth";
import Swal from "sweetalert2";

interface PayrollEntry {
  month: string;
  payrollSlipUrl: string;
}

const EmployeePayrollViewer = () => {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [months, setMonths] = useState<PayrollEntry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string>("");
const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);


  useEffect(() => {
    const stored = localStorage.getItem("user");
    const storedUser = stored ? JSON.parse(stored) : null;
    const id = storedUser?.userId;
    if (id) {
      setEmployeeId(id);
    } else {
      Swal.fire({
        icon: "info",
        title: "No User Found",
        text: "Please log in again to view your payroll records.",
        confirmButtonColor: "#226597",
      });
    }
  }, []);

  useEffect(() => {
    if (!employeeId) return;

    const fetchPayrolls = async () => {
      setLoading(true);
      setHasError(false);

      try {
        const response = await API.get(`/api/payrolls/${employeeId}`);

        let data: PayrollEntry[] = [];

        if (response.data) {
          if (Array.isArray(response.data.payrolls)) {
            data = response.data.payrolls;
          } else if (Array.isArray(response.data)) {
            data = response.data;
          }
        }

        if (data.length === 0) {
          Swal.fire({
            icon: "info",
            title: "No Payslips Found",
            text: "You don’t have any uploaded payslips yet.",
            confirmButtonColor: "#226597",
          });
          setMonths([]);
        } else {
          setMonths(data);
        }
      } catch (error) {
        console.error("Error fetching payrolls:", error);
        setHasError(true);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to fetch payroll data. Please try again later.",
          confirmButtonColor: "#226597",
        });
      } finally {
        setLoading(false);
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
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Unable to download payslip. Please try again.",
        confirmButtonColor: "#226597",
      });
    }
  };
if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <svg
          className="animate-spin h-12 w-12 text-[#226597]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3-3 3h4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          ></path>
        </svg>
        <p className="text-[#226597] font-medium text-lg">
          Fetching payroll records...
        </p>
      </div>
    );
  }
if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-2">
        <p className="text-gray-500">
          We couldn’t load payroll data right now. Please try again later.
        </p>
      </div>
    );
  }
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
