import {
  Box,
  Flex,
  Grid,
  Link,
  Icon,
  Text,
  TabList,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
  Card,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link as RouteLink } from "react-router-dom";
import React, { useRef, useState } from "react";
import ProfilePost from "./ProfilePost";
import {
  FaBookmark,
  FaCirclePlay,
  FaPlay,
  FaTableCells,
  FaUserTag,
} from "react-icons/fa6";

const ProfilePosts = () => {
  const postList = [20, 72, 58, 29, 89, 17, 94, 69, 11, 23, 10, 90, 18, 81, 79];
  const [prevPostRef, setPrevPostRef] = useState(null);
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";

  const tabPanelsMaxHeight = `calc(100vh - 90px)`;

  return (
    <Flex
      align="center"
      justify="center"
      px="1"
      fontSize="sm"
      color="gray.400"
      w="full"
    >
      <Tabs
        isLazy
        display={{ base: {}, md: "flex" }}
        flexDirection="row-reverse"
        align="center"
        colorScheme="blue"
        size="md"
        w="full"
        orientation={useBreakpointValue({
          base: "horizontal",
          md: "vertical",
        })}
      >
        {isSmallScreen ? (
          <TabList fontWeight="semibold" color="gray.400">
            <Tab>
              <Flex align="center" justify="center">
                <Icon as={FaTableCells} fontSize="xl" />
                {/* <Text as="span" ml="2" display={["none", "inline-block"]}>
                  Posts
                </Text> */}
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center" justify="center">
                <Icon as={FaPlay} fontSize="xl" />
                {/* <Text as="span" ml="2" display={["none", "inline-block"]}>
                  Reels
                </Text> */}
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center" justify="center">
                <Icon as={FaCirclePlay} fontSize="xl" />
                {/* <Text as="span" ml="2" display={["none", "inline-block"]}>
                  Videos
                </Text> */}
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center" justify="center">
                <Icon as={FaBookmark} fontSize="xl" />
                {/* <Text as="span" ml="2" display={["none", "inline-block"]}>
                  Saved
                </Text> */}
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center" justify="center">
                <Icon as={FaUserTag} fontSize="xl" />
                {/* <Text as="span" ml="2" display={["none", "inline-block"]}>
                  Tagged
                </Text> */}
              </Flex>
            </Tab>
          </TabList>
        ) : (
          <Flex align="center" overflow="hidden">
            <TabList
              borderLeft="0"
              fontWeight="semibold"
              color="gray.400"
              ml="-4"
            >
              <Tab borderLeft="0" borderRightWidth="2px" pl="7" pr="2">
                <Flex align="center" justify="center">
                  <Icon as={FaTableCells} fontSize="xl" />
                </Flex>
              </Tab>
              <Tab borderLeft="0" borderRightWidth="2px" pl="7" pr="2">
                <Flex align="center" justify="center">
                  <Icon as={FaPlay} fontSize="xl" />
                </Flex>
              </Tab>
              <Tab borderLeft="0" borderRightWidth="2px" pl="7" pr="2">
                <Flex align="center" justify="center">
                  <Icon as={FaCirclePlay} fontSize="xl" />
                </Flex>
              </Tab>
              <Tab borderLeft="0" borderRightWidth="2px" pl="7" pr="2">
                <Flex align="center" justify="center">
                  <Icon as={FaBookmark} fontSize="xl" />
                </Flex>
              </Tab>
              <Tab borderLeft="0" borderRightWidth="2px" pl="7" pr="2">
                <Flex align="center" justify="center">
                  <Icon as={FaUserTag} fontSize="xl" />
                </Flex>
              </Tab>
            </TabList>
          </Flex>
        )}

        <Card
          p="1"
          variant={{ base: "unstyled", md: "outline" }}
          // _dark={{ variant: "elevated" }}
          borderColor={{ base: "transparent", md: "inherit" }}
          rounded={{ base: "none", md: "lg" }}
          boxShadow={{ base: "none", md: "md" }}
          flex="1"
          overflowY={{ base: {}, md: "auto" }}
          h={{ base: {}, md: tabPanelsMaxHeight }}
        >
          <TabPanels>
            <TabPanel>
              <Grid
                templateColumns={{
                  base: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
                gap={{ base: "1", sm: "4", md: "4" }}
              >
                {postList.map((post) => (
                  <ProfilePost
                    key={post}
                    post={{ id: post }}
                    prevPostRef={prevPostRef}
                    setPrevPostRef={setPrevPostRef}
                  />
                ))}
              </Grid>
            </TabPanel>
            <TabPanel>Reels</TabPanel>
            <TabPanel>Videos</TabPanel>
            <TabPanel>Saved</TabPanel>
            <TabPanel>Tagged</TabPanel>
          </TabPanels>
        </Card>
      </Tabs>
    </Flex>
  );
};

export default ProfilePosts;
