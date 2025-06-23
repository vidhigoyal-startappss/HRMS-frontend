// components/common/Loader.tsx
import React from "react";

interface LoaderProps {
  size?: string;
  color?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "w-8 h-8",
  color = "text-blue-600",
  className = "",
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent border-gray-200 ${size} ${color}`}
        role="status"
      />
    </div>
  );
};

export default Loader;
