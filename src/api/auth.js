import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // or your backend hosted URL
});

// Signup
export const signup = async (data) => {
  return await API.post("/auth/signup", data); // adjust path if needed
};

// Login
export const login = async (data) => {
  return await API.post("/auth/login", data);
};

// Employee creation API
export const employeeCreate = (data) => {
  return axios.post("/employees/create", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};