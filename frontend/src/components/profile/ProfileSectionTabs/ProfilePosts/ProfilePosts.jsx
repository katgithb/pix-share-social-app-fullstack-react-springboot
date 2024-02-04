import {
  Flex,
  Skeleton,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Map, OrderedMap, Set } from "immutable";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { SphereSpinner } from "react-spinners-kit";
import { VirtuosoGrid } from "react-virtuoso";
import { POSTS_DEFAULT_PAGE } from "../../../../utils/constants/pagination/postPagination";
import EmptyProfilePosts from "../EmptyProfilePosts";
import ProfilePost from "./ProfilePost";

const ProfilePosts = ({
  currUser,
  posts,
  isGivenUserCurrUser = false,
  handlePageChange,
}) => {
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const [latestLoadedPage, setLatestLoadedPage] = useState(POSTS_DEFAULT_PAGE);
  const [loadedPostsPage, setLoadedPostsPage] = useState({});
  const [pageIndexMap, setPageIndexMap] = useState(Map());
  const [postIdToPageMap, setPostIdToPageMap] = useState(Map());
  const [loadedPostsMap, setLoadedPostsMap] = useState(OrderedMap());

  const { isPostCreated, isPostDeleted, deletedPostId } = useSelector(
    (store) => store.post.postManagement
  );
  const { isLoading: isLoadingPostLookup } = useSelector(
    (store) => store.post.postLookup
  );

  const loadMorePosts = () => {
    if (loadedPostsPage.last) return;

    handlePageChange(latestLoadedPage + 1);

    // Increment the latestLoadedPage state variable
    latestLoadedPage < loadedPostsPage.totalPages
      ? setLatestLoadedPage((prevPage) => prevPage + 1)
      : setLatestLoadedPage(loadedPostsPage.page + 1);
  };

  const handleRefreshProfile = () => {
    // Reload the page
    window.location.reload();
  };

  const populateInitialPostsPage = useCallback((initialPostsPage) => {
    if (initialPostsPage?.content) {
      const initialPosts = initialPostsPage?.content;
      const postIds = initialPosts.map((post) => post.id);
      console.log("Initial Posts:", initialPosts);

      const newPageIndexMap = Map().set(initialPostsPage?.page, postIds);
      setPageIndexMap(newPageIndexMap);

      const newPostIdToPageMap = Map(
        initialPosts.map((post) => [post.id, initialPostsPage?.page])
      );
      setPostIdToPageMap(newPostIdToPageMap);

      const newLoadedPostsMap = OrderedMap(
        initialPosts.map((post) => [post.id, post])
      );
      setLoadedPostsMap(newLoadedPostsMap);
    }
  }, []);

  const addNewPostsPageData = useCallback((newPostsPage) => {
    if (
      newPostsPage?.content &&
      newPostsPage?.page < newPostsPage?.totalPages
    ) {
      const newPosts = newPostsPage?.content;
      const postIds = newPosts.map((post) => post.id);
      console.log("New Posts:", newPosts);

      const newPageIndexMap = Map().set(newPostsPage?.page, postIds);
      setPageIndexMap((prevMap) => prevMap.merge(newPageIndexMap));

      const newPostIdToPageMap = Map(
        newPosts.map((post) => [post.id, newPostsPage?.page])
      );
      setPostIdToPageMap((prevMap) => prevMap.merge(newPostIdToPageMap));

      const newLoadedPostsMap = OrderedMap(
        newPosts.map((post) => [post.id, post])
      );
      setLoadedPostsMap((prevPostsMap) =>
        prevPostsMap.merge(newLoadedPostsMap)
      );
    }
  }, []);

  const clearDeletedPostData = useCallback(
    (deletedPostId, deletedPostPageNum) => {
      setPageIndexMap((prevMap) =>
        prevMap.filter((_, pageNum) => pageNum !== deletedPostPageNum)
      );

      setPostIdToPageMap((prevMap) =>
        prevMap.filter((_, postId) => postId !== deletedPostId)
      );

      setLoadedPostsMap((prevPostsMap) =>
        prevPostsMap.filter((_, postId) => postId !== deletedPostId)
      );
    },
    []
  );

  const clearPagesOnPostDelete = useCallback(
    (pagesToRemove = []) => {
      let postIdsToRemove = Set();
      const postIdsToRemoveBatches = [];

      pagesToRemove.forEach((_, pageNum) => {
        const pagePostIds = pageIndexMap.get(pageNum);
        const postIdsToRemoveBatch = Set(pagePostIds);

        postIdsToRemove = postIdsToRemove.union(pagePostIds);

        postIdsToRemoveBatches.push(postIdsToRemoveBatch);
      });

      console.log("pagesToRemove: ", pagesToRemove);

      setPageIndexMap((prevMap) =>
        prevMap.filter((_, pageNum) => !pagesToRemove.has(pageNum))
      );

      setPostIdToPageMap((prevMap) =>
        prevMap.filter((_, postId) => !postIdsToRemove.has(postId))
      );

      setLoadedPostsMap((prevPostsMap) =>
        postIdsToRemoveBatches.reduce(
          (map, batch) => map.filter((_, postId) => !batch.has(postId)),
          prevPostsMap
        )
      );
    },
    [pageIndexMap]
  );

  const updateLoadedPostEntry = useCallback((postId, updatedPost) => {
    const updatedPostMap = Map().set(postId, updatedPost);
    setLoadedPostsMap((prevPostsMap) => prevPostsMap.merge(updatedPostMap));
  }, []);

  const refetchPostPage = useCallback(
    (pageNumber) => {
      handlePageChange(pageNumber);

      setLatestLoadedPage(pageNumber);
    },
    [handlePageChange]
  );

  useEffect(() => {
    handlePageChange(POSTS_DEFAULT_PAGE);
  }, [handlePageChange]);

  useEffect(() => {
    if (posts) {
      const loadedPostsPage = posts;
      setLoadedPostsPage(posts);
      console.log("Profile loadedPostsPage: ", loadedPostsPage);

      if (loadedPostsPage?.page === POSTS_DEFAULT_PAGE - 1) {
        populateInitialPostsPage(loadedPostsPage);
      } else {
        addNewPostsPageData(loadedPostsPage);
      }
    }
  }, [addNewPostsPageData, populateInitialPostsPage, posts]);

  useEffect(() => {
    if (isPostCreated) {
      // Refetch first page
      refetchPostPage(POSTS_DEFAULT_PAGE);
    }
  }, [isPostCreated, refetchPostPage]);

  useEffect(() => {
    if (isPostDeleted && deletedPostId) {
      const deletedPostPageNum = postIdToPageMap.get(deletedPostId);

      clearDeletedPostData(deletedPostId, deletedPostPageNum);

      const pagesToRemove =
        deletedPostPageNum === POSTS_DEFAULT_PAGE - 1
          ? Map()
          : pageIndexMap.filter((_, pageNum) => pageNum > deletedPostPageNum);

      clearPagesOnPostDelete(pagesToRemove);

      // Only refetch deleted page
      refetchPostPage(deletedPostPageNum + 1);
    }
  }, [
    clearDeletedPostData,
    clearPagesOnPostDelete,
    deletedPostId,
    isPostDeleted,
    pageIndexMap,
    postIdToPageMap,
    refetchPostPage,
  ]);

  console.log(
    "Profile LoadedPostsMap: ",
    loadedPostsMap,
    loadedPostsPage,
    latestLoadedPage
  );

  const ItemContainer = styled.div`
    padding: 0px 4px 8px;
    min-width: 125px;
    display: flex;
    flex: auto;
  `;

  const ItemWrapper = styled.div`
    display: flex;
    flex: 1;
  `;

  const GridContainer = styled.div((props) => ({
    display: "grid",
    gridTemplateColumns: isSmallScreen
      ? "repeat(auto-fill, minmax(137.5px, 1fr))"
      : "repeat(auto-fill, minmax(175px, 1fr))",
    gridGap: isSmallScreen ? "4px" : "8px",
    scrollBehavior: "smooth",
    // placeContent: "center",
  }));

  const ProfilePostItem = ({ post }) => {
    const MemoizedProfilePost = useMemo(
      () => (
        <ItemWrapper key={post?.id}>
          <ProfilePost
            currUser={currUser}
            post={post}
            updateLoadedPostEntry={updateLoadedPostEntry}
          />
        </ItemWrapper>
      ),
      [post]
    );

    return MemoizedProfilePost;
  };

  const rowContent = (index) => {
    const post = loadedPostsMap.valueSeq().get(index);

    return <ProfilePostItem post={post} />;
  };

  const ScrollSeekPlaceholder = ({ height, width, index }) => (
    <Flex
      key={index}
      px={1}
      pb={2}
      rounded="lg"
      w="full"
      h={height}
      overflow="hidden"
      pointerEvents="none"
    >
      <Skeleton rounded="lg" boxShadow="md" height="full" width="full" />
    </Flex>
  );

  const Footer = () => {
    if (isLoadingPostLookup) {
      return (
        <Flex
          pt={4}
          pb={3}
          maxH="full"
          justifyContent="center"
          alignItems="center"
        >
          <SphereSpinner
            color={
              colorMode === "dark"
                ? theme.colors.gray[300]
                : theme.colors.gray[400]
            }
            loading={isLoadingPostLookup}
          />
        </Flex>
      );
    }

    if (loadedPostsPage.totalPages === 0) {
      return (
        <EmptyProfilePosts
          isGivenUserCurrUser={isGivenUserCurrUser}
          handleRefreshProfile={handleRefreshProfile}
        />
      );
    }

    return null;
  };

  return (
    <VirtuosoGrid
      style={{
        height: "100%",
        margin: "0px -4px",
      }}
      totalCount={loadedPostsMap.size}
      endReached={loadMorePosts}
      components={{
        Item: ItemContainer,
        List: GridContainer,
        ScrollSeekPlaceholder,
        Footer,
      }}
      itemContent={rowContent}
      scrollSeekConfiguration={{
        enter: (velocity) => Math.abs(velocity) > 400,
        exit: (velocity) => Math.abs(velocity) < 50,
      }}
    />
  );
};

export default ProfilePosts;
