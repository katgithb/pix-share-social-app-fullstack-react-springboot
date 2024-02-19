import { CloseIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import _ from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AiOutlineExpand, AiOutlineSend } from "react-icons/ai";
import { BsCardText } from "react-icons/bs";
import {
  FaHeart,
  FaRegComment,
  FaRegFaceSmile,
  FaRegHeart,
} from "react-icons/fa6";
import { GoLocation } from "react-icons/go";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { RiBookmarkFill, RiBookmarkLine } from "react-icons/ri";
import { RxTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Virtuoso } from "react-virtuoso";
import * as Yup from "yup";
import useTruncateText from "../../../../../hooks/useTruncateText";
import { createCommentAction } from "../../../../../redux/actions/comment/commentManagementActions";
import { findPostByIdAction } from "../../../../../redux/actions/post/postLookupActions";
import {
  isPostLikedByUserAction,
  isPostSavedByUserAction,
  likePostAction,
  savePostAction,
  unlikePostAction,
  unsavePostAction,
} from "../../../../../redux/actions/post/postSocialActions";
import {
  clearLikedComment,
  clearUnlikedComment,
} from "../../../../../redux/reducers/comment/commentSocialSlice";
import {
  clearIsPostLikedByUser,
  clearIsPostSavedByUser,
  clearLikedPost,
  clearSavedPost,
  clearUnlikedPost,
  clearUnsavedPost,
} from "../../../../../redux/reducers/post/postSocialSlice";
import { getHumanReadableNumberFormat } from "../../../../../utils/commonUtils";
import { getRelativePostTime } from "../../../../../utils/postUtils";
import PostCommentCard from "../../../../comment/PostCommentCard/PostCommentCard";
import AvatarWithLoader from "../../../../shared/AvatarWithLoader";
import CustomCommentTextInput from "../../../../shared/customFormElements/CustomCommentTextInput";
import ImageWithLoader from "../../../../shared/ImageWithLoader";

const PostExpandedView = ({
  currUser,
  post,
  updateLoadedPostEntry,
  setIsImageExpanded,
  onClose,
}) => {
  const CAPTION_TRUNCATE_CHARS_LIMIT = 100;
  const COMMENT_MAX_CHARS = 250;
  const initialValues = {
    comment: "",
  };

  const validationSchema = Yup.object().shape({
    comment: Yup.string()
      .max(COMMENT_MAX_CHARS, `Must be at most ${COMMENT_MAX_CHARS} characters`)
      .matches(/\S/, "Must not be blank"),
  });

  const dispatch = useDispatch();
  const postSocial = useSelector((store) => store.post.postSocial);
  const commentManagement = useSelector(
    (store) => store.comment.commentManagement
  );
  const token = localStorage.getItem("token");
  const [showImageOverlay, setShowImageOverlay] = useState(true);
  const [relativePostTime, setRelativePostTime] = useState(
    getRelativePostTime(post?.createdAt)
  );
  const truncatedCaptionText = useTruncateText(
    post?.caption,
    CAPTION_TRUNCATE_CHARS_LIMIT
  );

  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [isLikedLoading, setIsLikedLoading] = useState(true);
  const [isSavedByUser, setIsSavedByUser] = useState(false);
  const [isSavedLoading, setIsSavedLoading] = useState(true);
  const isLikedBtnLoaded = useRef(false);
  const isSavedBtnLoaded = useRef(false);
  const likeStatusUpdatedCommentsSet = useRef(new Set());

  const likedByUsersLength = post?.likedByUsers?.length || 0;
  const likesCount = getHumanReadableNumberFormat(likedByUsersLength);
  const commentsLength = post?.comments?.length || 0;
  const commentsCount = getHumanReadableNumberFormat(commentsLength);

  const togglePostImageOverlay = () => {
    setShowImageOverlay(!showImageOverlay);
  };

  const handleExpandPostImage = () => {
    setIsImageExpanded(true);
  };

  const handleModalClose = () => {
    if (token && post?.id && likeStatusUpdatedCommentsSet.current.size > 0) {
      const data = {
        token,
        postId: post?.id,
      };

      dispatch(findPostByIdAction(data));
    }

    for (let commentId of likeStatusUpdatedCommentsSet.current) {
      if (commentId) {
        dispatch(clearLikedComment(commentId));
        dispatch(clearUnlikedComment(commentId));
      }
    }
    likeStatusUpdatedCommentsSet.current.clear();
    onClose();
  };

  const handleCommentFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);
    if (token && post?.id) {
      const data = {
        token,
        postId: post?.id,
        comment: { content: values.comment },
      };

      dispatch(createCommentAction(data));
    }
    setSubmitting(false);
  };

  const changeCommentLikeUpdatesSet = useCallback((commentId) => {
    if (!likeStatusUpdatedCommentsSet.current.has(commentId)) {
      likeStatusUpdatedCommentsSet.current.add(commentId);
    }

    console.log(
      "Comment Like Updates in PostModal:",
      likeStatusUpdatedCommentsSet.current
    );
  }, []);

  const fetchPostLiked = useCallback(
    (postId) => {
      if (token && postId) {
        const data = {
          token,
          postId,
        };

        dispatch(isPostLikedByUserAction(data));
      }
    },
    [dispatch, token]
  );

  const fetchPostSaved = useCallback(
    (postId) => {
      if (token && postId) {
        const data = {
          token,
          postId,
        };

        dispatch(isPostSavedByUserAction(data));
      }
    },
    [dispatch, token]
  );

  const handlePostLike = () => {
    setIsLikedLoading(true);

    if (token && post?.id) {
      const data = {
        token,
        postId: post?.id,
      };

      dispatch(likePostAction(data));
    }
  };

  const handlePostUnlike = () => {
    setIsLikedLoading(true);

    if (token && post?.id) {
      const data = {
        token,
        postId: post?.id,
      };

      dispatch(unlikePostAction(data));
    }
  };

  const handlePostSave = () => {
    setIsSavedLoading(true);

    if (token && post?.id) {
      const data = {
        token,
        postId: post?.id,
      };

      dispatch(savePostAction(data));
    }
  };

  const handlePostUnsave = () => {
    setIsSavedLoading(true);

    if (token && post?.id) {
      const data = {
        token,
        postId: post?.id,
      };

      dispatch(unsavePostAction(data));
    }
  };

  const updatePostLiked = useCallback(
    (postId, updatedPost, isLiked) => {
      const updatedPostId = updatedPost?.id;
      if (updatedPostId === postId) {
        setIsLikedByUser(isLiked);
        setIsLikedLoading(false);

        isLiked
          ? dispatch(clearLikedPost(updatedPostId))
          : dispatch(clearUnlikedPost(updatedPostId));

        updateLoadedPostEntry(updatedPostId, updatedPost);
      }
    },
    [dispatch, updateLoadedPostEntry]
  );

  const updatePostSaved = useCallback(
    (postId, isSaved) => {
      setIsSavedByUser(isSaved);
      setIsSavedLoading(false);

      isSaved
        ? dispatch(clearSavedPost(postId))
        : dispatch(clearUnsavedPost(postId));
    },
    [dispatch]
  );

  useEffect(() => {
    const postId = post?.id;
    if (postId && postId in postSocial.likedPosts) {
      const likedPost = postSocial.likedPosts[postId];
      updatePostLiked(postId, likedPost, true);
    }
  }, [post?.id, postSocial.likedPosts, updatePostLiked]);

  useEffect(() => {
    const postId = post?.id;
    if (postId && postId in postSocial.unlikedPosts) {
      const unlikedPost = postSocial.unlikedPosts[postId];
      updatePostLiked(postId, unlikedPost, false);
    }
  }, [post?.id, postSocial.unlikedPosts, updatePostLiked]);

  useEffect(() => {
    const postId = post?.id;
    if (postId && postId in postSocial.savedPosts) {
      updatePostSaved(postId, true);
    }
  }, [post?.id, postSocial.savedPosts, updatePostSaved]);

  useEffect(() => {
    const postId = post?.id;
    if (postId && postId in postSocial.unsavedPosts) {
      updatePostSaved(postId, false);
    }
  }, [post?.id, postSocial.unsavedPosts, updatePostSaved]);

  useEffect(() => {
    const postId = post?.id;
    if (postId && postId in postSocial.isLikedByUser) {
      const isLiked = postSocial.isLikedByUser[postId];

      setIsLikedByUser(isLiked);
      setIsLikedLoading(false);
      dispatch(clearIsPostLikedByUser(postId));
    }
  }, [dispatch, post?.id, postSocial.isLikedByUser]);

  useEffect(() => {
    const postId = post?.id;
    if (postId && postId in postSocial.isSavedByUser) {
      const isSaved = postSocial.isSavedByUser[postId];

      setIsSavedByUser(isSaved);
      setIsSavedLoading(false);
      dispatch(clearIsPostSavedByUser(postId));
    }
  }, [dispatch, post?.id, postSocial.isSavedByUser]);

  useEffect(() => {
    if (_.isBoolean(post?.isSavedByUser)) {
      setIsSavedByUser(post?.isSavedByUser);
      setIsSavedLoading(false);
      return;
    }
    if (isSavedBtnLoaded.current) {
      fetchPostSaved(post?.id);
    } else {
      isSavedBtnLoaded.current = true;
    }
  }, [fetchPostSaved, post?.id, post?.isSavedByUser]);

  useEffect(() => {
    if (_.isBoolean(post?.isLikedByUser)) {
      setIsLikedByUser(post?.isLikedByUser);
      setIsLikedLoading(false);
      return;
    }
    if (isLikedBtnLoaded.current) {
      fetchPostLiked(post?.id);
    } else {
      isLikedBtnLoaded.current = true;
    }
  }, [fetchPostLiked, post?.id, post?.isLikedByUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativePostTime(getRelativePostTime(post?.createdAt));
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
    };
  }, [post?.createdAt]);

  const PostCommentCardItem = ({ comment }) => {
    const MemoizedPostCommentCard = useMemo(
      () => (
        <PostCommentCard
          key={comment?.id}
          currUser={currUser}
          comment={comment}
          changeCommentLikeUpdatesSet={changeCommentLikeUpdatesSet}
          showRelativeTime={true}
        />
      ),
      [comment]
    );

    return MemoizedPostCommentCard;
  };

  const rowContent = (index) => {
    const comment = post?.comments[index];

    return <PostCommentCardItem comment={comment} />;
  };

  const ScrollSeekPlaceholder = ({ height, width, index }) => (
    <Flex
      key={index}
      h={height}
      flex="1"
      align="start"
      my={2}
      gap={2}
      overflow="hidden"
      pointerEvents="none"
    >
      <Flex align="center">
        <SkeletonCircle size="2em" />
      </Flex>

      <Flex flex="1" flexDirection="column" align="start" gap={2}>
        <Flex minH={8} align="center" w="full">
          <Skeleton height="14px" width="40%" rounded="lg" />
        </Flex>
        <Skeleton mb={1} height="4.313em" width="60%" rounded="lg" />
      </Flex>
    </Flex>
  );

  return (
    <Flex
      h={{ base: {}, md: "85vh" }}
      flexDir={{ base: "column", md: "inherit" }}
      justify="center"
      mt={-4}
      gap={2}
    >
      <Flex
        flex={3}
        border="1px"
        borderColor="gray.300"
        position="relative"
        align="center"
        justify="end"
        overflow="hidden"
        rounded="lg"
        ml={{ base: "0", md: "-2" }}
        mb={{ base: "1", md: "0" }}
        p={{ base: "0", md: "2" }}
      >
        <Flex
          flex={1}
          rounded="lg"
          minH="340px"
          maxH={{ base: "720px", md: "full" }}
          justify="center"
          onClick={togglePostImageOverlay}
        >
          <ImageWithLoader
            src={post?.image}
            alt="Post Image"
            objectFit="cover"
            maxW="full"
            maxH="inherit"
            rounded="lg"
            boxShadow={post?.image ? "md" : {}}
          />
        </Flex>

        <Flex
          position="absolute"
          flexWrap={"wrap"}
          rounded="lg"
          justifySelf="start"
          left={0}
          h="full"
          px={2}
          py={3}
          overflow="hidden"
          transition="opacity 0.3s ease-in-out"
          opacity={showImageOverlay ? 1 : 0}
        >
          <Flex
            flexDirection="column"
            gap={2}
            rounded="lg"
            justify="space-between"
          >
            <IconButton
              icon={<CloseIcon />}
              bg={useColorModeValue("gray.100", "gray.500")}
              rounded="full"
              colorScheme="cyan"
              fontSize={{ base: "xs", md: "sm" }}
              variant="ghost"
              aria-label="Save"
              boxShadow={"md"}
              _hover={{
                bg: useColorModeValue("gray.200", "gray.600"),
              }}
              onClick={handleModalClose}
            />
          </Flex>
        </Flex>

        <Flex
          position="absolute"
          flexWrap={"wrap"}
          rounded="lg"
          right={0}
          h="full"
          px={2}
          py={3}
          overflow="hidden"
          transition="opacity 0.3s ease-in-out"
          opacity={showImageOverlay ? 1 : 0}
        >
          <Flex
            flexDirection="column"
            gap={2}
            rounded="lg"
            justify="space-between"
          >
            <IconButton
              icon={isSavedByUser ? <RiBookmarkFill /> : <RiBookmarkLine />}
              isLoading={
                post?.id in postSocial.isSavedLoading
                  ? postSocial.isSavedLoading[post?.id]
                  : isSavedLoading
              }
              bg={useColorModeValue("gray.100", "gray.500")}
              rounded="full"
              colorScheme="cyan"
              fontSize={{ base: "md", md: "20" }}
              variant="ghost"
              aria-label="Save"
              boxShadow={"md"}
              _hover={{
                bg: useColorModeValue("gray.200", "gray.600"),
              }}
              onClick={isSavedByUser ? handlePostUnsave : handlePostSave}
            />

            <IconButton
              icon={<AiOutlineExpand />}
              bg={useColorModeValue("gray.100", "gray.500")}
              rounded="full"
              colorScheme="twitter"
              fontSize={{ base: "md", md: "20" }}
              variant="ghost"
              aria-label="Save"
              boxShadow={"md"}
              _hover={{
                bg: useColorModeValue("gray.200", "gray.600"),
              }}
              onClick={handleExpandPostImage}
            />
          </Flex>
        </Flex>
      </Flex>

      <Box my={-2}>
        <Divider orientation="vertical" />
      </Box>

      <Flex
        flexDir="column"
        flex={2}
        overflow="hidden"
        ml={{ base: "-2", md: "-2" }}
        mr={{ base: "-2", md: "-4" }}
        my={{ base: "initial", md: "-2" }}
        p={2}
      >
        <Card
          flex={1}
          maxH={{ base: "75vh", md: "full" }}
          variant={useColorModeValue("outline", "elevated")}
          border={useColorModeValue("", "1px")}
          rounded="lg"
          boxShadow={"md"}
          _hover={{ boxShadow: "lg" }}
          overflowY="auto"
        >
          <CardHeader px={2} py={2} boxShadow="md">
            {post?.caption?.length > 0 && (
              <Flex
                mb={1}
                align="center"
                justify="space-between"
                overflow="hidden"
              >
                <Flex
                  maxH={{ base: "15vh", md: "20vh" }}
                  overflowY="auto"
                  align="start"
                  flex={1}
                  p={1}
                  border="1px"
                  borderColor="gray.300"
                  rounded="md"
                >
                  <Box fontSize="sm" noOfLines={2}>
                    <HStack gap={2} align="center" justify="space-between">
                      <IconButton
                        icon={<BsCardText />}
                        pointerEvents="none"
                        rounded="full"
                        colorScheme="blue"
                        size="sm"
                        fontSize="lg"
                        variant="ghost"
                        alignSelf="start"
                        ml={-1}
                      />
                      {truncatedCaptionText}
                    </HStack>
                  </Box>
                </Flex>
              </Flex>
            )}

            <Flex
              flexDirection="column"
              mb={1}
              gap={0}
              align="start"
              overflow="hidden"
            >
              <HStack gap={0} align="center" justify="space-between">
                <IconButton
                  icon={<RxTimer />}
                  pointerEvents="none"
                  rounded="full"
                  colorScheme="teal"
                  size="sm"
                  fontSize="lg"
                  variant="ghost"
                />
                <Badge
                  variant={"subtle"}
                  ml={1}
                  px={2.5}
                  colorScheme="teal"
                  fontSize={{ base: "xs", md: "xs" }}
                  fontWeight="semibold"
                  fontFamily="sans-serif"
                  letterSpacing="wide"
                  rounded="full"
                  boxShadow={"md"}
                >
                  {relativePostTime}
                </Badge>
              </HStack>

              {post?.location && (
                <HStack gap={0} align="center" justify="space-between">
                  <IconButton
                    icon={<GoLocation />}
                    pointerEvents="none"
                    rounded="full"
                    colorScheme="blue"
                    size="sm"
                    fontSize="lg"
                    variant="ghost"
                  />
                  <Text
                    fontSize={"xs"}
                    fontWeight="semibold"
                    fontFamily="sans-serif"
                    color={"gray.500"}
                    letterSpacing="wide"
                    ml={1}
                    px={0.5}
                    wordBreak={"break-word"}
                    _dark={{ color: "gray.400" }}
                  >
                    {post?.location}
                  </Text>
                </HStack>
              )}
            </Flex>

            <Flex
              mx={-1}
              align="start"
              justify="space-between"
              overflow="hidden"
            >
              <Flex align="center" flexWrap="wrap">
                <Flex align="center" mr={{ base: "2", md: "2" }}>
                  <IconButton
                    icon={isLikedByUser ? <FaHeart /> : <FaRegHeart />}
                    isLoading={
                      post?.id in postSocial.isLikedLoading
                        ? postSocial.isLikedLoading[post?.id]
                        : isLikedLoading
                    }
                    rounded="full"
                    colorScheme={isLikedByUser ? "red" : "gray"}
                    fontSize={"24"}
                    variant="ghost"
                    aria-label="Like"
                    onClick={isLikedByUser ? handlePostUnlike : handlePostLike}
                  />
                  <Badge
                    variant={"subtle"}
                    px={2}
                    colorScheme="red"
                    fontSize={"sm"}
                    fontWeight="semibold"
                    fontFamily="sans-serif"
                    textTransform="capitalize"
                    rounded="full"
                    boxShadow={"md"}
                  >
                    {likedByUsersLength > 0 ? likesCount : "Like"}
                  </Badge>
                </Flex>

                {commentsLength > 0 && (
                  <Flex align="center">
                    <IconButton
                      icon={<FaRegComment />}
                      pointerEvents="none"
                      rounded="full"
                      colorScheme="gray"
                      fontSize={"24"}
                      variant="ghost"
                      aria-label="Comment"
                    />
                    <Badge
                      variant={"subtle"}
                      px={2}
                      colorScheme="blue"
                      fontSize={"sm"}
                      fontWeight="semibold"
                      fontFamily="sans-serif"
                      textTransform="capitalize"
                      rounded="full"
                      boxShadow={"md"}
                    >
                      {commentsCount}
                    </Badge>
                  </Flex>
                )}
              </Flex>

              <Flex align="center" rounded="full">
                <Box>
                  <IconButton
                    icon={<PiPaperPlaneTiltBold />}
                    pointerEvents="none"
                    rounded="full"
                    colorScheme="gray"
                    fontSize={"24"}
                    fontWeight="bold"
                    variant="ghost"
                    aria-label="Share"
                  />
                </Box>
              </Flex>
            </Flex>
          </CardHeader>

          <Divider display={useColorModeValue("none", "inherit")} />

          <CardBody px={0} py={0}>
            {commentsLength > 0 ? (
              <Flex
                flex={1}
                flexDirection="column"
                py={1}
                minH={{ base: "125px", md: "175px" }}
                fontSize="sm"
                overflowY="auto"
                h="full"
              >
                <Virtuoso
                  style={{
                    flex: 1,
                    scrollBehavior: "smooth",
                  }}
                  totalCount={commentsLength}
                  itemContent={rowContent}
                  overscan={150}
                  components={{ ScrollSeekPlaceholder }}
                  scrollSeekConfiguration={{
                    enter: (velocity) => Math.abs(velocity) > 500,
                    exit: (velocity) => Math.abs(velocity) < 62.5,
                  }}
                />
              </Flex>
            ) : (
              <Flex
                flex={1}
                px={2}
                py={1}
                minH={{ base: "100px", md: "175px" }}
                align="center"
                justify="center"
                h="full"
              >
                <Text fontSize="sm" fontWeight="semibold" textAlign="center">
                  No comments yet. Be the first to comment!
                </Text>
              </Flex>
            )}
          </CardBody>

          <Divider display={useColorModeValue("none", "inherit")} />

          <CardFooter
            px={2}
            py={2}
            boxShadow="0px -4px 6px -1px rgba(0, 0, 0, 0.1)"
          >
            <Flex flexDirection="column" w="full" justify="center">
              <Flex align="center" w="full" overflow="hidden">
                <Flex align="center">
                  <AvatarWithLoader
                    loaderSize={9}
                    name={currUser?.name}
                    src={currUser?.userImage ? currUser?.userImage : {}}
                    boxSize={9}
                  />
                </Flex>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleCommentFormSubmission}
                >
                  {({ isValid, isSubmitting }) => (
                    <Flex
                      as={Form}
                      flex="1"
                      align="center"
                      ml={2}
                      bg={"gray.100"}
                      rounded="full"
                      overflow="hidden"
                    >
                      <CustomCommentTextInput
                        isRequired
                        id={"comment"}
                        name={"comment"}
                        placeholder={"Add a comment..."}
                        bg={"gray.100"}
                        color={"gray.500"}
                        rounded="full"
                        w="full"
                        outline="none"
                        borderColor="transparent"
                        focusBorderColor="transparent"
                        maxChars={COMMENT_MAX_CHARS}
                        _placeholder={{
                          color: "gray.500",
                        }}
                        inputLeftElement={
                          <Icon
                            color={"gray.500"}
                            as={FaRegFaceSmile}
                            boxSize={6}
                          />
                        }
                        inputRightElement={
                          <IconButton
                            type={"submit"}
                            isDisabled={
                              !isValid ||
                              isSubmitting ||
                              commentManagement.isDeletingComment
                            }
                            isLoading={commentManagement.isCreatingComment}
                            icon={<AiOutlineSend />}
                            rounded="full"
                            color="blue.400"
                            fontSize="2xl"
                            fontWeight="bold"
                            variant="ghost"
                            aria-label="Post Comment"
                            _dark={{ color: "blue.500" }}
                          />
                        }
                      />
                    </Flex>
                  )}
                </Formik>
              </Flex>
            </Flex>
          </CardFooter>
        </Card>
      </Flex>
    </Flex>
  );
};

export default PostExpandedView;
