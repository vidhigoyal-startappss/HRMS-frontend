import axios from "axios";
import { User } from "lucide-react";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

export const Me = async () => {
  try {
    const res = await API.get("/api/users/me");
    return res;
  } catch (err) {
    console.error("Invalid token, Logging out", err);
  }
};

export const signup = async (data) => {
  try {
    const response = await API.post("/api/users/register", data);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await API.post("/api/users/login", data);
    const { token, user } = response.data;
    console.log(user)

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("profileImage", user.profileImage);
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUserDetail = async (userId, data) => {
  try {
    const response = await API.post(`/api/users/complete-profile/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("User Details Create Error:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchEmployees = async (showArchived = false) => {
  try {
    const response = await API.get(`/api/users/employees?archived=${showArchived}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Employees Error:", error.response?.data || error.message);
    throw error;
  }
};


export const getEmployeeById = async (id) => {
  try {
    const res = await API.get(`/api/users/employee/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get Employee By ID Error:", error.response?.data || error.message);
    throw error;
  }
};


export const updateEmployee = async (id, data) => {
  try {
    const response = await API.patch(`/api/users/employee/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Employee Error:", error?.response?.data || error.message);
    throw error;
  }
};


export const getProfileImage = async (userId) => {
  try {
    const response = await API.get(`/api/users/profile-image/${userId}`);
    return response.data.imageUrl;
  } catch (error) {
    console.error("Failed to fetch profile image", error);
    return null;
  }
};



export const deleteUser = async (userId) => {
  try {
    const response = await API.delete(`/api/users/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete user", error);
    return null;
  }
};

export default API;
