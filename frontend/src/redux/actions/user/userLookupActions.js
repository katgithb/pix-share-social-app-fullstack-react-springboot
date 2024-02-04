import {
  getPopularUsers,
  getSavedPostsByUserId,
  getUserByUserName,
  getUsersByUserIds,
  searchUsersBySearchTerm,
} from "../../../services/api/userService";
import {
  fetchPopularUsers,
  fetchPopularUsersPending,
  findSavedPostsByUserId,
  findSavedPostsByUserIdPending,
  findUserByUserName,
  findUserByUserNamePending,
  findUsersByUserIds,
  findUsersByUserIdsPending,
  searchUsers,
  searchUsersPending,
  userLookupFailure,
} from "../../reducers/user/userLookupSlice";

export const findUserByUserNameAction = (data) => async (dispatch) => {
  dispatch(findUserByUserNamePending()); // Update loading state

  getUserByUserName(data)
    .then((response) => {
      const user = response.data;

      console.log("User by username: ", user);

      dispatch(findUserByUserName(user));
    })
    .catch((error) => {
      console.log(error);
      dispatch(userLookupFailure());
    });
};

export const findUsersByUserIdsAction = (data) => async (dispatch) => {
  dispatch(findUsersByUserIdsPending());

  getUsersByUserIds(data)
    .then((response) => {
      const users = response.data;

      console.log("Users by User Ids: ", users);

      dispatch(findUsersByUserIds(users));
    })
    .catch((error) => {
      console.log(error);
      dispatch(userLookupFailure());
    });
};

export const findSavedPostsByUserIdAction = (data) => async (dispatch) => {
  dispatch(findSavedPostsByUserIdPending());

  getSavedPostsByUserId(data)
    .then((response) => {
      const savedPosts = response.data;

      console.log("Saved Posts by User Id: ", savedPosts);

      dispatch(findSavedPostsByUserId(savedPosts));
    })
    .catch((error) => {
      console.log(error);
      dispatch(userLookupFailure());
    });
};

export const searchUsersAction = (data) => async (dispatch) => {
  dispatch(searchUsersPending());

  searchUsersBySearchTerm(data)
    .then((response) => {
      const users = response.data;

      console.log("Search results: ", users);

      dispatch(searchUsers(users));
    })
    .catch((error) => {
      console.log(error);
      dispatch(userLookupFailure());
    });
};

export const fetchPopularUsersAction = (data) => async (dispatch) => {
  dispatch(fetchPopularUsersPending());

  getPopularUsers(data)
    .then((response) => {
      const users = response.data;

      console.log("Popular Users: ", users);

      dispatch(fetchPopularUsers(users));
    })
    .catch((error) => {
      console.log(error);
      dispatch(userLookupFailure());
    });
};
