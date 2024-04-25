import { Flex, Grid, GridItem } from "@chakra-ui/react";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostFeed from "../components/post/PostFeed/PostFeed";
import BasicProfileCard from "../components/profile/BasicProfileCard";
import Footer from "../components/shared/Footer";
import SuggestionsList from "../components/suggestions/SuggestionsList/SuggestionsList";
import { findAllPostsPublicAction } from "../redux/actions/post/postLookupActions";
import { fetchPopularUsersPublicAction } from "../redux/actions/user/userLookupActions";
import {
  POSTS_DEFAULT_PAGE,
  POSTS_PER_PAGE,
  POSTS_SORT_BY,
  POSTS_SORT_DIRECTION,
} from "../utils/constants/pagination/postPagination";

const PublicLanding = () => {
  const dispatch = useDispatch();
  const { popularUsers } = useSelector((store) => store.user.userLookup);
  const selectPostLookup = useSelector((store) => store.post.postLookup);
  const postLookup = useMemo(() => selectPostLookup, [selectPostLookup]);

  const [postsPage, setPostsPage] = useState({});
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchPopularUsersPublicAction());
  }, [dispatch]);

  const changePage = useCallback(
    async (pageNumber) => {
      const data = {
        pageFetchParams: {
          page: pageNumber > 0 ? pageNumber - 1 : POSTS_DEFAULT_PAGE - 1,
          size: POSTS_PER_PAGE,
          sortBy: POSTS_SORT_BY,
          sortDir: POSTS_SORT_DIRECTION,
        },
      };
      dispatch(findAllPostsPublicAction(data));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (pageNumber) => {
      changePage(pageNumber);
    },
    [changePage]
  );

  const fetchInitialPosts = useCallback(() => {
    changePage(POSTS_DEFAULT_PAGE);
  }, [changePage]);

  useEffect(() => {
    fetchInitialPosts();
  }, [fetchInitialPosts]);

  useEffect(() => {
    const postsPage = postLookup.findAllPosts;

    if (postsPage && !_.isEmpty(postsPage)) {
      setPostsPage(postsPage);
    }
  }, [postLookup.findAllPosts]);

  useEffect(() => {
    if (popularUsers && popularUsers.length > 0) {
      setSuggestedUsers(popularUsers);
    }
  }, [popularUsers]);

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      <GridItem
        px={{ base: "4", md: "12", lg: "0" }}
        colSpan={{ base: "3", lg: "2" }}
      >
        <PostFeed
          posts={postsPage}
          handlePageChange={handlePageChange}
          isHomePageFeed={false}
        />
      </GridItem>

      <GridItem
        colSpan={{ base: "1", lg: "auto" }}
        display={{ base: "none", lg: "block" }}
      >
        <Flex
          flexDirection="column"
          position="sticky"
          top="20"
          left="0"
          px="3"
          pb={3}
          flex={1}
          overflow="hidden"
        >
          <BasicProfileCard />
          <SuggestionsList users={suggestedUsers} />
          <Footer />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default PublicLanding;
