import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "SuperAdmin" | "Admin" | "Employee" | "HR" | "Manager";

export interface UserState {
  id?: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
  profileImage?: string;
}

interface UserSliceState {
  user: UserState | null;
}

const initialState: UserSliceState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserState>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    updateProfile(state, action: PayloadAction<Partial<UserState>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;
