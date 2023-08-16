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
  const { id } = user;
  const gender = id % 2 === 0 ? "men" : "women";
  const image = `https://picsum.photos/1280/720?random=${Math.random() * 100}`;
  const userDetails = {
    dp: `https://randomuser.me/api/portraits/${gender}/${Math.round(id)}.jpg`,
    fullname: generateRandomName(),
    // username: generateRandomUsername(userDetails.fullname),
  };
  const username = generateRandomUsername(userDetails.fullname);
  const website = username.replace(/_/g, "") + ".com";
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";

  function generateRandomName() {
    const names = [
      "John Doe",
      "Jane Smith",
      "Alex Johnson Hades Kate Wilber Robert",
      "Sarah Thompson",
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }

  function generateRandomUsername(fullname) {
    const username = fullname.replace(/\s+/g, "_").toLowerCase();

    return username;
  }

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
              <MobileUserDetails
                userDetails={userDetails}
                username={username}
                website={website}
              />
            ) : (
              <NonMobileUserDetails
                userDetails={userDetails}
                username={username}
                website={website}
              />
            )}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

const MobileUserDetails = ({ userDetails, username, website }) => {
  return (
    <>
      <VStack mt={1} spacing={2}>
        <UserProfilePhoto userDetails={userDetails} username={username} />

        <UserProfileFullnameAndBio
          userDetails={userDetails}
          website={website}
        />
      </VStack>

      <UserProfileStats />
    </>
  );
};

const NonMobileUserDetails = ({ userDetails, username, website }) => {
  return (
    <>
      <VStack mt={1} spacing={2} w="full">
        <UserProfilePhoto userDetails={userDetails} username={username} />

        <UserProfileStats />
      </VStack>

      <UserProfileFullnameAndBio userDetails={userDetails} website={website} />

      {/* <Flex mt={8} mb={1}>
        <ProfileHighlights />
      </Flex> */}
    </>
  );
};

export default ProfileHeader;
