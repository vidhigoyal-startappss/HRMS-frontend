import React from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  salaryDetails: {
    basicFixedMonthly: number;
    basicFixedYearly: number;
    hraFixedMonthly: number;
    hraFixedYearly: number;
    conveyanceMonthly: number;
    conveyanceYearly: number;
    dearnessAllowancesMonthly: number;
    dearnessAllowancesYearly: number;
    otherAllowancesMonthly: number;
    otherAllowancesYearly: number;
    annualGrossSalaryMonthly: number;
    annualGrossSalaryYearly: number;
    employerPFMonthly: number;
    employerPFYearly: number;
    totalFixedPayMonthly: number;
    totalFixedPayYearly: number;
    individualVariablePayMonthly: number;
    individualVariablePayYearly: number;
    totalCTC: number;
    totalCTCMonthly: number;
    totalCTCYearly: number;
  };
};

const SalaryDetailsForm: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const inputClass = `w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none ${
    readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
  }`;

  const fields: { name: keyof FormValues["salaryDetails"]; label: string }[] = [
    { name: "basicFixedMonthly", label: "Basic Fixed Monthly" },
    { name: "basicFixedYearly", label: "Basic Fixed Yearly" },
    { name: "hraFixedMonthly", label: "HRA Fixed Monthly" },
    { name: "hraFixedYearly", label: "HRA Fixed Yearly" },
    { name: "conveyanceMonthly", label: "Conveyance Monthly" },
    { name: "conveyanceYearly", label: "Conveyance Yearly" },
    { name: "dearnessAllowancesMonthly", label: "Dearness Allowance Monthly" },
    { name: "dearnessAllowancesYearly", label: "Dearness Allowance Yearly" },
    { name: "otherAllowancesMonthly", label: "Other Allowances Monthly" },
    { name: "otherAllowancesYearly", label: "Other Allowances Yearly" },
    { name: "annualGrossSalaryMonthly", label: "Annual Gross Salary Monthly" },
    { name: "annualGrossSalaryYearly", label: "Annual Gross Salary Yearly" },
    { name: "employerPFMonthly", label: "Employer PF Monthly" },
    { name: "employerPFYearly", label: "Employer PF Yearly" },
    { name: "totalFixedPayMonthly", label: "Total Fixed Pay Monthly" },
    { name: "totalFixedPayYearly", label: "Total Fixed Pay Yearly" },
    { name: "individualVariablePayMonthly", label: "Individual Variable Pay Monthly" },
    { name: "individualVariablePayYearly", label: "Individual Variable Pay Yearly" },
    { name: "totalCTCMonthly", label: "Total CTC Monthly" },
    { name: "totalCTCYearly", label: "Total CTC Yearly" },
  ];

  return (
    <div className="mt-4 p-4">
      <h3 className="text-xl font-semibold mb-4">Salary Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {field.label}
            </label>
            <input
              type="number"
              {...register(`salaryDetails.${field.name}`, {
                required: "This field is required",
                valueAsNumber: true,
              })}
              className={inputClass}
              disabled={readOnly}
            />
            {errors.salaryDetails?.[field.name] && (
              <p className="text-red-500 text-sm">
                {(errors.salaryDetails?.[field.name] as any)?.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalaryDetailsForm;
