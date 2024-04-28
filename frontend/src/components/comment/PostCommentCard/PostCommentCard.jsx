import {
  Box,
  Card,
  Divider,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { IoRemoveCircleOutline, IoTimerOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouteLink } from "react-router-dom";
import useTruncateText from "../../../hooks/useTruncateText";
import {
  likeCommentAction,
  unlikeCommentAction,
} from "../../../redux/actions/comment/commentSocialActions";
import { getAuthToken } from "../../../utils/authUtils";
import {
  getRelativeCommentTime,
  isCurrUserComment,
} from "../../../utils/commentUtils";
import { getHumanReadableNumberFormat } from "../../../utils/commonUtils";
import AvatarWithLoader from "../../shared/AvatarWithLoader";
import PostCommentDeleteDialog from "./PostCommentDeleteDialog";

const PostCommentCard = ({
  isUserAuthenticated = false,
  currUser,
  postId,
  comment,
  changeCommentLikeUpdatesSet = () => {},
  handleInformUserFeatureRequiresAuth = () => {},
  showRelativeTime = false,
}) => {
  const COMMENT_TRUNCATE_CHARS_LIMIT = 100;
  const {
    isOpen: isOpenPostCommentDeleteDialog,
    onOpen: onOpenPostCommentDeleteDialog,
    onClose: onClosePostCommentDeleteDialog,
  } = useDisclosure();
  const postCommentDeleteDialogCancelRef = useRef();
  const [relativeCommentTime, setRelativeCommentTime] = useState(
    getRelativeCommentTime(comment?.createdAt)
  );
  const truncatedCommentText = useTruncateText(
    comment?.content,
    COMMENT_TRUNCATE_CHARS_LIMIT
  );

  const dispatch = useDispatch();
  const commentSocial = useSelector((store) => store.comment.commentSocial);
  const { isCreatingComment, isDeletingComment } = useSelector(
    (store) => store.comment.commentManagement
  );
  const token = getAuthToken();

  const [isLikedByUser, setIsLikedByUser] = useState(
    comment && !_.isEmpty(comment) ? comment?.isLikedByAuthUser : false
  );

  const [likedByUsersLength, setLikedByUsersLength] = useState(
    comment?.likedByUsers?.length || 0
  );
  const [likesCount, setLikesCount] = useState(
    getHumanReadableNumberFormat(likedByUsersLength)
  );

  const handleCommentLike = () => {
    if (token && comment?.id) {
      const data = {
        token,
        commentId: comment?.id,
      };

      dispatch(likeCommentAction(data));
    }
  };

  const handleCommentUnlike = () => {
    if (token && comment?.id) {
      const data = {
        token,
        commentId: comment?.id,
      };

      dispatch(unlikeCommentAction(data));
    }
  };

  const updateCommentLiked = useCallback(
    (commentId, updatedComment, isLiked) => {
      const updatedCommentId = updatedComment?.id;
      const isCommentLikedByUser = updatedComment?.isLikedByAuthUser;

      if (
        updatedComment &&
        !_.isEmpty(updatedComment) &&
        isCommentLikedByUser === isLiked &&
        updatedCommentId === commentId
      ) {
        const likedByUsersLength = updatedComment?.likedByUsers?.length || 0;

        setIsLikedByUser(isLiked);
        setLikedByUsersLength(likedByUsersLength);
        setLikesCount(getHumanReadableNumberFormat(likedByUsersLength));
        changeCommentLikeUpdatesSet(commentId);
      }
    },
    [changeCommentLikeUpdatesSet]
  );

  useEffect(() => {
    const commentId = comment?.id;
    if (commentId && commentId in commentSocial.likedComments) {
      const likedComment = commentSocial.likedComments[commentId];

      updateCommentLiked(commentId, likedComment, true);
    }
  }, [comment?.id, commentSocial.likedComments, updateCommentLiked]);

  useEffect(() => {
    const commentId = comment?.id;
    if (commentId && commentId in commentSocial.unlikedComments) {
      const unlikedComment = commentSocial.unlikedComments[commentId];

      updateCommentLiked(commentId, unlikedComment, false);
    }
  }, [comment?.id, commentSocial.unlikedComments, updateCommentLiked]);

  useEffect(() => {
    let interval;
    if (showRelativeTime) {
      interval = setInterval(() => {
        setRelativeCommentTime(getRelativeCommentTime(comment?.createdAt));
      }, 60000); // Update every minute
    }

    return () => {
      clearInterval(interval);
    };
  }, [comment?.createdAt, showRelativeTime]);

  return (
    <Box mt={2} px={2}>
      {isCurrUserComment(currUser?.id, comment?.user?.id) && (
        <PostCommentDeleteDialog
          isOpen={isOpenPostCommentDeleteDialog}
          onClose={onClosePostCommentDeleteDialog}
          cancelRef={postCommentDeleteDialogCancelRef}
          postId={postId}
          commentId={comment?.id}
        />
      )}

      <HStack align="center" justify="space-between" flexWrap="wrap">
        <Flex flex="1" align="start" gap={2}>
          <Flex align="center">
            <Link
              as={RouteLink}
              to={`/profile/${comment?.user?.username}`}
              rounded="full"
            >
              <AvatarWithLoader
                loaderSize={8}
                name={comment?.user?.name}
                src={comment?.user?.userImage ? comment?.user?.userImage : {}}
                size="sm"
              />
            </Link>
          </Flex>

          <Flex flexDirection="column">
            <HStack
              flex="1"
              minH={8}
              gap={0}
              align="center"
              justify="space-between"
              flexWrap="wrap"
            >
              <Flex flexDirection="column" align="start">
                <Text
                  as="span"
                  fontWeight="semibold"
                  wordBreak="break-all"
                  noOfLines={1}
                >
                  <Link
                    as={RouteLink}
                    to={`/profile/${comment?.user?.username}`}
                  >
                    {comment?.user?.username}
                  </Link>
                </Text>
              </Flex>
            </HStack>

            <Card
              gap={0.5}
              mb={1}
              px={2}
              py={1}
              variant={"outline"}
              rounded="lg"
              boxShadow={"md"}
              _dark={{ variant: "elevated" }}
            >
              <HStack gap={2} align="center" justify="space-between">
                <Text
                  fontSize="xs"
                  color={"gray.500"}
                  _dark={{ color: "gray.400" }}
                  textTransform="capitalize"
                  letterSpacing="wide"
                  fontWeight="semibold"
                  wordBreak="break-all"
                  noOfLines={2}
                >
                  {comment?.user?.name}
                </Text>

                {isCurrUserComment(currUser?.id, comment?.user?.id) && (
                  <Tooltip label="Delete Comment" rounded="full">
                    <IconButton
                      icon={<IoRemoveCircleOutline />}
                      isDisabled={isCreatingComment || isDeletingComment}
                      mx={-2}
                      rounded="full"
                      colorScheme="red"
                      size="sm"
                      variant="link"
                      aria-label="Delete Comment"
                      onClick={
                        isCreatingComment || isDeletingComment
                          ? () => {}
                          : onOpenPostCommentDeleteDialog
                      }
                    />
                  </Tooltip>
                )}
              </HStack>

              <HStack align="start" justify="space-between">
                {truncatedCommentText}
              </HStack>

              <Divider />

              <HStack
                flex="1"
                gap={1.5}
                align="start"
                justify="space-between"
                flexWrap="wrap"
              >
                <Flex gap={1} align="center">
                  <IconButton
                    icon={isLikedByUser ? <FaHeart /> : <FaRegHeart />}
                    isLoading={
                      comment?.id in commentSocial.isLikedLoading
                        ? commentSocial.isLikedLoading[comment?.id]
                        : false
                    }
                    mx={-2}
                    rounded="full"
                    colorScheme={isLikedByUser ? "red" : "gray"}
                    size="sm"
                    variant="link"
                    aria-label="Like"
                    onClick={
                      isUserAuthenticated
                        ? isLikedByUser
                          ? handleCommentUnlike
                          : handleCommentLike
                        : handleInformUserFeatureRequiresAuth
                    }
                  />

                  {likedByUsersLength > 0 ? (
                    <Text
                      fontSize="xs"
                      color={"gray.500"}
                      _dark={{ color: "gray.400" }}
                      textTransform="lowercase"
                      letterSpacing="wide"
                    >
                      {likesCount}
                    </Text>
                  ) : (
                    <Text
                      fontSize="xs"
                      color={"gray.500"}
                      _dark={{ color: "gray.400" }}
                      textTransform="capitalize"
                      letterSpacing="wide"
                    >
                      Like
                    </Text>
                  )}
                </Flex>

                {showRelativeTime && (
                  <Flex gap={1} align="center">
                    <IconButton
                      icon={<IoTimerOutline />}
                      mx={-2}
                      pointerEvents="none"
                      rounded="full"
                      colorScheme="teal"
                      size="sm"
                      variant="link"
                      aria-label="Like"
                    />
                    <Text
                      fontSize="xs"
                      color={"gray.500"}
                      _dark={{ color: "gray.400" }}
                      textTransform="lowercase"
                      letterSpacing="wide"
                    >
                      {relativeCommentTime}
                    </Text>
                  </Flex>
                )}
              </HStack>
            </Card>
          </Flex>
        </Flex>
      </HStack>
    </Box>
  );
};

export default PostCommentCard;
