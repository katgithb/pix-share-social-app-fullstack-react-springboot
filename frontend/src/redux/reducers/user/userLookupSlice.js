import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  findByUsername: null,
  findUsersByIds: [],
  findSavedPostsByUserId: {},
  searchUsers: {},
  popularUsers: [],
  isSearchUsersLoading: false,
  isLoading: false,
};

const loadingReducers = {
  findUserByUserNamePending: (state) => {
    state.isLoading = true;
  },
  findUsersByUserIdsPending: (state) => {
    state.isLoading = true;
  },
  findSavedPostsByUserIdPending: (state) => {
    state.isLoading = true;
  },
  searchUsersPending: (state) => {
    state.isSearchUsersLoading = true;
  },
  fetchPopularUsersPending: (state) => {
    state.isLoading = true;
  },
};

const userLookupSlice = createSlice({
  name: "userLookup",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    findUserByUserName: (state, action) => {
      state.findByUsername = action.payload;
      state.isLoading = false;
    },
    findUsersByUserIds: (state, action) => {
      state.findUsersByIds = action.payload;
      state.isLoading = false;
    },
    findSavedPostsByUserId: (state, action) => {
      state.findSavedPostsByUserId = action.payload;
      state.isLoading = false;
    },
    searchUsers: (state, action) => {
      state.searchUsers = action.payload;
      state.isSearchUsersLoading = false;
    },
    fetchPopularUsers: (state, action) => {
      state.popularUsers = action.payload;
      state.isLoading = false;
    },
    clearFindUserByUserName: (state) => {
      state.findByUsername = null;
    },
    clearSearchUsers: (state) => {
      state.searchUsers = {};
    },
    searchUsersFailure: (state) => {
      state.isSearchUsersLoading = false;
    },
    userLookupFailure: (state) => {
      state.isLoading = false;
    },
    clearUserLookup: () => initialState,
  },
});

export const {
  findUserByUserNamePending,
  findUsersByUserIdsPending,
  findSavedPostsByUserIdPending,
  searchUsersPending,
  fetchPopularUsersPending,
  findUserByUserName,
  findUsersByUserIds,
  findSavedPostsByUserId,
  searchUsers,
  fetchPopularUsers,
  clearFindUserByUserName,
  clearSearchUsers,
  searchUsersFailure,
  userLookupFailure,
  clearUserLookup,
} = userLookupSlice.actions;
export default userLookupSlice.reducer;
