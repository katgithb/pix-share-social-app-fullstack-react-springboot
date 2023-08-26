import axios from "axios";

const API_VERSION = import.meta.env.VITE_API_VERSION;
const API_RESOURCE = "auth";
const API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/api/${API_VERSION}/${API_RESOURCE}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async (usernameAndPassword) => {
  return await axiosInstance.post("/login", usernameAndPassword);
};

export const createUser = async (user) => {
  return await axiosInstance.post("/signup", user);
};
