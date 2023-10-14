import {
  deleteUser,
  getUserProfile,
  updateUser,
} from "../../../services/api/userService";
import { signOut } from "../../reducers/auth/authSlice";
import { clearUserLookup } from "../../reducers/user/userLookupSlice";
import {
  clearUserProfile,
  deleteUserProfile,
  deleteUserProfilePending,
  editUserProfile,
  editUserProfilePending,
  fetchUserProfile,
  fetchUserProfilePending,
  userProfileFailure,
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

      console.log("Update Success");
    })
    .catch((error) => {
      console.log(error);
      dispatch(userProfileFailure());
    });
};

export const deleteUserProfileAction = (data) => async (dispatch) => {
  dispatch(deleteUserProfilePending());

  deleteUser(data)
    .then(() => {
      console.log("Removing token: ", localStorage.getItem("token"));
      // Clear token from local storage
      localStorage.removeItem("token");

      dispatch(deleteUserProfile());

      // Clear user state
      dispatch(clearUserProfile());
      dispatch(clearUserLookup());
      dispatch(clearUserSocial());

      dispatch(signOut());

      console.log("Deletion Success");
    })
    .catch((error) => {
      console.log(error);
      dispatch(userProfileFailure());
    });
};