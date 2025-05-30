import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001", // or your backend hosted URL
});

// Signup
export const signup = async (data) => {
  return await API.post("/api/auth/signup", data); // adjust path if needed
};

// Login
export const login = async (data) => {
  return await API.post("/api/auth/login", data);
};
