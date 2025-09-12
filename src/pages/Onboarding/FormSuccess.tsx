import React from "react";

const FormSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">
          Form Submitted Successfully!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for completing your onboarding form. We'll be in touch soon.
        </p>
      </div>
    </div>
  );
};

export default FormSuccess;
