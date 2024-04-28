import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PagePreloader from "../components/shared/PagePreloader";
import MainLayout from "../layouts/MainLayout";
import PublicLanding from "../pages/PublicLanding";
import { checkAuthState } from "../redux/actions/auth/authActions";
import { fetchUserProfileAction } from "../redux/actions/user/userProfileActions";
import { getAuthToken } from "../utils/authUtils";

const ProtectedRoute = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = getAuthToken();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const selectUserProfile = useSelector((store) => store.user.userProfile);
  const userProfile = useMemo(() => selectUserProfile, [selectUserProfile]);

  const fetchCurrUser = useCallback(
    (isAuthenticated) => {
      if (token && isAuthenticated) {
        dispatch(fetchUserProfileAction({ token }));
      }
    },
    [dispatch, token]
  );

  useEffect(() => {
    const handleLocationChange = () => {
      dispatch(checkAuthState());
      setIsAuthChecked(true);
    };

    handleLocationChange(); // Run on initial render

    console.log("Location: ", location);

    // Clean up the listener when the component unmounts
    return () => {};
  }, [dispatch, location]);

  useEffect(() => {
    fetchCurrUser(isAuthenticated);
  }, [dispatch, fetchCurrUser, isAuthenticated, token]);

  if (!isAuthChecked || userProfile.isLoading) {
    return <PagePreloader />; // Render preloader until authentication check is complete
  }

  console.log("Authenticated: ", isAuthenticated);
  console.log("Authenticated User: ", userProfile.currUser);

  if (isAuthenticated && userProfile.currUser) {
    return <Outlet />; // Render protected child components
  }

  return location.pathname === "/" ? (
    <MainLayout>
      {/* Render PublicLanding page on "/" for unauthenticated */}
      <PublicLanding />
    </MainLayout>
  ) : (
    <Navigate to="/login" /> // Redirect to Login on other routes
  );
};

export default ProtectedRoute;
