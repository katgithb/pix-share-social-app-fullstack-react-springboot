import {
  Box,
  Card,
  Grid,
  GridItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/profile/ProfileHeader/ProfileHeader";
import ProfileSectionTabs from "../components/profile/ProfileSectionTabs/ProfileSectionTabs";
import useCurrUserProfileCheck from "../hooks/useCurrUserProfileCheck";
import { clearFindUserByUserName } from "../redux/reducers/user/userLookupSlice";

const Profile = () => {
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";

  const { username } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [postsPage, setPostsPage] = useState({});

  const userProfile = useSelector((store) => store.user.userProfile);
  const { findByUsername } = useSelector((store) => store.user.userLookup);
  const { findPostsByUserId: selectPostsByUserId } = useSelector(
    (store) => store.post.postLookup
  );
  const postsByUserId = useMemo(
    () => selectPostsByUserId,
    [selectPostsByUserId]
  );

  const { isGivenUserCurrUser } = useCurrUserProfileCheck(
    token,
    username,
    userProfile.currUser?.id,
    findByUsername?.id
  );
  const user = isGivenUserCurrUser ? userProfile.currUser : findByUsername;

  useEffect(() => {
    // Cleanup function to dispatch clearFindUserByUserName action on unmount
    return () => dispatch(clearFindUserByUserName());
  }, [dispatch]);

  useEffect(() => {
    const postsPage = postsByUserId;

    if (postsPage && !_.isEmpty(postsPage)) {
      console.log("Profile posts page: ", postsPage);
      setPostsPage(postsPage);
    }
  }, [postsByUserId]);

  return (
    <>
      {isSmallScreen ? (
        <Box maxW="5xl" mx="auto">
          <Box>
            <ProfileHeader
              user={user}
              totalPosts={postsPage?.totalRecords || 0}
              isGivenUserCurrUser={isGivenUserCurrUser}
            />

            <Card
              mb={5}
              variant="outline"
              _dark={{ variant: "elevated" }}
              rounded="lg"
              boxShadow={"md"}
            >
              <ProfileSectionTabs
                currUser={userProfile.currUser}
                user={user}
                posts={postsPage}
                isGivenUserCurrUser={isGivenUserCurrUser}
              />
            </Card>
          </Box>
        </Box>
      ) : (
        <Grid templateColumns="repeat(4, 1fr)" gap={"2"}>
          <GridItem colSpan={"1"} flexBasis="250px">
            <ProfileHeader
              user={user}
              totalPosts={postsPage?.totalRecords || 0}
              isGivenUserCurrUser={isGivenUserCurrUser}
            />
          </GridItem>
          <GridItem colSpan={"3"}>
            <ProfileSectionTabs
              currUser={userProfile.currUser}
              user={user}
              posts={postsPage}
              isGivenUserCurrUser={isGivenUserCurrUser}
            />
          </GridItem>
        </Grid>
      )}
    </>
  );
};

export default Profile;
