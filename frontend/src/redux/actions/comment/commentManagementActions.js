import {
  createCommentRequest,
  deleteCommentRequest,
} from "../../../services/api/commentService";
import {
  asyncToastNotification,
  errorToastNotification,
  successToastNotification,
} from "../../../utils/toastNotification";
import {
  commentCreationFailure,
  commentDeletionFailure,
  createComment,
  createCommentPending,
  deleteComment,
  deleteCommentPending,
} from "../../reducers/comment/commentManagementSlice";

export const createCommentAction = (data) => async (dispatch) => {
  dispatch(createCommentPending());

  createCommentRequest(data)
    .then(() => {
      dispatch(createComment());

      console.log("Comment Creation Success");
      successToastNotification("Comment is now live", null);
    })
    .catch((error) => {
      console.log(error);
      dispatch(commentCreationFailure());
      errorToastNotification("Failed to create comment", null);
    });
};

export const deleteCommentAction = (data) => async (dispatch) => {
  dispatch(deleteCommentPending());

  const deleteCommentPromise = new Promise((resolve, reject) => {
    deleteCommentRequest(data)
      .then(() => {
        resolve();
        dispatch(deleteComment());

        console.log("Comment Deletion Success");
      })
      .catch((error) => {
        reject(error);
        console.log(error);
        dispatch(commentDeletionFailure());
      });
  });

  asyncToastNotification(deleteCommentPromise, {
    loadingTitle: "Deleting comment... Please wait",
    successTitle: "Comment has been removed",
    errorTitle: "Failed to delete comment",
  });
};
