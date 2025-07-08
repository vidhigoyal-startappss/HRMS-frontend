import React, { useState, useEffect } from "react";
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
    "Designation",
    "Joining Date",
    "Employment Type",
    "Gender",
    "Actions",
  ];

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
  );
};

export default EmployeeManagement;
