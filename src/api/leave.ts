import API from "./auth";

// Interface for the leave request
interface LeaveRequest {
  leaveType: string;
  dayType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface LeaveEntry {
  employeeName: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  dayType: string;
  status: "Approved" | "Rejected" | "Pending";
  userId: User;
}

export const applyLeave = async (data: LeaveRequest) => {
  const response = await API.post("/api/leaves/apply", data);
  return response.data;
};

export const getLeaves = async () => {
  const response = await API.get("/api/leaves");
  return response.data;
};
export const updateStatus = async (id, status: string) => {
  const response = await API.patch(`/api/leaves/status/${id}`, { status });
  return response.data;
};
