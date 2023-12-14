import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currUser: null,
  isUserProfileUpdated: false,
  isUserPersonalInfoUpdated: false,
  isUserPasswordUpdated: false,
  isUserImageUpdated: false,
  isUserImageRemoved: false,
  isUserDeleted: false,
  isUpdatingUserProfile: false,
  isUpdatingUserPersonalInfo: false,
  isUpdatingUserPassword: false,
  isUpdatingUserImage: false,
  isRemovingUserImage: false,
  isLoading: false,
};

const loadingReducers = {
  fetchUserProfilePending: (state) => {
    state.isLoading = true;
  },
  editUserProfilePending: (state) => {
    state.isUpdatingUserProfile = true;
  },
  editUserPersonalInfoPending: (state) => {
    state.isUpdatingUserPersonalInfo = true;
  },
  editUserPasswordPending: (state) => {
    state.isUpdatingUserPassword = true;
  },
  editUserImagePending: (state) => {
    state.isUpdatingUserImage = true;
  },
  removeUserImagePending: (state) => {
    state.isRemovingUserImage = true;
  },
  deleteUserProfilePending: (state) => {
    state.isLoading = true;
  },
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: initialState,
  reducers: {
    ...loadingReducers,
    fetchUserProfile: (state, action) => {
      return {
        ...initialState,
        currUser: action.payload,
        isLoading: false,
      };
    },
    editUserProfile: (state) => {
      state.isUserProfileUpdated = true;
      state.isUpdatingUserProfile = false;
    },
    editUserPersonalInfo: (state) => {
      state.isUserPersonalInfoUpdated = true;
      state.isUpdatingUserPersonalInfo = false;
    },
    editUserPassword: (state) => {
      state.isUserPasswordUpdated = true;
      state.isUpdatingUserPassword = false;
    },
    editUserImage: (state) => {
      state.isUserImageUpdated = true;
      state.isUpdatingUserImage = false;
    },
    removeUserImage: (state) => {
      state.isUserImageRemoved = true;
      state.isRemovingUserImage = false;
    },
    deleteUserProfile: () => {
      return {
        ...initialState,
        isUserDeleted: true,
        isLoading: false,
      };
    },
    userProfileUpdateFailure: (state) => {
      state.isUpdatingUserProfile = false;
    },
    userPersonalInfoUpdateFailure: (state) => {
      state.isUpdatingUserPersonalInfo = false;
    },
    userPasswordUpdateFailure: (state) => {
      state.isUpdatingUserPassword = false;
    },
    userImageUpdateFailure: (state) => {
      state.isUpdatingUserImage = false;
    },
    userImageRemovalFailure: (state) => {
      state.isRemovingUserImage = false;
    },
    userProfileFailure: (state) => {
      state.isLoading = false;
    },
    clearUserProfile: () => initialState,
  },
});

export const {
  fetchUserProfilePending,
  editUserProfilePending,
  editUserPersonalInfoPending,
  editUserPasswordPending,
  editUserImagePending,
  removeUserImagePending,
  deleteUserProfilePending,
  fetchUserProfile,
  editUserProfile,
  editUserPersonalInfo,
  editUserPassword,
  editUserImage,
  removeUserImage,
  deleteUserProfile,
  userProfileUpdateFailure,
  userPersonalInfoUpdateFailure,
  userPasswordUpdateFailure,
  userImageUpdateFailure,
  userImageRemovalFailure,
  userProfileFailure,
  clearUserProfile,
} = userProfileSlice.actions;
export default userProfileSlice.reducer;
