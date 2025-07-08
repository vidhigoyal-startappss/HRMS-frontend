import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:3000/api",
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

// 1. Check-In Attendance
export const checkIn = async (location) => {
  try {
    const res = await API.post("/attendance/check-in", { location });
    return res.data;
  } catch (err) {
    console.error("Check-In Error:", err.response?.data || err.message);
    throw err;
  }
};

// 2. Check-Out Attendance
export const checkOut = async () => {
  try {
    const res = await API.put("/attendance/check-out");
    return res.data;
  } catch (err) {
    console.error("Check-Out Error:", err.response?.data || err.message);
    throw err;
  }
};

// 3. Get My Attendance History
export const getMyAttendance = async () => {
  try {
    const res = await API.get("/attendance/my");
    return res.data;
  } catch (err) {
    console.error("My Attendance Error:", err.response?.data || err.message);
    throw err;
  }
};

// 4. Get All Attendance (Admin/HR)
export const getAllAttendance = async () => {
  try {
    const res = await API.get("/attendance/all");
    return res.data;
  } catch (err) {
    console.error("All Attendance Error:", err.response?.data || err.message);
    throw err;
  }
};

// 5. Get Attendance by User ID
export const getAttendanceByUser = async (userId) => {
  try {
    const res = await API.get(`/attendance/${userId}`);
    return res.data;
  } catch (err) {
    console.error("User Attendance Error:", err.response?.data || err.message);
    throw err;
  }
};

// 6. Get Attendance Stats (weekly/monthly)
export const getAttendanceStats = async () => {
  try {
    const res = await API.get("/attendance/stats");
    return res.data;
  } catch (err) {
    console.error("Stats Error:", err.response?.data || err.message);
    throw err;
  }
};

// 7. Bulk Upload (Admin/Superadmin)
export const bulkUploadAttendance = async (formData) => {
  try {
    const res = await API.post("/attendance/bulk-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Bulk Upload Error:", err.response?.data || err.message);
    throw err;
  }
};

// 8. Delete an Attendance Record
export const deleteAttendance = async (id) => {
  try {
    const res = await API.delete(`/attendance/${id}`);
    return res.data;
  } catch (err) {
    console.error("Delete Attendance Error:", err.response?.data || err.message);
    throw err;
  }
};

// 9. Update Attendance (PUT by ID)
export const updateAttendance = async (id, data) => {
  try {
    const res = await API.put(`/attendance/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Update Error:", err.response?.data || err.message);
    throw err;
  }
};

// 10 Get Today's Summary (for Admin Dashboard)
export const getTodayAttendance = async () => {
  try {
    const res = await API.get("/attendance/today");
    return res.data;
  } catch (err) {
    console.error("Today's Attendance Error:", err.response?.data || err.message);
    throw err;
  }
};
