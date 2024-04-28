import { AUTH_TOKEN_NAME } from "./constants/tokenNames";

export const getAuthToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_NAME);
  return token;
};

export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_NAME, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_NAME);
};
