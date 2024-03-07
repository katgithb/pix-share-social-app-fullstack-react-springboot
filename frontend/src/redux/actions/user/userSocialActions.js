import {
  updateFollow,
  updateUnfollow,
} from "../../../services/api/userService";
import {
  errorToastNotification,
  successToastNotification,
} from "../../../utils/toastNotification";
import {
  followUser,
  followUserFailure,
  followUserPending,
  unfollowUser,
  unfollowUserFailure,
  unfollowUserPending,
} from "../../reducers/user/userSocialSlice";

export const followUserAction = (data) => async (dispatch) => {
  dispatch(followUserPending(data.userId));

  updateFollow(data)
    .then((response) => {
      const message = response.data.message;

      console.log("Followed user: ", data.userId);

      dispatch(followUser(data.userId));
      successToastNotification(message, null);
    })
    .catch((error) => {
      console.log(error);
      dispatch(followUserFailure(data.userId));
      errorToastNotification("Failed to follow", null);
    });
};

export const unfollowUserAction = (data) => async (dispatch) => {
  dispatch(unfollowUserPending(data.userId));

  updateUnfollow(data)
    .then((response) => {
      const message = response.data.message;

      console.log("Unfollowed user: ", data.userId);

      dispatch(unfollowUser(data.userId));
      successToastNotification(message, null);
    })
    .catch((error) => {
      console.log(error);
      dispatch(unfollowUserFailure(data.userId));
      errorToastNotification("Failed to unfollow", null);
    });
};
