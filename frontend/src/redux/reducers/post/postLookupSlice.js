import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  findPostsByUserId: {},
  findById: null,
  findPostsByUserIds: {},
  isLoading: false,
};

const loadingReducers = {
  findPostsByUserIdPending: (state) => {
    state.isLoading = true;
  },
  findByIdPending: (state) => {
    state.isLoading = true;
  },
  findPostsByUserIdsPending: (state) => {
    state.isLoading = true;
  },
};

const postLookupSlice = createSlice({
  name: "postLookup",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    findPostsByUserId: (state, action) => {
      state.findPostsByUserId = action.payload;
      state.isLoading = false;
    },
    findById: (state, action) => {
      state.findById = action.payload;
      state.isLoading = false;
    },
    findPostsByUserIds: (state, action) => {
      state.findPostsByUserIds = action.payload;
      state.isLoading = false;
    },
    postLookupFailure: (state) => {
      state.isLoading = false;
    },
    clearPostLookup: () => initialState,
  },
});

export const {
  findPostsByUserIdPending,
  findByIdPending,
  findPostsByUserIdsPending,
  findPostsByUserId,
  findById,
  findPostsByUserIds,
  postLookupFailure,
  clearPostLookup,
} = postLookupSlice.actions;
export default postLookupSlice.reducer;
