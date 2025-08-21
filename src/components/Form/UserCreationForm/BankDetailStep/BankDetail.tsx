import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    accountHolderName: string;
    adharNumber: string;
    panNumber: string;
        firstName: string;
    lastName: string;
  };
};



const BankDetailsForm: React.FC<{ readOnly?: boolean }> = ({
  readOnly = false,
}) => {
  const {
    register,
        watch,
        setValue,
    formState: { errors },

  } = useFormContext<FormValues>();

  const bankErrors = errors?.bankDetails || {};
  const inputClass = `w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none ${
    readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
  }`;

 const firstName = watch("basicDetails.firstName") ?? "";
 const lastName = watch("basicDetails.lastName") ?? "";
 const fullName = `${firstName} ${lastName}`.trim();


 useEffect(() => {
  if(firstName || lastName){
    setValue("bankDetails.accountHolderName", fullName);
  }

 }, [firstName, lastName, fullName, setValue]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Bank Name
        </label>
        <input
          {...register("bankDetails.bankName", {
            required: "Bank name is required",
          })}
          className={inputClass}
          disabled={readOnly}
        />
        {bankErrors.bankName && (
          <p className="text-red-500 text-sm">{bankErrors.bankName.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Account Number
        </label>
        <input
          {...register("bankDetails.accountNumber", {
            required: "Account number is required",
            validate: (value) =>
              /^[0-9]{9,18}$/.test(value) ||
              "Account number must be between 9 to 18 digits",
          })}
          className={inputClass}
          inputMode="numeric"
          maxLength={18}
          disabled={readOnly}
        />
        {bankErrors.accountNumber && (
          <p className="text-red-500 text-sm">
            {bankErrors.accountNumber.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          IFSC Code
        </label>
        <input
          {...register("bankDetails.ifscCode", {
            required: "IFSC code is required",
            pattern: {
              value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
              message: "Invalid IFSC code format",
            },
          })}
          className={inputClass + "uppercase"}
          maxLength={11}
          onInput={(e) => {
            if (readOnly) return;
            const input = e.target as HTMLInputElement;
            input.value = input.value.toUpperCase();
          }}
          disabled={readOnly}
        />
        {bankErrors.ifscCode && (
          <p className="text-red-500 text-sm">{bankErrors.ifscCode.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Branch Name
        </label>
        <input
          {...register("bankDetails.branchName", {
            required: "Branch name is required",
          })}
          className={inputClass}
          disabled={readOnly}
        />
        {bankErrors.branchName && (
          <p className="text-red-500 text-sm">
            {bankErrors.branchName.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Account Holder Name
        </label>
        <input
          {...register("bankDetails.accountHolderName", {
            required: "Account holder name is required",
          })}
          className={inputClass}
          disabled={readOnly}
        />
        {bankErrors.accountHolderName && (
          <p className="text-red-500 text-sm">
            {bankErrors.accountHolderName.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          Aadhar Number
        </label>
        <input
          {...register("bankDetails.adharNumber", {
            required: "Aadhar number is required",
            pattern: {
              value: /^\d{12}$/,
              message: "Aadhar must be exactly 12 digits",
            },
          })}
          className={inputClass}
          inputMode="numeric"
          maxLength={12}
          disabled={readOnly}
        />
        {bankErrors.adharNumber && (
          <p className="text-red-500 text-sm">
            {bankErrors.adharNumber.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1">
          PAN Number
        </label>
        <input
          {...register("bankDetails.panNumber", {
            required: "PAN number is required",
            pattern: {
              value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
              message: "Invalid PAN number format",
            },
          })}
          className={inputClass + "uppercase"}
          maxLength={10}
          onInput={(e) => {
            if (readOnly) return;
            const input = e.target as HTMLInputElement;
            input.value = input.value.toUpperCase();
          }}
          disabled={readOnly}
        />
        {bankErrors.panNumber && (
          <p className="text-red-500 text-sm">{bankErrors.panNumber.message}</p>
        )}
      </div>
    </div>
  );
};

export default BankDetailsForm;
