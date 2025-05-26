// components/forms/EducationDetailsForm.tsx
import React from "react";
import { useForm, SubmitHandler, useFormContext } from "react-hook-form";
import InputField from "../../../common/InputField";

type FormValues = {
  qualification: string;
  institution: string;
  yearOfPassing: number;
  grade: string;
};

type Props = {
  onSubmit: (data: FormValues) => void;
  defaultValues?: FormValues;
};

const EducationDetailsForm: React.FC<Props> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      <div>
        <label className="block">Highest Qualification</label>
        <input
          {...register("qualification", {
            required: "Qualification is required",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.qualification && (
          <p className="text-red-500 text-sm">
            {errors.qualification.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">University / College</label>
        <input
          {...register("institution", {
            required: "Institution name is required",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.institution && (
          <p className="text-red-500 text-sm">
            {errors.institution.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Year of Passing</label>
        <input
          type="number"
          {...register("yearOfPassing", {
            required: "Year of passing is required",
            min: { value: 1900, message: "Invalid year" },
            max: {
              value: new Date().getFullYear(),
              message: "Future year not allowed",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.yearOfPassing && (
          <p className="text-red-500 text-sm">
            {errors.yearOfPassing.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Grade / Percentage</label>
        <input
          {...register("grade", {
            required: "Grade or percentage is required",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.grade && (
          <p className="text-red-500 text-sm">
            {errors.grade.message as String}
          </p>
        )}
      </div>
    </div>
  );
};

export default EducationDetailsForm;
