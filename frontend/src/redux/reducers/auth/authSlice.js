import { createSlice } from "@reduxjs/toolkit";
import { SIGN_IN, SIGN_OUT, SIGN_UP } from "../../actions/auth/authActionTypes";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    signup: null,
    signin: null,
    isAuthenticated: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(SIGN_IN, (state, action) => {
        state.signin = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(SIGN_UP, (state, action) => {
        state.signup = action.payload;
      })
      .addCase(SIGN_OUT, (state) => {
        state.signup = null;
        state.signin = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
