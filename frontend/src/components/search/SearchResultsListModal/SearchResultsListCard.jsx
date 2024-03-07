import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouteLink } from "react-router-dom";
import {
  followUserAction,
  unfollowUserAction,
} from "../../../redux/actions/user/userSocialActions";
import AvatarWithLoader from "../../shared/AvatarWithLoader";

const SearchResultsListCard = ({
  user,
  changeUserFollowUpdatesSet = () => {},
}) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const userSocial = useSelector((store) => store.user.userSocial);

  const [isFollowedByUser, setIsFollowedByUser] = useState(
    user && !_.isEmpty(user) ? user?.isFollowedByAuthUser : false
  );

  const handleFollowUser = () => {
    if (token && user?.id) {
      const data = {
        token,
        userId: user?.id,
      };

      dispatch(followUserAction(data));
    }
  };

  const handleUnfollowUser = () => {
    if (token && user?.id) {
      const data = {
        token,
        userId: user?.id,
      };

      dispatch(unfollowUserAction(data));
    }
  };

  const updateUserFollowed = useCallback(
    (userId, isFollowed) => {
      setIsFollowedByUser(isFollowed);

      changeUserFollowUpdatesSet(userId);
    },
    [changeUserFollowUpdatesSet]
  );

  useEffect(() => {
    const userId = user?.id;
    if (userId && userId in userSocial.followedUsers) {
      updateUserFollowed(userId, true);
    }
  }, [updateUserFollowed, user?.id, userSocial.followedUsers]);

  useEffect(() => {
    const userId = user?.id;
    if (userId && userId in userSocial.unfollowedUsers) {
      updateUserFollowed(userId, false);
    }
  }, [updateUserFollowed, user?.id, userSocial.unfollowedUsers]);

  return (
    <Flex mt={0.5} px={2} py={1}>
      <Flex align="center">
        <Link as={RouteLink} to={`/profile/${user?.username}`} rounded="full">
          <AvatarWithLoader
            loaderSize={10}
            name={user?.name}
            src={user?.userImage ? user?.userImage : {}}
            size="sm"
            boxSize={10}
            alt="User Avatar"
            boxShadow={"md"}
            _hover={{
              transition: "transform 0.3s ease",
              transform: "rotate(8deg) scale(1.2)",
            }}
          />
        </Link>

        <Box px="2">
          <Text
            fontSize="sm"
            textAlign="start"
            fontWeight="semibold"
            wordBreak={"break-word"}
          >
            <Link as={RouteLink} to={`/profile/${user?.username}`}>
              {user?.username}
            </Link>
          </Text>
          <Text
            fontSize="sm"
            textAlign="start"
            color="gray.500"
            _dark={{ color: "gray.400" }}
          >
            {user?.name}
          </Text>
        </Box>
      </Flex>

      <Flex flex="1" alignItems="center" justifyContent="end">
        <Link
          fontSize="xs"
          color={"cyan.500"}
          _dark={{ color: "cyan.400" }}
          fontWeight="bold"
        >
          <Button
            isLoading={
              user?.id in userSocial.isFollowedLoading
                ? userSocial.isFollowedLoading[user?.id]
                : false
            }
            colorScheme={isFollowedByUser ? "red" : "cyan"}
            variant="outline"
            size="xs"
            rounded="full"
            onClick={isFollowedByUser ? handleUnfollowUser : handleFollowUser}
          >
            {isFollowedByUser ? "Unfollow" : "Follow"}
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default SearchResultsListCard;
