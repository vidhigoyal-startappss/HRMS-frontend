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

  if (!form) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Onboarding Form Details</h2>
      <div className="mb-4">
        <strong>Email:</strong> {form.email}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Basic Details</h3>
        <pre>{JSON.stringify(form.basicDetails, null, 2)}</pre>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Education Details</h3>
        <pre>{JSON.stringify(form.educationDetails, null, 2)}</pre>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Bank Details</h3>
        <pre>{JSON.stringify(form.bankDetails, null, 2)}</pre>
      </div>
    </div>
  );
};

export default OnboardingFormDetails;
