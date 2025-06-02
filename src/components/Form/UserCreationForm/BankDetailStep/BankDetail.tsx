import React from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    accountHolderName: string;
    aadharNumber: string;
    panNumber: string;
  };
};

const BankDetailsForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  const bankErrors = errors?.bankDetails || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      {/* Bank Name */}
      <div>
        <label className="block">Bank Name</label>
        <input
          {...register("bankDetails.bankName", { required: "Bank name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {bankErrors.bankName && <p className="text-red-500 text-sm">{bankErrors.bankName.message}</p>}
      </div>

      {/* Account Number */}
      <div>
        <label className="block">Account Number</label>
        <input
          {...register("bankDetails.accountNumber", {
            required: "Account number is required",
            minLength: { value: 9, message: "Account number must be at least 9 digits" },
            maxLength: { value: 18, message: "Account number must be at most 18 digits" },
            pattern: { value: /^[0-9]+$/, message: "Account number must be numeric" },
          })}
          className="w-full border px-3 py-2 rounded"
          inputMode="numeric"
        />
        {bankErrors.accountNumber && <p className="text-red-500 text-sm">{bankErrors.accountNumber.message}</p>}
      </div>

      {/* IFSC Code */}
      <div>
        <label className="block">IFSC Code</label>
        <input
          {...register("bankDetails.ifscCode", {
            required: "IFSC code is required",
            pattern: {
              value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
              message: "Invalid IFSC code format",
            },
          })}
          className="w-full border px-3 py-2 rounded uppercase"
          maxLength={11}
          onInput={e => {
            // Automatically uppercase IFSC input
            const input = e.target as HTMLInputElement;
            input.value = input.value.toUpperCase();
          }}
        />
        {bankErrors.ifscCode && <p className="text-red-500 text-sm">{bankErrors.ifscCode.message}</p>}
      </div>

      {/* Branch Name */}
      <div>
        <label className="block">Branch Name</label>
        <input
          {...register("bankDetails.branchName", { required: "Branch name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {bankErrors.branchName && <p className="text-red-500 text-sm">{bankErrors.branchName.message}</p>}
      </div>

      {/* Account Holder Name */}
      <div>
        <label className="block">Account Holder Name</label>
        <input
          {...register("bankDetails.accountHolderName", { required: "Account holder name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {bankErrors.accountHolderName && <p className="text-red-500 text-sm">{bankErrors.accountHolderName.message}</p>}
      </div>

      {/* Aadhar Number */}
      <div>
        <label className="block">Aadhar Number</label>
        <input
          {...register("bankDetails.aadharNumber", {
            required: "Aadhar number is required",
            pattern: { value: /^\d{12}$/, message: "Aadhar must be exactly 12 digits" },
          })}
          className="w-full border px-3 py-2 rounded"
          inputMode="numeric"
          maxLength={12}
        />
        {bankErrors.aadharNumber && <p className="text-red-500 text-sm">{bankErrors.aadharNumber.message}</p>}
      </div>

      {/* PAN Number */}
      <div>
        <label className="block">PAN Number</label>
        <input
          {...register("bankDetails.panNumber", {
            required: "PAN number is required",
            pattern: {
              value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
              message: "Invalid PAN number format",
            },
          })}
          className="w-full border px-3 py-2 rounded uppercase"
          maxLength={10}
          onInput={e => {
            // Automatically uppercase PAN input
            const input = e.target as HTMLInputElement;
            input.value = input.value.toUpperCase();
          }}
        />
        {bankErrors.panNumber && <p className="text-red-500 text-sm">{bankErrors.panNumber.message}</p>}
      </div>
    </div>
  );
};

export default BankDetailsForm;
