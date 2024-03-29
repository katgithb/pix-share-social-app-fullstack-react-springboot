import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Image,
  Link,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import { Link as RouteLink } from "react-router-dom";
import CreateStoryModal from "../CreateStoryModal/CreateStoryModal";

const StoriesBarCard = ({ currUser, story }) => {
  const { id, username } = story ? story : {};
  const gender = id % 2 === 0 ? "men" : "women";
  const image = `https://picsum.photos/id/${id}/315/560`;
  const storyObj = story
    ? {
        id,
        username,
        image,
        user: {
          dp: `https://randomuser.me/api/portraits/${gender}/${id}.jpg`,
        },
      }
    : undefined;

  return (
    <div>
      <Box hideFrom="md">
        <StoriesBarCardMobile currUser={currUser} story={storyObj} />
      </Box>
      <Box hideBelow="md">
        <StoriesBarCardNonMobile currUser={currUser} story={storyObj} />
      </Box>
    </div>
  );
};

const StoriesBarCardNonMobile = ({ currUser, story }) => {
  const {
    isOpen: isOpenNewStoryModal,
    onOpen: onOpenNewStoryModal,
    onClose: onCloseNewStoryModal,
  } = useDisclosure();

  return (
    <Flex
      role={"group"}
      w="10rem"
      h="16rem"
      position="relative"
      rounded="lg"
      flexDirection={"column-reverse"}
      p="3"
      // borderWidth="1px"
      // overflow="hidden"
      // bgGradient="linear(to-pink-500)"
      // borderColor="gray.200"
      cursor={story ? "pointer" : "default"}
      backgroundImage={story ? `url(${story?.image})` : `url(${currUser?.dp})`}
      backgroundSize="cover"
      backgroundPosition="center"
      boxShadow="0px 4px 6px rgba(0, 0, 0, 0.5)"
      // boxShadow="5px 5px 0000000"
      alignItems={"end"}
      _hover={{
        transition: "transform .3s ease",
        transform: "translateY(-2%)",
      }}
    >
      {!story && (
        <CreateStoryModal
          isOpen={isOpenNewStoryModal}
          onClose={onCloseNewStoryModal}
        />
      )}

      <Box
        pos="absolute"
        rounded="lg"
        inset="0"
        h="full"
        w="full"
        bgGradient="linear(to-t, blackAlpha.900, blackAlpha.300)"
        _groupHover={{
          _after: {
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 0,
            left: 0,
            bgGradient: "linear(to-t, blackAlpha.800, blackAlpha.400)",
            filter: "blur(8px)",
            zIndex: -1,
          },
        }}
      ></Box>
      <Flex
        position="absolute"
        p={6}
        py={14}
        px={6}
        // px={{ base: "6", md: "12" }}
        // h={"5rem"}
        // minH={"55px"}
        // maxH={"55px"}
        // top="0"
        // bottom="0"
        left="0"
        right="0"
        // p="2"
        rounded="lg"
        // bg="rgba(0, 0, 0, 0.5)"
        // bgGradient="linear(to-tr, yellow.400, pink.500, purple.600)"
        textAlign="center"
        justifyContent={"center"}
        // alignItems={"end"}
        // boxShadow={"md"}
        // boxShadow="0px 4px 6px rgba(0, 0, 0, 0.1)"
      >
        <Text
          mb={4}
          color="gray.100"
          fontSize="xs"
          fontWeight="semibold"
          fontFamily="sans-serif"
          noOfLines={2}
        >
          {story ? story?.username : "Add story"}
        </Text>
      </Flex>
      <Box
        position="absolute"
        // top="14%"
        // bottom="11.5%"
        mx="auto"
        left="50%"
        transform="translateX(-50%)"
        // boxShadow={"md"}
        // filter={"blur(6px)"}
      >
        <Box
          // mb={2}
          bgGradient={
            story
              ? "linear(to-tr, yellow.400, orange.500, pink.500, purple.600)"
              : "linear(to-tr, whiteAlpha.600, whiteAlpha.800)"
          }
          // bgGradient="linear(to-tr, yellow.400, purple.600)"
          p="1"
          rounded="full"
          boxShadow={"md"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            rounded: "xl",
            pos: "absolute",
            top: 0,
            left: 0,
            bgGradient: "linear(to-b, blackAlpha.600, blackAlpha.400)",
            // backgroundImage: `url(${user.dp})`,
            filter: "blur(6px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(8px)",
            },
          }}
        >
          {story ? (
            <Link
              as={RouteLink}
              to="/username"
              display="block"
              bg="gray.50"
              // p="0.5"
              rounded="full"
              cursor="pointer"
            >
              <Avatar
                src={story?.user?.dp}
                size="sm"
                w="14"
                h="14"
                // borderWidth="4px"
                // borderColor="white"
                alt="story"
                // boxShadow="0px 4px 6px rgba(0, 0, 0, 0.5)"
                _groupHover={{
                  transition: "transform 0.3s ease",
                  transform: "rotate(8deg) scale(1.2)",
                }}
              />
            </Link>
          ) : (
            <Link
              as={RouteLink}
              href=""
              display="block"
              bg="gray.50"
              // p="0.5"
              rounded="full"
            >
              <IconButton
                icon={<FaPlus />}
                isRound={true}
                boxSize="14"
                fontSize="xl"
                color={"blue.400"}
                bg={"gray.100"}
                _hover={{
                  bg: "blue.400",
                  color: "gray.100",
                }}
                _groupHover={{
                  transition: "transform 0.3s ease",
                  transform: "scale(1.175)",
                }}
                onClick={onOpenNewStoryModal}
              />
            </Link>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

const StoriesBarCardMobile = ({ currUser, story }) => {
  const {
    isOpen: isOpenNewStoryModal,
    onOpen: onOpenNewStoryModal,
    onClose: onCloseNewStoryModal,
  } = useDisclosure();

  return (
    <VStack>
      {!story && (
        <CreateStoryModal
          isOpen={isOpenNewStoryModal}
          onClose={onCloseNewStoryModal}
        />
      )}

      <Box>
        <Link as={RouteLink} href="#" style={{ textDecoration: "none" }}>
          <Flex
            role="group"
            align="center"
            justify="center"
            borderRadius="xl"
            border="1px"
            borderColor="gray.300"
            p="1"
            boxSize="54px"
            overflow="hidden"
          >
            {story ? (
              <Image
                src={story?.image}
                // fallbackSrc="path/to/placeholder.jpg"
                alt="Story"
                boxSize="45px"
                objectFit="cover"
                loading="lazy"
                rounded="lg"
                boxShadow={"md"}
                _hover={{
                  transition: "transform 0.3s ease",
                  transform: "translateY(-2%) scale(1.2)",
                }}
              />
            ) : (
              <IconButton
                icon={<FaPlus />}
                fontSize="xl"
                color={"blue.400"}
                bg={"gray.100"}
                _hover={{
                  bg: "blue.400",
                  color: "gray.100",
                }}
                _groupHover={{
                  transition: "transform 0.3s ease",
                  transform: "scale(1.175)",
                }}
                onClick={onOpenNewStoryModal}
              />
            )}
          </Flex>
        </Link>
      </Box>
      <Box
        flexBasis="44px"
        w={story ? "96px" : "80px"}
        textAlign="center"
        overflow="hidden"
      >
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color={"gray.500"}
          _dark={{ color: "gray.400" }}
          noOfLines={2}
          onClick={onOpenNewStoryModal}
        >
          {story ? story?.username : "Add story"}
        </Text>
      </Box>
    </VStack>
  );
};

export default StoriesBarCard;
