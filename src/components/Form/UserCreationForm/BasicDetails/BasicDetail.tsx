import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import API from "../../../../api/auth";
import { Loader } from "../../../Loader/Loader";

type FormValues = {
  basicDetails: {
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
  };
};

const BasicDetailsForm: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const inputClass = `w-full border px-3 py-2 rounded ${
    readOnly ? "bg-gray-100 cursor-not-allowed" : ""
  }`;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();

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
    setIsLoading(true);
    try {
      await API.post(`/api/users/upload-profile/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile image uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
      {/* First Name */}
      <div>
        <label className="block">First Name</label>
        <input
          {...register("basicDetails.firstName", {
            required: !readOnly ? "First name is required" : false,
          })}
          disabled={readOnly}
          className={inputClass}
        />
        {!readOnly && errors?.basicDetails?.firstName?.message && (
          <p className="text-red-500 text-sm">
            {errors.basicDetails.firstName.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block">Last Name</label>
        <input
          {...register("basicDetails.lastName", {
            required: !readOnly ? "Last name is required" : false,
          })}
          disabled={readOnly}
          className={inputClass}
        />
        {!readOnly && errors?.basicDetails?.lastName?.message && (
          <p className="text-red-500 text-sm">
            {errors.basicDetails.lastName.message}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block">Phone Number</label>
        <input
          {...register("basicDetails.phone", {
            required: !readOnly ? "Phone number is required" : false,
            pattern: !readOnly
              ? {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                }
              : undefined,
          })}
          disabled={readOnly}
          className={inputClass}
        />
        {!readOnly && errors?.basicDetails?.phone?.message && (
          <p className="text-red-500 text-sm">
            {errors.basicDetails.phone.message}
          </p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block">Date of Birth</label>
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
                  return age >= 21 || "Employee must be at least 21 years old";
                }
              : undefined,
          })}
          disabled={readOnly}
          className={inputClass}
        />
        {!readOnly && errors?.basicDetails?.dob?.message && (
          <p className="text-red-500 text-sm">
            {errors.basicDetails.dob.message}
          </p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block">Gender</label>
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
        {!readOnly && errors?.basicDetails?.gender?.message && (
          <p className="text-red-500 text-sm">
            {errors.basicDetails.gender.message}
          </p>
        )}
      </div>

      {/* Address Fields */}
      {[
        { label: "Address", name: "address" },
        { label: "City", name: "city" },
        { label: "State", name: "state" },
        { label: "ZIP Code", name: "zipCode", pattern: /^\d{5,6}$/, patternMsg: "Invalid ZIP code" },
        { label: "Country", name: "country" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block">{field.label}</label>
          <input
            {...register(`basicDetails.${field.name}` as const, {
              required: !readOnly ? `${field.label} is required` : false,
              pattern: field.pattern
                ? { value: field.pattern, message: field.patternMsg }
                : undefined,
            })}
            disabled={readOnly}
            className={inputClass}
          />
          {!readOnly && errors?.basicDetails?.[field.name]?.message && (
            <p className="text-red-500 text-sm">
              {errors.basicDetails[field.name]?.message}
            </p>
          )}
        </div>
      ))}

      {/* Joining Date, Designation, Department, Employment Type */}
      <div>
        <label className="block">Joining Date</label>
        <input
          type="date"
          {...register("basicDetails.joiningDate")}
          disabled={readOnly}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block">Designation</label>
        <input
          {...register("basicDetails.designation")}
          disabled={readOnly}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block">Department</label>
        <select
          {...register("basicDetails.department")}
          disabled={readOnly}
          className={inputClass}
        >
          <option value="">Select Department</option>
          <option value="engineering">Engineering</option>
          <option value="hr">HR</option>
          <option value="sales">Sales</option>
        </select>
      </div>

      <div>
        <label className="block">Employment Type</label>
        <select
          {...register("basicDetails.employmentType")}
          disabled={readOnly}
          className={inputClass}
        >
          <option value="">Select Type</option>
          <option value="full-time">Full-time</option>
          <option value="intern">Intern</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      {/* Profile Upload */}
      {!readOnly && (
        <div className="md:col-span-2">
          <label className="block mb-1">Upload Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm cursor-pointer text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:text-sm file:bg-white hover:file:bg-gray-100"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="mt-2 w-28 h-28 object-cover rounded-full border"
            />
          )}
          <button
            type="button"
            onClick={handleUpload}
            className="mt-2 bg-blue-700 hover:bg-blue-900 text-white cursor-pointer py-1 px-3 rounded-sm"
          >
            {isLoading ? <Loader /> : "Upload"}
          </button>
        </div>
      )}

      {/* ✅ Update Button */}
      {!readOnly && (
        <div className="md:col-span-4 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default BasicDetailsForm;
