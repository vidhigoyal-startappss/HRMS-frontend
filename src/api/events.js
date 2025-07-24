import axios from "axios";

// Create a centralized axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

// Attach token from localStorage if available
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

// Global error handler
const handleError = (label, err) => {
  const message =
    err?.response?.data?.message || err.message || "Unknown error";
  console.error(`${label} Error:`, message);
};

// Get today's birthday or anniversary events (type: 'birthday' | 'anniversary')
export const getTodayEventsByType = async (type) => {
  try {
    console.log("Calling:", `/api/events/today`, "with type:", type);
    const res = await API.post("/api/events/today", { type });
    return res.data;
  } catch (err) {
    handleError("Get Today's Events by Type", err);
    throw err;
  }
};

export const getAllEvents = async () => {
  try {
    const res = await API.get("/api/events");
    return res.data;
  } catch (err) {
    handleError("Fetch All Events", err);
    throw err;
  }
};


export const createEvent = async (eventData) => {
  try {
    const res = await API.post("/api/events", eventData);
    return res.data;
  } catch (err) {
    handleError("Create Event", err);
    throw err;
  }
};
