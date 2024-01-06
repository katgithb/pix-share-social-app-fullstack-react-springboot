import {
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Link,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BiExpandAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  FaHeart,
  FaRegComment,
  FaRegFaceSmile,
  FaRegHeart,
} from "react-icons/fa6";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { RiBookmarkFill, RiBookmarkLine } from "react-icons/ri";
import { Link as RouteLink } from "react-router-dom";
import useTruncateText from "../../../../hooks/useTruncateText";
import { getHumanReadableNumberFormat } from "../../../../utils/commonUtils";
import { getRelativePostTime } from "../../../../utils/postUtils";
import PostCommentCard from "../../../comment/PostCommentCard/PostCommentCard";
import AvatarGroupWithLoader from "../../../shared/AvatarGroupWithLoader";
import AvatarWithLoader from "../../../shared/AvatarWithLoader";
import ImageWithLoader from "../../../shared/ImageWithLoader";
import PostActionsMenu from "./PostActionsMenu";
import PostViewModal from "./PostViewModal/PostViewModal";

const PostFeedCard = ({
  currUser,
  post,
  postIdPage,
  checkPostLikedByCurrUser,
  checkPostSavedByCurrUser,
}) => {
  const MAX_COMMENTS = 2;
  const MAX_LIKED_USER_AVATARS = 3;
  const REQUEST_DELAY_IN_MS = 400;
  const {
    isOpen: isOpenPostViewModal,
    onOpen: onOpenPostViewModal,
    onClose: onClosePostViewModal,
  } = useDisclosure();
  const {
    isOpen: isOpenPostActionsMenu,
    onOpen: onOpenPostActionsMenu,
    onClose: onClosePostActionsMenu,
  } = useDisclosure();

  const [relativePostTime, setRelativePostTime] = useState(
    getRelativePostTime(post?.createdAt)
  );
  const truncatedCaptionText = useTruncateText(post?.caption, 140);

  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [isLikedLoading, setIsLikedLoading] = useState(true);
  const [isSavedByUser, setIsSavedByUser] = useState(false);
  const [isSavedLoading, setIsSavedLoading] = useState(false);
  const isLikedBtnLoaded = useRef(false);
  const isSavedBtnLoaded = useRef(false);

  const likedByUsersLength = post?.likedByUsers?.length || 0;
  const additionalLikesCount =
    likedByUsersLength > MAX_LIKED_USER_AVATARS
      ? getHumanReadableNumberFormat(
          likedByUsersLength - MAX_LIKED_USER_AVATARS
        )
      : getHumanReadableNumberFormat(likedByUsersLength);
  const likedByOthersCount = getHumanReadableNumberFormat(
    likedByUsersLength - MAX_LIKED_USER_AVATARS
  );
  const additionalLikesText =
    likedByUsersLength > MAX_LIKED_USER_AVATARS
      ? `+${additionalLikesCount}`
      : additionalLikesCount;
  const likesText = additionalLikesCount === 1 ? "like" : "likes";
  const likedByOthersText = likedByOthersCount === 1 ? "other" : "others";

  const commentsLength = post?.comments?.length || 0;
  const commentsCount = getHumanReadableNumberFormat(commentsLength);
  const commentsText = commentsLength === 1 ? "comment" : "comments";

  const likedByUsersAvatars = post?.likedByUsers
    .slice(-MAX_LIKED_USER_AVATARS)
    .reverse()
    .map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      image: user?.userImage,
    }));

  const checkPostLiked = useCallback(async () => {
    try {
      const isLiked = await checkPostLikedByCurrUser(post?.id, postIdPage);

      setIsLikedByUser(isLiked);
      setIsLikedLoading(false);
    } catch (error) {
      console.log(error);
      setIsLikedLoading(false);
    }
  }, [checkPostLikedByCurrUser, post?.id, postIdPage]);

  const checkPostSaved = useCallback(async () => {
    try {
      const isSaved = await checkPostSavedByCurrUser(post?.id, postIdPage);

      setIsSavedByUser(isSaved);
      setIsSavedLoading(false);
    } catch (error) {
      console.log(error);
      setIsSavedLoading(false);
    }
  }, [checkPostSavedByCurrUser, post?.id, postIdPage]);

  useEffect(() => {
    let timer;
    if (isSavedBtnLoaded.current) {
      timer = setTimeout(checkPostSaved, REQUEST_DELAY_IN_MS);
    } else {
      isSavedBtnLoaded.current = true;
    }

    return () => clearTimeout(timer);
  }, [checkPostSaved]);

  useEffect(() => {
    let timer;
    if (isLikedBtnLoaded.current) {
      timer = setTimeout(checkPostLiked, REQUEST_DELAY_IN_MS);
    } else {
      isLikedBtnLoaded.current = true;
    }

    return () => clearTimeout(timer);
  }, [checkPostLiked]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativePostTime(getRelativePostTime(post?.createdAt));
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
    };
  }, [post?.createdAt]);

  return (
    <Card
      mb={5}
      variant={useColorModeValue("outline", "elevated")}
      w="full"
      maxW="xl"
      rounded="lg"
      boxShadow={"md"}
      _hover={{ boxShadow: "lg" }}
    >
      <PostViewModal
        currUser={currUser}
        post={{
          ...post,
          isLikedByUser: isLikedByUser,
          isSavedByUser: isSavedByUser,
        }}
        isOpen={isOpenPostViewModal}
        onClose={onClosePostViewModal}
      />
      <CardHeader>
        <Flex overflow="hidden">
          <Flex flex="1" gap="3" align="center" flexWrap="wrap">
            <Link
              as={RouteLink}
              to={`/profile/${post?.user?.username}`}
              rounded="full"
            >
              <AvatarWithLoader
                loaderSize={12}
                name={post?.user?.name}
                src={post?.user?.userImage ? post?.user?.userImage : {}}
                size="md"
              />
            </Link>

            <Flex flexDirection="column" mb={-1} justify="center">
              <Heading size="sm" wordBreak="break-word" noOfLines={2}>
                <Link as={RouteLink} to={`/profile/${post?.user?.username}`}>
                  {post?.user?.username}
                </Link>
              </Heading>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={useColorModeValue("gray.500", "gray.400")}
                letterSpacing="wide"
                wordBreak="break-word"
                noOfLines={1}
              >
                {post?.location}
              </Text>
            </Flex>
          </Flex>

          <Flex py={1}>
            <PostActionsMenu
              currUser={currUser}
              post={post}
              onClose={onClosePostActionsMenu}
              menuIcon={<BsThreeDotsVertical />}
            />
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody pt={0} px={3}>
        <Flex
          border="1px"
          borderColor="gray.300"
          mb={3}
          justify="end"
          rounded="lg"
          flexWrap="wrap"
          position="relative"
          overflow="hidden"
        >
          <Flex
            flex={1}
            rounded="lg"
            minH="280px"
            maxH="340px"
            justify="center"
          >
            <ImageWithLoader
              src={post?.image}
              alt="Post Image"
              objectFit="contain"
              maxW="full"
              maxH="inherit"
            />
          </Flex>

          <Flex
            position="absolute"
            flexWrap={"wrap"}
            justify="flex-end"
            rounded="lg"
            h="full"
            p={3}
          >
            <Flex
              flexDirection="column"
              gap={2}
              rounded="lg"
              justify="space-between"
            >
              <IconButton
                icon={isSavedByUser ? <RiBookmarkFill /> : <RiBookmarkLine />}
                isLoading={isSavedLoading}
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
              />

              <IconButton
                icon={<BiExpandAlt />}
                isDisabled={isLikedLoading || isSavedLoading}
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
                onClick={onOpenPostViewModal}
              />
            </Flex>
          </Flex>
        </Flex>

        <Flex mx={-2} align="start" justify="space-between" overflow="hidden">
          <Flex align="center" flexWrap="wrap">
            <Flex align="center" mr={{ base: "0", md: "2" }}>
              <IconButton
                icon={isLikedByUser ? <FaHeart /> : <FaRegHeart />}
                isLoading={isLikedLoading}
                rounded="full"
                colorScheme={isLikedByUser ? "red" : "gray"}
                fontSize={"24"}
                variant="ghost"
                aria-label="Like"
              />

              {likedByUsersLength > 0 ? (
                <AvatarGroupWithLoader
                  loaderHeight={6}
                  avatars={likedByUsersAvatars}
                  hideBelow="md"
                  size="sm"
                  alignItems={"center"}
                >
                  <Badge
                    variant={"subtle"}
                    ml={0.5}
                    pl={likedByUsersLength > 3 ? 2 : 3}
                    pr={2}
                    colorScheme="red"
                    fontSize={"sm"}
                    fontWeight="semibold"
                    fontFamily="sans-serif"
                    textTransform="capitalize"
                    rounded="full"
                    boxShadow={"md"}
                  >
                    {additionalLikesText}{" "}
                    <Text as="span" fontSize="xs" fontWeight="normal">
                      {likesText}
                    </Text>
                  </Badge>
                </AvatarGroupWithLoader>
              ) : (
                <Badge
                  display={{ base: "none", md: "inherit" }}
                  variant={"subtle"}
                  ml={-1}
                  px={2}
                  colorScheme="red"
                  fontSize={"sm"}
                  fontWeight="semibold"
                  fontFamily="sans-serif"
                  textTransform="capitalize"
                  rounded="full"
                  boxShadow={"md"}
                >
                  <Text as="span" fontSize="xs" fontWeight="normal">
                    Be the first to <b>like!</b>
                  </Text>
                </Badge>
              )}
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
                  ml={-1}
                  px={2}
                  colorScheme="blue"
                  fontSize={"sm"}
                  fontWeight="semibold"
                  fontFamily="sans-serif"
                  textTransform="capitalize"
                  rounded="full"
                  boxShadow={"md"}
                >
                  {commentsCount}{" "}
                  <Text as="span" fontSize="xs" fontWeight="normal">
                    {commentsText}
                  </Text>
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

        <Flex
          mb={likedByUsersLength > 0 ? 1 : 2}
          hideFrom="md"
          align="center"
          overflow="hidden"
        >
          {likedByUsersLength > 0 ? (
            <AvatarGroupWithLoader
              loaderHeight={6}
              avatars={likedByUsersAvatars}
              hideFrom="md"
              size="sm"
              alignItems={"center"}
            >
              <Badge
                variant={"subtle"}
                ml={0.5}
                pl={likedByUsersLength > 3 ? 2 : 3}
                pr={2}
                colorScheme="red"
                fontSize={"sm"}
                fontWeight="semibold"
                fontFamily="sans-serif"
                textTransform="capitalize"
                rounded="full"
                boxShadow={"md"}
              >
                {additionalLikesText}{" "}
                <Text as="span" fontSize="xs" fontWeight="normal">
                  {likesText}
                </Text>
              </Badge>
            </AvatarGroupWithLoader>
          ) : (
            <Badge
              variant={"subtle"}
              ml={0}
              px={2}
              colorScheme="red"
              fontSize={"sm"}
              fontWeight="semibold"
              fontFamily="sans-serif"
              textTransform="capitalize"
              rounded="full"
              boxShadow={"md"}
            >
              <Text as="span" fontSize="xs" fontWeight="normal">
                Be the first to <b>like!</b>
              </Text>
            </Badge>
          )}
        </Flex>

        <Flex
          mb={likedByUsersLength > 0 ? 2 : 1}
          align="start"
          overflow="hidden"
        >
          {likedByUsersLength > 0 && (
            <Text fontSize={"xs"} noOfLines={4} overflow="hidden">
              Liked by{" "}
              <Text as="span" wordBreak="break-all" fontWeight="semibold">
                {post?.likedByUsers
                  .slice(-MAX_LIKED_USER_AVATARS)
                  .reverse()
                  .map((user) => (
                    <Link
                      as={RouteLink}
                      key={user.id}
                      to={`/profile/${user.username}`}
                    >
                      {user.username}
                    </Link>
                  ))
                  .reduce((prev, curr, index, array) => {
                    const isFirst = index === 0;
                    const isLast = index === array.length - 1;
                    const separator =
                      likedByUsersLength > MAX_LIKED_USER_AVATARS || !isLast
                        ? ", "
                        : " and ";

                    return isFirst ? [curr] : [...prev, separator, curr];
                  }, [])}
              </Text>
              {likedByUsersLength > MAX_LIKED_USER_AVATARS && (
                <>
                  {" "}
                  and{" "}
                  <Text as="span" fontWeight="semibold">
                    {likedByOthersCount} {likedByOthersText}
                  </Text>
                </>
              )}
            </Text>
          )}
        </Flex>

        {post?.caption?.length > 0 && (
          <Flex mb={2} align="center" justify="space-between" overflow="hidden">
            <Flex
              align="start"
              flex={1}
              p={1}
              border="1px"
              borderColor="gray.300"
              rounded="md"
              overflow="hidden"
            >
              <Box fontSize="sm" noOfLines={2}>
                <HStack justify="space-between">{truncatedCaptionText}</HStack>
              </Box>
            </Flex>
          </Flex>
        )}

        <Flex
          mb={commentsLength > 0 ? 2 : 0}
          pb={1}
          align="start"
          overflow="hidden"
        >
          <Badge
            variant={"subtle"}
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
        </Flex>

        <Flex
          borderTop={commentsLength > 0 ? "1px" : {}}
          borderTopColor={useColorModeValue("gray.500", "gray.400")}
          align="center"
          w="full"
          overflow="hidden"
        >
          <Flex
            flex={1}
            flexDirection="column"
            fontSize="sm"
            overflow="hidden"
            noOfLines={2}
          >
            {commentsLength > 0 ? (
              post?.comments
                ?.slice(0, MAX_COMMENTS)
                .map((comment, index) => (
                  <PostCommentCard
                    key={index}
                    currUser={currUser}
                    comment={comment}
                  />
                ))
            ) : (
              <></>
            )}
          </Flex>
        </Flex>

        {commentsLength > MAX_COMMENTS && (
          <Flex align="start" mt={2} pb={1} overflow="hidden">
            <Badge
              variant={"solid"}
              px={2.5}
              bgGradient={"linear(to-tr, yellow.400, pink.500)"}
              fontSize={{ base: "xs", md: "xs" }}
              fontWeight="semibold"
              fontFamily="sans-serif"
              letterSpacing="wide"
              rounded="full"
              boxShadow={"md"}
              cursor={
                isLikedLoading || isSavedLoading ? "not-allowed" : "pointer"
              }
              opacity={isLikedLoading || isSavedLoading ? 0.6 : 1}
              _hover={{
                transition: "transform .3s ease",
                transform:
                  isLikedLoading || isSavedLoading
                    ? "scaleX(1)"
                    : "scaleX(1.025) translateX(1.5%)",
              }}
              onClick={
                isLikedLoading || isSavedLoading ? {} : onOpenPostViewModal
              }
            >
              View all {commentsLength} comments
            </Badge>
          </Flex>
        )}
      </CardBody>
      <CardFooter pt={0} px={3}>
        <Flex align="center" w="full" overflow="hidden">
          <Flex align="center">
            <AvatarWithLoader
              loaderSize={9}
              name={currUser?.name}
              src={currUser?.userImage ? currUser?.userImage : {}}
              boxSize={9}
            />
          </Flex>

          <Flex
            flex="1"
            align="center"
            ml={2}
            bg={"gray.100"}
            rounded="full"
            overflow="hidden"
          >
            <Link pl="2" as={RouteLink} href="">
              <Icon color={"gray.500"} as={FaRegFaceSmile} boxSize={6} />
            </Link>
            <Input
              type="text"
              placeholder="Add a comment..."
              bg={"gray.100"}
              border={0}
              color={"gray.500"}
              rounded="full"
              w="full"
              focusBorderColor="transparent"
              _placeholder={{
                color: "gray.500",
              }}
            />
            <Link pr="0" as={RouteLink}>
              <IconButton
                icon={<AiOutlineSend />}
                rounded="full"
                color={useColorModeValue("blue.400", "blue.500")}
                fontSize={"24"}
                fontWeight="bold"
                variant="ghost"
                aria-label="Post Comment"
              />
            </Link>
          </Flex>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default PostFeedCard;
