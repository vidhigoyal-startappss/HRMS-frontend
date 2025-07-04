import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../api/auth";
import { Loader } from "../components/Loader/Loader";
import {
  ListFilter,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  UserPlus,
} from "lucide-react";
import { Autocomplete } from "../components/common/AutoCompleteComp/AutoComplete";

interface Employee {
  firstName: string;
  lastName: string;
  designation: string;
  joiningDate: string;
  employmentType: string;
  gender: string;
  email: string;
}

const EmployeeManagement = () => {
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(employeeData.length / itemsPerPage);
  const paginatedEmployees = employeeData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const navigate = useNavigate();
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEmployees();
        setEmployeeData(data);
      } catch (err) {
        setError("Failed to fetch employee data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const headers = [
    // "ID",
    "Name",
    "Email",
    "Designation",
    "Joining Date",
    "Employment Type",
    "Gender",
    "Actions",
  ];
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
  joiningDate: "",
  employmentType: "",
  designation: "",
});


  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    onFilterChange({ role: selectedRole });
    setIsOpen(false);
  };

  const handleViewProfile = (id: string) => {
    navigate(`/admin/employee/${id}`);
  };

  const handleEditProfile = (id: string) => {
    navigate(`/admin/employee/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-lg p-4 bg-white">
      <div className="flex justify-between mb-4">
        <Autocomplete<Employee>
          data={employeeData}
          searchFields={[
            "_id",
            "firstName",
            "lastName",
            "designation",
            "employmentType",
            "joiningDate",
            "email",
          ]}
          placeholder="Search by ID, Name, Designation, DOJ..."
          displayValue={(emp) =>
            `${emp.firstName} ${emp?.lastName}  ${emp?.designation} ${emp?.employmentType} ${emp?.joiningDate} ${emp?.email} `
          }
          onSelect={(emp) => navigate(`/admin/employee/${emp._id}`)}
        />

        <div className="flex gap-6 ">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-blue-900 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-950"
            >
              <ListFilter size={20} />
              Filters
              <ChevronDown size={16} />
            </button>

          {isOpen && (
  <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded w-64 z-50">
    <div className="p-4 space-y-2">
      {/* Designation Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Designation
        </label>
        <input
          type="text"
          className="w-full border px-2 py-1 rounded"
          value={filters.designation}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, designation: e.target.value }))
          }
        />
      </div>

      {/* Employment Type Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Employment Type
        </label>
        <select
          className="w-full border px-2 py-1 rounded"
          value={filters.employmentType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, employmentType: e.target.value }))
          }
        >
          <option value="">All</option>
          <option value="full-time">Full-Time</option>
          <option value="intern">Intern</option>
        </select>
      </div>

      {/* Joining Date Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Joining Date
        </label>
        <input
          type="date"
          className="w-full border px-2 py-1 rounded"
          value={filters.joiningDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, joiningDate: e.target.value }))
          }
        />
      </div>

      <button
        onClick={() => setIsOpen(false)}
        className="mt-3 w-full bg-blue-900 text-white py-1 rounded cursor-pointer text-sm hover:bg-blue-950"
      >
        Apply Filters
      </button>
    </div>
  </div>
)}

          </div>

          <button
            className="bg-green-600 p-2 font-extrabold flex items-center gap-2 cursor-pointer text-white rounded hover:bg-green-800"
            onClick={() => navigate("/admin/add-employee")}
          >
            Create User <UserPlus size={20} />
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-700 ">
        <thead className="bg-blue-900 text-white uppercase font-semibold text-sm">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees
            .filter((emp) => emp) // Avoid employees without basicDetails
            .map((emp, index) => (
              <tr
                key={emp?._id}
                className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
              >
                {/* <td className="px-4 py-3">{emp?._id}</td> */}
                <td className="px-4 py-3 font-medium">
                  {capitalizeFirstLetter(emp?.firstName)}{" "}
                  {capitalizeFirstLetter(emp?.lastName)}
                </td>
                <td className="px-4 py-3 font-medium">
                  {capitalizeFirstLetter(emp?.email)}
                </td>
                <td className="px-4 py-3">
                  {capitalizeFirstLetter(emp?.designation)}{" "}
                </td>
                <td className="px-4 py-3">
                  {" "}
                  {new Date(emp.joiningDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  {capitalizeFirstLetter(emp?.employmentType)}{" "}
                </td>
                <td className="px-4 py-3">
                  {capitalizeFirstLetter(emp?.gender)}
                </td>
                <td className="px-4 py-3 relative">
                  <button
                    className="p-2 cursor-pointer hover:bg-gray-200 rounded-full"
                    onClick={() => handleViewProfile(emp?._id)}
                  >
                    <Eye size={20} color={"orange"} />
                  </button>
                  <button
                    className="p-2 cursor-pointer hover:bg-gray-200 rounded-full"
                    onClick={() => handleEditProfile(emp?._id)}
                  >
                    <Edit size={20} color={"green"} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 bg-blue-900 text-white cursor-pointer rounded disabled:invisible"
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-1 bg-blue-900 text-white rounded cursor-pointer disabled:invisible"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeManagement;
