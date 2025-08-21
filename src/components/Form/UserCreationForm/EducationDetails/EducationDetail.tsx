import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  educationDetails: {
    qualification: string;
    institution: string;
    yearOfPassing: string;
    grade: string;
    z;
  };
};

const degrees = ["B.Tech", "MCA", "ME", "BE", "M.Tech", "BCS", "BBA", "MBA"];

const EducationDetailsForm: React.FC<{ readOnly?: boolean }> = ({
  readOnly = false,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const [gradeType, setGradeType] = useState<"Percentage" | "CGPA">(
    "Percentage"
  );

  const eduErrors = errors.educationDetails || {};

  const inputClass = `w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none ${
    readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
  }`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Highest Qualification
        </label>
        <select
          {...register("educationDetails.qualification", {
            required: !readOnly ? "Highest qualification is required" : false,
          })}
          disabled={readOnly}
          className={inputClass}
        >
          <option value="">Select degree</option>
          {degrees.map((deg) => (
            <option key={deg} value={deg}>
              {deg}
            </option>
          ))}
        </select>
        <div className="h-5 mt-1">
          {!readOnly && eduErrors.qualification && (
            <p className="text-red-500 text-sm">
              {eduErrors.qualification.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          University / College
        </label>
        <input
          {...register("educationDetails.institution", {
            required: !readOnly ? "University or college is required" : false,
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Only alphabets and spaces are allowed",
            },
          })}
          disabled={readOnly}
          className={inputClass}
        />
        <div className="h-5 mt-1">
          {!readOnly && eduErrors.institution && (
            <p className="text-red-500 text-sm">
              {eduErrors.institution.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Year of Passing
        </label>
        <div className="relative">
          <select
            {...register("educationDetails.yearOfPassing", {
              required: !readOnly ? "Year of passing is required" : false,
            })}
            disabled={readOnly}
            className={inputClass}
          >
            <option value="">Select year</option>
            {Array.from(
              { length: new Date().getFullYear() - 2000 + 1 },
              (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              }
            )}
          </select>
        </div>

        <div className="h-5 mt-1">
          {!readOnly && eduErrors.yearOfPassing && (
            <p className="text-red-500 text-sm">
              {eduErrors.yearOfPassing.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Grade / Percentage
        </label>

        <select
          value={gradeType}
          onChange={(e) =>
            setGradeType(e.target.value as "Percentage" | "CGPA")
          }
          disabled={readOnly}
          className={`${inputClass} mb-2`}
        >
          <option value="Percentage">Percentage</option>
          <option value="CGPA">CGPA</option>
        </select>

        <input
          {...register("educationDetails.grade", {
            required: !readOnly ? "Grade or percentage is required" : false,
            validate: (value) => {
              const num = parseFloat(value);
              if (isNaN(num)) {
                return "Must be a valid number";
              }

              if (gradeType === "CGPA") {
                if (num >= 0 && num <= 10) return true;
                return "CGPA must be between 0 and 10";
              }

              if (gradeType === "Percentage") {
                if (num >= 0 && num <= 100) return true;
                return "Percentage must be between 0 and 100";
              }

              return "Invalid grade format";
            },
          })}
          disabled={readOnly}
          className={inputClass}
        />

        <div className="h-5 mt-1">
          {!readOnly && eduErrors.grade && (
            <p className="text-red-500 text-sm">{eduErrors.grade.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationDetailsForm;
