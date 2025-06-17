import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

// import UserAccountCreationForm from "../AccountCreationStep/AccountCreation";
import BasicDetailsForm from "../BasicDetails/BasicDetail";
import EducationDetailsForm from "../EducationDetails/EducationDetail";
import BankDetailsForm from "../BankDetailStep/BankDetail";
import Stepper from "../../../Stepper/Stepper";

// API
import { employeeCreate } from "../../../../api/auth";

// Stepper labels
const steps = ["Basic Details", "Educational Details", "Bank Details"];

// Components for each step
const stepComponents = [
  // UserAccountCreationForm,
  BasicDetailsForm,
  EducationDetailsForm,
  BankDetailsForm,
];

// Form type — must match your backend DTO
type FormValues = {
  // account: {
  //   email: string;
  //   password: string;
  //   role: "admin" | "hr" | "employee";
  // };
  basicDetails: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dob: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    joiningDate: string;
    designation: string;
    department: string;
    employmentType: string;
  };
  educationDetails: {
    highestQualification: string;
    university: string;
    yearOfPassing: string;
    grade: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    accountHolderName: string;
    aadharNumber: string;
    panNumber: string;
  };
};

const EmployeeForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm<FormValues>({ mode: "onTouched" });

  const CurrentStepComponent = stepComponents[activeStep];

  const handleNext = async () => {
    const isStepValid = await methods.trigger();
    if (isStepValid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Final Payload:", data);
    try {
      const res = await employeeCreate(data);
      setIsSubmitted(true);
      console.log("Response:", res);
    } catch (error: any) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert(
        "Failed to submit: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <FormProvider {...methods}>
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center p-10 text-center mt-20 animate-fade-in">
          <div className="text-green-600 text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Employee Created Successfully
          </h2>
          <p className="text-gray-600 mb-8">
            Your new employee has been added. You can now manage them from the
            dashboard or add another.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm w-full sm:w-auto"
            >
              ➕ Add Another
            </button>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition shadow-sm w-full sm:w-auto"
            >
              📊 Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
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
      )}
    </FormProvider>
  );
};

export default EmployeeForm;
