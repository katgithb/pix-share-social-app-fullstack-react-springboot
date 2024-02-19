import {
  findAllPostsByUserIdsRequest,
  findPostByIdRequest,
  findPostsByUserIdRequest,
} from "../../../services/api/postService";
import {
  findPostById,
  findPostByIdFailure,
  findPostByIdPending,
  findPostsByUserId,
  findPostsByUserIdPending,
  findPostsByUserIds,
  findPostsByUserIdsPending,
  postLookupFailure,
} from "../../reducers/post/postLookupSlice";

export const findPostsByUserIdAction = (data) => async (dispatch) => {
  dispatch(findPostsByUserIdPending());

  findPostsByUserIdRequest(data)
    .then((response) => {
      const posts = response.data;

      console.log("Posts by User Id: ", posts);

      dispatch(findPostsByUserId(posts));
    })
    .catch((error) => {
      console.log(error);
      dispatch(postLookupFailure());
    });
};

export const findPostByIdAction = (data) => async (dispatch) => {
  dispatch(findPostByIdPending());

  findPostByIdRequest(data)
    .then((response) => {
      const post = response.data;

      console.log("Post by Id: ", post);

      dispatch(findPostById(post));
    })
    .catch((error) => {
      console.log(error);
      dispatch(findPostByIdFailure());
    });
};

export const findAllPostsByUserIdsAction = (data) => async (dispatch) => {
  dispatch(findPostsByUserIdsPending());

  findAllPostsByUserIdsRequest(data)
    .then((response) => {
      const posts = response.data;

      console.log("Posts by User Ids: ", posts);

      dispatch(findPostsByUserIds(posts));
    })
    .catch((error) => {
      console.log(error);
      dispatch(postLookupFailure());
    });
};
