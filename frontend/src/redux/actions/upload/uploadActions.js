import { generateCloudinaryUploadSignature } from "../../../services/api/uploadHelperService";
import {
  CLOUDINARY_API_KEY,
  uploadImageToCloudinary,
} from "../../../services/cloudinaryUploadService";
import {
  errorToastNotification,
  successToastNotification,
} from "../../../utils/toastNotification";
import {
  cloudinaryImageUpload,
  cloudinaryImageUploadPending,
  uploadFailure,
} from "../../reducers/upload/uploadSlice";

export const cloudinaryImageUploadAction = (data) => async (dispatch) => {
  dispatch(cloudinaryImageUploadPending());

  try {
    // Fetch the upload signature for signed upload
    const uploadSignatureResponse = await generateCloudinaryUploadSignature(
      data
    );
    const uploadSignatureData = uploadSignatureResponse.data;

    console.log("Upload Signature Data: ", uploadSignatureData);

    if (
      uploadSignatureData.uploadSignature &&
      uploadSignatureData.timestamp &&
      uploadSignatureData.publicId
    ) {
      const formData = new FormData();
      formData.append("file", data.image);
      // formData.append('upload_preset', 'YOUR_UPLOAD_PRESET');
      formData.append("public_id", uploadSignatureData.publicId);
      formData.append("signature", uploadSignatureData.uploadSignature);
      formData.append("api_key", CLOUDINARY_API_KEY);
      formData.append("timestamp", uploadSignatureData.timestamp);

      uploadImageToCloudinary(formData)
        .then((response) => {
          const imagePublicId = response.data.public_id;
          const imageSecureUrl = response.data.secure_url;

          console.log("Image upload response: ", response.data);
          console.log("Image public id: ", imagePublicId);

          dispatch(
            cloudinaryImageUpload({
              publicId: imagePublicId,
              secureUrl: imageSecureUrl,
            })
          );

          console.log("Image Upload Success");
          successToastNotification("Photo uploaded", null);
        })
        .catch((error) => {
          console.log(error);
          dispatch(uploadFailure());
          errorToastNotification("Photo upload failed", null);
        });
    } else {
      dispatch(uploadFailure());
    }
  } catch (error) {
    console.log(error);
    dispatch(uploadFailure());
  }
};

// export const cloudinaryImageDestroyAction = (data) => async (dispatch) => {
//   dispatch(cloudinaryImageDestroyPending());

//   deleteImageResourceFromCloudinary(data)
//     .then((response) => {
//       console.log("Image destroy response: ", response.data);

//       dispatch(cloudinaryImageDestroy());

//       console.log("Image Destroy Success");
//       successToastNotification("Profile Photo removed", null);
//     })
//     .catch((error) => {
//       console.log(error);
//       dispatch(uploadFailure());
//       errorToastNotification("Profile Photo deletion failed", null);
//     });
// };

// export const cloudinaryImageDestroyAction = (data) => async (dispatch) => {
//   dispatch(cloudinaryImageDestroyPending());

//   try {
//     // Fetch the upload signature for signed upload
//     const uploadSignatureResponse = await generateCloudinaryUploadSignature(
//       data
//     );
//     const uploadSignatureData = uploadSignatureResponse.data;

//     console.log("Upload Signature Data: ", uploadSignatureData);

//     if (
//       uploadSignatureData.uploadSignature &&
//       uploadSignatureData.timestamp &&
//       uploadSignatureData.publicId
//     ) {
//       const formData = new FormData();
//       formData.append("public_id", uploadSignatureData.publicId);
//       formData.append("signature", uploadSignatureData.uploadSignature);
//       formData.append("api_key", CLOUDINARY_API_KEY);
//       formData.append("timestamp", uploadSignatureData.timestamp);

//       destroyImageFromCloudinary(formData)
//         .then((response) => {
//           console.log("Image destroy response: ", response.data);

//           dispatch(cloudinaryImageDestroy());

//           console.log("Image Destroy Success");
//           successToastNotification("Profile Photo removed", null);
//         })
//         .catch((error) => {
//           console.log(error);
//           dispatch(uploadFailure());
//           errorToastNotification(error.response.data.message, null);
//         });
//     } else {
//       dispatch(uploadFailure());
//     }
//   } catch (error) {
//     console.log(error);
//     dispatch(uploadFailure());
//   }
// };
