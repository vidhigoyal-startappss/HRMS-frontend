import React from "react";
import { useFormContext } from "react-hook-form";

// Backend-aligned DTO type
type FormValues = {
  educationDetails: {
    qualification: string;
    institution: string;
    yearOfPassing: string;
    grade: string;
  };
};

const EducationDetailsForm: React.FC<{ readOnly?: boolean }> = ({
  readOnly = false,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const eduErrors = errors.educationDetails || {};

  const inputClass = `w-full border px-3 py-2 rounded ${
    readOnly ? "bg-gray-100 cursor-not-allowed" : ""
  }`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      {/* Highest Qualification */}
      <div>
        <label className="block font-medium">Highest Qualification</label>
        <input
          {...register("educationDetails.qualification", {
            required: !readOnly ? "Highest qualification is required" : false,
          })}
          disabled={readOnly}
          className={inputClass}
        />
        {!readOnly && eduErrors.qualification && (
          <p className="text-red-500 text-sm">
            {eduErrors.qualification.message}
          </p>
        )}
      </div>

      {/* University / College */}
      <div>
        <label className="block font-medium">University / College</label>
        <input
          {...register("educationDetails.institution", {
            required: !readOnly ? "University or college is required" : false,
          })}
          disabled={readOnly}
          className={inputClass}
        />
        {!readOnly && eduErrors.institution && (
          <p className="text-red-500 text-sm">
            {eduErrors.institution.message}
          </p>
        )}
      </div>

      {/* Year of Passing */}
      <div>
        <label className="block font-medium">Year of Passing</label>
        <input
          type="text"
          {...register("educationDetails.yearOfPassing", {
            required: !readOnly ? "Year of passing is required" : false,
            pattern: !readOnly
              ? {
                  value: /^\d{4}$/,
                  message: "Enter a valid 4-digit year",
                }
              : undefined,
          })}
          disabled={readOnly}
          className={inputClass}
        />
        {!readOnly && eduErrors.yearOfPassing && (
          <p className="text-red-500 text-sm">
            {eduErrors.yearOfPassing.message}
          </p>
        )}
      </div>

      {/* Grade / Percentage */}
      <div>
        <label className="block font-medium">Grade / Percentage</label>
        <input
          {...register("educationDetails.grade", {
            required: !readOnly ? "Grade or percentage is required" : false,
          })}
          disabled={readOnly}
          className={inputClass}
        />
        {!readOnly && eduErrors.grade && (
          <p className="text-red-500 text-sm">{eduErrors.grade.message}</p>
        )}
      </div>
    </div>
  );
};

export default EducationDetailsForm;
