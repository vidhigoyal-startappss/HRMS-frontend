import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../api/auth";
import { Loader } from "../components/Loader/Loader";
import { ListFilter, Eye, Edit, UserPlus } from "lucide-react";
import { Autocomplete } from "../components/common/AutoCompleteComp/AutoComplete";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  designation: string;
  joiningDate: string;
  employmentType: string;
  gender: string;
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
    <div className="overflow-x-auto rounded-xl p-3 bg-white">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
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
            `${emp.firstName} ${emp.lastName} - ${emp.designation} (${emp.employmentType}) ${emp.joiningDate}`
          }
          onSelect={(emp) => navigate(`/admin/employee/${emp._id}`)}
        />

        <div className="flex gap-3">
          <button className="p-2 border rounded-md border-gray-300 hover:bg-[#F3F9FB] cursor-pointer">
            <ListFilter size={20} color="#113F67" />
          </button>
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
            onClick={() => navigate("/admin/add-employee")}
            className="bg-[#226597] text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-[#1c4c7a] cursor-pointer"
          >
            Create User <UserPlus size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-[#113F67]">
        <thead className="bg-[#113F67] text-white uppercase font-medium text-sm rounded-t-xl">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.map((emp, index) => (
            <tr
              key={emp._id}
              className={index % 2 === 0 ? "bg-white" : "bg-[#F3F9FB]"}
            >
              <td className="px-4 py-3 font-medium text-[#113F67]">
                {emp.firstName} {emp.lastName}
              </td>
              <td className="px-4 py-3">{emp.designation}</td>
              <td className="px-4 py-3">
                {new Date(emp.joiningDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">{emp.employmentType}</td>
              <td className="px-4 py-3">{emp.gender}</td>
              <td className="px-4 py-3 flex gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                  onClick={() => handleViewProfile(emp._id)}
                >
                  <Eye size={18} color="#113F67" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                  onClick={() => handleEditProfile(emp._id)}
                >
                  <Edit size={18} color="#113F67" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-6 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#226597] text-white rounded-md disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        <span className="text-sm text-gray-700">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#226597] text-white rounded-md disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default EmployeeManagement;
