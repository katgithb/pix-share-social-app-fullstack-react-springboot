import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currUser: null,
  updatedUser: false,
  deletedUser: false,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: initialState,
  reducers: {
    fetchUserProfile: (state, action) => {
      state.currUser = action.payload;
      state.updatedUser = false;
      state.deletedUser = false;
    },
    editUserProfile: (state) => {
      state.updatedUser = true;
    },
    deleteUserProfile: (state) => {
      state.currUser = null;
      state.updatedUser = false;
      state.deletedUser = true;
    },
    clearUserProfile: () => initialState,
  },
});

export const {
  fetchUserProfile,
  editUserProfile,
  deleteUserProfile,
  clearUserProfile,
} = userProfileSlice.actions;
export default userProfileSlice.reducer;
