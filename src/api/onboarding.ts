import axios from "axios";
import API from "./auth";

export const sendOnboardingForm = (email: string) => {
  return API.post("/api/onboarding/create", { email });
};

export const getFormByToken = (token: string) => {
   return API.get(`/api/onboarding/${token}`).then(res => res.data);
};


export const submitOnboardingForm = (token: string, data: any) => {
 return API.post(`/api/onboarding/${token}/submit`, data); 
};
