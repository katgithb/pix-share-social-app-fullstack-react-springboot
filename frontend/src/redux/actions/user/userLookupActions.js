import {
  getPopularUsers,
  getUserByUserName,
  getUsersByUserIds,
  searchUsersBySearchTerm,
} from "../../../services/api/userService";
import {
  fetchPopularUsers,
  findUserByUserName,
  findUsersByUserIds,
  searchUsers,
} from "../../reducers/user/userLookupSlice";

export const findUserByUserNameAction = (data) => async (dispatch) => {
  getUserByUserName(data)
    .then((response) => {
      const user = response.data;

      console.log("User by username: ", user);

      dispatch(findUserByUserName(user));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const findUsersByUserIdsAction = (data) => async (dispatch) => {
  getUsersByUserIds(data)
    .then((response) => {
      const users = response.data;

      console.log("Users by User Ids: ", users);

      dispatch(findUsersByUserIds(users));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const searchUsersAction = (data) => async (dispatch) => {
  searchUsersBySearchTerm(data)
    .then((response) => {
      const users = response.data;

      console.log("Search results: ", users);

      dispatch(searchUsers(users));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const fetchPopularUsersAction = (data) => async (dispatch) => {
  getPopularUsers(data)
    .then((response) => {
      const users = response.data;

      console.log("Popular Users: ", users);

      dispatch(fetchPopularUsers(users));
    })
    .catch((error) => {
      console.log(error);
    });
};
