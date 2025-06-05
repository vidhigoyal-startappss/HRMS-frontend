// src/api/auth.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // Change to backend URL in production
});

// ✅ Add auth token to each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 🔐 Signup
export const signup = async (data) => {
  try {
    const response = await API.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

// 🔐 Login
export const login = async (data) => {
  try {
    const response = await API.post("/auth/login", data);

    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }

    console.log("Login Response:", response.data); // 👀 You should see token here
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// 🔐 Create employee (protected route)
export const employeeCreate = async (data) => {
  try {
    const response = await API.post("/employee/create", data);
    return response.data;
  } catch (error) {
    console.error("Employee Create Error:", error.response?.data || error.message);
    throw error;
  }
};
