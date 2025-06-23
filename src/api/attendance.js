// src/api/attendance.js
import axios from "axios";

// ✅ Axios instance
const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// ✅ Token Interceptor
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

// ✅ 1. MARK ATTENDANCE
export const markAttendance = async ({ status = "Present", date, time, latitude, longitude }) => {
  try {
    console.log("📍 Sending Location:", latitude, longitude); // ✅ Add this
    const response = await API.post("/attendance/mark", {
      status,
      date,
      time,
      latitude,
      longitude,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Mark Attendance Error:", error.response?.data || error.message);
    throw error;
  }
};

// 93, Heera Bagh, Scheme No 78 - III, near Dewas Naka, Bapu Gandhi Nagar, Indore, Madhya Pradesh 452010

// ✅ 2. GET ALL ATTENDANCE (Admin/HR Only)
export const getAllAttendance = async () => {
  try {
    const response = await API.get("/attendance/all");
    return response.data;
  } catch (error) {
    console.error("❌ Get All Attendance Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 3. GET MY ATTENDANCE (Employee)
export const getMyAttendance = async () => {
  try {
    const response = await API.get("/attendance/my");  // ✅ Only current user's data
    return response.data;
  } catch (error) {
    console.error("❌ Get My Attendance Error:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ 4. GET TODAY'S ATTENDANCE (Optional: For Dashboard Auto Check)
export const getTodayAttendance = async () => {
  try {
    const response = await API.get("/attendance/today");
    return response.data;
  } catch (error) {
    console.error("❌ Get Today's Attendance Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 5. UPDATE ATTENDANCE BY ID (Admin/HR Only)
export const updateAttendance = async (attendanceId, data) => {
  try {
    const response = await API.put(`/attendance/${attendanceId}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Update Attendance Error:", error.response?.data || error.message);
    throw error;
  }
};
