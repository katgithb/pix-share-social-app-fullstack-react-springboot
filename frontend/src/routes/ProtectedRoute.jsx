import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PagePreloader from "../components/shared/PagePreloader";
import { checkAuthState } from "../redux/actions/auth/authActions";
import { fetchUserProfileAction } from "../redux/actions/user/userProfileActions";

const ProtectedRoute = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const selectUserProfile = useSelector((store) => store.user.userProfile);
  const userProfile = useMemo(() => selectUserProfile, [selectUserProfile]);

  useEffect(() => {
    const handleLocationChange = () => {
      dispatch(checkAuthState());
      setIsAuthChecked(true);
    };

    handleLocationChange(); // Run on initial render

    return () => {}; // Clean up the listener when the component unmounts
  }, [dispatch, location]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchUserProfileAction({ token }));
    }
  }, [dispatch, isAuthenticated, token]);

  if (!isAuthChecked || userProfile.isLoading) {
    return <PagePreloader />; // Render preloader until authentication check is complete
  }

  console.log("Authenticated: ", isAuthenticated);
  console.log("Authenticated User: ", userProfile.currUser);

  return isAuthenticated && userProfile.currUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
