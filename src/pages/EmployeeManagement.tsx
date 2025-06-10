import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../api/auth"; // ✅ Adjust path if needed

interface Employee {
  _id: string;
  account: {
    email: string;
  };
  basicDetails: {
    firstName: string;
    lastName: string;
    designation: string;
    joiningDate: string;
    employmentType: string;
    gender: string;
  };
}

const EmployeeManagement = () => {
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
    "ID",
    "Name",
    "Designation",
    "Joining Date",
    "Employment Type",
    "Gender",
    "Actions",
  ];

  const toggleDropdown = (index: number) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const handleViewProfile = (id: string) => {
    navigate(`/admin/employee/${id}`);
  };

  const handleEditProfile = (id: string) => {
    navigate(`/admin/employee/edit/${id}`);
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-md p-4 bg-white">
      <div className="flex justify-end mb-4">
        {/* Uncomment if adding employees from frontend */}
        {/* <button
          onClick={() => navigate("/admin/add-employee")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Employee
        </button> */}
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
          {employeeData.map((emp, index) => (
            <tr
              key={emp._id}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="px-4 py-3">{emp._id}</td>
              <td className="px-4 py-3 font-medium">
                {emp.basicDetails.firstName} {emp.basicDetails.lastName}
              </td>
              <td className="px-4 py-3">{emp.basicDetails.designation}</td>
              <td className="px-4 py-3">{emp.basicDetails.joiningDate}</td>
              <td className="px-4 py-3">{emp.basicDetails.employmentType}</td>
              <td className="px-4 py-3">{emp.basicDetails.gender}</td>
              <td className="px-4 py-3 relative">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="p-1 rounded hover:bg-gray-300"
                >
                  <MoreVertical size={20} />
                </button>

                {dropdownIndex === index && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#001f3f] text-white rounded shadow-md z-10">
                    <ul>
                      <li
                        className="px-4 py-2 hover:bg-[#003366] cursor-pointer"
                        onClick={() => handleViewProfile(emp._id)}
                      >
                        View Profile
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-[#003366] cursor-pointer"
                        onClick={() => handleEditProfile(emp._id)}
                      >
                        Edit Profile
                      </li>
                    </ul>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
