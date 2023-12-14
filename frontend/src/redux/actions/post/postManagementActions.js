import {
  createPostRequest,
  deletePostRequest,
} from "../../../services/api/postService";
import {
  asyncToastNotification,
  errorToastNotification,
  successToastNotification,
} from "../../../utils/toastNotification";
import {
  createPost,
  createPostPending,
  deletePost,
  deletePostPending,
  postCreationFailure,
  postDeletionFailure,
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

  const deletePostPromise = new Promise((resolve, reject) => {
    deletePostRequest(data)
      .then(() => {
        resolve();
        dispatch(deletePost(data.postId));

        console.log("Post Deletion Success");
      })
      .catch((error) => {
        reject(error);
        console.log(error);
        dispatch(postDeletionFailure());
      });
  });

  asyncToastNotification(deletePostPromise, {
    loadingTitle: "Deleting post... Please wait",
    successTitle: "Post has been removed",
    errorTitle: "Failed to delete post",
  });
};
