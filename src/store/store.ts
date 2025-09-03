import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/user/userSlice";
import navigateReducer from "../feature/navigation/navigationSlice"
import leaveReducer from '../feature/leave/leaveSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    navigation: navigateReducer,
    leave: leaveReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

