import {
  Box,
  Card,
  Grid,
  GridItem,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import ProfilePosts from "../components/profile/ProfilePosts/ProfilePosts";

const Profile = () => {
  const userIdList = [
    20, 72, 58, 29, 89, 17, 94, 69, 11, 23, 10, 90, 18, 81, 79,
  ];

  const userId = userIdList[Math.floor(Math.random() * userIdList.length)];
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";

  return (
    <>
      {isSmallScreen ? (
        <Box maxW="5xl" mx="auto">
          <Box>
            <ProfileHeader user={{ id: userId }} />

            {/* <Card
              p="1"
              mb={8}
              variant="outline"
              _dark={{ variant: "elevated" }}
              rounded="lg"
              boxShadow={"md"}
            >
              <ProfileHighlights />
            </Card> */}

            <Card
              mb={5}
              variant="outline"
              _dark={{ variant: "elevated" }}
              rounded="lg"
              boxShadow={"md"}
            >
              <ProfilePosts />
            </Card>
          </Box>
        </Box>
      ) : (
        <Grid templateColumns="repeat(4, 1fr)" gap={"2"}>
          <GridItem colSpan={"1"} flexBasis="250px">
            <ProfileHeader user={{ id: userId }} />
          </GridItem>
          <GridItem colSpan={"3"}>
            <ProfilePosts />
          </GridItem>
        </Grid>
      )}
    </>
  );
};

export default Profile;
