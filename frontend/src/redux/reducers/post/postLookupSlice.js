import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  findPostsByUserId: {},
  findPostById: null,
  findPostsByUserIds: {},
  findAllPosts: {},
  isPostByIdLoading: {},
  isLoading: false,
};

const loadingReducers = {
  findPostsByUserIdPending: (state) => {
    state.isLoading = true;
  },
  findPostByIdPending: (state, action) => {
    const postId = action.payload;
    state.isPostByIdLoading[postId] = true;
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
      const { postId, post } = action.payload;
      state.findPostById = post;
      state.isPostByIdLoading[postId] = false;
    },
    findPostsByUserIds: (state, action) => {
      state.findPostsByUserIds = action.payload;
      state.isLoading = false;
    },
    findAllPosts: (state, action) => {
      state.findAllPosts = action.payload;
      state.isLoading = false;
    },
    clearPostById: (state, action) => {
      const postId = action.payload;
      state.findPostById = null;
      delete state.isPostByIdLoading[postId];
    },
    findPostByIdFailure: (state, action) => {
      const postId = action.payload;
      state.isPostByIdLoading[postId] = false;
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
