import React from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  educationDetails: {
    qualification: string;
    institution: string;
    yearOfPassing: number;
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      {/* Qualification */}
      <div>
        <label className="block">Highest Qualification</label>
        <input
          {...register("educationDetails.qualification", {
            required: "Qualification is required",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {eduErrors.qualification && (
          <p className="text-red-500 text-sm">{eduErrors.qualification.message}</p>
        )}
      </div>

      {/* Institution */}
      <div>
        <label className="block">University / College</label>
        <input
          {...register("educationDetails.institution", {
            required: "Institution name is required",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {eduErrors.institution && (
          <p className="text-red-500 text-sm">{eduErrors.institution.message}</p>
        )}
      </div>

      {/* Year of Passing */}
      <div>
        <label className="block">Year of Passing</label>
        <input
          type="number"
          {...register("educationDetails.yearOfPassing", {
            required: "Year of passing is required",
            min: { value: 1900, message: "Invalid year" },
            max: {
              value: new Date().getFullYear(),
              message: "Future year not allowed",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {eduErrors.yearOfPassing && (
          <p className="text-red-500 text-sm">{eduErrors.yearOfPassing.message}</p>
        )}
      </div>

      {/* Grade */}
      <div>
        <label className="block">Grade / Percentage</label>
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
