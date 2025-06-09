// src/api/auth.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = async (data) => {
  try {
    const response = await API.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await API.post("/auth/login", data);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

export const employeeCreate = async (data) => {
  try {
    const response = await API.post("/employee/create", data);
    return response.data;
  } catch (error) {
    console.error("Employee Create Error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await API.get("/employee");
    return response.data;
  } catch (error) {
    console.error("Fetch Employees Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getEmployeeById = async (id) => {
  try {
    const res = await API.get(`/employee/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get Employee By ID Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await API.patch(`/employee/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Employee Error:", error.response?.data || error.message);
    throw error;
  }
};
