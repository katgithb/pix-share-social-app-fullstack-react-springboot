import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  findByUsername: null,
  findUsersByIds: [],
  popularUsers: [],
  searchUsers: [],
};

const userLookupSlice = createSlice({
  name: "userLookup",
  initialState: initialState,
  reducers: {
    findUserByUserName: (state, action) => {
      state.findByUsername = action.payload;
    },
    findUsersByUserIds: (state, action) => {
      state.findUsersByIds = action.payload;
    },
    searchUsers: (state, action) => {
      state.searchUsers = action.payload;
    },
    fetchPopularUsers: (state, action) => {
      state.popularUsers = action.payload;
    },
    clearUserLookup: () => initialState,
  },
});

export const {
  findUserByUserName,
  findUsersByUserIds,
  searchUsers,
  fetchPopularUsers,
  clearUserLookup,
} = userLookupSlice.actions;
export default userLookupSlice.reducer;
