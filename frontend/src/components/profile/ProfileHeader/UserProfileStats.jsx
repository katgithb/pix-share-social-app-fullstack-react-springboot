import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Link as RouteLink } from "react-router-dom";
import { getHumanReadableNumberFormat } from "../../../utils/commonUtils";

const UserProfileStats = ({
  userDetails,
  maxCharsMobileUserDetails,
  totalPosts = 0,
  isGivenUserCurrUser = false,
}) => {
  const profileBioLength = userDetails?.bio?.length || 0;
  const totalPostsCount = getHumanReadableNumberFormat(totalPosts);
  const totalPostsText = totalPosts === 1 ? "post" : "posts";

  const followersLength = userDetails?.follower?.length || 0;
  const followersCount = getHumanReadableNumberFormat(followersLength);
  const followersText = followersLength === 1 ? "follower" : "followers";

  const followingLength = userDetails?.following?.length || 0;
  const followingCount = getHumanReadableNumberFormat(followingLength);
  const followingText = "following";

  return (
    <>
      <HStack
        fontSize="sm"
        w="full"
        justify={{ base: "center", md: "space-between" }}
        color={useColorModeValue("gray.500", "gray.400")}
        p="2"
        mt={{
          base: "1",
          md:
            userDetails?.bio && profileBioLength > maxCharsMobileUserDetails
              ? "4"
              : "3",
        }}
      >
        <Box flex={{ base: "1", md: "0" }} textAlign="center">
          <Text
            as="strong"
            color={useColorModeValue("gray.700", "gray.200")}
            fontSize="lg"
            fontWeight="bold"
            textTransform="uppercase"
            display="block"
          >
            {totalPostsCount}
          </Text>{" "}
          {totalPostsText}
        </Box>
        <Box flex={{ base: "1", md: "0" }} textAlign="center">
          <Text
            as="strong"
            color={useColorModeValue("gray.700", "gray.200")}
            fontSize="lg"
            fontWeight="bold"
            textTransform="uppercase"
            display="block"
          >
            {followersCount}
          </Text>{" "}
          {followersText}
        </Box>
        <Box flex={{ base: "1", md: "0" }} textAlign="center">
          <Text
            as="strong"
            color={useColorModeValue("gray.700", "gray.200")}
            fontSize="lg"
            fontWeight="bold"
            textTransform="uppercase"
            display="block"
          >
            {followingCount}
          </Text>{" "}
          {followingText}
        </Box>
      </HStack>

      <Stack direction={{ base: "row", md: "column" }} w="full" spacing={4}>
        <Flex flex="1" justify="center">
          <Link
            as={RouteLink}
            w="full"
            to="/"
            style={{ textDecoration: "none" }}
          >
            <Button
              size="md"
              w="full"
              rounded="2xl"
              colorScheme="gray"
              fontSize={"sm"}
            >
              Back to Home
            </Button>
          </Link>
        </Flex>
        <Flex flex="1" justify="center">
          <Link
            as={RouteLink}
            w="full"
            to={isGivenUserCurrUser ? "/account/edit" : ""}
            style={{ textDecoration: "none" }}
          >
            <Button
              size="md"
              w="full"
              color={useColorModeValue("gray.50", "gray.100")}
              bg={useColorModeValue("blue.500", "blue.400")}
              rounded="2xl"
              fontSize={"sm"}
              _hover={{
                bg: useColorModeValue("blue.600", "blue.500"),
                color: useColorModeValue("gray.100", "gray.200"),
              }}
            >
              {isGivenUserCurrUser ? "Edit Profile" : "Follow"}
            </Button>
          </Link>
        </Flex>
      </Stack>
    </>
  );
};

export default UserProfileStats;
