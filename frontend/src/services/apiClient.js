import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (usernameAndPassword) => {
  return await axios.post(
    `${API_BASE_URL}/api/v1/auth/login`,
    usernameAndPassword
  );
};

export const register = async (user) => {
  return await axios.post(`${API_BASE_URL}/api/v1/auth/signup`, user);
};
