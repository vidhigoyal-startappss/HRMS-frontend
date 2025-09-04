import React from "react";
import { useFormContext } from "react-hook-form";

const BasicDetailsStep: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div>
      <input {...register("basicDetails.firstName")} placeholder="First Name" />
      <input {...register("basicDetails.lastName")} placeholder="Last Name" />
      <input {...register("basicDetails.phone")} placeholder="Phone" />
       </div>
  );
};

export default BasicDetailsStep;