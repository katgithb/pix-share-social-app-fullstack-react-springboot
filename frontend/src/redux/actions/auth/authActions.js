import jwtDecode from "jwt-decode";
import { createUser, login } from "../../../services/api/authService";
import {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from "../../../utils/authUtils";
import {
  errorToastNotification,
  successToastNotification,
} from "../../../utils/toastNotification";
import {
  authFailure,
  signIn,
  signInPending,
  signOut,
  signUp,
  signUpPending,
} from "../../reducers/auth/authSlice";
import { clearUserLookup } from "../../reducers/user/userLookupSlice";
import { clearUserProfile } from "../../reducers/user/userProfileSlice";
import { clearUserSocial } from "../../reducers/user/userSocialSlice";

export const signinAction = (data) => async (dispatch) => {
  dispatch(signInPending());

  login(data)
    .then((response) => {
      //get token from response
      const token = response.data.token;
      console.log("User signin: ", token);

      //set JWT token to local storage
      setAuthToken(token);

      dispatch(signIn({ token }));

      console.log("Login Success");
      successToastNotification("Login Success", null);
    })
    .catch((error) => {
      console.log(error);
      dispatch(authFailure());

      // errorToastNotification(error.code, error.response.data.message);
      if (error.response) {
        errorToastNotification(error.response.data.message, null);
      } else if (error.code === "ERR_NETWORK") {
        errorToastNotification(
          "Network Error",
          "We're having trouble connecting to the server. Please try again."
        );
      }
    });
};

export const signupAction = (data) => async (dispatch) => {
  dispatch(signUpPending());

  createUser(data)
    .then((response) => {
      const { password, ...user } = data;
      console.log("User signup: ", response);

      dispatch(signUp(user));

      console.log("Signup Success");
      successToastNotification(
        `Account created for ${data.name}`
        // "We've created your account for you."
      );
    })
    .catch((error) => {
      console.log(error);
      dispatch(authFailure());

      if (error.response) {
        errorToastNotification(error.response.data.message, null);
      } else if (error.code === "ERR_NETWORK") {
        errorToastNotification(
          "Network Error",
          "We're having trouble connecting to the server. Please try again."
        );
      }
    });
};

export const signoutAction = () => (dispatch) => {
  console.log("Removing token: ", getAuthToken());
  // Clear token from local storage
  removeAuthToken();

  // Clear user state
  dispatch(clearUserProfile());
  dispatch(clearUserLookup());
  dispatch(clearUserSocial());

  dispatch(signOut());

  console.log("Logout Success");
  successToastNotification("Logged Out", null);
};

export const checkAuthState = () => (dispatch) => {
  const token = getAuthToken();
  console.log("token: ", token);

  if (!token) {
    // Token is missing, user is not authenticated
    console.log("Auth token not present");

    // Clear user state
    dispatch(clearUserProfile());
    dispatch(clearUserLookup());
    dispatch(clearUserSocial());

    dispatch(signOut());
  } else {
    try {
      const { exp } = jwtDecode(token);
      const currentDate = Date.now();
      const expirationDate = exp * 1000;

      if (currentDate > expirationDate) {
        // Token is expired, user is not authenticated
        dispatch(signoutAction());
      } else {
        // Token is valid, user is authenticated
        console.log("Auth token: ", token);

        dispatch(signIn({ token }));
      }
    } catch (error) {
      console.log(error);
      dispatch(signoutAction());
    }
  }
};
