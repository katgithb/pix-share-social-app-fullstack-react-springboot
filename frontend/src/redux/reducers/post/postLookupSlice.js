import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  findPostsByUserId: {},
  findPostById: null,
  findPostsByUserIds: {},
  findAllPosts: {},
  isPostByIdLoading: false,
  isLoading: false,
};

const loadingReducers = {
  findPostsByUserIdPending: (state) => {
    state.isLoading = true;
  },
  findPostByIdPending: (state) => {
    state.isPostByIdLoading = true;
  },
  findPostsByUserIdsPending: (state) => {
    state.isLoading = true;
  },
  findAllPostsPending: (state) => {
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
    findPostById: (state, action) => {
      state.findPostById = action.payload;
      state.isPostByIdLoading = false;
    },
    findPostsByUserIds: (state, action) => {
      state.findPostsByUserIds = action.payload;
      state.isLoading = false;
    },
    findAllPosts: (state, action) => {
      state.findAllPosts = action.payload;
      state.isLoading = false;
    },
    clearPostById: (state) => {
      state.findPostById = null;
    },
    findPostByIdFailure: (state) => {
      state.isPostByIdLoading = false;
    },
    postLookupFailure: (state) => {
      state.isLoading = false;
    },
    clearPostLookup: () => initialState,
  },
});

export const {
  findPostsByUserIdPending,
  findPostByIdPending,
  findPostsByUserIdsPending,
  findAllPostsPending,
  findPostsByUserId,
  findPostById,
  findPostsByUserIds,
  findAllPosts,
  clearPostById,
  findPostByIdFailure,
  postLookupFailure,
  clearPostLookup,
} = postLookupSlice.actions;
export default postLookupSlice.reducer;
