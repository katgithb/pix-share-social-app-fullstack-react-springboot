import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  ScaleFade,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link as RouteLink } from "react-router-dom";
import useIsUserAuthenticated from "../../../../../hooks/useIsUserAuthenticated";
import { findPostByIdAction } from "../../../../../redux/actions/post/postLookupActions";
import {
  clearLikedComment,
  clearUnlikedComment,
} from "../../../../../redux/reducers/comment/commentSocialSlice";
import { infoToastNotification } from "../../../../../utils/toastNotification";
import AvatarWithLoader from "../../../../shared/AvatarWithLoader";
import CustomizableModal from "../../../../shared/CustomizableModal";
import PostActionsMenu from "../PostActionsMenu";
import PostExpandedView from "./PostExpandedView";
import PostImageExpandedView from "./PostImageExpandedView";

const PostViewModal = ({
  currUser,
  post,
  updateLoadedPostEntry,
  isOpen,
  onClose,
}) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isSavedStatusUpdated, setIsSavedStatusUpdated] = useState(false);
  const likeStatusUpdatedCommentsSet = useRef(new Set());

  const dispatch = useDispatch();
  const isUserAuthenticated = useIsUserAuthenticated();
  const token = localStorage.getItem("token");

  const changeCommentLikeUpdatesSet = useCallback((commentId) => {
    if (!likeStatusUpdatedCommentsSet.current.has(commentId)) {
      likeStatusUpdatedCommentsSet.current.add(commentId);
    }
  }, []);

  const clearCommentLikeUpdates = useCallback(
    (commentLikeUpdatesSet = new Set()) => {
      for (let commentId of commentLikeUpdatesSet) {
        if (commentId) {
          dispatch(clearLikedComment(commentId));
          dispatch(clearUnlikedComment(commentId));
        }
      }
    },
    [dispatch]
  );

  const refetchPost = useCallback(
    (postId) => {
      if (token && postId) {
        const data = {
          token,
          postId,
        };

        dispatch(findPostByIdAction(data));
      }
    },
    [dispatch, token]
  );

  const handleModalClose = () => {
    const commentLikeUpdatesSet = likeStatusUpdatedCommentsSet.current;
    setIsImageExpanded(false);

    if (isSavedStatusUpdated || commentLikeUpdatesSet.size > 0) {
      refetchPost(post?.id);
      clearCommentLikeUpdates(commentLikeUpdatesSet);
    }

    likeStatusUpdatedCommentsSet.current.clear();
    onClose();
  };

  const handleInformUserFeatureRequiresAuth = () => {
    infoToastNotification(
      <p>Sign Up or Login to access this feature</p>,
      "This feature is available for registered users only!"
    );
  };

  return (
    <CustomizableModal
      isOpen={isOpen}
      onClose={handleModalClose}
      size={isImageExpanded ? "full" : "5xl"}
      header={
        isImageExpanded ? null : (
          <HeaderContent
            isUserAuthenticated={isUserAuthenticated}
            currUser={currUser}
            post={post}
            handleInformUserFeatureRequiresAuth={
              handleInformUserFeatureRequiresAuth
            }
            handleModalClose={handleModalClose}
          />
        )
      }
      showModalCloseButton={false}
      scrollBehavior={"outside"}
    >
      {isImageExpanded ? (
        <ScaleFade in initialScale={0.9}>
          <PostImageExpandedView
            post={post}
            setIsImageExpanded={setIsImageExpanded}
            onClose={handleModalClose}
          />
        </ScaleFade>
      ) : (
        <ScaleFade in initialScale={0.9}>
          <PostExpandedView
            isUserAuthenticated={isUserAuthenticated}
            currUser={currUser}
            post={post}
            updateLoadedPostEntry={updateLoadedPostEntry}
            changeCommentLikeUpdatesSet={changeCommentLikeUpdatesSet}
            handleInformUserFeatureRequiresAuth={
              handleInformUserFeatureRequiresAuth
            }
            setIsImageExpanded={setIsImageExpanded}
            setIsSavedStatusUpdated={setIsSavedStatusUpdated}
            onClose={handleModalClose}
          />
        </ScaleFade>
      )}
    </CustomizableModal>
  );
};

const HeaderContent = ({
  isUserAuthenticated = false,
  currUser,
  post,
  handleInformUserFeatureRequiresAuth = () => {},
  handleModalClose,
}) => {
  const {
    isOpen: isOpenPostActionsMenu,
    onOpen: onOpenPostActionsMenu,
    onClose: onClosePostActionsMenu,
  } = useDisclosure();

  return (
    <Box>
      <Box mx={-2} mt={-2} overflow="hidden">
        <Flex pb={1} overflow="hidden">
          <Flex
            flex="1"
            gap="3"
            align="center"
            flexWrap="wrap"
            overflow="hidden"
          >
            <Link
              as={RouteLink}
              to={`/profile/${post?.user?.username}`}
              rounded="full"
            >
              <AvatarWithLoader
                loaderSize={10}
                name={post?.user?.name}
                src={post?.user?.userImage ? post?.user?.userImage : {}}
                boxSize="10"
              />
            </Link>

            <Flex flexDirection="column" mb={-1.5} justify="center">
              <Heading size="xs" wordBreak={"break-word"}>
                <Link as={RouteLink} to={`/profile/${post?.user?.username}`}>
                  {post?.user?.username}
                </Link>
              </Heading>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={useColorModeValue("gray.500", "gray.400")}
                letterSpacing="wide"
                wordBreak={"break-word"}
              >
                {post?.user?.name}
              </Text>
            </Flex>
          </Flex>

          <PostActionsMenu
            isUserAuthenticated={isUserAuthenticated}
            currUser={currUser}
            post={post}
            handleInformUserFeatureRequiresAuth={
              handleInformUserFeatureRequiresAuth
            }
            isModalActionsMenu
            handleModalClose={handleModalClose}
            onClose={onClosePostActionsMenu}
            menuIcon={<BsThreeDots />}
          />
        </Flex>
      </Box>

      <Box mx={-6}>
        <Divider />
      </Box>
    </Box>
  );
};

export default PostViewModal;
