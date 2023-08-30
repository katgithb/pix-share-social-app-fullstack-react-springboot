import {
  updateFollow,
  updateUnfollow,
} from "../../../services/api/userService";
import {
  followUser,
  followUserPending,
  unfollowUser,
  unfollowUserPending,
  userSocialFailure,
} from "../../reducers/user/userSocialSlice";

export const followUserAction = (data) => async (dispatch) => {
  dispatch(followUserPending());

  updateFollow(data)
    .then((response) => {
      const user = response.data;

      console.log("Follow user: ", user);

      dispatch(followUser(user));
    })
    .catch((error) => {
      console.log(error);
      dispatch(userSocialFailure());
    });
};

export const unfollowUserAction = (data) => async (dispatch) => {
  dispatch(unfollowUserPending());

  updateUnfollow(data)
    .then((response) => {
      const user = response.data;

      console.log("Unfollow user: ", user);

      dispatch(unfollowUser(user));
    })
    .catch((error) => {
      console.log(error);
      dispatch(userSocialFailure());
    });
};
