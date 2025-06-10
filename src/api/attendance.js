// src/api/attendance.js
import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: "http://localhost:3000",
});

// Add token from localStorage if available
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

// ✅ Mark Attendance
export const markAttendance = async (data) => {
  try {
    const response = await API.post("/attendance/mark", data);
    return response.data;
  } catch (error) {
    console.error("Mark Attendance Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get Attendance (Super Admin, HR, Employee)
export const getAllAttendance = async () => {
  try {
    // Admin/super-admin does not require userId

    const response = await API.get("/attendance/all");
    return response.data;
  } catch (error) {
    console.error("Get Attendance Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Update attendance by ID
export const updateAttendance = async (attendanceId, data) => {
  try {
    const response = await API.put(`/attendance/${attendanceId}`, data);
    return response.data;
  } catch (error) {
    console.error("Update Attendance Error:", error.response?.data || error.message);
    throw error;
  }
};
