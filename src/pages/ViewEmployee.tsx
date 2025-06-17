import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import Stepper from "../components/Stepper/Stepper";

// import UserAccountCreationForm from "../components/Form/UserCreationForm/AccountCreationStep/AccountCreation";
import BasicDetailsForm from "../components/Form/UserCreationForm/BasicDetails/BasicDetail";
import EducationDetailsForm from "../components/Form/UserCreationForm/EducationDetails/EducationDetail";
import BankDetailsForm from "../components/Form/UserCreationForm/BankDetailStep/BankDetail";

import { getEmployeeById } from "../api/auth"; // ✅ create this API

const steps = [
  // "Account Creation",
  "Basic Details",
  "Educational Details",
  "Bank Details",
];

const stepComponents = [
  // UserAccountCreationForm,
  BasicDetailsForm,
  EducationDetailsForm,
  BankDetailsForm,
];

const ViewEmployee = () => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const methods = useForm({ mode: "onTouched" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employee = await getEmployeeById(id);

        // Clean the object to remove _id, __v, timestamps
        const cleanedEmployee = {
          // account: {
          //   email: employee.account.email,
          //   role: employee.account.role,
          // },
          basicDetails: {
            firstName: employee.basicDetails.firstName,
            lastName: employee.basicDetails.lastName,
            gender: employee.basicDetails.gender,
            phoneNumber: employee.basicDetails.phoneNumber,
            dob: employee.basicDetails.dob,
            address: employee.basicDetails.address,
            city: employee.basicDetails.city,
            state: employee.basicDetails.state,
            zipcode: employee.basicDetails.zipcode,
            country: employee.basicDetails.country,
            joiningDate: employee.basicDetails.joiningDate,
            designation: employee.basicDetails.designation,
            department: employee.basicDetails.department,
            employmentType: employee.basicDetails.employmentType,
          },
          educationDetails: {
            highestQualification:
              employee.educationDetails.highestQualification,
            university: employee.educationDetails.university,
            yearOfPassing: employee.educationDetails.yearOfPassing,
            grade: employee.educationDetails.grade,
          },
          bankDetails: {
            accountHolderName: employee.bankDetails.accountHolderName,
            accountNumber: employee.bankDetails.accountNumber,
            ifscCode: employee.bankDetails.ifscCode,
            bankName: employee.bankDetails.bankName,
            branchName: employee.bankDetails.branchName,
            panNumber: employee.bankDetails.panNumber,
            aadharNumber: employee.bankDetails.aadharNumber,
          },
        };

        methods.reset(cleanedEmployee); // ✅ clean data passed here
      } catch (error) {
        console.error("Failed to fetch employee:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <p className="text-center p-10">Loading...</p>;

  const CurrentStepComponent = stepComponents[activeStep];

  return (
    <FormProvider {...methods}>
      <div className="mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-xl">
        <Stepper steps={steps} activeStep={activeStep} />

        <div className="mt-8">
          {/* 👇 Pass readOnly={true} to disable inputs */}
          <CurrentStepComponent readOnly={true} />
        </div>

        <div className="mt-8 flex justify-between">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => prev - 1)}
              className="bg-gray-300 px-6 py-2 rounded-lg"
            >
              Back
            </button>
          )}
          {activeStep < steps.length - 1 && (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => prev + 1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default ViewEmployee;
