import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { UserPlus,LayoutDashboard } from "lucide-react"
// import UserAccountCreationForm from "../AccountCreationStep/AccountCreation";
import BasicDetailsForm from "../BasicDetails/BasicDetail";
import EducationDetailsForm from "../EducationDetails/EducationDetail";
import BankDetailsForm from "../BankDetailStep/BankDetail";
import Stepper from "../../../Stepper/Stepper";

// API
import { updateUserDetail } from "../../../../api/auth";
import { useParams } from "react-router-dom";

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

type leaves ={
      paidAllowed?:number;
      wfhAllowed?:number;
}
type FormValues = {
  // account: {
  //   email: string;
  //   password: string;
  //   role: "admin" | "hr" | "employee";
  // };
  basicDetails: {
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
    joiningDate: string;
    designation: string;
    department: string;
    employmentType: string;
    leaves:leaves;
  };
  educationDetails: {
    qualification: string;
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
    adharNumber: string;
    panNumber: string;
  };
};

const EmployeeForm = () => {
  const userId = useParams<{ userId: string }>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm<FormValues>({ mode: "onTouched",
  defaultValues: {
    basicDetails: {
      leaves: {
        paidAllowed: 1.5,
        wfhAllowed: 1,
      }
    }}
 });

  const CurrentStepComponent = stepComponents[activeStep];

  const handleNext = async () => {
    const isStepValid = await methods.trigger();
    if (isStepValid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormValues) => {
    // console.log("Final Payload:", data);
    try {
      // console.log(typeof userId);
      const keys = Object.keys(userId);
      const firstKey = keys[0];
      const firstValue = userId[firstKey];
      console.log(data);
      const res = await updateUserDetail(firstValue, data);
      setIsSubmitted(true);
      // console.log("Response:", res);
    } catch (error: any) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert(
        "Failed to submit: " + (error.response?.data?.message || error.message)
      );
    }
  };
  // console.log(userId);

  return (
    <FormProvider {...methods}>
      {isSubmitted ? (
        <div className="flex flex-col items-center bg-[#113F67] justify-center rounded-lg p-20 m-20 text-center mt-20 animate-fade-in ">
          {/* <h1 className="text-3xl font-bold text-white">Thank You</h1> */}
          <h2 className="text-2xl font-semibold text-white mb-2">
            Employee Created Successfully
          </h2>
          <p className="text-white mb-8">
            Your new employee has been added. You can now manage them from the
            dashboard or add another.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => window.location.href="/employee-management"}
              className="bg-[#226597] text-white flex gap-2 px-6 py-2 rounded-lg cursor-pointer hover:bg-[#87C0CD] transition shadow-sm w-full sm:w-auto"
            >
             <UserPlus size={18}/> <p>Add User</p> 
            </button>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-[#226597] text-white flex gap-2 px-6 py-2 rounded-lg cursor-pointer hover:bg-[#87C0CD] transition shadow-sm w-full sm:w-auto"
            >
              <LayoutDashboard size={18}/> <p>Dashboard</p> 
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="mx-auto p-6 max-w-4xl bg-white  rounded-xl"
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
                className="bg-#226597 text-white font-medium px-6 py-2 rounded-lg hover:bg-[#1c4c7a] transition"
              >
                Back
              </button>
            )}

            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#226597] text-white font-medium px-6 py-2 cursor-pointer rounded-lg hover:bg-[#1c4c7a] transition"
              >
                <div className="flex justify-center gap-2">
                  Next
                </div>
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#226597] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#1c4c7a] transition"
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
