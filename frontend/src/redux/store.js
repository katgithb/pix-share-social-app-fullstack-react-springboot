import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth/authSlice";

const store = configureStore({
  devTools: true,
  reducer: {
    auth: authReducer,
  },
});

export default store;
