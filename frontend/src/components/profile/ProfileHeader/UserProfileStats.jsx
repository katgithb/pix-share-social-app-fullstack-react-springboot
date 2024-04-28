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
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouteLink } from "react-router-dom";
import { fetchUserProfileAction } from "../../../redux/actions/user/userProfileActions";
import {
  followUserAction,
  unfollowUserAction,
} from "../../../redux/actions/user/userSocialActions";
import {
  clearFollowedUser,
  clearUnfollowedUser,
} from "../../../redux/reducers/user/userSocialSlice";
import { getAuthToken } from "../../../utils/authUtils";
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

  const dispatch = useDispatch();
  const token = getAuthToken();
  const userSocial = useSelector((store) => store.user.userSocial);

  const [isFollowedByUser, setIsFollowedByUser] = useState(
    userDetails && !_.isEmpty(userDetails)
      ? userDetails?.isFollowedByAuthUser
      : false
  );

  const handleFollowUser = () => {
    if (token && userDetails?.id) {
      const data = {
        token,
        userId: userDetails?.id,
      };

      dispatch(followUserAction(data));
    }
  };

  const handleUnfollowUser = () => {
    if (token && userDetails?.id) {
      const data = {
        token,
        userId: userDetails?.id,
      };

      dispatch(unfollowUserAction(data));
    }
  };

  const updateUserFollowed = useCallback(
    (userId, isFollowed) => {
      isFollowed
        ? dispatch(clearFollowedUser(userId))
        : dispatch(clearUnfollowedUser(userId));
      setIsFollowedByUser(isFollowed);

      if (token) {
        dispatch(fetchUserProfileAction({ token }));
      }
    },
    [dispatch, token]
  );

  useEffect(() => {
    const userId = userDetails?.id;
    if (userId && userId in userSocial.followedUsers) {
      updateUserFollowed(userId, true);
    }
  }, [updateUserFollowed, userDetails?.id, userSocial.followedUsers]);

  useEffect(() => {
    const userId = userDetails?.id;
    if (userId && userId in userSocial.unfollowedUsers) {
      updateUserFollowed(userId, false);
    }
  }, [updateUserFollowed, userDetails?.id, userSocial.unfollowedUsers]);

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
          {isGivenUserCurrUser ? (
            <Link
              as={RouteLink}
              w="full"
              to={"/account/edit"}
              style={{ textDecoration: "none" }}
            >
              <Button
                size="md"
                w="full"
                color={"gray.50"}
                bg={"blue.500"}
                rounded="2xl"
                fontSize={"sm"}
                _hover={{
                  bg: "blue.600",
                  color: "gray.100",
                }}
                _dark={{
                  bg: "blue.400",
                  color: "gray.100",
                  _hover: {
                    bg: "blue.500",
                    color: "gray.200",
                  },
                }}
              >
                Edit Profile
              </Button>
            </Link>
          ) : (
            <Link w="full" style={{ textDecoration: "none" }}>
              <Button
                isLoading={
                  userDetails?.id in userSocial.isFollowedLoading
                    ? userSocial.isFollowedLoading[userDetails?.id]
                    : false
                }
                loadingText="Updating..."
                size="md"
                w="full"
                color={"gray.50"}
                bg={isFollowedByUser ? "red.500" : "blue.500"}
                rounded="2xl"
                fontSize={"sm"}
                _hover={{
                  bg: isFollowedByUser ? "red.600" : "blue.600",
                  color: "gray.100",
                }}
                _dark={{
                  bg: isFollowedByUser ? "red.500" : "blue.400",
                  color: "gray.100",
                  _hover: {
                    bg: isFollowedByUser ? "red.600" : "blue.500",
                    color: "gray.200",
                  },
                }}
                onClick={
                  isFollowedByUser ? handleUnfollowUser : handleFollowUser
                }
              >
                {isFollowedByUser ? "Unfollow" : "Follow"}
              </Button>
            </Link>
          )}
        </Flex>
      </Stack>
    </>
  );
};

export default UserProfileStats;
