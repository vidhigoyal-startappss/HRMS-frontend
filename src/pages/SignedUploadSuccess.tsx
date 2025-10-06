import React from "react";

const SignedUploadSuccess: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Signed PDF Uploaded Successfully!
        </h1>
        <p className="text-gray-800 mb-6">
          Thank you for submitting your signed appointment letter. We have
          received your document and will process it shortly.
        </p>
      </div>
    </div>
  );
};

export default SignedUploadSuccess;
