import React, { useEffect, useState } from "react";
import API, { fetchEmployees } from "../api/auth";

interface Employee {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

const PayrollManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [payslipFile, setPayslipFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(true);
  const [employeeFetchError, setEmployeeFetchError] = useState<string | null>(
    null
  );
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getEmployees = async () => {
      setLoadingEmployees(true);
      setEmployeeFetchError(null);
      try {
        const data = await fetchEmployees();
        let employeesList: Employee[] = [];
        if (Array.isArray(data)) {
          employeesList = data;
        } else if (data && typeof data === "object") {
          if (Array.isArray((data as any).employees)) {
            employeesList = (data as any).employees;
          } else if (Array.isArray((data as any).users)) {
            employeesList = (data as any).users;
          }
        }
        const mapped = employeesList.map((emp) => {
          let name = emp.name;
          if (!name) {
            const fn = emp.firstName || "";
            const ln = emp.lastName || "";
            name = `${fn} ${ln}`.trim() || emp._id;
          }
          return { ...emp, name };
        });

        setEmployees(mapped);
      } catch (error: any) {
        setEmployeeFetchError(
          error.response?.data || error.message || "Unknown error"
        );
      } finally {
        setLoadingEmployees(false);
      }
    };

    getEmployees();
  }, []);

  const handleUpload = async () => {
    if (!selectedEmployee || !payslipFile || !selectedMonth) {
      alert("Please select an employee, a month, and upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("employeeId", selectedEmployee);
    formData.append("month", selectedMonth);
    formData.append("file", payslipFile);

    try {
      const response = await API.post("api/payrolls/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200 || response.status === 201) {
        setIsUploaded(true);
        alert("Payslip uploaded successfully!");
      } else {
        alert("Failed to upload payslip.");
      }
    } catch (err: any) {
      alert("An error occurred while uploading the payslip.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-[#226597] mb-6 text-center">
          Payroll Management
        </h2>

        {loadingEmployees ? (
          <div className="text-center text-gray-600">Loading employees...</div>
        ) : employeeFetchError ? (
          <div className="text-red-600 text-center mb-4">
            Error loading employees: {employeeFetchError}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Employee
              </label>

              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                <select
                  id="employee"
                  value={selectedEmployee || ""}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="sm:w-2/3 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select Employee --</option>
                  {employees
                    .filter((employee) =>
                      employee.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                </select>

                <div className="relative sm:w-1/3 w-full">
                  <input
                    type="text"
                    placeholder="Search employee by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="month"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Select Month
              </label>
              <input
                type="month"
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="payslip"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Upload Payslip (PDF)
              </label>
              <input
                type="file"
                id="payslip"
                accept="application/pdf"
                onChange={(e) =>
                  e.target.files && setPayslipFile(e.target.files[0])
                }
                className="w-full px-4 py-2  border-[#226597] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleUpload}
              className="w-[200px] bg-[#226597] text-white px-4 py-2 rounded-md hover:bg-[#1b4e7a] transition"
            >
              Upload Payslip
            </button>

            {isUploaded && (
              <div className="text-green-600 text-center font-medium">
                Payslip uploaded successfully!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollManagement;
