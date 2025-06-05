import React from "react";
import { useFormContext } from "react-hook-form";

// Backend-aligned DTO type
type FormValues = {
  educationDetails: {
    highestQualification: string;
    university: string;
    yearOfPassing: string;
    grade: string;
  };
};

const EducationDetailsForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const eduErrors = errors.educationDetails || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      {/* Highest Qualification */}
      <div>
        <label className="block font-medium">Highest Qualification</label>
        <input
          {...register("educationDetails.highestQualification", {
            required: "Highest qualification is required",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {eduErrors.highestQualification && (
          <p className="text-red-500 text-sm">
            {eduErrors.highestQualification.message}
          </p>
        )}
      </div>

      {/* University / College */}
      <div>
        <label className="block font-medium">University / College</label>
        <input
          {...register("educationDetails.university", {
            required: "University or college is required",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {eduErrors.university && (
          <p className="text-red-500 text-sm">{eduErrors.university.message}</p>
        )}
      </div>

      {/* Year of Passing */}
      <div>
        <label className="block font-medium">Year of Passing</label>
        <input
          type="text"
          {...register("educationDetails.yearOfPassing", {
            required: "Year of passing is required",
            pattern: {
              value: /^\d{4}$/,
              message: "Enter a valid 4-digit year",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {eduErrors.yearOfPassing && (
          <p className="text-red-500 text-sm">{eduErrors.yearOfPassing.message}</p>
        )}
      </div>

      {/* Grade / Percentage */}
      <div>
        <label className="block font-medium">Grade / Percentage</label>
        <input
          {...register("educationDetails.grade", {
            required: "Grade or percentage is required",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {eduErrors.grade && (
          <p className="text-red-500 text-sm">{eduErrors.grade.message}</p>
        )}
      </div>
    </div>
  );
};

export default EducationDetailsForm;
