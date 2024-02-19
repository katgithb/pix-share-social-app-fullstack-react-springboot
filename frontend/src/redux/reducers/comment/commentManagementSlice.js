import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCommentCreated: false,
  isCommentDeleted: false,
  isCreatingComment: false,
  isDeletingComment: false,
};

const loadingReducers = {
  createCommentPending: (state) => {
    state.isCreatingComment = true;
  },
  deleteCommentPending: (state) => {
    state.isDeletingComment = true;
  },
};

const commentManagementSlice = createSlice({
  name: "commentManagement",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    createComment: (state) => {
      state.isCommentCreated = true;
      state.isCreatingComment = false;
    },
    deleteComment: (state) => {
      state.isCommentDeleted = true;
      state.isDeletingComment = false;
    },
    commentCreationFailure: (state) => {
      state.isCreatingComment = false;
    },
    commentDeletionFailure: (state) => {
      state.isDeletingComment = false;
    },
    clearCommentManagement: () => initialState,
  },
});

export const {
  createCommentPending,
  deleteCommentPending,
  createComment,
  deleteComment,
  commentCreationFailure,
  commentDeletionFailure,
  clearCommentManagement,
} = commentManagementSlice.actions;
export default commentManagementSlice.reducer;
