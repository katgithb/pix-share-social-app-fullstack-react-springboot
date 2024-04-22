import {
  likePostRequest,
  savePostRequest,
  unlikePostRequest,
  unsavePostRequest,
} from "../../../services/api/postService";
import {
  likePost,
  likePostFailure,
  likePostPending,
  savePost,
  savePostFailure,
  savePostPending,
  unlikePost,
  unlikePostFailure,
  unlikePostPending,
  unsavePost,
  unsavePostFailure,
  unsavePostPending,
} from "../../reducers/post/postSocialSlice";

export const likePostAction = (data) => async (dispatch) => {
  dispatch(likePostPending(data.postId));

  likePostRequest(data)
    .then((response) => {
      const likedPost = response.data;
      console.log("Liked post: ", likedPost);

      dispatch(likePost({ postId: likedPost?.id, post: likedPost }));
    })
    .catch((error) => {
      console.log(error);
      dispatch(likePostFailure(data.postId));
    });
};

export const unlikePostAction = (data) => async (dispatch) => {
  dispatch(unlikePostPending(data.postId));

  unlikePostRequest(data)
    .then((response) => {
      const unlikedPost = response.data;
      console.log("Unliked post: ", unlikedPost);

      dispatch(unlikePost({ postId: unlikedPost?.id, post: unlikedPost }));
    })
    .catch((error) => {
      console.log(error);
      dispatch(unlikePostFailure(data.postId));
    });
};

export const savePostAction = (data) => async (dispatch) => {
  dispatch(savePostPending(data.postId));

  savePostRequest(data)
    .then(() => {
      dispatch(savePost(data.postId));

      console.log("Post Saved");
    })
    .catch((error) => {
      console.log(error);
      dispatch(savePostFailure(data.postId));
    });
};

export const unsavePostAction = (data) => async (dispatch) => {
  dispatch(unsavePostPending(data.postId));

  unsavePostRequest(data)
    .then(() => {
      dispatch(unsavePost(data.postId));

      console.log("Post Unsaved");
    })
    .catch((error) => {
      console.log(error);
      dispatch(unsavePostFailure(data.postId));
    });
};
