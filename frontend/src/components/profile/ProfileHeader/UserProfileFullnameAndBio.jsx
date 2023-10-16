import {
  Box,
  Heading,
  Link,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Link as RouteLink } from "react-router-dom";

const UserProfileFullnameAndBio = ({
  userDetails,
  maxCharsMobileUserDetails,
}) => {
  return (
    <VStack
      align="start"
      w="full"
      gap={2}
      mt={{
        base: "0",
        md:
          userDetails?.bio &&
          userDetails?.bio?.length > maxCharsMobileUserDetails
            ? "8"
            : "0",
      }}
    >
      <Heading
        size="sm"
        pb={2}
        alignSelf={{
          base: "center",
          md:
            userDetails?.bio &&
            userDetails?.bio?.length > maxCharsMobileUserDetails
              ? "start"
              : "center",
        }}
        textAlign={{
          base: "center",
          md:
            userDetails?.bio &&
            userDetails?.bio?.length > maxCharsMobileUserDetails
              ? "start"
              : "center",
        }}
        wordBreak="break-word"
      >
        {userDetails?.name}
      </Heading>

      <Box
        display={
          userDetails?.bio && userDetails?.bio?.length > 0 ? "inherit" : "none"
        }
        alignSelf={{
          base: "center",
          md:
            userDetails?.bio &&
            userDetails?.bio?.length > maxCharsMobileUserDetails
              ? "start"
              : "center",
        }}
        textAlign={{
          base: "center",
          md:
            userDetails?.bio &&
            userDetails?.bio?.length > maxCharsMobileUserDetails
              ? "start"
              : "center",
        }}
      >
        <Text
          fontSize={"sm"}
          color={useColorModeValue("gray.500", "gray.400")}
          letterSpacing="wide"
          whiteSpace="pre-line" // Preserves line breaks
          lineHeight="1.5"
        >
          {userDetails?.bio}
        </Text>
      </Box>

      <Link
        display={
          userDetails?.website && userDetails?.website?.length > 0
            ? "inherit"
            : "none"
        }
        as={RouteLink}
        to={userDetails?.website}
        alignSelf={{
          base: "center",
          md:
            userDetails?.bio &&
            userDetails?.bio?.length > maxCharsMobileUserDetails
              ? "start"
              : "center",
        }}
        textAlign={{
          base: "center",
          md:
            userDetails?.bio &&
            userDetails?.bio?.length > maxCharsMobileUserDetails
              ? "start"
              : "center",
        }}
        style={{ textDecoration: "none" }}
        isExternal
      >
        <Text
          fontSize={"sm"}
          color={useColorModeValue("blue.600", "blue.400")}
          fontWeight="semibold"
          wordBreak={"break-all"}
        >
          {userDetails?.website}
        </Text>
      </Link>
    </VStack>
  );
};

export default UserProfileFullnameAndBio;
