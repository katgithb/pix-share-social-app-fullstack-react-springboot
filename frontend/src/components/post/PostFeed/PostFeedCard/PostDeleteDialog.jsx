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
import { deletePostAction } from "../../../../redux/actions/post/postManagementActions";

const PostDeleteDialog = ({ isOpen, onClose, cancelRef, postId = 0 }) => {
  const dispatch = useDispatch();
  const { isDeletingPost, isPostDeleted } = useSelector(
    (store) => store.post.postManagement
  );
  const token = localStorage.getItem("token");

  const handlePostDelete = () => {
    if (token) {
      const data = { token, postId };

      console.log("Deleting post with postId: ", postId);

      dispatch(deletePostAction(data));
    }
  };

  useEffect(() => {
    if (isPostDeleted) {
      onClose();
    }
  }, [isPostDeleted, onClose]);

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
            Delete Post
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this post? You cannot undo this
            action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              isDisabled={isDeletingPost}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              isLoading={isDeletingPost}
              loadingText="Deleting..."
              colorScheme="red"
              onClick={handlePostDelete}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default PostDeleteDialog;
