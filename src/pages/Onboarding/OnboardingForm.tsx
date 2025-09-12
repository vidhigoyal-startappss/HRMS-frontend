import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import Stepper from "../../components/Stepper/Stepper";
import BasicDetailsStep from "./steps/BasicDetailsStep";
import EducationDetailsStep from "./steps/EducationDetailsStep";
import BankDetailsStep from "./steps/BankDetailsStep";
import { submitOnboardingForm, getFormByToken } from "../../api/onboarding";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const steps = ["Basic Details", "Education Details", "Bank Details"];
const stepComponents = [
  BasicDetailsStep,
  EducationDetailsStep,
  BankDetailsStep,
];

const OnboardingForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const methods = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
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
      navigate("/form-success");
    } catch (error) {
      toast.error("Submission failed.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto p-6"
      >
        <Stepper
          steps={steps}
          activeStep={currentStep}
          styleConfig={{
            activeBgColor: "#226597",
            completedBgColor: "#000",
          }}
        >
          {stepComponents.map((Component, idx) => (
            <Component key={idx} />
          ))}
        </Stepper>

        <div className="mt-10 flex justify-between items-center">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition duration-200"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-200"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition duration-200"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default OnboardingForm;
