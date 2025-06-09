// src/pages/UpdateEmployee.tsx
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

import UserAccountCreationForm from "../components/Form/UserCreationForm/AccountCreationStep/AccountCreation";
import BasicDetailsForm from "../components/Form/UserCreationForm/BasicDetails/BasicDetail";
import EducationDetailsForm from "../components/Form/UserCreationForm/EducationDetails/EducationDetail";
import BankDetailsForm from "../components/Form/UserCreationForm/BankDetailStep/BankDetail";
import Stepper from "../components/Stepper/Stepper";

import { getEmployeeById, updateEmployee } from "../api/auth";

const steps = ["Account Creation", "Basic Details", "Educational Details", "Bank Details"];
const stepComponents = [
  UserAccountCreationForm,
  BasicDetailsForm,
  EducationDetailsForm,
  BankDetailsForm,
];

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const methods = useForm({ mode: "onTouched" });
  const [activeStep, setActiveStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const CurrentStepComponent = stepComponents[activeStep];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employee = await getEmployeeById(id);
        methods.reset(employee);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load employee:", error);
        alert("Failed to load employee data");
      }
    };
    fetchData();
  }, [id, methods]);

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    try {
      await updateEmployee(id, data);
      alert("Employee updated successfully!");
      navigate("/admin/employee-management");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update employee");
    }
  };

  if (!isLoaded) return <div className="text-center p-10">Loading...</div>;

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
              className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Back
            </button>
          )}

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Update
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default UpdateEmployee;
