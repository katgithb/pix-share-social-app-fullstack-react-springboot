import {
  deleteUser,
  deleteUserImage,
  getUserProfile,
  updatePassword,
  updateUser,
  updateUserImage,
  verifyPassword,
} from "../../../services/api/userService";
import { getAuthToken, removeAuthToken } from "../../../utils/authUtils";
import {
  errorToastNotification,
  successToastNotification,
} from "../../../utils/toastNotification";
import { signOut } from "../../reducers/auth/authSlice";
import { clearUserLookup } from "../../reducers/user/userLookupSlice";
import {
  clearUserProfile,
  deleteUserProfile,
  deleteUserProfilePending,
  editUserImage,
  editUserImagePending,
  editUserPassword,
  editUserPasswordPending,
  editUserPersonalInfo,
  editUserPersonalInfoPending,
  editUserProfile,
  editUserProfilePending,
  fetchUserProfile,
  fetchUserProfilePending,
  removeUserImage,
  removeUserImagePending,
  userImageRemovalFailure,
  userImageUpdateFailure,
  userPasswordUpdateFailure,
  userPersonalInfoUpdateFailure,
  userProfileFailure,
  userProfileUpdateFailure,
} from "../../reducers/user/userProfileSlice";
import { clearUserSocial } from "../../reducers/user/userSocialSlice";

export const fetchUserProfileAction = (data) => async (dispatch) => {
  dispatch(fetchUserProfilePending());

  getUserProfile(data)
    .then((response) => {
      const currUser = response.data;

      console.log("currUser: ", currUser);

      dispatch(fetchUserProfile(currUser));
    })
    .catch((error) => {
      console.log(error);
      dispatch(userProfileFailure());
    });
};

export const editUserProfileAction = (data) => async (dispatch) => {
  dispatch(editUserProfilePending());

  updateUser(data)
    .then(() => {
      dispatch(editUserProfile());

      console.log("Profile Update Success");
      successToastNotification("Profile updated", null);
    })
    .catch((error) => {
      console.log(error);
      dispatch(userProfileUpdateFailure());
      errorToastNotification(error.response.data.message, null);
    });
};

export const editUserPersonalInfoAction = (data) => async (dispatch) => {
  dispatch(editUserPersonalInfoPending());

  updateUser(data)
    .then(() => {
      dispatch(editUserPersonalInfo());

      console.log("Personal Information Update Success");
      successToastNotification("Personal Information updated", null);

      if (data.user.email) {
        console.log("Removing token: ", getAuthToken());
        // Clear token from local storage
        removeAuthToken();

        // Clear user state
        dispatch(clearUserProfile());
        dispatch(clearUserLookup());
        dispatch(clearUserSocial());

        dispatch(signOut());

        successToastNotification("You can now login with the new email.", null);
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch(userPersonalInfoUpdateFailure());
      errorToastNotification(error.response.data.message, null);
    });
};

export const editUserPasswordAction = (data) => async (dispatch) => {
  dispatch(editUserPasswordPending());
  let timeout;

  try {
    // Verify the current password
    const verifyResponse = await verifyPassword(data);
    const passwordsMatch = verifyResponse.data;

    console.log("passwordsMatch: ", passwordsMatch);

    if (passwordsMatch) {
      updatePassword(data)
        .then(() => {
          dispatch(editUserPassword());

          console.log("Update Password Success");
          successToastNotification("Password updated", null);

          timeout = setTimeout(() => {
            console.log("Removing token: ", getAuthToken());
            // Clear token from local storage
            removeAuthToken();

            // Clear user state
            dispatch(clearUserProfile());
            dispatch(clearUserLookup());
            dispatch(clearUserSocial());

            dispatch(signOut());

            successToastNotification(
              "You can now login with the new password.",
              null
            );
          }, 4000);
        })
        .catch((error) => {
          console.log(error);
          dispatch(userPasswordUpdateFailure());
          errorToastNotification(error.response.data.message, null);
        });
    } else {
      dispatch(userPasswordUpdateFailure());
      errorToastNotification(
        "The current password you entered is incorrect.",
        null
      );
    }
  } catch (error) {
    console.log(error);
    dispatch(userPasswordUpdateFailure());
  } finally {
    clearTimeout(timeout);
  }
};

export const editUserImageAction = (data) => async (dispatch) => {
  dispatch(editUserImagePending());

  if (data.image) {
    const userImageData = {
      token: data.token,
      formData: new FormData(), // Create FormData object
    };

    userImageData.formData.append("image", data.image);

    updateUserImage(userImageData)
      .then(() => {
        dispatch(editUserImage());

        console.log("Profile Photo Update Success");
        successToastNotification("Profile photo updated", null);
      })
      .catch((error) => {
        console.log(error);
        dispatch(userImageUpdateFailure());
        errorToastNotification("Profile photo update failed", null);
      });
  } else {
    dispatch(userImageUpdateFailure());
    errorToastNotification("No file selected for upload", null);
  }
};

export const removeUserImageAction = (data) => async (dispatch) => {
  dispatch(removeUserImagePending());

  deleteUserImage(data)
    .then(() => {
      dispatch(removeUserImage());

      console.log("Profile Photo Removal Success");
      successToastNotification("Profile photo removed", null);
    })
    .catch((error) => {
      console.log(error);
      dispatch(userImageRemovalFailure());
      errorToastNotification("Profile photo removal failed", null);
    });
};

export const deleteUserProfileAction = (data) => async (dispatch) => {
  dispatch(deleteUserProfilePending());

  try {
    // Verify the current password
    const verifyResponse = await verifyPassword(data);
    const passwordsMatch = verifyResponse.data;

    console.log("passwordsMatch: ", passwordsMatch);

    if (passwordsMatch) {
      deleteUser(data)
        .then(() => {
          console.log("Removing token: ", getAuthToken());
          // Clear token from local storage
          removeAuthToken();

          dispatch(deleteUserProfile());

          // Clear user state
          dispatch(clearUserProfile());
          dispatch(clearUserLookup());
          dispatch(clearUserSocial());

          dispatch(signOut());

          console.log("Account Deletion Success");
          successToastNotification(
            "Your account is deleted",
            "Thanks for using our platform!\nWe look forward to seeing you again."
          );
        })
        .catch((error) => {
          console.log(error);
          dispatch(userProfileFailure());
          errorToastNotification(error.response.data.message, null);
        });
    } else {
      dispatch(userProfileFailure());
      errorToastNotification(
        "The current password you entered is incorrect.",
        null
      );
    }
  } catch (error) {
    console.log(error);
    dispatch(userProfileFailure());
  }
};
