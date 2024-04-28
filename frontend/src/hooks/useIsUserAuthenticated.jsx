import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getAuthToken } from "../utils/authUtils";

const useIsUserAuthenticated = () => {
  const token = getAuthToken();
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const { currUser } = useSelector((store) => store.user.userProfile);

  const isUserAuthenticated = useMemo(() => {
    return token && isAuthenticated && currUser;
  }, [token, isAuthenticated, currUser]);

  return isUserAuthenticated;
};

export default useIsUserAuthenticated;
