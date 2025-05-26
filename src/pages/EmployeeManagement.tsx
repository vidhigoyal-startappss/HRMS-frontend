import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeManagement = () => {
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const [employeeData, setEmployeeData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/employeeTable.json");
      const data = await res.json();
      setEmployeeData(data);
    };
    fetchData();
  }, []);

  const headers = [
    "Profile",
    "ID",
    "Name",
    "Job Title",
    "Start Date",
    "Category",
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

  return (
    <div className="overflow-x-auto rounded-lg shadow-md p-4 bg-white">
      <div className="flex justify-end mb-4">
        {/* <button
          onClick={() => navigate("/admin/add-employee")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Employee
        </button> */}
      </div>

      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-200 text-gray-800 uppercase font-semibold text-sm">
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
              key={emp.id}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="px-4 py-3">
                <img
                  src={emp.profile}
                  alt={emp.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="px-4 py-3">{emp.id}</td>
              <td className="px-4 py-3 font-medium">{emp.name}</td>
              <td className="px-4 py-3">{emp.jobTitle}</td>
              <td className="px-4 py-3">{emp.startDate}</td>
              <td className="px-4 py-3">{emp.category}</td>
              <td className="px-4 py-3">{emp.gender}</td>
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
                        onClick={() => handleViewProfile(emp.id)}
                      >
                        View Profile
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-[#003366] cursor-pointer"
                        onClick={() => handleEditProfile(emp.id)}
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
