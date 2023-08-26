import {
  updateFollow,
  updateUnfollow,
} from "../../../services/api/userService";
import { followUser, unfollowUser } from "../../reducers/user/userSocialSlice";

export const followUserAction = (data) => async (dispatch) => {
  updateFollow(data)
    .then((response) => {
      const user = response.data;

      console.log("Follow user: ", user);

      dispatch(followUser(user));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const unfollowUserAction = (data) => async (dispatch) => {
  updateUnfollow(data)
    .then((response) => {
      const user = response.data;

      console.log("Unfollow user: ", user);

      dispatch(unfollowUser(user));
    })
    .catch((error) => {
      console.log(error);
    });
};
