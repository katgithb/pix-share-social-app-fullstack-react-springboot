import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link as RouteLink, useParams } from "react-router-dom";

const StoriesListCard = ({ storyUser, isActive }) => {
  const { id, username } = storyUser;
  const gender = id % 2 === 0 ? "men" : "women";
  const image = `https://picsum.photos/1280/720?random=${Math.random() * 100}`;
  const user = {
    dp: `https://randomuser.me/api/portraits/${gender}/${Math.round(id)}.jpg`,
    // fullname: generateRandomName(),
    // stories: generateRandomStories(),
  };

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

  function generateRandomStories() {
    const randomStories = [];
    const idList = [
      99, 19, 30, 66, 70, 20, 70, 8, 38, 89, 17, 94, 66, 11, 17, 12, 89, 16, 82,
    ];

    const randomIndex = Math.floor(Math.random() * idList.length);
    for (let i = 0; i < randomIndex; i++) {
      const story = `https://picsum.photos/${idList[i]}/720/1280`;
      randomStories.push(story);
    }

    return randomStories;
  }

  return (
    <Flex
      role={"group"}
      flexDirection={{ base: "column", md: "row" }}
      flex="1"
      gap="3"
      alignItems="center"
      overflow="hidden"
      transition={{ base: "transform 0.3s ease", md: {} }}
      transform={
        isActive
          ? { base: "scale(1.2)", md: "scale(1)" }
          : { base: "scale(1)", md: "scale(1)" }
      }
    >
      <Link
        as={RouteLink}
        to={`/story/${id}`}
        bgGradient={
          isActive
            ? {
                base: "linear(to-bl, yellow.400, orange.500, pink.500, purple.600)",
                md: "linear(to-tr, yellow.400, orange.500, pink.500, purple.600)",
              }
            : "linear(to-tr, yellow.400, orange.500, pink.500, purple.600)"
        }
        p={"1"}
        m={1}
        rounded="full"
        transition={{ base: {}, md: "transform 0.3s ease" }}
        transform={
          isActive
            ? { base: {}, md: "scale(1.1)" }
            : { base: {}, md: "scale(1)" }
        }
      >
        <Box
          bg="gray.50"
          p={isActive ? { base: "0.5", md: "0" } : "0"}
          rounded="full"
        >
          <Avatar
            name={username}
            src={user.dp}
            boxSize={isActive ? "10" : { base: "9", md: "10" }}
            boxShadow={"md"}
            _groupHover={{
              transition: "transform 0.3s ease",
              transform: "rotate(8deg) scale(1.2)",
            }}
          />
        </Box>
      </Link>

      <Box display={{ base: "none", md: "block" }} wordBreak="break-word">
        <Link
          as={RouteLink}
          to={`/story/${id}`}
          //   style={{ textDecoration: "none" }}
        >
          <Heading size="xs" py={1}>
            {username}
          </Heading>
        </Link>
        <Text
          fontSize="xs"
          color={useColorModeValue("gray.500", "gray.400")}
          textTransform="lowercase"
          letterSpacing="wide"
          // display={{ base: "none", md: "block" }}
        >
          7 hours ago
        </Text>
      </Box>
    </Flex>
  );
};

export default StoriesListCard;
