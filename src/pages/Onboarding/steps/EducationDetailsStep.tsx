import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  educationDetails: {
    qualification: string;
    institution: string;
    yearOfPassing: string;
    grade: string;
  };
};

const degrees = ["B.Tech", "MCA", "ME", "BE", "M.Tech", "BCS", "BBA", "MBA"];

const EducationDetailsForm: React.FC<{ readOnly?: boolean }> = ({
  readOnly = false,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<FormValues>();

  const formData = watch();
  const eduErrors = errors.educationDetails || {};

  const [gradeType, setGradeType] = useState<"Percentage" | "CGPA">(
    "Percentage"
  );

  const inputClass = `border border-gray-300 rounded-md p-2 w-full shadow-sm text-sm focus:outline-none ${
    readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
  }`;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-6">Education Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            value={formData.educationDetails?.qualification || ""}
          >
            <option value="">Select degree</option>
            {degrees.map((deg) => (
              <option key={deg} value={deg}>
                {deg}
              </option>
            ))}
          </select>
          {eduErrors.qualification && (
            <p className="text-red-500 text-sm mt-1">
              {eduErrors.qualification.message}
            </p>
          )}
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
            value={formData.educationDetails?.institution || ""}
          />
          {eduErrors.institution && (
            <p className="text-red-500 text-sm mt-1">
              {eduErrors.institution.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Year of Passing
          </label>
          <select
            {...register("educationDetails.yearOfPassing", {
              required: !readOnly ? "Year of passing is required" : false,
            })}
            disabled={readOnly}
            className={inputClass}
            value={formData.educationDetails?.yearOfPassing || ""}
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
          {eduErrors.yearOfPassing && (
            <p className="text-red-500 text-sm mt-1">
              {eduErrors.yearOfPassing.message}
            </p>
          )}
        </div>

        <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Grade Type
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
                if (isNaN(num)) return "Must be a valid number";

                if (gradeType === "CGPA") {
                  return num >= 0 && num <= 10
                    ? true
                    : "CGPA must be between 0 and 10";
                }

                if (gradeType === "Percentage") {
                  return num >= 0 && num <= 100
                    ? true
                    : "Percentage must be between 0 and 100";
                }

                return "Invalid grade format";
              },
            })}
            disabled={readOnly}
            className={inputClass}
            value={formData.educationDetails?.grade || ""}
          />
          {eduErrors.grade && (
            <p className="text-red-500 text-sm mt-1">
              {eduErrors.grade.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationDetailsForm;
