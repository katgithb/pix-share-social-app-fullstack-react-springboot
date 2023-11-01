import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPostCreated: false,
  isPostDeleted: false,
  isCreatingPost: false,
  isLoading: false,
};

const loadingReducers = {
  createPostPending: (state) => {
    state.isCreatingPost = true;
  },
  deletePostPending: (state) => {
    state.isLoading = true;
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
    deletePost: (state) => {
      state.isPostDeleted = true;
      state.isLoading = false;
    },
    postCreationFailure: (state) => {
      state.isCreatingPost = false;
    },
    postManagementFailure: (state) => {
      state.isLoading = false;
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
  postManagementFailure,
  clearPostManagement,
} = postManagementSlice.actions;
export default postManagementSlice.reducer;
