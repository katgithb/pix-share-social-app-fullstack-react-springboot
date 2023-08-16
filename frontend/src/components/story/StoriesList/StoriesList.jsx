import {
  Box,
  Flex,
  Heading,
  Link,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Link as RouteLink } from "react-router-dom";
import StoriesListCard from "./StoriesListCard";

const StoriesList = ({ userId, userIds, fullnames, isCollapsed }) => {
  const activeCardRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const userIdIndex = userIds?.indexOf(parseInt(userId));
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });

  function generateUsernameFromName(fullname) {
    const username = fullname.replace(/\s+/g, "_").toLowerCase();

    return username;
  }

  useEffect(() => {
    if (userIdIndex !== -1) {
      setActiveIndex(userIdIndex);
    }
    // Scroll to the active StoriesListCard
    if (activeCardRef.current) {
      const rect = activeCardRef.current.getBoundingClientRect();
      const isFullyVisible =
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight);

      if (breakpoint === "base" || breakpoint === "sm") {
        if (isFullyVisible) {
          activeCardRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "end",
          });
        }
      } else {
        activeCardRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  }, [breakpoint, userId, userIdIndex]);

  return (
    <>
      <Flex
        flexDirection={{ base: "row", md: "column" }}
        py={2}
        gap={4}
        overflowY="auto"
        transition={"scroll 0.3s ease"}
      >
        {userIds?.map((item, index) => {
          const isActive = item.toString() === userId.toString();
          const username = generateUsernameFromName(fullnames[index]);

          return (
            <Box
              key={index}
              alignItems="center"
              display={
                isCollapsed ? { base: "none", md: "inherit" } : "inherit"
              }
              px={isActive ? { base: 1, md: 1 } : 2}
              py={isActive ? { base: 1, md: 1 } : { base: 2.5, md: 0 }}
              mx={isActive ? { base: 4, md: 3 } : 1}
              rounded="md"
              boxShadow={isActive ? { base: {}, md: "md" } : {}}
              borderLeft={isActive ? { md: "4px" } : {}}
              color={isActive ? "blue.400" : {}}
              bg={isActive ? { base: {}, md: "gray.200" } : {}}
              _dark={
                isActive
                  ? { color: "blue.200", bg: { base: {}, md: "gray.600" } }
                  : {}
              }
              transition={"all 0.3s ease"}
              transform={isActive ? "scale(1.1)" : "scale(1)"}
              ref={isActive ? activeCardRef : null}
            >
              <StoriesListCard
                storyUser={{ id: item, username: username }}
                isActive={isActive}
              />
            </Box>
          );
        })}
      </Flex>

      <Flex
        mx={4}
        justify="center"
        align="center"
        textAlign="center"
        display={{ base: "block", md: "none" }}
        whiteSpace="nowrap"
        overflowX="auto"
      >
        <Link as={RouteLink} to={`/story/${userId}`}>
          <Heading
            size="xs"
            color={useColorModeValue("blue.400", "blue.200")}
            py={1}
          >
            {generateUsernameFromName(fullnames[activeIndex])}
          </Heading>
        </Link>
      </Flex>

      {/* <Box position="absolute" left={2} top="50%">
        <IconButton
          icon={<FaChevronLeft />}
          onClick={handleCollapse}
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
      </Box> */}
    </>
  );
};

export default StoriesList;
