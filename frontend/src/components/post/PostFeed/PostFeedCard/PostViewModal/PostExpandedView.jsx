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
  Input,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
import { Link as RouteLink } from "react-router-dom";
import useTruncateText from "../../../../../hooks/useTruncateText";
import { getHumanReadableNumberFormat } from "../../../../../utils/commonUtils";
import { getRelativePostTime } from "../../../../../utils/postUtils";
import PostCommentCard from "../../../../comment/PostCommentCard/PostCommentCard";
import AvatarWithLoader from "../../../../shared/AvatarWithLoader";
import ImageWithLoader from "../../../../shared/ImageWithLoader";

const PostExpandedView = ({ currUser, post, setIsImageExpanded, onClose }) => {
  const [showImageOverlay, setShowImageOverlay] = useState(true);
  const [relativePostTime, setRelativePostTime] = useState(
    getRelativePostTime(post?.createdAt)
  );
  const truncatedCaptionText = useTruncateText(post?.caption, 100);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativePostTime(getRelativePostTime(post?.createdAt));
    }, 60000); // Update every minute

    return () => {
      clearInterval(interval);
    };
  }, [post?.createdAt]);

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
              onClick={onClose}
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
              icon={
                post?.isSavedByUser ? <RiBookmarkFill /> : <RiBookmarkLine />
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
                    icon={post?.isLikedByUser ? <FaHeart /> : <FaRegHeart />}
                    rounded="full"
                    colorScheme={post?.isLikedByUser ? "red" : "gray"}
                    fontSize={"24"}
                    variant="ghost"
                    aria-label="Like"
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

          <CardBody
            minH={{ base: "100px", md: "175px" }}
            alignItems="center"
            overflowY="auto"
            px={2}
            py={1}
          >
            <Flex
              flex={1}
              flexDirection="column"
              align={commentsLength > 0 ? {} : "center"}
              fontSize="sm"
              overflow="hidden"
              h={commentsLength > 0 ? {} : "full"}
              noOfLines={2}
            >
              {commentsLength > 0 ? (
                post?.comments.map((comment, index) => (
                  <PostCommentCard
                    key={index}
                    currUser={currUser}
                    comment={comment}
                    showRelativeTime={true}
                  />
                ))
              ) : (
                <Flex flex={1} align="center" justify="center" h="full">
                  <Text fontSize="sm" fontWeight="semibold" textAlign="center">
                    No comments
                  </Text>
                </Flex>
              )}
            </Flex>
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
            </Flex>
          </CardFooter>
        </Card>
      </Flex>
    </Flex>
  );
};

export default PostExpandedView;
