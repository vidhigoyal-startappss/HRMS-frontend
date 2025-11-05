import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = "Super/Admin" | "Admin" | "Employee" | "HR" | "Manager";

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

      localStorage.setItem("user", JSON.stringify(action.payload));

      const loggedInUsers: UserState[] = JSON.parse(
        sessionStorage.getItem("loggedInUsers") || "[]"
      );
      if (!loggedInUsers.find((u) => u.email === action.payload.email)) {
        loggedInUsers.push(action.payload);
        sessionStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers));
      }
    },

    logout(state) {
      if (!state.user) return;

      const loggedInUsers: UserState[] = JSON.parse(
        sessionStorage.getItem("loggedInUsers") || "[]"
      );
      const filteredUsers = loggedInUsers.filter(
        (u) => u.email !== state.user?.email
      );
      sessionStorage.setItem("loggedInUsers", JSON.stringify(filteredUsers));

      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    updateProfile(state, action: PayloadAction<Partial<UserState>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { login, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;
