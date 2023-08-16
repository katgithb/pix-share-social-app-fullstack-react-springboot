import { CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  HStack,
  IconButton,
  Icon,
  Image,
  Input,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineExpand, AiOutlineSend } from "react-icons/ai";
import { BiSolidBookmark } from "react-icons/bi";
import { FaHeart, FaRegComment, FaRegFaceSmile } from "react-icons/fa6";
import { GoLocation } from "react-icons/go";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { RxTimer } from "react-icons/rx";
import { Link as RouteLink } from "react-router-dom";
import PostCommentCard from "../../../../comment/PostCommentCard";

const PostExpandedView = ({
  currUser,
  user,
  post,
  setIsImageExpanded,
  onClose,
}) => {
  const [showImageOverlay, setShowImageOverlay] = useState(true);

  const useTruncateAndAddReadMore = (text, maxChars = 100) => {
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);
    if (text.length <= maxChars) {
      return <Text>{text}</Text>;
    } else {
      const truncatedText = isTextOverflowing
        ? text
        : `${text.substring(0, maxChars)}...`;
      const readMoreLink = (
        <Text
          as="span"
          alignSelf="start"
          color={"gray.500"}
          _dark={{ color: "gray.400" }}
          fontWeight="semibold"
          cursor="pointer"
          _hover={{
            textDecorationLine: "underline",
          }}
          onClick={() => setIsTextOverflowing(!isTextOverflowing)}
        >
          {isTextOverflowing ? "less" : "more"}
        </Text>
      );
      return (
        <>
          <Text noOfLines={!isTextOverflowing ? 2 : {}}>{truncatedText}</Text>

          {readMoreLink}
        </>
      );
    }
  };

  const togglePostImageOverlay = () => {
    setShowImageOverlay(!showImageOverlay);
  };

  const captionText = useTruncateAndAddReadMore(post?.caption, 100);
  // console.log(user, post);
  console.log(post?.comments.length);

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
        position="relative"
        align="center"
        justify="end"
        overflow="hidden"
        ml={{ base: "-2", md: "-4" }}
        mr={{ base: "-2", md: "-2" }}
        mt={{ base: "-1", md: "-2" }}
        mb={{ base: "1", md: "-2" }}
        p={2}
      >
        <Flex
          position="relative"
          justify="center"
          h="full"
          onClick={togglePostImageOverlay}
        >
          <Image
            src={post?.image}
            minH={"380px"}
            maxH="full"
            loading="lazy"
            objectFit="cover"
            alt=""
            rounded="lg"
            boxShadow="md"
          />
        </Flex>

        <Flex
          position="absolute"
          flexWrap={"wrap"}
          rounded="lg"
          justifySelf="start"
          left={2}
          h="full"
          px={3}
          py={5}
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
          h="full"
          px={3}
          py={5}
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
              icon={<BiSolidBookmark />}
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
              onClick={() => setIsImageExpanded(true)}
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
                // overflow="hidden"
              >
                <Box fontSize="sm" noOfLines={2}>
                  <HStack gap={2} align="center" justify="space-between">
                    <Avatar
                      p="0.5"
                      name={user?.fullname}
                      src={user?.dp}
                      boxSize={9}
                      loading="lazy"
                      alignSelf="start"
                    />
                    {captionText}
                  </HStack>
                </Box>
              </Flex>
            </Flex>

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
                  16 hours ago
                </Badge>
              </HStack>

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
                  color={useColorModeValue("gray.500", "gray.400")}
                  letterSpacing="wide"
                  ml={1}
                  px={0.5}
                  wordBreak={"break-word"}
                >
                  London, City of London, United Kingdom
                </Text>
              </HStack>
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
                    icon={<FaHeart />}
                    rounded="full"
                    colorScheme="red"
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
                    110.65k
                  </Badge>
                </Flex>

                <Flex align="center">
                  <IconButton
                    icon={<FaRegComment />}
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
                    433.84k
                  </Badge>
                </Flex>
              </Flex>

              <Flex align="center" rounded="full">
                <Box>
                  <IconButton
                    icon={<PiPaperPlaneTiltBold />}
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
            py={0}
          >
            <Flex
              flex={1}
              flexDirection="column"
              align={post?.comments.length > 0 ? {} : "center"}
              fontSize="sm"
              overflow="hidden"
              h={post?.comments.length > 0 ? {} : "full"}
              noOfLines={2}
            >
              {post?.comments.length ? (
                post?.comments.map((comment, index) => (
                  <PostCommentCard key={index} user={user} comment={comment} />
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
                  <Avatar
                    name={currUser?.fullname}
                    src={currUser?.dp}
                    boxSize={9}
                    loading="lazy"
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
