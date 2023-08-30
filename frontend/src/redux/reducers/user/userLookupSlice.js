import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  findByUsername: null,
  findUsersByIds: [],
  popularUsers: [],
  searchUsers: [],
  isLoading: false,
};

const loadingReducers = {
  findUserByUserNamePending: (state) => {
    state.isLoading = true;
  },
  findUsersByUserIdsPending: (state) => {
    state.isLoading = true;
  },
  searchUsersPending: (state) => {
    state.isLoading = true;
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
    searchUsers: (state, action) => {
      state.searchUsers = action.payload;
      state.isLoading = false;
    },
    fetchPopularUsers: (state, action) => {
      state.popularUsers = action.payload;
      state.isLoading = false;
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
  searchUsersPending,
  fetchPopularUsersPending,
  findUserByUserName,
  findUsersByUserIds,
  searchUsers,
  fetchPopularUsers,
  userLookupFailure,
  clearUserLookup,
} = userLookupSlice.actions;
export default userLookupSlice.reducer;
