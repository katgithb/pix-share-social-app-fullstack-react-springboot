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
  return await axiosInstance.get(`/all/${data.userId}`);
};

export const findPostByIdRequest = async (data) => {
  return await axiosInstance.get(`/id/${data.postId}`);
};

export const findAllPostsByUserIdsRequest = async (data) => {
  return await axiosInstance.get(`/following/${data.userIds}`);
};

export const likePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/like/${data.postId}`, { headers });
};

export const unlikePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/unlike/${data.postId}`, { headers });
};

export const savePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/save_post/${data.postId}`, { headers });
};

export const unsavePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/unsave_post/${data.postId}`, { headers });
};

export const deletePostRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.delete(`/delete/${data.postId}`, { headers });
};
