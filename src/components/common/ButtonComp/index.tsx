import React from "react";
import { Loader } from "../../Loader/Loader";// Optional, or you can define a small spinner inside here

interface ButtonProps {
  name: string;
  onHandleClick?: () => void;
  cls: string;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  name,
  onHandleClick,
  isLoading = false,
  cls,
  type = "submit",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onHandleClick}
      disabled={isLoading || disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition 
        ${cls} ${isLoading || disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {isLoading && <span className="loader h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
      {isLoading ? "Processing..." : name}
    </button>
  );
};

export default Button;
