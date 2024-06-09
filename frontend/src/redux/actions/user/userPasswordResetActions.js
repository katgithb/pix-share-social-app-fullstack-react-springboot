import {
  initiatePasswordReset,
  resetPassword,
  validatePasswordResetToken,
} from "../../../services/api/userService";
import {
  errorToastNotification,
  successToastNotification,
} from "../../../utils/toastNotification";
import {
  failureMessage,
  initiateUserPasswordReset,
  initiateUserPasswordResetFailure,
  initiateUserPasswordResetPending,
  resetUserPassword,
  resetUserPasswordFailure,
  resetUserPasswordPending,
  successMessage,
  validateUserPasswordResetToken,
  validateUserPasswordResetTokenFailure,
  validateUserPasswordResetTokenPending,
} from "../../reducers/user/userPasswordResetSlice";

export const initiatePasswordResetAction = (data) => async (dispatch) => {
  dispatch(initiateUserPasswordResetPending());

  initiatePasswordReset(data)
    .then(() => {
      dispatch(initiateUserPasswordReset());

      console.log("User Password Reset Requested");
      dispatch(
        successMessage({
          title: "Password Reset Request Received!",
          description:
            "If this email address was used to create an account, we'll send you an email with instructions to reset your password. Please check your email inbox and spam folder just in case.",
        })
      );
    })
    .catch((error) => {
      console.log(error);
      dispatch(initiateUserPasswordResetFailure());

      if (error.response?.data?.errorCode === "INVALID_REQUEST") {
        dispatch(
          failureMessage({
            title: "",
            description: error.response.data.message,
          })
        );
      } else if (error.response?.data?.errorCode === "EMAIL_DELIVERY_ERROR") {
        dispatch(
          failureMessage({
            title: "Password Reset Email Delivery Failed!",
            description: error.response.data.message,
          })
        );
      } else if (error.code === "ERR_NETWORK") {
        console.log(error.code);
        errorToastNotification(
          "Network Error",
          "We're having trouble connecting to the server. Please try again."
        );
      } else {
        dispatch(
          failureMessage({
            title: "Password Reset Email Delivery Failed!",
            description:
              "There was an unexpected error sending your password reset email. Please try requesting a new password reset link.",
          })
        );
      }
    });
};

export const validatePasswordResetTokenAction = (data) => async (dispatch) => {
  dispatch(validateUserPasswordResetTokenPending());

  validatePasswordResetToken(data)
    .then((response) => {
      const isPasswordResetTokenValid = response.data;

      console.log("isPasswordResetTokenValid: ", isPasswordResetTokenValid);

      dispatch(
        validateUserPasswordResetToken({
          token: data.passwordResetToken,
          isTokenValid: isPasswordResetTokenValid,
        })
      );
    })
    .catch((error) => {
      console.log(error);
      dispatch(validateUserPasswordResetTokenFailure());

      if (error.response?.data?.errorCode === "INVALID_TOKEN") {
        dispatch(
          failureMessage({
            title: "Password Reset Link Invalid!",
            description:
              "Password reset link appears to be invalid or expired. Please copy and paste the full URL into your browser or submit another reset request to get a new link.",
          })
        );
      } else {
        dispatch(
          failureMessage({
            title: "Password Reset Link Verification Failed!",
            description:
              "There was a problem verifying your password reset link. Please copy and paste the full URL into your browser or submit another reset request to get a new link.",
          })
        );
      }
    });
};

export const resetUserPasswordAction = (data) => async (dispatch) => {
  dispatch(resetUserPasswordPending());

  resetPassword(data)
    .then(() => {
      dispatch(resetUserPassword());

      console.log("User Password Reset Successful");
      successToastNotification(
        "Your password has been reset! You can now log in with your new password.",
        null
      );
    })
    .catch((error) => {
      console.log(error);
      dispatch(resetUserPasswordFailure());

      if (error.response?.data?.errorCode === "INVALID_TOKEN") {
        dispatch(
          failureMessage({
            title: "Password Reset Link Invalid!",
            description:
              "Password reset link appears to be invalid or expired. Please copy and paste the full URL into your browser or submit another reset request to get a new link.",
          })
        );
      } else if (error.code === "ERR_NETWORK") {
        console.log(error.code);
        errorToastNotification(
          "Network Error",
          "We're having trouble connecting to the server. Please try again."
        );
      } else {
        dispatch(
          failureMessage({
            title: "Password Reset Failed!",
            description:
              "There was a problem resetting your password. Please try again or request a new password reset link.",
          })
        );
      }
    });
};
