import _ from "lodash";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { checkAuthState } from "../../../redux/actions/auth/authActions";
import { validatePasswordResetTokenAction } from "../../../redux/actions/user/userPasswordResetActions";
import { fetchUserProfileAction } from "../../../redux/actions/user/userProfileActions";
import { getAuthToken } from "../../../utils/authUtils";
import PagePreloader from "../../shared/PagePreloader";

const PasswordResetTokenVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = getAuthToken();
  const [searchParams] = useSearchParams();

  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);
  const selectUserProfile = useSelector((store) => store.user.userProfile);
  const userProfile = useMemo(() => selectUserProfile, [selectUserProfile]);
  const {
    passwordResetToken,
    isValidatingPasswordResetToken,
    isPasswordResetTokenValidated,
  } = useSelector((store) => store.user.userPasswordReset);

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchUserProfileAction({ token }));
    }
  }, [dispatch, isAuthenticated, token]);

  useEffect(() => {
    if (userProfile.currUser) {
      navigate("/");
    }
  }, [navigate, userProfile.currUser]);

  useEffect(() => {
    const passwordResetToken = searchParams.get("token");

    if (passwordResetToken) {
      dispatch(validatePasswordResetTokenAction({ passwordResetToken }));
    } else {
      navigate("/reset-password/new");
    }
  }, [dispatch, navigate, searchParams]);

  console.log(searchParams);
  console.log("Password Reset token: ", searchParams.get("token"));
  console.log("Password Reset Token State: ", passwordResetToken);

  if (
    isLoading ||
    userProfile.isLoading ||
    isValidatingPasswordResetToken ||
    (!isPasswordResetTokenValidated && !passwordResetToken)
  ) {
    return <PagePreloader />;
  }

  if (
    !_.isEmpty(passwordResetToken) &&
    passwordResetToken["token"] &&
    passwordResetToken["isTokenValid"]
  ) {
    return <Navigate to="/reset-password" />;
  } else {
    return <Navigate to="/reset-password/new" />;
  }
};

export default PasswordResetTokenVerification;
