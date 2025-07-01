import React from "react";
import { UseFormRegister, RegisterOptions, FieldError } from "react-hook-form";

interface InputFieldProps {
  name: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<any>;
  validation?: RegisterOptions;
  error?: FieldError;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  type,
  placeholder,
  register,
  validation,
  error,
}) => {
  return (
    <div className="mb-2">
      <input
        type={type}
        {...register(name, validation)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <div className="h-5 mt-1">
        {error ? (
          <p className="text-red-500 text-sm">{error.message}</p>
        ) : (
          <p className="invisible text-sm">placeholder</p>
        )}
      </div>
    </div>
  );
};

export default InputField;
