import { Avatar, Box, Link, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { Link as RouteLink } from "react-router-dom";

const UserProfilePhoto = ({ userDetails, username }) => {
  return (
    <>
      <Link
        as={RouteLink}
        to={`/username`}
        bgGradient={"linear(to-tr, yellow.400, pink.400, purple.600)"}
        p={"1"}
        rounded="full"
      >
        <Box bg="gray.50" p={"0.5"} rounded="full">
          <Avatar
            name={username}
            src={userDetails?.dp}
            size="xl"
            boxShadow={"md"}
            _hover={{
              transition: "transform 0.3s ease",
              transform: "rotate(8deg) scale(1.2)",
            }}
          />
        </Box>
      </Link>

      <Link as={RouteLink} to={`/username`}>
        <Text
          fontSize={"sm"}
          fontWeight="semibold"
          color={useColorModeValue("gray.500", "gray.400")}
          letterSpacing="wide"
          textAlign="center"
          wordBreak={"break-all"}
        >
          {username}
        </Text>
      </Link>
    </>
  );
};

export default UserProfilePhoto;
