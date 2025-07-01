import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../api/auth";
import { Loader } from "../components/Loader/Loader";
import { Funnel,Search ,Eye ,Edit,UserPlus} from "lucide-react";
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
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg w-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-500"
              size={18}
            />
          </div>

        <div className="flex gap-4">
          <button className="filter">
            <Funnel size={"35px"} fill="#000" />
          </button>
          <button
            className="bg-green-600 p-2 font-extrabold flex items-center gap-2 cursor-pointer text-white rounded hover:bg-green-800"
            onClick={() => navigate("/admin/add-employee")}
          >
            Create User <UserPlus size={20}/>
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
          {employeeData.map((emp, index) => (
            <tr
              key={emp._id}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="px-4 py-3">{emp._id}</td>
              <td className="px-4 py-3 font-medium">
                {emp.firstName} {emp?.lastName}
              </td>
              <td className="px-4 py-3">{emp.designation}</td>
              <td className="px-4 py-3">{emp.joiningDate}</td>
              <td className="px-4 py-3">{emp.employmentType}</td>
              <td className="px-4 py-3">{emp.gender}</td>
              <td className="px-4 py-3 relative">
                <button
                  className="p-2 cursor-pointer hover:bg-gray-200 rounded-full"
                  onClick={() => handleViewProfile(emp._id)}
                >
                 <Eye size={20} color={"orange"}/>
                </button>
                <button
                   className="p-2 cursor-pointer hover:bg-gray-200 rounded-full"
                onClick={() => handleEditProfile(emp._id)}>
                 <Edit size={20} color={"green"}/>
                </button>

                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
