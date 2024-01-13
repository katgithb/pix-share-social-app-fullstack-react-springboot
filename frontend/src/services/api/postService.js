import axios from "axios";

const API_VERSION = import.meta.env.VITE_API_VERSION;
const API_RESOURCE = "posts";
const API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/api/${API_VERSION}/${API_RESOURCE}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const createPostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.post("/create", data.post, { headers });
};

export const findPostsByUserIdRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get(`/all/${data.userId}`, { headers });
};

export const findPostByIdRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get(`/id/${data.postId}`, { headers });
};

export const findAllPostsByUserIdsRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };
  const params = data.pageFetchParams;

  return await axiosInstance.get(`/following/${data.userIds}`, {
    headers,
    params,
  });
};

export const likePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/like/${data.postId}`, {}, { headers });
};

export const unlikePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/unlike/${data.postId}`, {}, { headers });
};

export const isPostLikedByCurrentUserRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get(`/${data.postId}/isLiked`, { headers });
};

export const savePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/save_post/${data.postId}`, {}, { headers });
};

export const unsavePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(
    `/unsave_post/${data.postId}`,
    {},
    { headers }
  );
};

export const isPostSavedByCurrentUserRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get(`/${data.postId}/isSaved`, { headers });
};

export const deletePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.delete(`/delete/${data.postId}`, { headers });
};
