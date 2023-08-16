import {
  Box,
  Card,
  Flex,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { useParams } from "react-router-dom";
import StoriesList from "../components/story/StoriesList/StoriesList";
import StoryViewer from "../components/story/StoryViewer/StoryViewer";

const Story = () => {
  const { userId } = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  function generateUsernameFromName(fullname) {
    const username = fullname.replace(/\s+/g, "_").toLowerCase();

    return username;
  }

  function generateRandomStories() {
    const randomStories = [];

    let randomIndex = Math.floor(Math.random() * userIdList.length);
    if (randomIndex > 10) {
      randomIndex = 9;
    }
    for (let i = 0; i < randomIndex; i++) {
      const story = `https://picsum.photos/id/${Math.floor(
        Math.random() * 100
      )}/800/1080`;
      randomStories.push(story);
    }

    return randomStories;
  }

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Flex
      h={{ base: "100vh", md: "97.5vh" }}
      my={{ base: 3, md: 2 }}
      flexDirection={{ base: "column", md: "row" }}
    >
      <Card
        variant={useColorModeValue("outline", "elevated")}
        flexBasis="250px"
        mx={{ base: 3, md: 3 }}
        mb={{ base: 3, md: 0 }}
        // minH={{ base: "16vh", md: {} }}
        maxH={
          isCollapsed
            ? { base: "20px", md: "full" }
            : { base: "17.5vh", md: "full" }
        }
        overflowY="auto"
        rounded="lg"
        boxShadow={"md"}
      >
        <StoriesList
          userId={userId}
          userIds={userIdList}
          fullnames={fullnameList}
          isCollapsed={isCollapsed}
        />
      </Card>

      <Box
        display={{ base: "inherit", md: "none" }}
        position="absolute"
        left={"50%"}
        top="-2%"
      >
        <IconButton
          // icon={isCollapsed ? <FaChevronDown /> : <FaChevronUp />}
          // icon={
          //   isCollapsed ? <TbLayoutNavbarExpand /> : <TbLayoutBottombarExpand />
          // }
          icon={isCollapsed ? <MdOutlineExpandMore /> : <MdOutlineExpandLess />}
          onClick={handleCollapse}
          variant="ghost"
          // bg="blue.400"
          colorScheme="gray"
          rounded="full"
          // fontSize="md"
          fontSize="24"
          // boxShadow="md"
          transform="translateX(-50%)"
          zIndex="1"
          // _hover={{
          //   bg: "gray.100",
          //   color: "blue.400",
          // }}
        />
      </Box>

      <Flex
        flex="1"
        bg={useColorModeValue("gray.200", "gray.600")}
        align="center"
        justify={"center"}
        rounded="lg"
        mx="3"
      >
        <StoryViewer
          userId={userId}
          userIds={userIdList}
          fullnames={fullnameList}
          stories={generateRandomStories()}
          isCollapsedStoriesList={isCollapsed}
        />
      </Flex>
    </Flex>
  );
};

export default Story;
