import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followUser: null,
  unfollowUser: null,
};

const userSocialSlice = createSlice({
  name: "userSocial",
  initialState: initialState,
  reducers: {
    followUser: (state, action) => {
      state.followUser = action.payload;
    },
    unfollowUser: (state, action) => {
      state.unfollowUser = action.payload;
    },
    clearUserSocial: () => initialState,
  },
});

export const { followUser, unfollowUser, clearUserSocial } =
  userSocialSlice.actions;
export default userSocialSlice.reducer;
