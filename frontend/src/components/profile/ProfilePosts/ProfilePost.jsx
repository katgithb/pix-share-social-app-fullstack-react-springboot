import { Link as RouteLink } from "react-router-dom";
import React, { useRef, useState } from "react";
import {
  Box,
  Flex,
  Link,
  Icon,
  Text,
  Image,
  HStack,
  useColorModeValue,
  Badge,
  IconButton,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaComment, FaHeart, FaRegComment } from "react-icons/fa6";
import { BiExpandAlt } from "react-icons/bi";
import { BsArrowsAngleExpand } from "react-icons/bs";

const ProfilePost = ({ post, prevPostRef, setPrevPostRef }) => {
  const { id } = post;
  // const [showOverlay, setShowOverlay] = useState(false);
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";
  const postRef = useRef(null);

  const handleImageClick = () => {
    // Hide overlay of previous post
    if (prevPostRef && prevPostRef.current) {
      prevPostRef.current.parentNode.querySelector(".overlay").style.display =
        "none";
    }

    // Show overlay of current post
    postRef.current.parentNode.querySelector(".overlay").style.display =
      "inherit";

    // Update previous post ref
    setPrevPostRef(postRef);
  };

  const handleOverlayClick = () => {
    // Hide overlay of current post
    postRef.current.parentNode.querySelector(".overlay").style.display = "none";
  };

  const handleTouchStart = () => {
    if (
      postRef.current.parentNode.querySelector(".overlay").style.display ===
      "none"
    ) {
      handleImageClick();
    }
  };

  const handleTouchEnd = () => {
    if (
      postRef.current.parentNode.querySelector(".overlay").style.display ===
      "none"
    ) {
      handleImageClick();
    }
  };

  return (
    <Flex
      position="relative"
      align="center"
      justify="center"
      rounded="lg"
      w="full"
      boxShadow="md"
      overflow="hidden"
      pointerEvents="none"
    >
      <Flex
        minH={{ base: "125px", md: "200px" }}
        align="center"
        pointerEvents="auto"
        ref={postRef}
        onMouseEnter={isSmallScreen ? null : handleImageClick}
        onClick={isSmallScreen ? handleImageClick : null}
      >
        <Image
          src={`https://picsum.photos/id/${id}/720/720.jpg`}
          // fallbackSrc="path/to/placeholder.jpg"
          alt="Post Image"
          objectFit="cover"
          rounded="lg"
          w="full"
          h="full"
        />
      </Flex>

      <Flex
        // display={showOverlay ? "inherit" : "none"}
        display="none"
        pointerEvents="auto"
        // onMouseLeave={() => setShowOverlay(false)}
        onMouseLeave={isSmallScreen ? null : handleOverlayClick}
        onClick={isSmallScreen ? handleOverlayClick : null}
        className="overlay"
        align="center"
        justify="center"
        color="white"
        position="absolute"
        inset="0"
        zIndex="10"
        bgGradient="linear(to-t, blackAlpha.700, blackAlpha.300)"
        rounded="lg"
        w="full"
        h="full"
      >
        <Flex
          flexDirection="column"
          position="relative"
          justify="center"
          flex="1"
          h="full"
          gap={0}
          rounded="lg"
        >
          <HStack spacing={2} justify="center" flexWrap="wrap" rounded="lg">
            <Flex align={"center"} rounded="full">
              <IconButton
                icon={<FaHeart />}
                rounded="full"
                colorScheme={useColorModeValue("white", "gray")}
                fontSize={{ base: "lg", md: "20px" }}
                variant="ghost"
                aria-label="Like"
                cursor="default"
              />
              <Badge
                variant={"solid"}
                ml="-1"
                px={2.5}
                bgGradient={"linear(to-tr, yellow.400, pink.500)"}
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="semibold"
                fontFamily="sans-serif"
                rounded="full"
              >
                433.8k
              </Badge>
            </Flex>

            <Flex align={"center"} rounded="full">
              <IconButton
                icon={<FaComment />}
                rounded="full"
                colorScheme={useColorModeValue("white", "gray")}
                fontSize={{ base: "lg", md: "20px" }}
                variant="ghost"
                aria-label="Comment"
                cursor="default"
              />
              <Badge
                variant={"solid"}
                ml="-1"
                px={2.5}
                bgGradient={"linear(to-tr, yellow.400, pink.500)"}
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="semibold"
                fontFamily="sans-serif"
                rounded="full"
              >
                124.66k
              </Badge>
            </Flex>
          </HStack>

          <HStack
            position="absolute"
            top="0"
            p={{ base: "1", md: "1.5" }}
            w="full"
            justify="end"
            rounded="lg"
          >
            <IconButton
              icon={<BiExpandAlt />}
              bg={useColorModeValue("gray.100", "gray.400")}
              rounded="full"
              colorScheme="gray"
              size={breakpoint === "base" || breakpoint === "sm" ? "sm" : "md"}
              fontSize={{ base: "md", md: "lg" }}
              variant="solid"
              boxShadow={"md"}
              _hover={{
                bg: useColorModeValue("gray.200", "gray.500"),
              }}
            />
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProfilePost;
