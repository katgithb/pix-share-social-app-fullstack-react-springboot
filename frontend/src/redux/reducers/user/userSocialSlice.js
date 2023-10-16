import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followUser: null,
  unfollowUser: null,
  isLoading: false,
};

const loadingReducers = {
  followUserPending: (state) => {
    state.isLoading = true;
  },
  unfollowUserPending: (state) => {
    state.isLoading = true;
  },
};

const userSocialSlice = createSlice({
  name: "userSocial",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    followUser: (state, action) => {
      state.followUser = action.payload;
      state.isLoading = false;
    },
    unfollowUser: (state, action) => {
      state.unfollowUser = action.payload;
      state.isLoading = false;
    },
    userSocialFailure: (state) => {
      state.isLoading = false;
    },
    clearUserSocial: () => initialState,
  },
});

export const {
  followUserPending,
  unfollowUserPending,
  followUser,
  unfollowUser,
  userSocialFailure,
  clearUserSocial,
} = userSocialSlice.actions;
export default userSocialSlice.reducer;
