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
import { deleteCommentAction } from "../../../redux/actions/comment/commentManagementActions";

const PostCommentDeleteDialog = ({
  isOpen,
  onClose,
  cancelRef,
  postId = null,
  commentId = 0,
}) => {
  const dispatch = useDispatch();
  const { isDeletingComment, isCommentDeleted } = useSelector(
    (store) => store.comment.commentManagement
  );
  const token = localStorage.getItem("token");

  const handleCommentDelete = () => {
    if (token) {
      const data = { token, postId, commentId };

      console.log("Deleting comment with commentId: ", commentId);

      dispatch(deleteCommentAction(data));
    }
  };

  useEffect(() => {
    if (isCommentDeleted) {
      onClose();
    }
  }, [isCommentDeleted, onClose]);

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
            Delete Comment
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this comment? You cannot undo this
            action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              isDisabled={isDeletingComment}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              isLoading={isDeletingComment}
              loadingText="Deleting..."
              colorScheme="red"
              onClick={handleCommentDelete}
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

export default PostCommentDeleteDialog;
