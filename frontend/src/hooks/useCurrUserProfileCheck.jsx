import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { findUserByUserNameAction } from "../redux/actions/user/userLookupActions";
import { isCurrUser } from "../utils/userUtils";

const useCurrUserProfileCheck = (token, username, currUserId, userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && username) {
      const data = { token, username };
      dispatch(findUserByUserNameAction(data));
    }
  }, [dispatch, token, username]);

  const isGivenUserCurrUser = useMemo(
    () => isCurrUser(currUserId, userId),
    [currUserId, userId]
  );

  return { isGivenUserCurrUser };
};

export default useCurrUserProfileCheck;
