import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-blue-50 to-white px-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-xl text-center animate-fadeIn">
        <h1 className="text-6xl md:text-8xl font-extrabold text-[#113F67] mb-6">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>

        <p className="text-gray-600 mb-8 text-md md:text-lg">
          The page you are looking for doesn’t exist or has been moved. <br />
          Don’t worry, you can go back to the login page and start fresh.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-[#113F67] hover:bg-[#226597] transition-colors duration-300 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Go to Login
        </button>
      </div>

      <p className="mt-8 text-gray-400 text-sm">
        © {new Date().getFullYear()} Startapppss System India Pvt. Ltd. All
        Rights are Reserved
      </p>
    </div>
  );
};

export default NotFound;
