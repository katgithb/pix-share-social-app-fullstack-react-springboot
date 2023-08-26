import axios from "axios";

const API_VERSION = import.meta.env.VITE_API_VERSION;
const API_RESOURCE = "users";
const API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/api/${API_VERSION}/${API_RESOURCE}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const getUserProfile = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get("/account/profile", { headers });
};

export const getUserByUserName = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get(`/username/${data.username}`, {
    headers,
  });
};

export const getUsersByUserIds = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get(`/m/${data.userIds}`, {
    headers,
  });
};

export const searchUsersBySearchTerm = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get("/search", {
    headers,
    params: {
      q: data.query,
    },
  });
};

export const getPopularUsers = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.get("/popular", {
    headers,
  });
};

export const updateFollow = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/follow/${data.userId}`, null, {
    headers,
  });
};

export const updateUnfollow = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put(`/unfollow/${data.userId}`, null, {
    headers,
  });
};

export const updateUser = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.put("/account/edit", data.user, { headers });
};

export const deleteUser = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.delete("/account/delete", {
    headers,
  });
};
