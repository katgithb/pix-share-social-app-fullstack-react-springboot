import {
  Box,
  Card,
  Grid,
  GridItem,
  Spinner,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import ProfilePosts from "../components/profile/ProfilePosts/ProfilePosts";
import { findUserByUserNameAction } from "../redux/actions/user/userLookupActions";
import { isCurrUser } from "../utils/userUtils";

const Profile = () => {
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";

  const dispatch = useDispatch();
  const { username } = useParams();
  const { userProfile, userLookup } = useSelector((store) => store.user);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const data = { token, username };
      dispatch(findUserByUserNameAction(data));
    }
  }, [dispatch, token, username]);

  if (userLookup.isLoading) {
    return <Spinner />; // Display a loading spinner or placeholder
  }

  const isGivenUserCurrUser = isCurrUser(
    userProfile.currUser?.id,
    userLookup.findByUsername?.id
  );

  return (
    <>
      {isSmallScreen ? (
        <Box maxW="5xl" mx="auto">
          <Box>
            <ProfileHeader
              user={
                isGivenUserCurrUser
                  ? userProfile.currUser
                  : userLookup.findByUsername
              }
            />

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
            <ProfileHeader
              user={
                isGivenUserCurrUser
                  ? userProfile.currUser
                  : userLookup.findByUsername
              }
            />
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
