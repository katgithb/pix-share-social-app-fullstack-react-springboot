import jwtDecode from "jwt-decode";
import { login, register } from "../../../services/apiClient";
import {
  errorToastNotification,
  successToastNotification,
} from "../../../utils/toastNotification";
import { SIGN_IN, SIGN_OUT, SIGN_UP } from "./authActionTypes_legacy";

export const signinAction = (data) => async (dispatch) => {
  login(data)
    .then((response) => {
      //get token from response
      const token = response.data.token;
      console.log("User signin: ", token);

      //set JWT token to local storage
      localStorage.setItem("token", token);

      dispatch({ type: SIGN_IN, payload: { token: token } });

      console.log("Login Success");
      successToastNotification("Login Success", null);
    })
    .catch((error) => {
      console.log(error);
      // errorToastNotification(error.code, error.response.data.message);
      errorToastNotification(error.response.data.message, null);
    });
};

export const signupAction = (data) => async (dispatch) => {
  register(data)
    .then((response) => {
      const user = data;
      console.log("User signup: ", response);

      dispatch({ type: SIGN_UP, payload: user });

      console.log("Signup Success");
      successToastNotification(
        `Account created for ${data.name}.`
        // "We've created your account for you."
      );
    })
    .catch((error) => {
      console.log(error);
      errorToastNotification(error.response.data.message, null);
    });
};

export const signoutAction = () => (dispatch) => {
  console.log("Removing token: ", localStorage.getItem("token"));
  // Clear token from local storage
  localStorage.removeItem("token");

  dispatch({ type: SIGN_OUT });

  console.log("Logout Success");
  successToastNotification("Logged Out", null);
};

export const checkAuthState = () => (dispatch) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Token is missing, user is not authenticated
    console.log("Auth token not present");
    dispatch(signoutAction());
  } else {
    const { exp } = jwtDecode(token);
    const currentDate = Date.now();
    const expirationDate = exp * 1000;

    if (currentDate > expirationDate) {
      // Token is expired, user is not authenticated
      dispatch(signoutAction());
    } else {
      // Token is valid, user is authenticated
      console.log("Auth token: ", token);

      dispatch({ type: SIGN_IN, payload: { token: token } });
    }
  }
};
