import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees, deleteUser } from "../api/auth";
import { Loader } from "../components/Loader/Loader";
import {
  ListFilter,
  Eye,
  Edit,
  UserPlus,
  ChevronDown,
  Trash2,
  ArchiveRestore,
  Archive,
} from "lucide-react";
import { Autocomplete } from "../components/common/AutoCompleteComp/AutoComplete";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../store";

interface Employee {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  designation?: string | null;
  joiningDate?: string | null;
  employmentType?: string | null;
  gender?: string | null;
  email?: string | null;
}

const EmployeeManagement = () => {
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const role = user?.role;

  const [filters, setFilters] = useState({
    joiningDate: "",
    employmentType: "",
    designation: "",
    gender: "",
    sortOrder: "",
    email: "",
  });

  const headers = [
    "Name",
    "Email",
    "Designation",
    "Joining Date",
    "Employment Type",
    "Gender",
    "Actions",
  ];

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const safeDisplay = (
    value?: string | null,
    capitalizeText = false
  ): string => {
    if (!value || value.trim() === "") return "N/A";
    const trimmed = value.trim();
    return capitalizeText ? capitalize(trimmed) : trimmed;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEmployees(showArchived);
        setEmployeeData(data);
      } catch (err) {
        setError("Failed to fetch employee data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showArchived]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const openModal = (userId: string) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      setEmployeeData((prev) => prev.filter((e) => e._id !== userId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    } finally {
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleRequestDelete = (userId: string) => {
    toast.info("Delete request sent for approval.");
  };

  const handleViewProfile = (id: string) => {
    navigate(`/admin/employee/${id}`);
  };

  const handleEditProfile = (id: string) => {
    navigate(`/admin/employee/${id}`);
  };

  let filteredEmployees = employeeData.filter((emp) => {
    return (
      (!filters.designation ||
        (emp.designation ?? "")
          .toLowerCase()
          .includes(filters.designation.toLowerCase())) &&
      (!filters.employmentType ||
        emp.employmentType === filters.employmentType) &&
      (!filters.gender ||
        (emp.gender ?? "").toLowerCase() === filters.gender.toLowerCase()) &&
      (!filters.email ||
        (emp.email ?? "")
          .toLowerCase()
          .includes(filters.email.toLowerCase())) &&
      (!filters.joiningDate ||
        emp.joiningDate?.slice(0, 10) === filters.joiningDate)
    );
  });

  if (filters.sortOrder === "latest") {
    filteredEmployees.sort(
      (a, b) =>
        new Date(b.joiningDate ?? "").getTime() -
        new Date(a.joiningDate ?? "").getTime()
    );
  } else if (filters.sortOrder === "oldest") {
    filteredEmployees.sort(
      (a, b) =>
        new Date(a.joiningDate ?? "").getTime() -
        new Date(b.joiningDate ?? "").getTime()
    );
  }

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;

  const paginatedFiltered = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <div className="relative min-h-[600px] overflow-x-auto rounded-xl p-3 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
          displayValue={(emp) => {
            const name =
              `${safeDisplay(emp.firstName)} ${safeDisplay(
                emp.lastName
              )}`.trim() || "No Name";
            const designation = safeDisplay(emp.designation);
            const employmentType = safeDisplay(emp.employmentType);
            const joiningDate = emp.joiningDate
              ? new Date(emp.joiningDate).toLocaleDateString()
              : "N/A";

            return `${name} - ${designation} (${employmentType}) ${joiningDate}`;
          }}
          onSelect={(emp) => navigate(`/admin/employee/${emp._id}`)}
        />

        <div className="flex gap-3 items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-[#226597] text-white 
  px-2 py-1 text-sm 
  sm:px-1 sm:py-1.5 sm:text-sm 
  md:px-4 md:py-2 md:text-base 
  rounded hover:bg-[#1c4c7a]"
            >
              <ListFilter size={20} /> Filters <ChevronDown size={16} />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-xl w-64 z-50  overflow-auto max-h-80">
                <div className="p-4 space-y-3 overflow-auto ">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={filters.designation}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          designation: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Type
                    </label>
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={filters.employmentType}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          employmentType: e.target.value,
                        }))
                      }
                    >
                      <option value="">All</option>
                      <option value="full-time">Full-Time</option>
                      <option value="intern">Intern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={filters.gender}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                    >
                      <option value="">All</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      className="w-full border px-2 py-1 rounded"
                      value={filters.joiningDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          joiningDate: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={filters.email}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort by Joining Date
                    </label>
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={filters.sortOrder}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          sortOrder: e.target.value,
                        }))
                      }
                    >
                      <option value="">Default</option>
                      <option value="latest">Latest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full mt-2 bg-[#226597] text-white py-1 cursor-pointer rounded hover:hover:bg-[#1c4c7a]"
                  >
                    Apply Filters
                  </button>

                  <button
                    onClick={() =>
                      setFilters({
                        joiningDate: "",
                        employmentType: "",
                        designation: "",
                        gender: "",
                        sortOrder: "",
                        email: "",
                      })
                    }
                    className="w-full mt-2 bg-gray-200 text-black py-1 rounded hover:bg-gray-300"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/admin/add-employee")}
            className="bg-[#226597] text-white 
  px-2 py-1 text-sm w-full justify-center
  sm:px-3 sm:py-1 sm:text-sm sm:w-auto
  md:px-1 md:py-0 md:text-base
  lg:px-5 lg:py-1.5 lg:text-lg 
  rounded-md cursor-pointer font-semibold 
  flex items-center gap-2 
  hover:bg-[#1c4c7a]"
          >
            Create User <UserPlus size={18} />
          </button>

          {role === "SuperAdmin" ? (
            <button
              onClick={() => setShowArchived((prev) => !prev)}
              className="flex items-center gap-2 bg-[#226597] text-white 
  lg:px-2 lg:py-1.5 text-sm 
  sm:px-3 sm:py-1.5 sm:text-sm 
  md:px-2 md:py-1 md:text-base 
  rounded hover:bg-[#1c4c7a]"
              title="Archive Soft Deleted User"
            >
              {!showArchived ? (
                <Archive size={20} />
              ) : (
                <ArchiveRestore size={20} />
              )}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead
            className={`${
              !showArchived
                ? "bg-[#113F67] text-white"
                : "bg-[#071b2c] text-gray-200"
            } uppercase font-medium text-sm`}
          >
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedFiltered.map((emp, index) => (
              <tr
                key={emp._id}
                className={`${
                  index % 2 === 0
                    ? !showArchived
                      ? "bg-white text-black"
                      : "bg-gray-100 text-gray-500"
                    : "bg-[#F3F9FB]"
                }`}
              >
                <td className="px-4 py-3 font-medium">
                  {safeDisplay(emp.firstName, true)}{" "}
                  {safeDisplay(emp.lastName, true)}
                </td>
                <td className="px-4 py-3">{safeDisplay(emp.email, true)}</td>
                <td className="px-4 py-3">
                  {safeDisplay(emp.designation, true)}
                </td>
                <td className="px-4 py-3">
                  {emp.joiningDate
                    ? new Date(emp.joiningDate).toLocaleDateString("en-GB")
                    : "N/A"}
                </td>
                <td className="px-4 py-3">
                  {safeDisplay(emp.employmentType, true)}
                </td>
                <td className="px-4 py-3">{safeDisplay(emp.gender, true)}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleViewProfile(emp._id)}
                    className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                  >
                    <Eye size={18} color="#113F67" />
                  </button>
                  <button
                    onClick={() => handleEditProfile(emp._id)}
                    className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                  >
                    <Edit size={18} color="#113F67" />
                  </button>
                  {role === "SuperAdmin" ? (
                    <button
                      onClick={() => openModal(emp._id)}
                      className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                    >
                      <Trash2 size={18} color="#113F67" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRequestDelete(emp._id)}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                    >
                      <Trash2 size={18} color="#113F67" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-6 text-gray-600 font-medium">
            No such user exists.
          </div>
        )}

        {filteredEmployees.length > 0 && (
          <div className="flex justify-between mt-6 items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#226597] cursor-pointer text-white rounded-md disabled:opacity-0"
            >
              Prev
            </button>

            <span className="text-sm text-[#113F67]">
              Page <strong>{currentPage}</strong> of{" "}
              <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#226597] cursor-pointer text-white rounded-md hover:bg-[#1c4c7a] disabled:opacity-0"
            >
              Next
            </button>
          </div>
        )}

        {isModalOpen && (
          <div
            className="fixed inset-0  backdrop-blur-sm
bg-opacity-70 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded shadow-md w-80">
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this user?</p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(userToDelete!)}
                  className="px-4 py-2 bg-[#226597] text-white rounded hover:bg-[#1c4c7a]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
