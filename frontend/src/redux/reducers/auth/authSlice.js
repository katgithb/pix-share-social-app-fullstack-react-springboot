import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    signup: null,
    signin: null,
    isAuthenticated: false,
    isLoading: false, // Add a loading property to the initial state
  },
  reducers: {
    signInPending: (state) => {
      state.isLoading = true;
    },
    signIn: (state, action) => {
      state.signin = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    signUpPending: (state) => {
      state.isLoading = true;
    },
    signUp: (state, action) => {
      state.signup = action.payload;
      state.isLoading = false;
    },
    signOut: (state) => {
      state.signup = null;
      state.signin = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    authFailure: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // Additional extra reducers if needed
  },
});

export const {
  signInPending,
  signIn,
  signUpPending,
  signUp,
  signOut,
  authFailure,
} = authSlice.actions;
export default authSlice.reducer;
