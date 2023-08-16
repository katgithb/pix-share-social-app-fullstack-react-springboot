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

const UserProfileFullnameAndBio = ({ userDetails, website }) => {
  return (
    <VStack align="start" gap={2} mt={{ base: "0", md: "8" }}>
      <Heading
        size="sm"
        pb={2}
        alignSelf={{ base: "center", md: "start" }}
        textAlign={{ base: "center", md: "start" }}
        wordBreak="break-word"
      >
        {userDetails?.fullname}
      </Heading>

      <Box>
        <Text
          fontSize={"sm"}
          color={useColorModeValue("gray.500", "gray.400")}
          letterSpacing="wide"
        >
          Be the type of person that you want to meet. Don’t treat people as bad
          as they are, treat them as good as you are. I survived because the
          fire inside me burned brighter than the fire around me. Be a warrior,
          not a worrier Passion changes everything. Die having memories don’t
          die with just dreams. See the good in the world. You become what you
          believe, so believe in yourself. <br /> 🔥 Spread positive energy.{" "}
          <br />
          ❤️ Follow kindness <br />
          💪 Support each other <br />
          Follow the rules of Karma 🕉️ <br />
        </Text>
      </Box>

      <Link
        as={RouteLink}
        href={website}
        style={{ textDecoration: "none" }}
        isExternal
      >
        <Text
          fontSize={"sm"}
          color={useColorModeValue("blue.600", "blue.400")}
          fontWeight="semibold"
          wordBreak={"break-all"}
        >
          {website}
        </Text>
      </Link>
    </VStack>
  );
};

export default UserProfileFullnameAndBio;
