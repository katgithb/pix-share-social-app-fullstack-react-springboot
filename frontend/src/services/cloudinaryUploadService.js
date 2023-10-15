import axios from "axios";

const CLOUDINARY_API_VERSION = import.meta.env.VITE_CLOUDINARY_API_VERSION;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_BASE_URL = `${
  import.meta.env.VITE_CLOUDINARY_API_BASE_URL
}/${CLOUDINARY_API_VERSION}/${CLOUDINARY_CLOUD_NAME}`;
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

const axiosInstance = axios.create({
  baseURL: CLOUDINARY_API_BASE_URL,
});

export const uploadImageToCloudinary = async (data) => {
  return await axiosInstance.post("/image/upload", data);
};

export const destroyImageFromCloudinary = async (data) => {
  return await axiosInstance.post("/image/destroy", data);
};
