import axios from "axios";

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

const handleError = (label, err) => {
  const message =
    err?.response?.data?.message || err.message || "Unknown error";
  console.error(`${label} Error:`, message);
};

export const checkIn = async (location) => {
  try {
    const res = await API.post("/api/attendance/check-in", { location });
    return res.data;
  } catch (err) {
    handleError("Check-In", err);
    throw err;
  }
};

export const checkOut = async () => {
  try {
    const res = await API.put("/api/attendance/check-out");
    return res.data;
  } catch (err) {
    handleError("Check-Out", err);
    throw err;
  }
};

export const getTodayAllAttendance = async () => {
  try {
    const res = await API.get("/api/attendance/today/all");
    return res.data;
  } catch (err) {
    handleError("All Attendance Today", err);
    throw err;
  }
};

export const getMyAttendance = async () => {
  try {
    const res = await API.get("/api/attendance/my");
    return res.data;
  } catch (err) {
    handleError("My Attendance", err);
    throw err;
  }
};

export const getMyTodayAttendance = async () => {
  try {
    const res = await API.get("/api/attendance/my/today");
    return res.data;
  } catch (err) {
    handleError("My Today Attendance", err);
    throw err;
  }
};
