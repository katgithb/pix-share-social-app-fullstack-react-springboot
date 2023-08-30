import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currUser: null,
  updatedUser: false,
  deletedUser: false,
  isLoading: false,
};

const loadingReducers = {
  fetchUserProfilePending: (state) => {
    state.isLoading = true;
  },
  editUserProfilePending: (state) => {
    state.isLoading = true;
  },
  deleteUserProfilePending: (state) => {
    state.isLoading = true;
  },
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    fetchUserProfile: (state, action) => {
      state.currUser = action.payload;
      state.updatedUser = false;
      state.deletedUser = false;
      state.isLoading = false;
    },
    editUserProfile: (state) => {
      state.updatedUser = true;
      state.isLoading = false;
    },
    deleteUserProfile: (state) => {
      state.currUser = null;
      state.updatedUser = false;
      state.deletedUser = true;
      state.isLoading = false;
    },
    userProfileFailure: (state) => {
      state.isLoading = false;
    },
    clearUserProfile: () => initialState,
  },
});

export const {
  fetchUserProfilePending,
  editUserProfilePending,
  deleteUserProfilePending,
  fetchUserProfile,
  editUserProfile,
  deleteUserProfile,
  userProfileFailure,
  clearUserProfile,
} = userProfileSlice.actions;
export default userProfileSlice.reducer;
