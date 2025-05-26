import React from "react";
import { Stepper as FormStepper, Step } from "react-form-stepper";
import { StepperProps, StyleConfig } from "./StepperInterface";

const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  children,
  styleConfig,
}) => {
  const defaultStyle: StyleConfig = {
    activeBgColor: "#124Afc",
    completedBgColor: "#000",
  };

  const mergedStyle = {
    ...defaultStyle,
    ...styleConfig,
  };
  return (
    <div>
      <FormStepper activeStep={activeStep} styleConfig={mergedStyle}>
        {steps.map((label, index) => (
          <Step key={index} label={label} />
        ))}
      </FormStepper>

      <div className="mt-6">
        {Array.isArray(children) ? children[activeStep] : children}
      </div>
    </div>
  );
};

export default Stepper;
