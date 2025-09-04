import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import Stepper from "../../components/Stepper/Stepper";
import BasicDetailsStep from "./steps/BasicDetailsStep";
import EducationDetailsStep from "./steps/EducationDetailsStep";
import BankDetailsStep from "./steps/BankDetailsStep";
import { sendOnboardingForm, getFormByToken } from "../../api/onboarding";
import { toast } from "react-toastify";

const steps = ["Basic Details", "Education Details", "Bank Details"];
const stepComponents = [BasicDetailsStep, EducationDetailsStep, BankDetailsStep];

const OnboardingForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const methods = useForm();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const form = await getFormByToken(token!);
        if (form.isSubmitted) {
          toast.error("Form already submitted.");
        }
      } catch (error) {
        toast.error("Invalid or expired form link.");
      }
    };
    fetchData();
  }, [token]);

  const onSubmit = async (data: any) => {
    try {
      await submitOnboardingForm(token!, data);
      toast.success("Form submitted!");
    } catch (error) {
      toast.error("Submission failed.");
    }
  };

  const CurrentComponent = stepComponents[currentStep];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stepper
           steps={steps}
           activeStep={currentStep}
           styleConfig={{
             activeBgColor: "#226597",
             completedBgColor: "#000"
           }}
>
  {stepComponents.map((Component, idx) => (
    <Component key={idx} />
  ))}
</Stepper>
       
        <div style={{ marginTop: 20 }}>
          {currentStep > 0 && (
            <button type="button" onClick={() => setCurrentStep((s) => s - 1)}>
              Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={() => setCurrentStep((s) => s + 1)}>
              Next
            </button>
          ) : (
            <button type="submit">Submit</button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default OnboardingForm;
