import React from "react";
import arrowImage from "../assets/arrow.png";
import { useNavigate } from "react-router-dom";

type EmployeeCardProps = {
  name: string;
  role: string;
  imageUrl: string;
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  name,
  role,
  imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUpiglNG5F4DdRpAG_jVCrqsQVX4P2d4jLzQ&s",
}) => {
  const navigate = useNavigate();
  const handleEditClick = () => {
    navigate(`/employee/profile/`);
  };

  return (
    <div className="relative flex items-center justify-between bg-blue-900 p-4 rounded-lg shadow-md hover:shadow-lg transition">
      {/* Left side: profile image + name + role */}
      <div className="flex items-center gap-4">
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-24 rounded-full border-4 border-gray-200"
        />
        <div className="flex flex-col gap-1 items-start">
          <h3 className="md:text-2xl font-semibold text-white">{name}</h3>
          <p className="md:text-lg text-gray-300">{role}</p>
        </div>
      </div>

      {/* Right side: Edit button */}
      <button
        className="bg-yellow-500 px-5 py-2 rounded-sm cursor-pointer z-30 hover:bg-yellow-400"
        onClick={handleEditClick}
      >
        Edit Profile
      </button>

      {/* Arrow image positioned at top-right */}
      <img
        src={arrowImage}
        alt="arrow"
        className="absolute top-1 right-0 w-[150px] h-[100px] rotate-0 z-10"
      />
    </div>
  );
};

export default EmployeeCard;
