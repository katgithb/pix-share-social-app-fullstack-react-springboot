import { useMemo } from "react";
import { useSelector } from "react-redux";

const useIsUserAuthenticated = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const { currUser } = useSelector((store) => store.user.userProfile);

  const isUserAuthenticated = useMemo(() => {
    return token && isAuthenticated && currUser;
  }, [token, isAuthenticated, currUser]);

  return isUserAuthenticated;
};

export default useIsUserAuthenticated;
