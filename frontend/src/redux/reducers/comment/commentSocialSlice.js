import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedComments: {},
  unlikedComments: {},
  isLikedLoading: {},
};

const loadingReducers = {
  likeCommentPending: (state, action) => {
    const commentId = action.payload;
    state.isLikedLoading[commentId] = true;
  },
  unlikeCommentPending: (state, action) => {
    const commentId = action.payload;
    state.isLikedLoading[commentId] = true;
  },
};

const commentSocialSlice = createSlice({
  name: "commentSocial",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    likeComment: (state, action) => {
      const { commentId, comment } = action.payload;
      state.likedComments[commentId] = comment;
      delete state.unlikedComments[commentId];
      state.isLikedLoading[commentId] = false;
    },
    unlikeComment: (state, action) => {
      const { commentId, comment } = action.payload;
      state.unlikedComments[commentId] = comment;
      delete state.likedComments[commentId];
      state.isLikedLoading[commentId] = false;
    },
    clearLikedComment: (state, action) => {
      const commentId = action.payload;
      delete state.likedComments[commentId];
      delete state.isLikedLoading[commentId];
    },
    clearUnlikedComment: (state, action) => {
      const commentId = action.payload;
      delete state.unlikedComments[commentId];
      delete state.isLikedLoading[commentId];
    },
    likeCommentFailure: (state, action) => {
      const commentId = action.payload;
      state.isLikedLoading[commentId] = false;
    },
    unlikeCommentFailure: (state, action) => {
      const commentId = action.payload;
      state.isLikedLoading[commentId] = false;
    },
    clearCommentSocial: () => initialState,
  },
});

export const {
  likeCommentPending,
  unlikeCommentPending,
  likeComment,
  unlikeComment,
  clearLikedComment,
  clearUnlikedComment,
  likeCommentFailure,
  unlikeCommentFailure,
  clearCommentSocial,
} = commentSocialSlice.actions;
export default commentSocialSlice.reducer;
