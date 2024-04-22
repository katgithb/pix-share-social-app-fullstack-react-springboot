import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedPosts: {},
  unlikedPosts: {},
  savedPosts: {},
  unsavedPosts: {},
  isLikedLoading: {},
  isSavedLoading: {},
};

const loadingReducers = {
  likePostPending: (state, action) => {
    const postId = action.payload;
    state.isLikedLoading[postId] = true;
  },
  unlikePostPending: (state, action) => {
    const postId = action.payload;
    state.isLikedLoading[postId] = true;
  },
  savePostPending: (state, action) => {
    const postId = action.payload;
    state.isSavedLoading[postId] = true;
  },
  unsavePostPending: (state, action) => {
    const postId = action.payload;
    state.isSavedLoading[postId] = true;
  },
};

const postSocialSlice = createSlice({
  name: "postSocial",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    likePost: (state, action) => {
      const { postId, post } = action.payload;
      state.likedPosts[postId] = post;
      delete state.unlikedPosts[postId];
      state.isLikedLoading[postId] = false;
    },
    unlikePost: (state, action) => {
      const { postId, post } = action.payload;
      state.unlikedPosts[postId] = post;
      delete state.likedPosts[postId];
      state.isLikedLoading[postId] = false;
    },
    savePost: (state, action) => {
      const postId = action.payload;
      state.savedPosts[postId] = true;
      delete state.unsavedPosts[postId];
      state.isSavedLoading[postId] = false;
    },
    unsavePost: (state, action) => {
      const postId = action.payload;
      state.unsavedPosts[postId] = true;
      delete state.savedPosts[postId];
      state.isSavedLoading[postId] = false;
    },
    clearLikedPost: (state, action) => {
      const postId = action.payload;
      delete state.likedPosts[postId];
      delete state.isLikedLoading[postId];
    },
    clearUnlikedPost: (state, action) => {
      const postId = action.payload;
      delete state.unlikedPosts[postId];
      delete state.isLikedLoading[postId];
    },
    clearSavedPost: (state, action) => {
      const postId = action.payload;
      delete state.savedPosts[postId];
      delete state.isSavedLoading[postId];
    },
    clearUnsavedPost: (state, action) => {
      const postId = action.payload;
      delete state.unsavedPosts[postId];
      delete state.isSavedLoading[postId];
    },
    likePostFailure: (state, action) => {
      const postId = action.payload;
      state.isLikedLoading[postId] = false;
    },
    unlikePostFailure: (state, action) => {
      const postId = action.payload;
      state.isLikedLoading[postId] = false;
    },
    savePostFailure: (state, action) => {
      const postId = action.payload;
      state.isSavedLoading[postId] = false;
    },
    unsavePostFailure: (state, action) => {
      const postId = action.payload;
      state.isSavedLoading[postId] = false;
    },
    clearPostSocial: () => initialState,
  },
});

export const {
  likePostPending,
  unlikePostPending,
  savePostPending,
  unsavePostPending,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  clearLikedPost,
  clearUnlikedPost,
  clearSavedPost,
  clearUnsavedPost,
  clearPostSocial,
  likePostFailure,
  unlikePostFailure,
  savePostFailure,
  unsavePostFailure,
} = postSocialSlice.actions;
export default postSocialSlice.reducer;
