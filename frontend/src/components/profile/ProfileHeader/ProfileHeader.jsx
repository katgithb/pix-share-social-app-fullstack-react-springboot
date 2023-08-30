import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Icon,
  Text,
  VStack,
  Avatar,
  useColorModeValue,
  HStack,
  IconButton,
  Card,
  CardBody,
  useBreakpointValue,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { FaGear, FaHeart, FaUserPen } from "react-icons/fa6";
import { Link as RouteLink } from "react-router-dom";
import UserProfileFullnameAndBio from "./UserProfileFullnameAndBio";
import UserProfilePhoto from "./UserProfilePhoto";
import UserProfileStats from "./UserProfileStats";

const ProfileHeader = ({ user }) => {
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";
  const MAX_CHARS_MOBILE_USER_DETAILS = 30;

  // console.log(user);

  return (
    <Card
      mb={8}
      variant={useColorModeValue("outline", "elevated")}
      rounded="lg"
      boxShadow={"md"}
    >
      <CardBody>
        <Flex overflow="hidden">
          <Flex
            flex="1"
            flexDirection="column"
            align="center"
            justify="center"
            gap={2}
          >
            {isSmallScreen ? (
              <MobileUserDetails user={user} />
            ) : user.bio && user.bio?.length > MAX_CHARS_MOBILE_USER_DETAILS ? (
              <NonMobileUserDetails
                user={user}
                maxCharsMobileUserDetails={MAX_CHARS_MOBILE_USER_DETAILS}
              />
            ) : (
              <MobileUserDetails user={user} />
            )}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

const MobileUserDetails = ({ user }) => {
  return (
    <>
      <VStack mt={1} spacing={2}>
        <UserProfilePhoto userDetails={user} />

        <UserProfileFullnameAndBio userDetails={user} />
      </VStack>

      <UserProfileStats userDetails={user} />
    </>
  );
};

const NonMobileUserDetails = ({ user, maxCharsMobileUserDetails = 25 }) => {
  return (
    <>
      <VStack mt={1} spacing={2} w="full">
        <UserProfilePhoto userDetails={user} />

        <UserProfileStats
          userDetails={user}
          maxCharsMobileUserDetails={maxCharsMobileUserDetails}
        />
      </VStack>

      <UserProfileFullnameAndBio
        userDetails={user}
        maxCharsMobileUserDetails={maxCharsMobileUserDetails}
      />
    </>
  );
};

export default ProfileHeader;
