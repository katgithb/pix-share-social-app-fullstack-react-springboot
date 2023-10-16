import {
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

const UserProfileStats = ({ userDetails, maxCharsMobileUserDetails }) => {
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
            userDetails?.bio &&
            userDetails?.bio?.length > maxCharsMobileUserDetails
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
            10
          </Text>{" "}
          posts
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
            {userDetails?.follower.length}
          </Text>{" "}
          {userDetails?.follower.length > 1 ? "followers" : "follower"}
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
            {userDetails?.following.length}
          </Text>{" "}
          following
        </Box>
      </HStack>

      <Stack direction={{ base: "row", md: "column" }} w="full" spacing={4}>
        <Flex flex="1" justify="center">
          <Button
            size="md"
            w="full"
            rounded="2xl"
            colorScheme="gray"
            fontSize={"sm"}
          >
            Edit Profile
          </Button>
        </Flex>
        <Flex flex="1" justify="center">
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
            Follow
          </Button>
        </Flex>
      </Stack>
    </>
  );
};

export default UserProfileStats;
