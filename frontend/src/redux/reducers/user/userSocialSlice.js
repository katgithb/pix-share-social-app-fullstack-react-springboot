import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followedUsers: {},
  unfollowedUsers: {},
  isFollowedLoading: {},
};

const loadingReducers = {
  followUserPending: (state, action) => {
    const userId = action.payload;
    state.isFollowedLoading[userId] = true;
  },
  unfollowUserPending: (state, action) => {
    const userId = action.payload;
    state.isFollowedLoading[userId] = true;
  },
};

const userSocialSlice = createSlice({
  name: "userSocial",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    followUser: (state, action) => {
      const userId = action.payload;
      state.followedUsers[userId] = true;
      delete state.unfollowedUsers[userId];
      state.isFollowedLoading[userId] = false;
    },
    unfollowUser: (state, action) => {
      const userId = action.payload;
      state.unfollowedUsers[userId] = true;
      delete state.followedUsers[userId];
      state.isFollowedLoading[userId] = false;
    },
    clearFollowedUser: (state, action) => {
      const userId = action.payload;
      delete state.followedUsers[userId];
      delete state.isFollowedLoading[userId];
    },
    clearUnfollowedUser: (state, action) => {
      const userId = action.payload;
      delete state.unfollowedUsers[userId];
      delete state.isFollowedLoading[userId];
    },
    followUserFailure: (state, action) => {
      const userId = action.payload;
      state.isFollowedLoading[userId] = false;
    },
    unfollowUserFailure: (state, action) => {
      const userId = action.payload;
      state.isFollowedLoading[userId] = false;
    },
    clearUserSocial: () => initialState,
  },
});

export const {
  followUserPending,
  unfollowUserPending,
  followUser,
  unfollowUser,
  clearFollowedUser,
  clearUnfollowedUser,
  followUserFailure,
  unfollowUserFailure,
  clearUserSocial,
} = userSocialSlice.actions;
export default userSocialSlice.reducer;
