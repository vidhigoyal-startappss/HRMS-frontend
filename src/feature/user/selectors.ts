import { RootState } from "../../store/store";

export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectCurrentRole = (state: RootState) => state.user.user?.role;
