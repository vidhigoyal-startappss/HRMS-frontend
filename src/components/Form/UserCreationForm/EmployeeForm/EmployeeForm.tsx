import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import UserAccountCreationForm from "../AccountCreationStep/AccountCreation";
import BasicDetailsForm from "../BasicDetails/BasicDetail";
import EducationDetailsForm from "../EducationDetails/EducationDetail";
import BankDetailsForm from "../BankDetailStep/BankDetail";
import Stepper from "../../../Stepper/Stepper";

// API Call
import { employeeCreate } from "../../../../api/auth";

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

// Match this with the full DTO schema expected by backend
type FormValues = {
  email: string;
  password: string;
  role: string;
  accountCreation: {
    firstName: string;
    lastName: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    joiningDate?: string;
    designation?: string;
    department?: string;
    employmentType?: string;
  };
  educationDetails: {
    qualification: string;
    institution: string;
    yearOfPassing: string;
    grade: string;
  };
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    aadharNumber: string;
    panNumber: string;
  };
};

const EmployeeForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      accountCreation: {
        firstName: "",
        lastName: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        joiningDate: "",
        designation: "",
        department: "",
        employmentType: "",
      },
      educationDetails: {
        qualification: "",
        institution: "",
        yearOfPassing: "",
        grade: "",
      },
      bankDetails: {
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        branchName: "",
        accountHolderName: "",
        aadharNumber: "",
        panNumber: "",
      },
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

  const onSubmit = async (data: FormValues) => {
  console.log("✅ Final Submission Data (raw):", data);

  const payload = {
    email: data.email,
    password: data.password,
    role: data.role,
    accountCreationDetails: data.accountCreation,
    educationDetails: data.educationDetails,
    bankDetails: data.bankDetails,
  };

  console.log("📦 Payload to be sent:", payload);

  try {
    const response = await employeeCreate(payload);
    alert("🎉 Employee data saved successfully!");
    console.log("✅ Server Response:", response.data);
  } catch (error: any) {
    alert("❌ Error submitting form: " + error.message);
    console.error("❌ Error details:", error);
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
