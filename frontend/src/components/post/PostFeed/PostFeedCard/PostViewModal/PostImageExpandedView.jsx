import { CloseIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Image, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";
import { ImShrink2 } from "react-icons/im";

const PostImageExpandedView = ({ post, setIsImageExpanded, onClose }) => {
  const [showImageOverlay, setShowImageOverlay] = useState(true);

  const togglePostImageOverlay = () => {
    setShowImageOverlay(!showImageOverlay);
  };

  return (
    <Flex
      justify="end"
      overflow="hidden"
      position="relative"
      mx={{ base: "-5", md: "-4" }}
      my={0}
    >
      <Flex
        position="relative"
        w="full"
        h={{ base: "91vh", md: "97.35vh" }}
        align="center"
        justify="center"
        onClick={togglePostImageOverlay}
        m={0}
        p={0}
      >
        <Image
          src={post?.image}
          maxW="full"
          maxH="full"
          loading="lazy"
          objectFit="contain"
          alt=""
          rounded="lg"
          boxShadow="md"
        />
      </Flex>

      <Flex
        position="absolute"
        flexWrap={"wrap"}
        rounded="lg"
        h="full"
        p={3}
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

          <IconButton
            icon={<ImShrink2 />}
            bg={useColorModeValue("gray.100", "gray.500")}
            rounded="full"
            colorScheme="twitter"
            fontSize={{ base: "md", md: "lg" }}
            variant="ghost"
            aria-label="Save"
            boxShadow={"md"}
            _hover={{
              bg: useColorModeValue("gray.200", "gray.600"),
            }}
            onClick={() => setIsImageExpanded(false)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostImageExpandedView;
