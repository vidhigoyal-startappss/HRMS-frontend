import axios from "axios";

// ✅ Base API Configuration
const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// ✅ Attach token to each request
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

// ✅ Unified Error Handler
const handleError = (label, err) => {
  const message =
    err?.response?.data?.message || err.message || "Unknown error";
  console.error(`${label} Error:`, message);
};

// ✅ 1. Check-In Attendance
export const checkIn = async (location) => {
  try {
    const res = await API.post("/attendance/check-in", { location });
    return res.data;
  } catch (err) {
    handleError("Check-In", err);
    throw err;
  }
};

// ✅ 2. Check-Out Attendance
export const checkOut = async () => {
  try {
    const res = await API.put("/attendance/check-out");
    return res.data;
  } catch (err) {
    handleError("Check-Out", err);
    throw err;
  }
};

// ✅ 3. Get Today's Attendance (for Admin)
export const getTodayAttendance = async () => {
  try {
    const res = await API.get("/attendance/today/all");
    return res.data;
  } catch (err) {
    handleError("Today's Attendance", err);
    throw err;
  }
};

// ✅ 4. Get My Attendance History
export const getMyAttendance = async () => {
  try {
    const res = await API.get("/attendance/my");
    return res.data;
  } catch (err) {
    handleError("My Attendance", err);
    throw err;
  }
};

// ✅ 5. (Optional) Get Today’s Attendance for Logged-in User
export const getMyTodayAttendance = async () => {
  try {
    const res = await API.get("/attendance/my/today");
    return res.data;
  } catch (err) {
    handleError("My Today Attendance", err);
    throw err;
  }
};
