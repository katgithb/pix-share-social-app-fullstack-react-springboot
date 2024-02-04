import {
  Card,
  CardBody,
  Fade,
  Flex,
  useBreakpointValue,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import ProfileHeaderSkeleton from "./ProfileHeaderSkeleton";
import UserProfileFullnameAndBio from "./UserProfileFullnameAndBio";
import UserProfileNotFound from "./UserProfileNotFound/UserProfileNotFound";
import UserProfilePhoto from "./UserProfilePhoto";
import UserProfileStats from "./UserProfileStats";

const ProfileHeader = ({ user, totalPosts, isGivenUserCurrUser = false }) => {
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";
  const { colorMode } = useColorMode();
  const MAX_CHARS_MOBILE_USER_DETAILS = 30;

  const { isLoading: isLoadingUserLookup } = useSelector(
    (store) => store.user.userLookup
  );

  if (isLoadingUserLookup) {
    return (
      <Fade
        in={isLoadingUserLookup}
        transition={{ exit: { delay: 0.6 }, enter: { duration: 0.4 } }}
      >
        <ProfileHeaderSkeleton />
      </Fade>
    );
  }

  if (!user) {
    return (
      <Fade
        in={!isLoadingUserLookup}
        transition={{ exit: { delay: 0.6 }, enter: { duration: 0.4 } }}
      >
        <UserProfileNotFound />
      </Fade>
    );
  }

  return (
    <Card
      mb={8}
      variant={colorMode === "dark" ? "elevated" : "outline"}
      rounded="lg"
      boxShadow={"md"}
    >
      <Fade
        in={!isLoadingUserLookup}
        transition={{ exit: { delay: 0.6 }, enter: { duration: 0.4 } }}
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
                  user={user}
                  totalPosts={totalPosts}
                  isGivenUserCurrUser={isGivenUserCurrUser}
                />
              ) : user?.bio &&
                user?.bio?.length > MAX_CHARS_MOBILE_USER_DETAILS ? (
                <NonMobileUserDetails
                  user={user}
                  maxCharsMobileUserDetails={MAX_CHARS_MOBILE_USER_DETAILS}
                  totalPosts={totalPosts}
                  isGivenUserCurrUser={isGivenUserCurrUser}
                />
              ) : (
                <MobileUserDetails
                  user={user}
                  totalPosts={totalPosts}
                  isGivenUserCurrUser={isGivenUserCurrUser}
                />
              )}
            </Flex>
          </Flex>
        </CardBody>
      </Fade>
    </Card>
  );
};

const MobileUserDetails = ({ user, totalPosts, isGivenUserCurrUser }) => {
  return (
    <>
      <VStack mt={1} spacing={2}>
        <UserProfilePhoto userDetails={user} />

        <UserProfileFullnameAndBio userDetails={user} />
      </VStack>

      <UserProfileStats
        userDetails={user}
        totalPosts={totalPosts}
        isGivenUserCurrUser={isGivenUserCurrUser}
      />
    </>
  );
};

const NonMobileUserDetails = ({
  user,
  maxCharsMobileUserDetails = 25,
  totalPosts,
  isGivenUserCurrUser,
}) => {
  return (
    <>
      <VStack mt={1} spacing={2} w="full">
        <UserProfilePhoto userDetails={user} />

        <UserProfileStats
          userDetails={user}
          maxCharsMobileUserDetails={maxCharsMobileUserDetails}
          totalPosts={totalPosts}
          isGivenUserCurrUser={isGivenUserCurrUser}
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
