import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Link,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BiCommentDetail, BiExpandAlt, BiSolidBookmark } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart, FaRegComment, FaRegFaceSmile } from "react-icons/fa6";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { Link as RouteLink } from "react-router-dom";
import PostActionsMenu from "./PostActionsMenu";
import PostCommentCard from "../../../comment/PostCommentCard";
import PostViewModal from "./PostViewModal/PostViewModal";

const PostFeedCard = ({ currUser, user, post }) => {
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
  // const captionText = useTextOverflow(2);
  const MAX_COMMENTS = 2;
  const caption =
    "\"Fantasy is a necessary ingredient in living, it's a way of looking at life through the wrong end of a telescope, and that enables you to laugh at life's realities\" - Dr. Seuss";

  const useTruncatedText = (text, maxChars = 100) => {
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);
    if (text <= maxChars) {
      return text;
    }

    const truncatedText = isTextOverflowing
      ? text
      : `${text.slice(0, maxChars)}...`;

    return { truncatedText, isTextOverflowing, setIsTextOverflowing };
  };

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
          alignSelf="end"
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

  const captionText = useTruncateAndAddReadMore(caption, 140);

  function generateRandomName() {
    const names = [
      "John Doe",
      "Jane Smith",
      "Alex Johnson Hades Kate Wilber Robert",
      "Sarah Thompson",
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }

  function generateRandomUsername(fullname) {
    const username = fullname.replace(/\s+/g, "_").toLowerCase();

    return username;
  }

  function generateRandomCaption() {
    const captions = [
      "Laborum nemo error odio. Ratione explicabo et odio.",
      "Vel aperiam doloribus mollitia et et. Fuga autem omnis voluptates nihil in fugit totam adipisci. Voluptatum voluptatem exercitationem rerum molestiae cum et hic. Molestias dolores ex et molestiae. Quaerat qui et voluptate adipisci autem.",
      "Est asperiores dignissimos fuga. Voluptas id at voluptatum. Ea facere magni necessitatibus et praesentium aut.",
      "Porro et nulla nulla quo rem rerum exercitationem. Facilis quia dolorem beatae sed eos exercitationem voluptas reprehenderit et. Cum voluptate repudiandae laborum ut tempore. Laborum maxime nihil ab veniam in. In distinctio laboriosam.",
      "Et est in est rerum est. Vel labore veniam repellat fugit eum distinctio quia eaque consequatur. Est eos deserunt in.",
      "Delectus sit cupiditate est. Quod maxime consequatur consequatur.",
      "Ipsa ratione harum consectetur quas repudiandae quibusdam sint amet ducimus.",
      "Enim rem odio eos est repudiandae eveniet distinctio voluptatum reprehenderit.",
    ];
    const randomIndex = Math.floor(Math.random() * captions.length);
    return captions[randomIndex];
  }

  function generateRandomComments() {
    const randomComments = [];
    const comments = [
      "Laborum nemo error odio. Ratione explicabo et odio.",
      "Vel aperiam doloribus mollitia et et. Fuga autem omnis voluptates nihil in fugit totam adipisci. Voluptatum voluptatem exercitationem rerum molestiae cum et hic. Molestias dolores ex et molestiae. Quaerat qui et voluptate adipisci autem.",
      "Est asperiores dignissimos fuga. Voluptas id at voluptatum. Ea facere magni necessitatibus et praesentium aut.",
      "Porro et nulla nulla quo rem rerum exercitationem. Facilis quia dolorem beatae sed eos exercitationem voluptas reprehenderit et. Cum voluptate repudiandae laborum ut tempore. Laborum maxime nihil ab veniam in. In distinctio laboriosam.",
      "Et est in est rerum est. Vel labore veniam repellat fugit eum distinctio quia eaque consequatur. Est eos deserunt in.",
      "Delectus sit cupiditate est. Quod maxime consequatur consequatur.",
      "Ipsa ratione harum consectetur quas repudiandae quibusdam sint amet ducimus.",
      "Enim rem odio eos est repudiandae eveniet distinctio voluptatum reprehenderit.",
    ];

    const randomIndex = Math.floor(Math.random() * comments.length);
    for (let i = 0; i < randomIndex; i++) {
      const comment = comments[i];
      randomComments.push(comment);
    }

    return randomComments;
  }

  function useTextOverflow(lines = 1) {
    const textRef = useRef(null);
    const containerRef = useRef(null);
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        if (textRef.current && containerRef.current) {
          const text = textRef.current.innerText;
          const containerWidth =
            containerRef.current.getBoundingClientRect().width;
          const charWidth = 8; // Adjust this value based on current font and styling
          const maxChars = Math.floor(containerWidth / charWidth);

          lines === 1
            ? setIsTextOverflowing(text.length > maxChars + charWidth / 2)
            : setIsTextOverflowing(
                text.length > maxChars * lines + charWidth * lines
              );
        }
      };

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return { textRef, containerRef, isTextOverflowing };
  }

  return (
    <Card
      mb={5}
      variant={useColorModeValue("outline", "elevated")}
      maxW="xl"
      rounded="lg"
      boxShadow={"md"}
      _hover={{ boxShadow: "lg" }}
    >
      <PostViewModal
        currUser={currUser}
        user={user}
        post={post}
        isOpen={isOpenPostViewModal}
        onClose={onClosePostViewModal}
      />
      <CardHeader>
        <Flex overflow="hidden">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              name={user?.fullname}
              src={user?.dp}
              size="md"
              loading="lazy"
            />

            <Flex flexDirection="column" mb={-1} justify="center">
              <Heading size="sm" wordBreak="break-word">
                {user?.username}
              </Heading>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={useColorModeValue("gray.500", "gray.400")}
                letterSpacing="wide"
                wordBreak="break-word"
              >
                Amsterdam, Netherlands
              </Text>
            </Flex>
          </Flex>
          {/* <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={<BsThreeDotsVertical />}
          /> */}
          <PostActionsMenu
            isOpen={isOpenPostActionsMenu}
            onClose={onClosePostActionsMenu}
            menuIcon={<BsThreeDotsVertical />}
          />
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
            rounded="lg"
            minH="200px"
            align="center"
            justify="center"
            w="full"
          >
            <Box maxW="1280px" maxH="720px">
              <Image
                src={post?.image}
                // fallbackSrc="path/to/placeholder.jpg"
                alt="Post Image"
                loading="lazy"
                objectFit="cover"
                w="full"
                h="full"
              />
            </Box>
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
                icon={<BiExpandAlt />}
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

          {/* <Flex
            position="absolute"
            flexWrap={"wrap"}
            justify="space-between"
            rounded="lg"
            w="full"
            p={3}
          > */}
          {/* <Flex
              top="0"
              flexDirection={"column"}
              rounded="lg"
            >
              <Flex align={"flex-start"} rounded="full">
                <IconButton
                  icon={<FaHeart />}
                  bg={useColorModeValue("gray.100", "gray.500")}
                  rounded="full"
                  colorScheme="red"
                  fontSize={{ base: "md", md: "lg" }}
                  variant="ghost"
                  aria-label="Like"
                  boxShadow={"md"}
                  _hover={{
                    bg: useColorModeValue("gray.200", "gray.600"),
                  }}
                />
                <Badge
                  variant={"solid"}
                  ml="-2"
                  px={2.5}
                  // py={0.5}
                  bgGradient={"linear(to-tr, yellow.400, pink.500)"}
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="semibold"
                  fontFamily="sans-serif"
                  rounded="full"
                  boxShadow={"md"}
                >
                  433.8k
                </Badge>
              </Flex>

              <Flex align={"flex-start"} rounded="full" mt={3}>
                <IconButton
                  icon={<FaRegComment />}
                  bg={useColorModeValue("gray.100", "gray.500")}
                  rounded="full"
                  colorScheme="gray"
                  fontSize={{ base: "md", md: "lg" }}
                  variant="ghost"
                  aria-label="Comment"
                  boxShadow={"md"}
                  _hover={{
                    bg: useColorModeValue("gray.200", "gray.600"),
                  }}
                />
                <Badge
                  variant={"solid"}
                  ml="-2"
                  px={2.5}
                  // py={0.5}
                  bgGradient={"linear(to-tr, yellow.400, pink.500)"}
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="semibold"
                  fontFamily="sans-serif"
                  rounded="full"
                  boxShadow={"md"}
                >
                  12.6k
                </Badge>
              </Flex>

              <Flex align={"flex-start"} rounded="full" mt={3} mb={3}>
                <IconButton
                  icon={<FaRegPaperPlane />}
                  bg={useColorModeValue("gray.100", "gray.500")}
                  rounded="full"
                  colorScheme="gray"
                  fontSize={{ base: "md", md: "lg" }}
                  variant="ghost"
                  aria-label="Share"
                  boxShadow={"md"}
                  _hover={{
                    bg: useColorModeValue("gray.200", "gray.600"),
                  }}
                />
              </Flex>
            </Flex> */}

          {/* <Flex
              // right="0"
              rounded="lg"
            >
              <IconButton
                icon={<FaRegBookmark />}
                bg={useColorModeValue("gray.100", "gray.500")}
                rounded="full"
                colorScheme="gray"
                fontSize={{ base: "md", md: "lg" }}
                variant="ghost"
                aria-label="Save"
                boxShadow={"md"}
                _hover={{
                  bg: useColorModeValue("gray.200", "gray.600"),
                }}
              />
            </Flex> */}
          {/* </Flex> */}
        </Flex>

        <Flex mx={-2} align="start" justify="space-between" overflow="hidden">
          <Flex align="center" flexWrap="wrap">
            <Flex align="center" mr={{ base: "0", md: "2" }}>
              <IconButton
                icon={<FaHeart />}
                rounded="full"
                colorScheme="red"
                fontSize={"24"}
                variant="ghost"
                aria-label="Like"
              />

              <AvatarGroup
                display={{ base: "none", md: "inherit" }}
                size="sm"
                alignItems={"center"}
                max={4}
              >
                <Avatar name={user?.fullname} src={user?.dp} loading="lazy" />
                <Avatar
                  name="Kent Dodds"
                  src="https://bit.ly/kent-c-dodds"
                  loading="lazy"
                />
                <Avatar
                  name="Prosper Muyiwa"
                  src="https://bit.ly/prosper-baba"
                  loading="lazy"
                />

                <Badge
                  variant={"subtle"}
                  ml={0.5}
                  px={2}
                  colorScheme="red"
                  fontSize={"sm"}
                  fontWeight="semibold"
                  fontFamily="sans-serif"
                  textTransform="capitalize"
                  rounded="full"
                  boxShadow={"md"}
                >
                  +110.65k{" "}
                  <Text
                    as="span"
                    fontSize="xs"
                    fontWeight="normal"
                    textTransform="capitalize"
                  >
                    Likes
                  </Text>
                </Badge>
              </AvatarGroup>
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
                433.84k{" "}
                <Text as="span" fontSize="xs" fontWeight="normal">
                  Comments
                </Text>
              </Badge>
            </Flex>
          </Flex>

          <Flex align="center" rounded="full">
            {/* <Box align="start">
              <IconButton
                icon={<FaRegHeart />}
                // bg={useColorModeValue("gray.100", "gray.500")}
                rounded="full"
                colorScheme="gray"
                fontSize={{ base: "md", md: "24px" }}
                variant="ghost"
                aria-label="Like"
                // boxShadow={"md"}
                // _hover={{
                //   bg: useColorModeValue("gray.200", "gray.600"),
                // }}
              />
              <Badge
                variant={"subtle"}
                ml={-1}
                px={2}
                colorScheme="red"
                fontSize={"sm"}
                fontWeight="medium"
                fontFamily="sans-serif"
                textTransform="capitalize"
                rounded="full"
                boxShadow={"md"}
              >
                Like
              </Badge>
            </Box> */}

            {/* <Box>
              <IconButton
                icon={<FaRegComment />}
                // bg={useColorModeValue("gray.100", "gray.500")}
                rounded="full"
                colorScheme="gray"
                fontSize={{ base: "md", md: "24" }}
                variant="ghost"
                aria-label="Comment"
                // boxShadow={"md"}
                // _hover={{
                //   bg: useColorModeValue("gray.200", "gray.600"),
                // }}
              />
              <Badge
                variant={"subtle"}
                ml={-1}
                px={2}
                colorScheme="blue"
                fontSize={"sm"}
                fontWeight="semibold"
                fontFamily="sans-serif"
                rounded="full"
                boxShadow={"md"}
              >
                433.8K
              </Badge>
            </Box> */}

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

        <Flex
          mb={1}
          display={{ base: "inherit", md: "none" }}
          align="center"
          overflow="hidden"
        >
          <AvatarGroup size="sm" alignItems={"center"} max={4}>
            <Avatar name={user?.fullname} src={user?.dp} loading="lazy" />
            <Avatar
              name="Kent Dodds"
              src="https://bit.ly/kent-c-dodds"
              loading="lazy"
            />
            <Avatar
              name="Prosper Muyiwa"
              src="https://bit.ly/prosper-baba"
              loading="lazy"
            />

            <Badge
              variant={"subtle"}
              ml={0.5}
              px={2}
              colorScheme="red"
              fontSize={"sm"}
              fontWeight="semibold"
              fontFamily="sans-serif"
              textTransform="capitalize"
              rounded="full"
              boxShadow={"md"}
            >
              +110.65k{" "}
              <Text
                as="span"
                fontSize="xs"
                fontWeight="normal"
                textTransform="capitalize"
              >
                Likes
              </Text>
            </Badge>
          </AvatarGroup>
        </Flex>

        <Flex mb={2} align="start" overflow="hidden">
          <Text fontSize={"xs"} noOfLines={2} overflow="hidden">
            Liked by{" "}
            <Text as="span" wordBreak="break-all" fontWeight="semibold">
              {user?.username.length > 50
                ? `${user?.username.slice(0, 50)}...`
                : user?.username}
            </Text>{" "}
            and{" "}
            <Text as="span" fontWeight="semibold">
              112 others
            </Text>
          </Text>
        </Flex>

        <Flex mb={2} align="center" justify="space-between" overflow="hidden">
          <Flex align="start" overflow="hidden">
            <Box fontSize="sm" noOfLines={2}>
              <Text as="span" fontWeight="semibold" noOfLines={1}>
                {user?.username}
              </Text>{" "}
              <HStack justify="space-between">
                {captionText}
                {/* <Text noOfLines={!captionText.isTextOverflowing ? 2 : {}}>
                  {captionText.truncatedText}
                </Text>
                {caption.length > 100 && (
                  <Text
                    as="span"
                    alignSelf="end"
                    color={"gray.500"}
                    _dark={{ color: "gray.400" }}
                    fontWeight="semibold"
                    cursor="pointer"
                    _hover={{
                      textDecorationLine: "underline",
                    }}
                    onClick={() =>
                      captionText.setIsTextOverflowing(
                        !captionText.isTextOverflowing
                      )
                    }
                  >
                    {captionText.isTextOverflowing ? "less" : "more"}
                  </Text>
                )} */}
              </HStack>
            </Box>
          </Flex>
        </Flex>

        <Flex
          mb={post?.comments?.length > 0 ? 2 : 0}
          align="start"
          overflow="hidden"
        >
          <Badge
            variant={"subtle"}
            px={2.5}
            mb={1}
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
        </Flex>

        <Flex
          borderTop={post?.comments?.length > 0 ? "1px" : {}}
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
            {post?.comments?.length ? (
              post?.comments
                ?.slice(0, MAX_COMMENTS)
                .map((comment, index) => (
                  <PostCommentCard key={index} user={user} comment={comment} />
                ))
            ) : (
              <></>
            )}
          </Flex>
        </Flex>

        <Flex align="start" overflow="hidden">
          {post?.comments?.length && post?.comments?.length > MAX_COMMENTS ? (
            <Badge
              variant={"solid"}
              px={2.5}
              mb={post?.comments?.length > 0 ? 1 : 0}
              bgGradient={"linear(to-tr, yellow.400, pink.500)"}
              fontSize={{ base: "xs", md: "xs" }}
              fontWeight="semibold"
              fontFamily="sans-serif"
              letterSpacing="wide"
              rounded="full"
              boxShadow={"md"}
              cursor="pointer"
              _hover={{
                transition: "transform .3s ease",
                transform: "scaleX(1.025) translateX(1.5%)",
              }}
              onClick={onOpenPostViewModal}
            >
              View all {post?.comments?.length} comments
            </Badge>
          ) : (
            <></>
          )}
        </Flex>

        {/* <Flex align="start" overflow="hidden">
          {user.comments.length && user.comments.length > MAX_COMMENTS ? (
            <Text
              fontSize="xs"
              color={"gray.500"}
              _dark={{ color: "gray.400" }}
              textTransform="uppercase"
              letterSpacing="wide"
              cursor="pointer"
              _hover={{
                textDecorationLine: "underline",
              }}
            >
              View all {user.comments.length} comments
            </Text>
          ) : (
            <></>
          )}
        </Flex> */}

        {/* <Flex
          pt={2}
          // mb={2}
          borderTop="1px"
          borderTopColor={useColorModeValue("gray.500", "gray.400")}
          align="start"
          // justify="center"
          overflow="hidden"
        >
           <Text
            fontSize="xs"
            color={useColorModeValue("gray.500", "gray.400")}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            16 hours ago
          </Text> 
        </Flex> */}
      </CardBody>
      <CardFooter pt={0} px={3}>
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
      </CardFooter>
    </Card>
  );
};

export default PostFeedCard;
