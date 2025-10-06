import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OnboardingFormDetails: React.FC = () => {
  const { token } = useParams();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/onboarding/${token}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.error("Failed to load form:", err));
  }, [token]);

  if (!form) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6   rounded-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Onboarding Form Details
      </h2>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="text-gray-600">
            <strong>Email:</strong>
            <p>{form.email}</p>
          </div>
          <div className="text-gray-600">
            <strong>Phone:</strong>
            <p>{form.basicDetails.phone}</p>
          </div>
          <div className="text-gray-600">
            <strong>Date of Birth:</strong>
            <p>{form.basicDetails.dob}</p>
          </div>
          <div className="text-gray-600">
            <strong>Gender:</strong>
            <p>{form.basicDetails.gender}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">
          Address Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="text-gray-600">
            <strong>Current Address:</strong>
            <p>{form.basicDetails.currentAddress}</p>
          </div>
          <div className="text-gray-600">
            <strong>Permanent Address:</strong>
            <p>{form.basicDetails.permanentAddress}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">
          Emergency Contact
        </h3>
        <div className="text-gray-600">
          <strong>Name:</strong>
          <p>{form.basicDetails.emergencyContactPersonName}</p>
        </div>
        <div className="text-gray-600">
          <strong>Email:</strong>
          <p>{form.basicDetails.emergencyContactEmail}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="text-gray-600">
            <strong>CTC (Annual):</strong>
            <p>{form.basicDetails.ctc}</p>
          </div>
          <div className="text-gray-600">
            <strong>Joining Date:</strong>
            <p>{form.basicDetails.joiningDate}</p>
          </div>
          <div className="text-gray-600">
            <strong>Designation:</strong>
            <p>{form.basicDetails.designation}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">
          Education Details
        </h3>
        <div className="text-gray-600">
          <strong>Qualification:</strong>
          <p>{form.educationDetails.qualification}</p>
        </div>
        <div className="text-gray-600">
          <strong>Institution:</strong>
          <p>{form.educationDetails.institution}</p>
        </div>
        <div className="text-gray-600">
          <strong>Year of Passing:</strong>
          <p>{form.educationDetails.yearOfPassing}</p>
        </div>
        <div className="text-gray-600">
          <strong>Grade:</strong>
          <p>{form.educationDetails.grade}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">Bank Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="text-gray-600">
            <strong>Bank Name:</strong>
            <p>{form.bankDetails.bankName}</p>
          </div>
          <div className="text-gray-600">
            <strong>Account Number:</strong>
            <p>{form.bankDetails.accountNumber}</p>
          </div>
          <div className="text-gray-600">
            <strong>IFSC Code:</strong>
            <p>{form.bankDetails.ifscCode}</p>
          </div>
          <div className="text-gray-600">
            <strong>Branch Name:</strong>
            <p>{form.bankDetails.branchName}</p>
          </div>
          <div className="text-gray-600">
            <strong>Account Holder Name:</strong>
            <p>{form.bankDetails.accountHolderName}</p>
          </div>
          <div className="text-gray-600">
            <strong>Aadhaar Number:</strong>
            <p>{form.bankDetails.adharNumber}</p>
          </div>
          <div className="text-gray-600">
            <strong>PAN Number:</strong>
            <p>{form.bankDetails.panNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFormDetails;
