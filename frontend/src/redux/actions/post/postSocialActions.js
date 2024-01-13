import {
  isPostLikedByCurrentUserRequest,
  isPostSavedByCurrentUserRequest,
  likePostRequest,
  savePostRequest,
  unlikePostRequest,
  unsavePostRequest,
} from "../../../services/api/postService";
import {
  isPostLikedByUser,
  isPostLikedByUserFailure,
  isPostLikedByUserPending,
  isPostSavedByUser,
  isPostSavedByUserFailure,
  isPostSavedByUserPending,
  likePost,
  savePost,
  unlikePost,
  unsavePost,
} from "../../reducers/post/postSocialSlice";

export const likePostAction = (data) => async (dispatch) => {
  likePostRequest(data)
    .then((response) => {
      const likedPost = response.data;
      console.log("Liked post: ", likedPost);

      dispatch(likePost({ postId: likedPost?.id, post: likedPost }));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const unlikePostAction = (data) => async (dispatch) => {
  unlikePostRequest(data)
    .then((response) => {
      const unlikedPost = response.data;
      console.log("Unliked post: ", unlikedPost);

      dispatch(unlikePost({ postId: unlikedPost?.id, post: unlikedPost }));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const isPostLikedByUserAction = (data) => async (dispatch) => {
  dispatch(isPostLikedByUserPending(data.postId));

  isPostLikedByCurrentUserRequest(data)
    .then((response) => {
      const isLiked = response.data;
      console.log("Post Liked: ", isLiked);

      dispatch(isPostLikedByUser({ postId: data.postId, isLiked }));
    })
    .catch((error) => {
      console.log(error);
      dispatch(isPostLikedByUserFailure(data.postId));
    });
};

export const savePostAction = (data) => async (dispatch) => {
  savePostRequest(data)
    .then(() => {
      dispatch(savePost(data.postId));

      console.log("Post Saved");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const unsavePostAction = (data) => async (dispatch) => {
  unsavePostRequest(data)
    .then(() => {
      dispatch(unsavePost(data.postId));

      console.log("Post Unsaved");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const isPostSavedByUserAction = (data) => async (dispatch) => {
  dispatch(isPostSavedByUserPending(data.postId));

  isPostSavedByCurrentUserRequest(data)
    .then((response) => {
      const isSaved = response.data;
      console.log("Post Saved: ", isSaved);

      dispatch(isPostSavedByUser({ postId: data.postId, isSaved }));
    })
    .catch((error) => {
      console.log(error);
      dispatch(isPostSavedByUserFailure(data.postId));
    });
};
