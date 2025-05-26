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

    if (!isStepValid) return;

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = (data) => {
    console.log("✅ Final Submission Data:", data);
    alert("Form submitted! Check console.");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto p-4 max-w-4xl bg-white shadow-md rounded-lg">
        <Stepper steps={steps} activeStep={activeStep} />

        <div className="mt-6">
          <CurrentStepComponent />
        </div>

        <div className="mt-6 flex justify-between">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 text-black font-bold py-2 px-6 rounded-lg"
            >
              Back
            </button>
          )}

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="text-white bg-blue-500 rounded-lg font-bold px-6 py-2"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="text-white bg-green-500 rounded-lg font-bold px-6 py-2"
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
