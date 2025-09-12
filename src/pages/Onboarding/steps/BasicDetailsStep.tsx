import React from "react";
import { useFormContext } from "react-hook-form";

const BasicDetailsStep: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const formData = watch();

  const inputClass = "border border-gray-300 rounded-md p-2 w-full";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Field
            label="First Name"
            name="basicDetails.firstName"
            value={formData.basicDetails?.firstName}
          />
          <Field
            label="Last Name"
            name="basicDetails.lastName"
            value={formData.basicDetails?.lastName}
          />
          <Field
            label="Phone"
            name="basicDetails.phone"
            value={formData.basicDetails?.phone}
          />
          <Field
            label="Date of Birth"
            name="basicDetails.dob"
            value={formData.basicDetails?.dob}
            type="date"
          />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              {...register("basicDetails.gender")}
              className={inputClass}
              value={formData.basicDetails?.gender || ""}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.basicDetails?.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.basicDetails.gender.message}
              </p>
            )}
          </div>

          <Field
            label="Address"
            name="basicDetails.address"
            value={formData.basicDetails?.address}
          />
          <Field
            label="City"
            name="basicDetails.city"
            value={formData.basicDetails?.city}
          />
          <Field
            label="State"
            name="basicDetails.state"
            value={formData.basicDetails?.state}
          />
          <Field
            label="Zip Code"
            name="basicDetails.zipCode"
            value={formData.basicDetails?.zipCode}
          />
          <Field
            label="Country"
            name="basicDetails.country"
            value={formData.basicDetails?.country}
          />

          <Field
            label="Emergency Contact Person Name"
            name="basicDetails.emergencyContactPersonName"
            value={formData.basicDetails?.emergencyContactPersonName}
          />
          <Field
            label="Emergency Contact Email"
            name="basicDetails.emergencyContactEmail"
            value={formData.basicDetails?.emergencyContactEmail}
          />

          <Field
            label="Current Address"
            name="basicDetails.currentAddress"
            value={formData.basicDetails?.currentAddress}
          />
          <Field
            label="Permanent Address"
            name="basicDetails.permanentAddress"
            value={formData.basicDetails?.permanentAddress}
          />

          <Field
            label="CTC"
            name="basicDetails.ctc"
            value={formData.basicDetails?.ctc}
          />
          <Field
            label="Joining Date"
            name="basicDetails.joiningDate"
            value={formData.basicDetails?.joiningDate}
            type="date"
          />
          <Field
            label="Designation"
            name="basicDetails.designation"
            value={formData.basicDetails?.designation}
          />
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  type = "text",
}: {
  label: string;
  name: string;
  value: any;
  type?: string;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputClass = "border border-gray-300 rounded-md p-2 w-full";

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        {...register(name)}
        placeholder={label}
        value={value || ""}
        className={inputClass}
      />
      {
        // @ts-ignore
        errors?.[name?.split(".")[0]]?.[name?.split(".")[1]] && (
          <p className="text-red-500 text-sm mt-1">
            {
              // @ts-ignore
              errors[name.split(".")[0]][name.split(".")[1]].message
            }
          </p>
        )
      }
    </div>
  );
};

export default BasicDetailsStep;
