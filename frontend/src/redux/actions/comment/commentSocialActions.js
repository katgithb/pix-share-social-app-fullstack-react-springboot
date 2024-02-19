import {
  likeCommentRequest,
  unlikeCommentRequest,
} from "../../../services/api/commentService";
import {
  likeComment,
  likeCommentFailure,
  likeCommentPending,
  unlikeComment,
  unlikeCommentFailure,
  unlikeCommentPending,
} from "../../reducers/comment/commentSocialSlice";

export const likeCommentAction = (data) => async (dispatch) => {
  dispatch(likeCommentPending(data.commentId));

  likeCommentRequest(data)
    .then((response) => {
      const likedComment = response.data;
      console.log("Liked comment: ", likedComment);

      dispatch(
        likeComment({ commentId: likedComment?.id, comment: likedComment })
      );
    })
    .catch((error) => {
      console.log(error);
      dispatch(likeCommentFailure(data.commentId));
    });
};

export const unlikeCommentAction = (data) => async (dispatch) => {
  dispatch(unlikeCommentPending(data.commentId));

  unlikeCommentRequest(data)
    .then((response) => {
      const unlikedComment = response.data;
      console.log("Unliked comment: ", unlikedComment);

      dispatch(
        unlikeComment({
          commentId: unlikedComment?.id,
          comment: unlikedComment,
        })
      );
    })
    .catch((error) => {
      console.log(error);
      dispatch(unlikeCommentFailure(data.commentId));
    });
};
