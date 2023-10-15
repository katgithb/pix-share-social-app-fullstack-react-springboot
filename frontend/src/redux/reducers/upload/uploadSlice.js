import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mediaUploadId: null,
  mediaSecureUrl: null,
  isMediaUploaded: false,
  isMediaDestroyed: false,
  isLoading: false,
};

const loadingReducers = {
  cloudinaryImageUploadPending: (state) => {
    state.isLoading = true;
  },
  cloudinaryImageDestroyPending: (state) => {
    state.isLoading = true;
  },
};

const uploadSlice = createSlice({
  name: "upload",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    cloudinaryImageUpload: (state, action) => {
      state.mediaUploadId = action.payload.publicId;
      state.mediaSecureUrl = action.payload.secureUrl;
      state.isMediaUploaded = true;
      state.isLoading = false;
    },
    cloudinaryImageDestroy: (state) => {
      state.isMediaDestroyed = true;
      state.isLoading = false;
    },
    uploadFailure: (state) => {
      state.isLoading = false;
    },
    clearUpload: () => initialState,
  },
});

export const {
  cloudinaryImageUploadPending,
  cloudinaryImageDestroyPending,
  cloudinaryImageUpload,
  cloudinaryImageDestroy,
  uploadFailure,
  clearUpload,
} = uploadSlice.actions;
export default uploadSlice.reducer;
