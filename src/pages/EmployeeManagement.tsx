import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../api/auth";
import { Loader } from "../components/Loader/Loader";
import { Funnel, Search, Eye, Edit, UserPlus } from "lucide-react";
import { Autocomplete } from "../components/common/AutoCompleteComp/AutoComplete";

interface Employee {

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
    // "ID",
    "Name",
    "Designation",
    "Joining Date",
    "Employment Type",
    "Gender",
    "Actions",
  ];
function convertIsoToDate(isoDateString) {
  return new Date(isoDateString);
}

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
    <div className="overflow-x-auto rounded-lg shadow-md p-4 bg-white">
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
          ]}
          placeholder="Search by ID, Name, Designation, DOJ..."
          displayValue={(emp) =>
            `${emp.firstName} ${emp?.lastName}  ${emp?.designation } ${emp?.employmentType} ${emp?.joiningDate} `
          }
          onSelect={(emp) => navigate(`/admin/employee/${emp._id}`)}
        />

        <div className="flex gap-4">
          <button className="filter">
            <Funnel size={"35px"} fill="#000" />
          </button>
          <button
            className="bg-green-600 p-2 font-extrabold flex items-center gap-2 cursor-pointer text-white rounded hover:bg-green-800"
            onClick={() => navigate("/admin/add-employee")}
          >
            Create User <UserPlus size={20} />
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-700">
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
                  {emp?.firstName} {emp?.lastName}
                </td>
                <td className="px-4 py-3">{emp?.designation}</td>
                <td className="px-4 py-3">  {new Date(emp.joiningDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</td>
                <td className="px-4 py-3">{emp?.employmentType}</td>
                <td className="px-4 py-3">{emp?.gender}</td>
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
    className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
  >
    Prev
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

    </div>
  );
};

export default EmployeeManagement;
