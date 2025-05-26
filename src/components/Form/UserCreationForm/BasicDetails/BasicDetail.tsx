// components/forms/BasicDetailsForm.tsx
import React from "react";
import { useForm, useFormContext } from "react-hook-form";

type FormValues = {
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
  joiningDate: string;
  designation: string;
  department: string;
  employmentType: string;
};

type Props = {
  onSubmit: (data: FormValues) => void;
  defaultValues: Object;
};

const BasicDetailsForm: React.FC<Props> = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
      <div>
        <label className="block">First Name</label>
        <input
          {...register("firstName", { required: "First name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">
            {errors.firstName.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Last Name</label>
        <input
          {...register("lastName", { required: "Last name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">
            {errors.lastName.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Phone Number</label>
        <input
          {...register("phone", { required: "Phone number is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">
            {errors.phone.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Date of Birth</label>
        <input
          type="date"
          {...register("dob")}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block">Gender</label>
        <select
          {...register("gender", { required: "Gender is required" })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm">
            {errors.gender.message as String}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block">Address</label>
        <input
          {...register("address", { required: "Address is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">
            {errors.address.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">City</label>
        <input
          {...register("city", { required: "City is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.city && (
          <p className="text-red-500 text-sm">
            {errors.city.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">State</label>
        <input
          {...register("state", { required: "State is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.state && (
          <p className="text-red-500 text-sm">
            {errors.state.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">ZIP Code</label>
        <input
          {...register("zipCode", { required: "ZIP code is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.zipCode && (
          <p className="text-red-500 text-sm">
            {errors.zipCode.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Country</label>
        <input
          {...register("country", { required: "Country is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.country && (
          <p className="text-red-500 text-sm">
            {errors.country.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Joining Date</label>
        <input
          type="date"
          {...register("joiningDate")}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block">Designation</label>
        <input
          {...register("designation")}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block">Department</label>
        <select
          {...register("department")}
          className="w-full border px-3 py-2 rounded"
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
          {...register("employmentType")}
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
