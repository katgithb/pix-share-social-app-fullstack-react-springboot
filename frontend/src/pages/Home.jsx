import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { Map } from "immutable";
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
import { findAllPostsByUserIdsAction } from "../redux/actions/post/postLookupActions";
import {
  isPostLikedByUserAction,
  isPostSavedByUserAction,
} from "../redux/actions/post/postSocialActions";
import { fetchPopularUsersAction } from "../redux/actions/user/userLookupActions";
import { clearPostManagement } from "../redux/reducers/post/postManagementSlice";
import {
  POSTS_DEFAULT_PAGE,
  POSTS_PER_PAGE,
  POSTS_SORT_BY,
  POSTS_SORT_DIRECTION,
} from "../utils/constants/pagination/postPagination";
import {
  removePageFromPostAttributeCache,
  trimPostAttributeCache,
  updatePostAttributeCache,
} from "../utils/postUtils";

const Home = () => {
  const POST_LIKED_CACHE_MAX_PAGES = 7;
  const POST_SAVED_CACHE_MAX_PAGES = 7;
  const dispatch = useDispatch();
  const { currUser } = useSelector((store) => store.user.userProfile);
  const { popularUsers } = useSelector((store) => store.user.userLookup);
  const selectPostLookup = useSelector((store) => store.post.postLookup);
  const postLookup = useMemo(() => selectPostLookup, [selectPostLookup]);
  const token = localStorage.getItem("token");

  const [followingUserIds, setFollowingUserIds] = useState([]);
  const [postsPage, setPostsPage] = useState({});
  const [postLikedCacheMap, setPostLikedCacheMap] = useState(Map());
  const [postSavedCacheMap, setPostSavedCacheMap] = useState(Map());
  const prevCurrUserRef = useRef(null);

  const isPostLikedCached = (postId, postIdPage) => {
    const postLikedMap = postLikedCacheMap.get(postIdPage) || Map();

    return postLikedMap.has(postId);
  };

  const fetchPostLiked = useCallback(
    (postId) => {
      if (token && postId) {
        const data = {
          token,
          postId,
        };

        dispatch(isPostLikedByUserAction(data));
      }
    },
    [dispatch, token]
  );

  const addPostLikedToCacheMap = useCallback(
    (postId, postIdPage, isLiked) => {
      const maxCacheSize = POST_LIKED_CACHE_MAX_PAGES;
      const minPage = postLikedCacheMap.keySeq().min() || 0;
      const maxPage = postLikedCacheMap.keySeq().max() || 0;

      const trimmedCache = trimPostAttributeCache(
        postLikedCacheMap,
        postIdPage,
        minPage,
        maxPage,
        maxCacheSize
      );
      const updatedCache = updatePostAttributeCache(
        trimmedCache,
        postIdPage,
        postId,
        isLiked
      );

      setPostLikedCacheMap(updatedCache);
    },
    [postLikedCacheMap]
  );

  const isPostSavedCached = (postId, postIdPage) => {
    const postSavedMap = postSavedCacheMap.get(postIdPage) || Map();

    return postSavedMap.has(postId);
  };

  const fetchPostSaved = useCallback(
    (postId) => {
      if (token && postId) {
        const data = {
          token,
          postId,
        };

        dispatch(isPostSavedByUserAction(data));
      }
    },
    [dispatch, token]
  );

  const addPostSavedToCacheMap = useCallback(
    (postId, postIdPage, isSaved) => {
      const maxCacheSize = POST_SAVED_CACHE_MAX_PAGES;
      const minPage = postSavedCacheMap.keySeq().min() || 0;
      const maxPage = postSavedCacheMap.keySeq().max() || 0;

      const trimmedCache = trimPostAttributeCache(
        postSavedCacheMap,
        postIdPage,
        minPage,
        maxPage,
        maxCacheSize
      );
      const updatedCache = updatePostAttributeCache(
        trimmedCache,
        postIdPage,
        postId,
        isSaved
      );

      setPostSavedCacheMap(updatedCache);
    },
    [postSavedCacheMap]
  );

  const checkPostLikedByCurrUser = useCallback(
    (postId, postIdPage, skipCache = false) => {
      const postLikedMap = postLikedCacheMap.get(postIdPage) || Map();
      // console.log("postLikedCacheMap", postLikedCacheMap.toJS());

      if (postLikedMap.has(postId) && !skipCache) {
        return postLikedMap.get(postId);
      }

      fetchPostLiked(postId);
      return null;
    },
    [fetchPostLiked, postLikedCacheMap]
  );

  const checkPostSavedByCurrUser = useCallback(
    (postId, postIdPage, skipCache = false) => {
      const postSavedMap = postSavedCacheMap.get(postIdPage) || Map();
      // console.log("postSavedCacheMap", postSavedCacheMap.toJS());

      if (postSavedMap.has(postId) && !skipCache) {
        return postSavedMap.get(postId);
      }

      fetchPostSaved(postId);
      return null;
    },
    [fetchPostSaved, postSavedCacheMap]
  );

  const removeCachedPostLikedPage = (postIdPage) => {
    const updatedCache = removePageFromPostAttributeCache(
      postLikedCacheMap,
      postIdPage
    );

    setPostLikedCacheMap(updatedCache);
  };

  const removeCachedPostSavedPage = (postIdPage) => {
    const updatedCache = removePageFromPostAttributeCache(
      postSavedCacheMap,
      postIdPage
    );

    setPostSavedCacheMap(updatedCache);
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchPopularUsersAction({ token }));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (currUser) {
      const followingIds = currUser?.following?.map((user) => user.id);
      setFollowingUserIds([currUser?.id, ...followingIds]);
    }
  }, [currUser]);

  const changePage = useCallback(
    async (pageNumber) => {
      if (token && followingUserIds.length > 0) {
        const data = {
          token,
          userIds: followingUserIds,
          pageFetchParams: {
            page: pageNumber > 0 ? pageNumber - 1 : POSTS_DEFAULT_PAGE - 1,
            size: POSTS_PER_PAGE,
            sortBy: POSTS_SORT_BY,
            sortDir: POSTS_SORT_DIRECTION,
          },
        };
        dispatch(findAllPostsByUserIdsAction(data));
        dispatch(clearPostManagement());
      }
    },
    [dispatch, followingUserIds, token]
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
    const postsPage = postLookup.findPostsByUserIds;

    if (postsPage && !_.isEmpty(postsPage)) {
      setPostsPage(postsPage);
    }
  }, [postLookup.findPostsByUserIds]);

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
        {/* <StoriesBar currUser={user} /> */}

        <PostFeed
          currUser={currUser}
          posts={postsPage}
          handlePageChange={handlePageChange}
          isHomePageFeed
          isPostLikedCached={isPostLikedCached}
          isPostSavedCached={isPostSavedCached}
          checkPostLikedByCurrUser={checkPostLikedByCurrUser}
          checkPostSavedByCurrUser={checkPostSavedByCurrUser}
          addPostLikedToCacheMap={addPostLikedToCacheMap}
          addPostSavedToCacheMap={addPostSavedToCacheMap}
          removeCachedPostLikedPage={removeCachedPostLikedPage}
          removeCachedPostSavedPage={removeCachedPostSavedPage}
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

export default Home;
