import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "admin" | "employee" | "hr";

export interface UserState {
  id?: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
  profileImage?: string;  // Added profileImage
}

interface UserSliceState {
  user: UserState | null;
}

const initialState: UserSliceState = {
  user: null,
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
