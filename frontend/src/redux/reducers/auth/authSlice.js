import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    signup: null,
    signin: null,
    isAuthenticated: false,
  },
  reducers: {
    signIn: (state, action) => {
      state.signin = action.payload.token;
      state.isAuthenticated = true;
    },
    signUp: (state, action) => {
      state.signup = action.payload;
    },
    signOut: (state) => {
      state.signup = null;
      state.signin = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Additional extra reducers if needed
  },
});

export const { signIn, signUp, signOut } = authSlice.actions;
export default authSlice.reducer;
