import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUserImageAction } from "../../../redux/actions/user/userProfileActions";

const UserAvatarDeleteDialog = ({ isOpen, onClose, cancelRef, currUser }) => {
  const dispatch = useDispatch();
  const { isRemovingUserImage, isUserImageRemoved } = useSelector(
    (store) => store.user.userProfile
  );
  const token = localStorage.getItem("token");
  // const upload = useSelector((store) => store.upload);

  // const handleImageDestroy = () => {
  //   if (token && currUser?.userImageUploadId) {
  //     const imageUploadId = currUser?.userImageUploadId;
  //     // const uploadType = "avatar";
  //     // const data = {
  //     //   token,
  //     //   signatureData: { uploadType },
  //     // };
  //     const data = {
  //       token,
  //       uploadDeleteData: { imageUploadId },
  //     };
  //     dispatch(cloudinaryImageDestroyAction(data))
  //       .then(() => {
  //         onClose();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });

  //     console.log("Destroyed Media Upload Id: ", currUser?.userImageUploadId);
  //   }
  // };

  const handleUserAvatarDelete = () => {
    if (token) {
      const data = { token };

      console.log("Removing Media Upload Id: ", currUser?.userImageUploadId);

      dispatch(removeUserImageAction(data));
    }
  };

  useEffect(() => {
    if (isUserImageRemoved) {
      onClose();
    }
  }, [isUserImageRemoved, onClose]);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Remove Profile Photo
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to remove your profile photo? You cannot undo
            this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              isDisabled={isRemovingUserImage}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              // isLoading={upload.isLoading}
              isLoading={isRemovingUserImage}
              loadingText="Removing..."
              colorScheme="red"
              // onClick={handleImageDestroy}
              onClick={handleUserAvatarDelete}
              ml={3}
            >
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default UserAvatarDeleteDialog;
