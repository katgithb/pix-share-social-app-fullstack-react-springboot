import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Link,
  Icon,
  IconButton,
  Card,
  useColorModeValue,
  Text,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa6";
import { Link as RouteLink } from "react-router-dom";
import StoriesBarCard from "./StoriesBarCard";
import WatchAllLink from "./WatchAllLink";

const StoriesBar = ({ currUser }) => {
  const userIdList = [
    20, 72, 58, 29, 89, 17, 94, 69, 11, 23, 10, 90, 18, 81, 79,
  ];
  const fullnameList = [
    "Jane Smith",
    "Alex Johnson Hades Kate Wilber Robert",
    "Sarah Thompson",
    "John Doe",
    "Jane Smith",
    "Alex Johnson Hades Kate Wilber Robert",
    "Sarah Thompson",
    "John Doe",
    "Jane Smith",
    "Alex Johnson Hades Kate Wilber Robert",
    "Sarah Thompson",
    "John Doe",
    "Jane Smith",
    "Alex Johnson Hades Kate Wilber Robert",
    "Sarah Thompson",
  ];

  const stories = userIdList.map((userId, index) => ({
    id: userId,
    username: generateUsernameFromName(fullnameList[index]),
  }));

  function generateUsernameFromName(fullname) {
    const username = fullname.replace(/\s+/g, "_").toLowerCase();

    return username;
  }

  return (
    <Card
      mb={5}
      variant={useColorModeValue("outline", "elevated")}
      rounded="lg"
      boxShadow={"md"}
    >
      <Box display={{ base: "initial", md: "none" }}>
        <StoriesBarMobile currUser={currUser} stories={stories} />
      </Box>

      <Box display={{ base: "none", md: "initial" }}>
        <StoriesBarNonMobile currUser={currUser} stories={stories} />
      </Box>
    </Card>
  );
};

const StoriesBarNonMobile = ({ currUser, stories }) => {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= containerRef.current.clientWidth;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += containerRef.current.clientWidth;
    }
  };

  return (
    <Flex position="relative" rounded="lg">
      <Box
        p={6}
        overflow="hidden"
        rounded="lg"
        border="1px"
        borderColor="gray.300"
      >
        <Flex
          align="center"
          rounded={"lg"}
          p={4}
          overflowX="auto"
          gap={4}
          ref={containerRef}
          scrollBehavior="smooth"
        >
          <Link as={RouteLink} href="">
            <StoriesBarCard currUser={currUser} />
          </Link>

          {stories?.map((story, index) => (
            <Link as={RouteLink} key={index} to={`/story/${story?.id}`}>
              <StoriesBarCard currUser={currUser} story={story} />
            </Link>
          ))}

          <WatchAllLink />
        </Flex>
      </Box>

      <Box position="absolute" left={1} top="50%">
        <IconButton
          icon={<FaChevronLeft />}
          onClick={scrollLeft}
          bg="blue.400"
          color="gray.100"
          rounded="full"
          fontSize="lg"
          boxShadow="md"
          transform="translateY(-50%)"
          zIndex="1"
          _hover={{
            bg: "gray.100",
            color: "blue.400",
          }}
        />
      </Box>

      <Box position="absolute" right={1} top="50%">
        <IconButton
          icon={<FaChevronRight />}
          onClick={scrollRight}
          bg="blue.400"
          color="gray.100"
          rounded="full"
          fontSize="lg"
          boxShadow="md"
          transform="translateY(-50%)"
          zIndex="1"
          _hover={{
            bg: "gray.100",
            color: "blue.400",
          }}
        />
      </Box>
    </Flex>
  );
};

const StoriesBarMobile = ({ currUser, stories }) => {
  return (
    <Flex
      align="center"
      justify={{ base: "start", md: "center" }}
      px="2"
      py="2"
      // mb="8"
      gap={{ base: "2", md: "1" }}
      fontSize="sm"
      fontWeight="semibold"
      w="full"
      flexWrap={{ base: "nowrap", md: "wrap" }}
      overflowX="auto"
    >
      <Link as={RouteLink} href="">
        <StoriesBarCard currUser={currUser} />
      </Link>
      {stories?.map((story, index) => (
        <Link as={RouteLink} key={index} to={`/story/${story?.id}`}>
          <StoriesBarCard currUser={currUser} story={story} />
        </Link>
      ))}

      <WatchAllLink />
    </Flex>
  );
};

export default StoriesBar;
