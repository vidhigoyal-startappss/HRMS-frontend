import React from "react";
import { useFormContext } from "react-hook-form";

// Define FormValues matching backend DTO for Basic Details
type FormValues = {
  basicDetails: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dob: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    joiningDate?: string;
    designation?: string;
    department?: string;
    employmentType?: string;
  };
};

const BasicDetailsForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
      {/* First Name */}
      <div>
        <label className="block">First Name</label>
        <input
          {...register("basicDetails.firstName", { required: "First name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.basicDetails?.firstName?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block">Last Name</label>
        <input
          {...register("basicDetails.lastName", { required: "Last name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.basicDetails?.lastName?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.lastName.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block">Phone Number</label>
        <input
          {...register("basicDetails.phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Phone number must be 10 digits",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.basicDetails?.phoneNumber?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.phoneNumber.message}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block">Date of Birth</label>
        <input
          type="date"
          {...register("basicDetails.dob", { required: "Date of birth is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.basicDetails?.dob?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.dob.message}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block">Gender</label>
        <select
          {...register("basicDetails.gender", { required: "Gender is required" })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors?.basicDetails?.gender?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.gender.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="md:col-span-2">
        <label className="block">Address</label>
        <input
          {...register("basicDetails.address", { required: "Address is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.basicDetails?.address?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.address.message}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block">City</label>
        <input
          {...register("basicDetails.city", { required: "City is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.basicDetails?.city?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.city.message}</p>
        )}
      </div>

      {/* State */}
      <div>
        <label className="block">State</label>
        <input
          {...register("basicDetails.state", { required: "State is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.basicDetails?.state?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.state.message}</p>
        )}
      </div>

      {/* ZIP Code */}
      <div>
        <label className="block">ZIP Code</label>
        <input
          {...register("basicDetails.zipcode", {
            required: "ZIP code is required",
            pattern: {
              value: /^\d{5,6}$/,
              message: "Invalid ZIP code",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.basicDetails?.zipcode?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.zipcode.message}</p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className="block">Country</label>
        <input
          {...register("basicDetails.country", { required: "Country is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors?.basicDetails?.country?.message && (
          <p className="text-red-500 text-sm">{errors.basicDetails.country.message}</p>
        )}
      </div>

      {/* Joining Date (Optional) */}
      <div>
        <label className="block">Joining Date</label>
        <input
          type="date"
          {...register("basicDetails.joiningDate")}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Designation (Optional) */}
      <div>
        <label className="block">Designation</label>
        <input
          {...register("basicDetails.designation")}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Department (Optional) */}
      <div>
        <label className="block">Department</label>
        <select
          {...register("basicDetails.department")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Department</option>
          <option value="engineering">Engineering</option>
          <option value="hr">HR</option>
          <option value="sales">Sales</option>
        </select>
      </div>

      {/* Employment Type (Optional) */}
      <div>
        <label className="block">Employment Type</label>
        <select
          {...register("basicDetails.employmentType")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
