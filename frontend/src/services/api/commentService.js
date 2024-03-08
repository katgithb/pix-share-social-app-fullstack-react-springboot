import axios from "axios";

const API_VERSION = import.meta.env.VITE_API_VERSION;
const API_RESOURCE = "comments";
const API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/api/${API_VERSION}/${API_RESOURCE}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const createCommentRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.post(`/create/${data.postId}`, data.comment, {
    headers,
  });
};

export const findCommentsByPostIdRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get(`/all/${data.postId}`, { headers });
};

export const findCommentByIdRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get(`/id/${data.commentId}`, { headers });
};

export const likeCommentRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/like/${data.commentId}`, {}, { headers });
};

export const unlikeCommentRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/unlike/${data.commentId}`, {}, { headers });
};

export const deleteCommentRequest = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.delete(`/delete/${data.commentId}`, { headers });
};
