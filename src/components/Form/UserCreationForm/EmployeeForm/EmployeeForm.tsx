import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import UserAccountCreationForm from "../AccountCreationStep/AccountCreation";
import BasicDetailsForm from "../BasicDetails/BasicDetail";
import EducationDetailsForm from "../EducationDetails/EducationDetail";
import BankDetailsForm from "../BankDetailStep/BankDetail";
import Stepper from "../../../Stepper/Stepper";

const steps = [
  "Account Creation",
  "Basic Details",
  "Educational Details",
  "Bank Details",
];

const stepComponents = [
  UserAccountCreationForm,
  BasicDetailsForm,
  EducationDetailsForm,
  BankDetailsForm,
];

const EmployeeForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm({
    mode: "onTouched",
    defaultValues: {
      accountCreation: {},
      basicDetails: {},
      educationDetails: {},
      bankDetails: {},
    },
  });

  const CurrentStepComponent = stepComponents[activeStep];

  const handleNext = async () => {
    const isStepValid = await methods.trigger();

    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data) => {
  console.log("✅ Final Submission Data:", data);

  try {
    const response = await fetch("/api/users/singup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to save user data");
    }

    const result = await response.json();
    alert("Form submitted and saved successfully!");
    console.log("Saved data response:", result);
  } catch (error) {
    alert("Error submitting form: " + error.message);
  }
};

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-xl"
      >
        <Stepper steps={steps} activeStep={activeStep} />

        <div className="mt-8">
          <CurrentStepComponent />
        </div>

        <div className="mt-8 flex justify-between">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 text-black font-medium px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Back
            </button>
          )}

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default EmployeeForm;
