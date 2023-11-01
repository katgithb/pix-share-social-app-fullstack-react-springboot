import {
  createPostRequest,
  deletePostRequest,
} from "../../../services/api/postService";
import {
  errorToastNotification,
  successToastNotification,
} from "../../../utils/toastNotification";
import {
  createPost,
  createPostPending,
  deletePost,
  deletePostPending,
  postCreationFailure,
  postManagementFailure,
} from "../../reducers/post/postManagementSlice";

export const createPostAction = (data) => async (dispatch) => {
  dispatch(createPostPending());

  createPostRequest(data)
    .then(() => {
      dispatch(createPost());

      console.log("Post Creation Success");
      successToastNotification("Post is now live", null);
    })
    .catch((error) => {
      console.log(error);
      dispatch(postCreationFailure());
      errorToastNotification("Failed to create post", null);
    });
};

export const deletePostAction = (data) => async (dispatch) => {
  dispatch(deletePostPending());

  deletePostRequest(data)
    .then(() => {
      dispatch(deletePost());

      console.log("Post Deletion Success");
      successToastNotification("Post has been removed", null);
    })
    .catch((error) => {
      console.log(error);
      dispatch(postManagementFailure());
      errorToastNotification("Failed to delete post", null);
    });
};
