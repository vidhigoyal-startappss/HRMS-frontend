import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LeaveSummary {
  paidUsed: number;
  unpaidUsed: number;
  paidLeft: number;
  wfhLeft: number;
  totalPaidYearly: number;
  totalWfhYearly: number;
  totalPaidMonthly: number;
  totalWfhMonthly: number;
  monthlyApplied: number;
  approvedCount: number;
  pendingCount: number;
  earnedLeavesTillNow: number;
}

interface LeaveState {
  leaveSummary: LeaveSummary;
}

const initialState: LeaveState = {
  leaveSummary: {
    paidUsed: 0,
    unpaidUsed: 0,
    paidLeft: 0,
    wfhLeft: 0,
    totalPaidYearly: 0,
    totalWfhYearly: 0,
    totalPaidMonthly: 0,
    totalWfhMonthly: 0,
    monthlyApplied: 0,
    approvedCount: 0,
    pendingCount: 0,
    earnedLeavesTillNow: 0,
  },
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    setLeaveSummary: (state, action: PayloadAction<LeaveSummary>) => {
      state.leaveSummary = action.payload;
    },
  },
});

export const { setLeaveSummary } = leaveSlice.actions;
export default leaveSlice.reducer;
