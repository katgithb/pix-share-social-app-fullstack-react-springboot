import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPostCreated: false,
  isPostDeleted: false,
  deletedPostId: null,
  isCreatingPost: false,
  isDeletingPost: false,
};

const loadingReducers = {
  createPostPending: (state) => {
    state.isCreatingPost = true;
  },
  deletePostPending: (state) => {
    state.isDeletingPost = true;
  },
};

const postManagementSlice = createSlice({
  name: "postManagement",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    createPost: (state) => {
      state.isPostCreated = true;
      state.isCreatingPost = false;
    },
    deletePost: (state, action) => {
      state.isPostDeleted = true;
      state.deletedPostId = action.payload;
      state.isDeletingPost = false;
    },
    postCreationFailure: (state) => {
      state.isCreatingPost = false;
    },
    postDeletionFailure: (state) => {
      state.isDeletingPost = false;
    },
    clearPostManagement: () => initialState,
  },
});

export const {
  createPostPending,
  deletePostPending,
  createPost,
  deletePost,
  postCreationFailure,
  postDeletionFailure,
  clearPostManagement,
} = postManagementSlice.actions;
export default postManagementSlice.reducer;
