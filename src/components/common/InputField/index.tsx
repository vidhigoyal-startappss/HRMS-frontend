import React from "react";
import { UseFormRegister,RegisterOptions, FieldError } from "react-hook-form";
interface LoginFormInputs {
  email: string;
  password: string;
}



  interface InputFieldProps {
    name: keyof LoginFormInputs;
    type?: string;
    placeholder?: string;
    register: UseFormRegister<LoginFormInputs>;
    validation?: RegisterOptions;
    error?: FieldError;
    label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  register,
  validation,
  error,
  placeholder,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        {...register(name, validation)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
       {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;
