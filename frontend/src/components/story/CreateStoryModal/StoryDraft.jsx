import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Link,
  Icon,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaRegFaceSmile } from "react-icons/fa6";
import { Link as RouteLink } from "react-router-dom";

const StoryDraft = ({ user, files, caption, handleCaptionChange }) => {
  console.log("user: ", user);
  console.log("files: ", files);

  return (
    <Flex
      h="85vh"
      flexDir={{ base: "column", md: "inherit" }}
      justify="center"
      mt={-4}
      gap={2}
    >
      <Flex flex={3} overflow="hidden" mb={{ base: "3", md: "inherit" }}>
        <Flex justify="center" align="center" h="full">
          <Image
            src={files[0]?.preview}
            key={files[0]?.name}
            maxH="full"
            objectFit="contain"
            alt=""
            rounded="lg"
          />
        </Flex>
      </Flex>

      <Box my={-2}>
        <Divider orientation="vertical" />
      </Box>

      <Flex flexDir="column" flex={1}>
        <Flex flexDirection="column" h="full" boxShadow="md" rounded="lg">
          <Flex align="center" gap={1.5} px={2} py={1} flexWrap="wrap">
            <Link
              as={RouteLink}
              to={`/username`}
              bgGradient={useColorModeValue(
                "linear(to-tr, blackAlpha.500, blackAlpha.300)",
                "linear(to-tr, whiteAlpha.600, whiteAlpha.800)"
              )}
              p="1"
              rounded="full"
            >
              <Avatar size="sm" src={user?.dp} alt="User Avatar" />
            </Link>
            <Box justifyContent={"start"} wordBreak="break-word">
              <Link
                as={RouteLink}
                to={`/username`}
                style={{ textDecoration: "none" }}
              >
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  opacity="0.7"
                  colorScheme="gray"
                >
                  {user?.username}
                </Text>
              </Link>
            </Box>
          </Flex>
          <Flex flexDirection="column" flex="1" px={2} mt={2}>
            <Textarea
              name="caption"
              py={1}
              px={0}
              w="full"
              h="full"
              outline="none"
              borderColor="transparent"
              rows={6}
              placeholder="Write a caption..."
              onChange={handleCaptionChange}
              value={caption}
            />
            <Flex justify="space-between" py={1}>
              <Icon as={FaRegFaceSmile} fontSize="md" color="gray.400" />
              <Text fontSize="sm" color="gray.400">
                {caption?.length}/250
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Divider />

        <Flex flex="1" mt={3} mb={1} align="end" justify="center">
          <Button
            size="md"
            w="full"
            color={useColorModeValue("gray.50", "gray.100")}
            bg={useColorModeValue("blue.500", "blue.400")}
            rounded="2xl"
            fontSize={"md"}
            _hover={{
              bg: useColorModeValue("blue.600", "blue.500"),
              color: useColorModeValue("gray.100", "gray.200"),
            }}
          >
            Share
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StoryDraft;
