import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { checkAuthState } from "../redux/actions/auth/authActions";
import { fetchUserProfileAction } from "../redux/actions/user/userProfileActions";

const ProtectedRoute = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleLocationChange = () => {
      dispatch(checkAuthState());
      setIsAuthChecked(true);
    };

    handleLocationChange(); // Run on initial render

    return () => {}; // Clean up the listener when the component unmounts
  }, [dispatch, location]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfileAction({ token }));
    }
  }, [dispatch, token]);

  if (!isAuthChecked) {
    return null; // Render nothing until authentication check is complete
  }

  console.log("Authenticated: ", isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
