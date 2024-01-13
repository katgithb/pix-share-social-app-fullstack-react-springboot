import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedPosts: {},
  unlikedPosts: {},
  savedPosts: {},
  unsavedPosts: {},
  isLikedByUser: {},
  isLikedLoading: {},
  isSavedByUser: {},
  isSavedLoading: {},
};

const loadingReducers = {
  isPostLikedByUserPending: (state, action) => {
    const postId = action.payload;
    state.isLikedLoading[postId] = true;
  },
  isPostSavedByUserPending: (state, action) => {
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
    },
    unlikePost: (state, action) => {
      const { postId, post } = action.payload;
      state.unlikedPosts[postId] = post;
      delete state.likedPosts[postId];
    },
    savePost: (state, action) => {
      const postId = action.payload;
      state.savedPosts[postId] = true;
      delete state.unsavedPosts[postId];
    },
    unsavePost: (state, action) => {
      const postId = action.payload;
      state.unsavedPosts[postId] = true;
      delete state.savedPosts[postId];
    },
    isPostLikedByUser: (state, action) => {
      const { postId, isLiked } = action.payload;
      state.isLikedByUser[postId] = isLiked;
      state.isLikedLoading[postId] = false;
    },
    isPostSavedByUser: (state, action) => {
      const { postId, isSaved } = action.payload;
      state.isSavedByUser[postId] = isSaved;
      state.isSavedLoading[postId] = false;
    },
    clearLikedPost: (state, action) => {
      const postId = action.payload;
      delete state.likedPosts[postId];
    },
    clearUnlikedPost: (state, action) => {
      const postId = action.payload;
      delete state.unlikedPosts[postId];
    },
    clearSavedPost: (state, action) => {
      const postId = action.payload;
      delete state.savedPosts[postId];
    },
    clearUnsavedPost: (state, action) => {
      const postId = action.payload;
      delete state.unsavedPosts[postId];
    },
    clearIsPostLikedByUser: (state, action) => {
      const postId = action.payload;
      delete state.isLikedByUser[postId];
      delete state.isLikedLoading[postId];
    },
    clearIsPostSavedByUser: (state, action) => {
      const postId = action.payload;
      delete state.isSavedByUser[postId];
      delete state.isSavedLoading[postId];
    },
    isPostLikedByUserFailure: (state, action) => {
      const postId = action.payload;
      state.isLikedLoading[postId] = false;
    },
    isPostSavedByUserFailure: (state, action) => {
      const postId = action.payload;
      state.isSavedLoading[postId] = false;
    },
    clearPostSocial: () => initialState,
  },
});

export const {
  isPostLikedByUserPending,
  isPostSavedByUserPending,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  isPostLikedByUser,
  isPostSavedByUser,
  clearLikedPost,
  clearUnlikedPost,
  clearSavedPost,
  clearUnsavedPost,
  clearPostSocial,
  clearIsPostLikedByUser,
  clearIsPostSavedByUser,
  isPostLikedByUserFailure,
  isPostSavedByUserFailure,
} = postSocialSlice.actions;
export default postSocialSlice.reducer;
