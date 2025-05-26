import React from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
  aadharNumber: string;
  panNumber: string;
};

type Props = {
  onSubmit: (data: FormValues) => void;
  defaultValues?: FormValues;
};

const BankDetailsForm: React.FC<Props> = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      <div>
        <label className="block">Bank Name</label>
        <input
          {...register("bankName", { required: "Bank name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.bankName && (
          <p className="text-red-500 text-sm">
            {errors.bankName.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Account Number</label>
        <input
          {...register("accountNumber", {
            required: "Account number is required",
            minLength: { value: 9, message: "Invalid account number" },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.accountNumber && (
          <p className="text-red-500 text-sm">
            {errors.accountNumber.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">IFSC Code</label>
        <input
          {...register("ifscCode", {
            required: "IFSC code is required",
            pattern: {
              value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
              message: "Invalid IFSC code",
            },
          })}
          className="w-full border px-3 py-2 rounded uppercase"
        />
        {errors.ifscCode && (
          <p className="text-red-500 text-sm">
            {errors.ifscCode.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Branch Name</label>
        <input
          {...register("branchName", { required: "Branch name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.branchName && (
          <p className="text-red-500 text-sm">
            {errors.branchName.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Account Holder Name</label>
        <input
          {...register("accountHolderName", {
            required: "Account holder name is required",
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.accountHolderName && (
          <p className="text-red-500 text-sm">
            {errors.accountHolderName.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">Aadhar Number</label>
        <input
          {...register("aadharNumber", {
            required: "Aadhar number is required",
            pattern: {
              value: /^\d{12}$/,
              message: "Aadhar must be 12 digits",
            },
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.aadharNumber && (
          <p className="text-red-500 text-sm">
            {errors.aadharNumber.message as String}
          </p>
        )}
      </div>

      <div>
        <label className="block">PAN Number</label>
        <input
          {...register("panNumber", {
            required: "PAN number is required",
            pattern: {
              value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
              message: "Invalid PAN format",
            },
          })}
          className="w-full border px-3 py-2 rounded uppercase"
        />
        {errors.panNumber && (
          <p className="text-red-500 text-sm">
            {errors.panNumber.message as String}
          </p>
        )}
      </div>
    </div>
  );
};

export default BankDetailsForm;
