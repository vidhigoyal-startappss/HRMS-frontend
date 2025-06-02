import React from "react";
import { useFormContext } from "react-hook-form";

// Define FormValues matching backend DTO
type FormValues = {
  accountCreation: {
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
  };
};

const AccountCreationForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const basicErrors = errors.accountCreation || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
      {/* First Name */}
      <div>
        <label className="block">First Name</label>
        <input
          {...register("accountCreation.firstName", { required: "First name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {basicErrors.firstName && (
          <p className="text-red-500 text-sm">{basicErrors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block">Last Name</label>
        <input
          {...register("accountCreation.lastName", { required: "Last name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {basicErrors.lastName && (
          <p className="text-red-500 text-sm">{basicErrors.lastName.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block">Phone Number</label>
        <input
          {...register("accountCreation.phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Phone number must be 10 digits",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {basicErrors.phone && (
          <p className="text-red-500 text-sm">{basicErrors.phone.message}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block">Date of Birth</label>
        <input
          type="date"
          {...register("accountCreation.dob", { required: "Date of birth is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {basicErrors.dob && (
          <p className="text-red-500 text-sm">{basicErrors.dob.message}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block">Gender</label>
        <select
          {...register("accountCreation.gender", { required: "Gender is required" })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {basicErrors.gender && (
          <p className="text-red-500 text-sm">{basicErrors.gender.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="md:col-span-2">
        <label className="block">Address</label>
        <input
          {...register("accountCreation.address", { required: "Address is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {basicErrors.address && (
          <p className="text-red-500 text-sm">{basicErrors.address.message}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block">City</label>
        <input
          {...register("accountCreation.city", { required: "City is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {basicErrors.city && (
          <p className="text-red-500 text-sm">{basicErrors.city.message}</p>
        )}
      </div>

      {/* State */}
      <div>
        <label className="block">State</label>
        <input
          {...register("accountCreation.state", { required: "State is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {basicErrors.state && (
          <p className="text-red-500 text-sm">{basicErrors.state.message}</p>
        )}
      </div>

      {/* ZIP Code */}
      <div>
        <label className="block">ZIP Code</label>
        <input
          {...register("accountCreation.zipCode", {
            required: "ZIP code is required",
            pattern: {
              value: /^\d{5,6}$/,
              message: "Invalid ZIP code",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {basicErrors.zipCode && (
          <p className="text-red-500 text-sm">{basicErrors.zipCode.message}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="block">Country</label>
        <input
          {...register("accountCreation.country", { required: "Country is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {basicErrors.country && (
          <p className="text-red-500 text-sm">{basicErrors.country.message}</p>
        )}
      </div>

      {/* Joining Date (Optional) */}
      <div>
        <label className="block">Joining Date</label>
        <input
          type="date"
          {...register("accountCreation.joiningDate")}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Designation (Optional) */}
      <div>
        <label className="block">Designation</label>
        <input
          {...register("accountCreation.designation")}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Department (Optional) */}
      <div>
        <label className="block">Department</label>
        <select {...register("accountCreation.department")} className="w-full border px-3 py-2 rounded">
          <option value="">Select Department</option>
          <option value="engineering">Engineering</option>
          <option value="hr">HR</option>
          <option value="sales">Sales</option>
        </select>
      </div>

      {/* Employment Type (Optional) */}
      <div>
        <label className="block">Employment Type</label>
        <select {...register("accountCreation.employmentType")} className="w-full border px-3 py-2 rounded">
          <option value="">Select Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>
      </div>
    </div>
  );
};

export default AccountCreationForm;
