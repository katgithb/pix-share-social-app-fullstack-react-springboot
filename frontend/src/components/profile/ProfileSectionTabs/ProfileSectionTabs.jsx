import {
  Card,
  Flex,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaBookmark, FaTableCells } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { findPostsByUserIdAction } from "../../../redux/actions/post/postLookupActions";
import { findSavedPostsByUserIdAction } from "../../../redux/actions/user/userLookupActions";
import { clearPostManagement } from "../../../redux/reducers/post/postManagementSlice";
import { getAuthToken } from "../../../utils/authUtils";
import {
  POSTS_DEFAULT_PAGE,
  POSTS_PER_PAGE,
  POSTS_SORT_BY,
  POSTS_SORT_DIRECTION,
  SAVED_POSTS_DEFAULT_PAGE,
  SAVED_POSTS_PER_PAGE,
  SAVED_POSTS_SORT_BY,
  SAVED_POSTS_SORT_DIRECTION,
} from "../../../utils/constants/pagination/postPagination";
import ProfilePosts from "./ProfilePosts/ProfilePosts";
import ProfileSavedPosts from "./ProfileSavedPosts/ProfileSavedPosts";

const ProfileSectionTabs = ({
  currUser,
  user,
  posts,
  isGivenUserCurrUser = false,
}) => {
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";
  const tabPanelsMaxHeight = `calc(100vh - 90px)`;

  const dispatch = useDispatch();
  const token = getAuthToken();
  const [savedPostsPage, setSavedPostsPage] = useState({});

  const { findSavedPostsByUserId: selectSavedPostsByUserId } = useSelector(
    (store) => store.user.userLookup
  );
  const savedPostsByUserId = useMemo(
    () => selectSavedPostsByUserId,
    [selectSavedPostsByUserId]
  );

  const changePostsPage = useCallback(
    async (pageNumber) => {
      if (token && user?.id) {
        const data = {
          token,
          userId: user?.id,
          pageFetchParams: {
            page: pageNumber > 0 ? pageNumber - 1 : POSTS_DEFAULT_PAGE - 1,
            size: POSTS_PER_PAGE,
            sortBy: POSTS_SORT_BY,
            sortDir: POSTS_SORT_DIRECTION,
          },
        };
        dispatch(findPostsByUserIdAction(data));
        dispatch(clearPostManagement());
      }
    },
    [dispatch, token, user?.id]
  );

  const changeSavedPostsPage = useCallback(
    async (pageNumber) => {
      if (token) {
        const data = {
          token,
          pageFetchParams: {
            page:
              pageNumber > 0 ? pageNumber - 1 : SAVED_POSTS_DEFAULT_PAGE - 1,
            size: SAVED_POSTS_PER_PAGE,
            sortBy: SAVED_POSTS_SORT_BY,
            sortDir: SAVED_POSTS_SORT_DIRECTION,
          },
        };
        dispatch(findSavedPostsByUserIdAction(data));
      }
    },
    [dispatch, token]
  );

  const handlePostsPageChange = useCallback(
    (pageNumber) => {
      changePostsPage(pageNumber);
    },
    [changePostsPage]
  );

  const handleSavedPostsPageChange = useCallback(
    (pageNumber) => {
      changeSavedPostsPage(pageNumber);
    },
    [changeSavedPostsPage]
  );

  useEffect(() => {
    const savedPostsPage = savedPostsByUserId;

    if (savedPostsPage && !_.isEmpty(savedPostsPage)) {
      console.log("Profile savedPosts page: ", savedPostsPage);
      setSavedPostsPage(savedPostsPage);
    }
  }, [savedPostsByUserId]);

  return (
    <Flex
      align="center"
      justify="center"
      px="1"
      fontSize="sm"
      color="gray.400"
      w="full"
    >
      <Tabs
        isLazy
        display={{ base: {}, md: "flex" }}
        flexDirection="row-reverse"
        align="center"
        colorScheme="blue"
        size="md"
        w="full"
        orientation={useBreakpointValue({
          base: "horizontal",
          md: "vertical",
        })}
      >
        {isSmallScreen ? (
          <TabList fontWeight="semibold" color="gray.400">
            <Tab>
              <Flex align="center" justify="center">
                <Icon as={FaTableCells} fontSize="xl" />
                <Text as="span" ml="2">
                  Posts
                </Text>
              </Flex>
            </Tab>
            {isGivenUserCurrUser && (
              <Tab>
                <Flex align="center" justify="center">
                  <Icon as={FaBookmark} fontSize="xl" />
                  <Text as="span" ml="2">
                    Saved
                  </Text>
                </Flex>
              </Tab>
            )}
          </TabList>
        ) : (
          <Flex align="center" overflow="hidden">
            <TabList
              borderLeft="0"
              fontWeight="semibold"
              color="gray.400"
              ml="-4"
            >
              <Tab borderLeft="0" borderRightWidth="2px" pl="7" pr="2">
                <Flex align="center" justify="center">
                  <Icon as={FaTableCells} fontSize="xl" />
                </Flex>
              </Tab>
              {isGivenUserCurrUser && (
                <Tab borderLeft="0" borderRightWidth="2px" pl="7" pr="2">
                  <Flex align="center" justify="center">
                    <Icon as={FaBookmark} fontSize="xl" />
                  </Flex>
                </Tab>
              )}
            </TabList>
          </Flex>
        )}

        <Card
          p="1"
          variant={{ base: "unstyled", md: "outline" }}
          borderColor={{ base: "transparent", md: "inherit" }}
          rounded={{ base: "none", md: "lg" }}
          boxShadow={{ base: "none", md: "md" }}
          flex="1"
          overflowY={"auto"}
          h={tabPanelsMaxHeight}
        >
          <TabPanels flex={1}>
            <TabPanel p={2} h="full">
              <ProfilePosts
                currUser={currUser}
                posts={posts}
                isGivenUserCurrUser={isGivenUserCurrUser}
                handlePageChange={handlePostsPageChange}
              />
            </TabPanel>

            {isGivenUserCurrUser && (
              <TabPanel p={2} h="full">
                <ProfileSavedPosts
                  currUser={currUser}
                  savedPosts={savedPostsPage}
                  handlePageChange={handleSavedPostsPageChange}
                  handlePostsPageChange={handlePostsPageChange}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Card>
      </Tabs>
    </Flex>
  );
};

export default ProfileSectionTabs;
