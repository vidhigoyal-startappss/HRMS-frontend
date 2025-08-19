import React, { useEffect, useState } from "react";
import { set, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import API from "../../../../api/auth";
import { Loader } from "../../../Loader/Loader";
import { Info } from "lucide-react";

type leaves = {
  paidAllowed?: number;
  wfhAllowed?: number;
};

type FormValues = {
  basicDetails: {
    employeeid: string;
    firstName: string;
    lastName: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    joiningDate?: string;
    designation?: string;
    department?: string;
    employmentType?: string;
    profileImage?: string;
    leaves?: leaves;
    emergencyContactPersonName: string;
    emergencyContactEmail: string;
    currentAddress: string;
    permanentAddress: string;
    ctc: string;
  };
};

//  function getRandomNumber(min: number, max: number): number{
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }

const BasicDetailsForm: React.FC<{ readOnly?: boolean }> = ({
  readOnly = false,
}) => {
  const {
    register,
    watch,
    formState: { errors },
    clearErrors,
  } = useFormContext<FormValues>();

  const inputClass = `w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none ${
    readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
  }`;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const [uploadSuccess, setuploadSuccess] = useState<boolean>(false);
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  // const [isLoading , setIsLoading] = useState<boolean>(false);

  const departmentDesignationMap: Record<string, string[]> = {
    engineering: ["MERN-Stack Developer", "Data Engineer"],
    hr: ["HR Manager", "HR Executive"],
    sales: ["Business Development Executive", "Sales"],
  };
  const selectedDepartment = watch("basicDetails.department");
  const designationOptions = departmentDesignationMap[selectedDepartment] || [];
  const { setValue } = useFormContext<FormValues>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !id) return alert("No file or user ID found");
    const formData = new FormData();
    formData.append("file", selectedFile);
    setuploadSuccess(false);
    setIsLoading(true);
    try {
      const response = await API.post(
        `/api/users/upload-profile/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const imageUrl = response.data.imageUrl;
      setValue("basicDetails.profileImage", imageUrl);
      setPreviewUrl(imageUrl);

      setuploadSuccess(true);
      clearErrors("basicDetails.profileImage");
    } catch (err) {
      console.error(err);

      setuploadSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const addressFields = [
    { label: "Address", name: "address" },
    { label: "City", name: "city" },
    { label: "State", name: "state" },
    {
      label: "ZIP Code",
      name: "zipCode",
      pattern: /^\d{5,6}$/,
      patternMsg: "Invalid ZIP code",
    },
    { label: "Country", name: "country" },
  ];

  // useEffect(() => {
  //  const newRandomNumber = getRandomNumber(1, 100);

  //  setRandomNumber(newRandomNumber);
  // }, []);

  useEffect(() => {
    if (id) {
      console.log("user id", id);

      setIsLoading(true);
      API.get(`/api/users/employee/${id}`)
        .then((response) => {
          console.log("api data", response.data);
         console.log("User API response data:", response.data);
          const { employeeId } = response.data;

          setEmployeeId(employeeId);
          setValue("basicDetails.employeeid", employeeId);
        })
        .catch((error) => {
          console.error("Error fetching user details", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, setValue]);

  return (
    <>
      <h4>Add User Information</h4>
      <p className="text-lg font-medium text-back-100 mt-5">
        EmployeeId : {employeeId ?? "Loading..."}
        
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 p-4 bg-white rounded-xl">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            {...register("basicDetails.firstName", {
              required: !readOnly ? "First name is required" : false,
              pattern: {
                value: /^[a-zA-Z\s'-]+$/,
                message: "alphabets are required",
              },
            })}
            disabled={readOnly}
            className={inputClass}
          />
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.firstName?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.firstName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            {...register("basicDetails.lastName", {
              required: !readOnly ? "Last name is required" : false,
              pattern: {
                value: /^[a-zA-Z\s'-]+$/,
                message: "alphabets are required",
              },
            })}
            disabled={readOnly}
            className={inputClass}
          />
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.lastName?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            {...register("basicDetails.phone", {
              required: !readOnly ? "Phone number is required" : false,
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits",
              },
            })}
            disabled={readOnly}
            className={inputClass}
          />
          {!readOnly && errors.basicDetails?.phone?.message && (
            <p className="text-red-500 text-sm">
              {errors.basicDetails.phone.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            {...register("basicDetails.dob", {
              required: !readOnly ? "Date of birth is required" : false,
              validate: !readOnly
                ? (value) => {
                    const today = new Date();
                    const dob = new Date(value);
                    let age = today.getFullYear() - dob.getFullYear();
                    const m = today.getMonth() - dob.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                      age--;
                    }
                    return (
                      age >= 21 || "Employee must be at least 21 years old"
                    );
                  }
                : undefined,
            })}
            disabled={readOnly}
            className={inputClass}
          />
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.dob?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.dob.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            {...register("basicDetails.gender", {
              required: !readOnly ? "Gender is required" : false,
            })}
            disabled={readOnly}
            className={inputClass}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.gender?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.gender.message}
              </p>
            )}
          </div>
        </div>

        {addressFields.map((field) => (
          <div className="flex flex-col" key={field.name}>
            <label className="text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              {...register(`basicDetails.${field.name}` as const, {
                required: !readOnly ? "This field is required" : false,
                pattern: field.pattern
                  ? { value: field.pattern, message: field.patternMsg }
                  : undefined,
              })}
              disabled={readOnly}
              className={inputClass}
            />
            <div className="h-5 mt-1">
              {!readOnly && errors?.basicDetails?.[field.name]?.message && (
                <p className="text-red-500 text-sm">
                  {errors.basicDetails?.[field.name]?.message}
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Joining Date
          </label>
          <input
            type="date"
            {...register("basicDetails.joiningDate", {
              required: !readOnly ? "Joining Date is required" : false,
            })}
            disabled={readOnly}
            className={inputClass}
          />
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.joiningDate?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.joiningDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            {...register("basicDetails.department", {
              required: !readOnly ? "Department is required" : false,
            })}
            disabled={readOnly}
            className={inputClass}
          >
            <option value="">Select Department</option>
            <option value="engineering">Engineering</option>
            <option value="hr">HR</option>
            <option value="sales">Sales</option>
          </select>
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.department?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.department.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Designation
          </label>
          <select
            {...register("basicDetails.designation", {
              required: !readOnly ? "Designation is required" : false,
            })}
            disabled={readOnly || !selectedDepartment}
            className={inputClass}
          >
            <option value="">Select Designation</option>
            {designationOptions.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.designation?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.designation.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Employment Type
          </label>
          <select
            {...register("basicDetails.employmentType", {
              required: !readOnly ? "Employee Type is required" : false,
            })}
            disabled={readOnly}
            className={inputClass}
          >
            <option value="">Select Type</option>
            <option value="full-time">Full-time</option>
            <option value="intern">Intern</option>
            <option value="contract">Contract</option>
          </select>
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.employmentType?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.employmentType.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Emergency Contact Person Name
          </label>
          <input
            {...register("basicDetails.emergencyContactPersonName", {
              required: !readOnly
                ? " emergencyContactPersonName is required"
                : false,
              pattern: {
                value: /^[a-zA-Z\s'-]+$/,
                message: "alphabets are required",
              },
            })}
            disabled={readOnly}
            className={inputClass}
          />
          <div className="h-5 mt-1">
            {!readOnly &&
              errors.basicDetails?.emergencyContactPersonName?.message && (
                <p className="text-red-500 text-sm">
                  {errors.basicDetails.emergencyContactPersonName.message}
                </p>
              )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Emergency Contact Email ID
          </label>

          <input
            {...register("basicDetails.emergencyContactEmail", {
              required: !readOnly ? "emergencyContactEmail is required" : false,
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email format",
              },
            })}
            disabled={readOnly}
            className={inputClass}
          />
          <div className="h-5 mt-1">
            {!readOnly &&
              errors.basicDetails?.emergencyContactEmail?.message && (
                <p className="text-red-500 text-sm">
                  {errors.basicDetails.emergencyContactEmail.message}
                </p>
              )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Current Address
          </label>

          <input
            {...register("basicDetails.currentAddress", {
              required: !readOnly ? "currentAddress is required" : false,
            })}
            disabled={readOnly}
            className={inputClass}
          />
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.currentAddress?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.currentAddress.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Permanent Address
          </label>

          <input
            {...register("basicDetails.permanentAddress", {
              required: !readOnly ? "permanentAddress is required" : false,
            })}
            disabled={readOnly}
            className={inputClass}
          />
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.permanentAddress?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.permanentAddress.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">ctc</label>

          <input
            {...register("basicDetails.ctc", {
              required: !readOnly ? "ctc is required" : false,
              pattern: {
                value: /^\d+$/,
                message: "ctc must be a number",
              },
            })}
            disabled={readOnly}
            className={inputClass}
          />
          <div className="h-5 mt-1">
            {!readOnly && errors.basicDetails?.ctc?.message && (
              <p className="text-red-500 text-sm">
                {errors.basicDetails.ctc.message}
              </p>
            )}
          </div>
        </div>

        {!readOnly && (
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Upload Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm cursor-pointer text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:bg-white hover:file:bg-gray-100"
              required={true}
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full border"
              />
            )}
            <button
              type="button"
              onClick={handleUpload}
              className="mt-2 bg-[#226597] hover:bg-[#1c4c7a] cursor-pointer text-white py-1.5 px-4 rounded-md"
            >
              {isLoading ? <Loader /> : "Upload"}
            </button>
            {uploadSuccess && (
              <p className="text-green-500 text-sm mt-2">
                Profile image uploaded successfully!
              </p>
            )}
          </div>
        )}
        <div className="h-5 mt-1">
          {!readOnly && errors.basicDetails?.profileImage?.message && (
            <p className="text-red-500 text-sm">
              {errors.basicDetails.profileImage.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default BasicDetailsForm;
