import {
  Box,
  Card,
  Flex,
  Image,
  Link,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Link as RouteLink } from "react-router-dom";
import React from "react";
import {
  FaPlay,
  FaPlugCirclePlus,
  FaPlus,
  FaRegCirclePlay,
  FaUserPlus,
} from "react-icons/fa6";
import ProfileHighlight from "./ProfileHighlight";

const ProfileHighlights = () => {
  const highlightList = [
    20, 72, 58, 29, 89, 17, 94, 69, 11, 23, 10, 90, 18, 81, 79,
  ];
  const image = `https://picsum.photos/1280/720?random=${Math.random() * 100}`;

  return (
    <Flex
      // border="1px"
      align="center"
      justify={{ base: "start", md: "center" }}
      py="1"
      // mb="8"
      gap={{ base: "2", md: "1" }}
      fontSize="sm"
      fontWeight="semibold"
      w="full"
      flexWrap={{ base: "nowrap", md: "wrap" }}
      overflowX="auto"
    >
      <ProfileHighlight />

      {highlightList.map((highlight) => (
        <ProfileHighlight key={highlight} highlight={highlight} />
      ))}

      <VStack>
        <Link as={RouteLink} to="">
          <Flex
            role="group"
            align="center"
            justify="center"
            borderRadius="full"
            border="2px"
            borderColor={"gray.600"}
            _dark={{
              borderColor: "gray.300",
              _hover: { bg: "gray.300", borderColor: "gray.600" },
            }}
            boxSize="54px"
            _hover={{
              bg: "gray.600",
              borderColor: "gray.100",
            }}
          >
            <Icon
              as={FaPlay}
              fontSize="md"
              color={"gray.600"}
              _dark={{
                color: "gray.300",
              }}
              _groupHover={{
                color: useColorModeValue("gray.100", "gray.600"),
              }}
            />
          </Flex>
        </Link>

        <Box w="80px" textAlign="center" overflow="hidden">
          <Link as={RouteLink} to="">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={"gray.600"}
              _dark={{ color: "gray.300" }}
            >
              Watch all
            </Text>
          </Link>
        </Box>
      </VStack>
    </Flex>
  );
};

export default ProfileHighlights;
