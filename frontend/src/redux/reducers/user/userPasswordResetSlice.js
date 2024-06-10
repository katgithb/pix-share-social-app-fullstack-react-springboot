import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  passwordResetToken: null,
  isUserPasswordResetInitiated: false,
  isPasswordResetTokenValidated: false,
  isUserPasswordReset: false,
  isInitiatingUserPasswordReset: false,
  isValidatingPasswordResetToken: false,
  isResettingUserPassword: false,
  successMessage: null,
  failureMessage: null,
};

const loadingReducers = {
  initiateUserPasswordResetPending: (state) => {
    state.isInitiatingUserPasswordReset = true;
  },
  validateUserPasswordResetTokenPending: (state) => {
    state.isValidatingPasswordResetToken = true;
  },
  resetUserPasswordPending: (state) => {
    state.isResettingUserPassword = true;
  },
};

const userPasswordResetSlice = createSlice({
  name: "userPasswordReset",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    initiateUserPasswordReset: (state) => {
      state.isUserPasswordResetInitiated = true;
      state.isInitiatingUserPasswordReset = false;
    },
    validateUserPasswordResetToken: (state, action) => {
      state.passwordResetToken = action.payload;
      state.isPasswordResetTokenValidated = true;
      state.isValidatingPasswordResetToken = false;
    },
    resetUserPassword: (state) => {
      state.isUserPasswordReset = true;
      state.isResettingUserPassword = false;
    },
    successMessage: (state, action) => {
      state.successMessage = action.payload;
      state.failureMessage = null;
    },
    failureMessage: (state, action) => {
      state.failureMessage = action.payload;
      state.successMessage = null;
    },
    initiateUserPasswordResetFailure: (state) => {
      state.isInitiatingUserPasswordReset = false;
    },
    validateUserPasswordResetTokenFailure: (state) => {
      state.passwordResetToken = {};
      state.isValidatingPasswordResetToken = false;
    },
    resetUserPasswordFailure: (state) => {
      state.isResettingUserPassword = false;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearFailureMessage: (state) => {
      state.failureMessage = null;
    },
    clearUserPasswordReset: () => initialState,
  },
});

export const {
  initiateUserPasswordResetPending,
  validateUserPasswordResetTokenPending,
  resetUserPasswordPending,
  initiateUserPasswordReset,
  validateUserPasswordResetToken,
  resetUserPassword,
  successMessage,
  failureMessage,
  initiateUserPasswordResetFailure,
  validateUserPasswordResetTokenFailure,
  resetUserPasswordFailure,
  clearSuccessMessage,
  clearFailureMessage,
  clearUserPasswordReset,
} = userPasswordResetSlice.actions;
export default userPasswordResetSlice.reducer;
