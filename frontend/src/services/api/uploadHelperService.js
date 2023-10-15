import axios from "axios";

const API_VERSION = import.meta.env.VITE_API_VERSION;
const API_RESOURCE = "upload";
const API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/api/${API_VERSION}/${API_RESOURCE}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const generateCloudinaryUploadSignature = async (data) => {
  const headers = { Authorization: `Bearer ${data.token}` };

  return await axiosInstance.post("/signature", data.signatureData, {
    headers,
  });
};

// export const deleteImageResourceFromCloudinary = async (data) => {
//   const headers = { Authorization: `Bearer ${data.token}` };

//   return await axiosInstance.delete("/delete", {
//     headers,
//     data: data.uploadDeleteData,
//   });
// };
