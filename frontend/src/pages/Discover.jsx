import { Flex, Grid, GridItem } from "@chakra-ui/react";
import _ from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import PostFeed from "../components/post/PostFeed/PostFeed";
import BasicProfileCard from "../components/profile/BasicProfileCard";
import Footer from "../components/shared/Footer";
import SuggestionsList from "../components/suggestions/SuggestionsList/SuggestionsList";
import { findAllPostsAction } from "../redux/actions/post/postLookupActions";
import { fetchPopularUsersAction } from "../redux/actions/user/userLookupActions";
import { clearPostManagement } from "../redux/reducers/post/postManagementSlice";
import {
  POSTS_DEFAULT_PAGE,
  POSTS_PER_PAGE,
  POSTS_SORT_BY,
  POSTS_SORT_DIRECTION,
} from "../utils/constants/pagination/postPagination";

const Discover = () => {
  const dispatch = useDispatch();
  const { currUser } = useSelector((store) => store.user.userProfile);
  const { popularUsers } = useSelector((store) => store.user.userLookup);
  const selectPostLookup = useSelector((store) => store.post.postLookup);
  const postLookup = useMemo(() => selectPostLookup, [selectPostLookup]);
  const token = localStorage.getItem("token");

  const [postsPage, setPostsPage] = useState({});
  const prevCurrUserRef = useRef(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchPopularUsersAction({ token }));
    }
  }, [dispatch, token]);

  const changePage = useCallback(
    async (pageNumber) => {
      if (token) {
        const data = {
          token,
          pageFetchParams: {
            page: pageNumber > 0 ? pageNumber - 1 : POSTS_DEFAULT_PAGE - 1,
            size: POSTS_PER_PAGE,
            sortBy: POSTS_SORT_BY,
            sortDir: POSTS_SORT_DIRECTION,
          },
        };
        dispatch(findAllPostsAction(data));
        dispatch(clearPostManagement());
      }
    },
    [dispatch, token]
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
    if (
      currUser &&
      token &&
      prevCurrUserRef.current !== null &&
      prevCurrUserRef.current !== currUser
    ) {
      const data = { token };

      dispatch(fetchPopularUsersAction(data));
    }
    prevCurrUserRef.current = currUser;
  }, [currUser, dispatch, token]);

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      <GridItem
        px={{ base: "4", md: "12", lg: "0" }}
        colSpan={{ base: "3", lg: "2" }}
      >
        <PostFeed
          currUser={currUser}
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
          <BasicProfileCard user={currUser} />
          <SuggestionsList users={popularUsers} />
          <Footer />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Discover;
