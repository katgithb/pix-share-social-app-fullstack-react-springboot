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
import {
  POSTS_DEFAULT_PAGE,
  SAVED_POSTS_DEFAULT_PAGE,
} from "../../../../utils/constants/pagination/postPagination";
import EmptyProfileSavedPosts from "../EmptyProfileSavedPosts";
import ProfileSavedPost from "./ProfileSavedPost";

const ProfileSavedPosts = ({
  currUser,
  savedPosts,
  handlePageChange,
  handlePostsPageChange,
}) => {
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const [latestLoadedPage, setLatestLoadedPage] = useState(
    SAVED_POSTS_DEFAULT_PAGE
  );
  const [loadedSavedPostsPage, setLoadedSavedPostsPage] = useState({});
  const [pageIndexMap, setPageIndexMap] = useState(Map());
  const [postIdToPageMap, setPostIdToPageMap] = useState(Map());
  const [loadedSavedPostsMap, setLoadedSavedPostsMap] = useState(OrderedMap());

  const { isPostCreated, isPostDeleted, deletedPostId } = useSelector(
    (store) => store.post.postManagement
  );
  const { isLoading: isLoadingUserLookup } = useSelector(
    (store) => store.user.userLookup
  );

  const loadMoreSavedPosts = () => {
    if (loadedSavedPostsPage.last) return;

    handlePageChange(latestLoadedPage + 1);

    // Increment the latestLoadedPage state variable
    latestLoadedPage < loadedSavedPostsPage.totalPages
      ? setLatestLoadedPage((prevPage) => prevPage + 1)
      : setLatestLoadedPage(loadedSavedPostsPage.page + 1);
  };

  const populateInitialSavedPostsPage = useCallback((initialSavedPostsPage) => {
    if (initialSavedPostsPage?.content) {
      const initialSavedPosts = initialSavedPostsPage?.content;
      const postIds = initialSavedPosts.map((post) => post.id);
      console.log("Initial SavedPosts:", initialSavedPosts);

      const newPageIndexMap = Map().set(initialSavedPostsPage?.page, postIds);
      setPageIndexMap(newPageIndexMap);

      const newPostIdToPageMap = Map(
        initialSavedPosts.map((post) => [post.id, initialSavedPostsPage?.page])
      );
      setPostIdToPageMap(newPostIdToPageMap);

      const newLoadedSavedPostsMap = OrderedMap(
        initialSavedPosts.map((post) => [post.id, post])
      );
      setLoadedSavedPostsMap(newLoadedSavedPostsMap);
    }
  }, []);

  const addNewSavedPostsPageData = useCallback((newSavedPostsPage) => {
    if (
      newSavedPostsPage?.content &&
      newSavedPostsPage?.page < newSavedPostsPage?.totalPages
    ) {
      const newSavedPosts = newSavedPostsPage?.content;
      const postIds = newSavedPosts.map((post) => post.id);
      console.log("New SavedPosts:", newSavedPosts);

      const newPageIndexMap = Map().set(newSavedPostsPage?.page, postIds);
      setPageIndexMap((prevMap) => prevMap.merge(newPageIndexMap));

      const newPostIdToPageMap = Map(
        newSavedPosts.map((post) => [post.id, newSavedPostsPage?.page])
      );
      setPostIdToPageMap((prevMap) => prevMap.merge(newPostIdToPageMap));

      const newLoadedSavedPostsMap = OrderedMap(
        newSavedPosts.map((post) => [post.id, post])
      );
      setLoadedSavedPostsMap((prevSavedPostsMap) =>
        prevSavedPostsMap.merge(newLoadedSavedPostsMap)
      );
    }
  }, []);

  const clearRemovedPostData = useCallback(
    (deletedPostId, deletedPostPageNum) => {
      setPageIndexMap((prevMap) =>
        prevMap.filter((_, pageNum) => pageNum !== deletedPostPageNum)
      );

      setPostIdToPageMap((prevMap) =>
        prevMap.filter((_, postId) => postId !== deletedPostId)
      );

      setLoadedSavedPostsMap((prevSavedPostsMap) =>
        prevSavedPostsMap.filter((_, postId) => postId !== deletedPostId)
      );
    },
    []
  );

  const clearPagesOnPostRemoval = useCallback(
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

      setLoadedSavedPostsMap((prevSavedPostsMap) =>
        postIdsToRemoveBatches.reduce(
          (map, batch) => map.filter((_, postId) => !batch.has(postId)),
          prevSavedPostsMap
        )
      );
    },
    [pageIndexMap]
  );

  const updateLoadedSavedPostEntry = useCallback((postId, updatedPost) => {
    const updatedPostMap = Map().set(postId, updatedPost);
    setLoadedSavedPostsMap((prevSavedPostsMap) =>
      prevSavedPostsMap.merge(updatedPostMap)
    );
  }, []);

  const refetchSavedPostPage = useCallback(
    (pageNumber) => {
      handlePageChange(pageNumber);

      setLatestLoadedPage(pageNumber);
    },
    [handlePageChange]
  );

  const clearUnsavedPostEntryAndRefetch = useCallback(
    (unsavedPostId) => {
      const unsavedPostPageNum = postIdToPageMap.get(unsavedPostId);

      clearRemovedPostData(unsavedPostId, unsavedPostPageNum);

      const pagesToRemove =
        unsavedPostPageNum === SAVED_POSTS_DEFAULT_PAGE - 1
          ? Map()
          : pageIndexMap.filter((_, pageNum) => pageNum > unsavedPostPageNum);

      clearPagesOnPostRemoval(pagesToRemove);

      // Only refetch unsaved post page
      refetchSavedPostPage(unsavedPostPageNum + 1);
    },
    [
      clearRemovedPostData,
      clearPagesOnPostRemoval,
      pageIndexMap,
      postIdToPageMap,
      refetchSavedPostPage,
    ]
  );

  useEffect(() => {
    handlePageChange(SAVED_POSTS_DEFAULT_PAGE);
  }, [handlePageChange]);

  useEffect(() => {
    if (savedPosts) {
      const loadedSavedPostsPage = savedPosts;
      setLoadedSavedPostsPage(savedPosts);
      console.log("Profile loadedSavedPostsPage: ", loadedSavedPostsPage);

      if (loadedSavedPostsPage?.page === SAVED_POSTS_DEFAULT_PAGE - 1) {
        populateInitialSavedPostsPage(loadedSavedPostsPage);
      } else {
        addNewSavedPostsPageData(loadedSavedPostsPage);
      }
    }
  }, [addNewSavedPostsPageData, populateInitialSavedPostsPage, savedPosts]);

  useEffect(() => {
    if (isPostCreated) {
      // Refetch first posts page
      handlePostsPageChange(POSTS_DEFAULT_PAGE);
    }
  }, [handlePostsPageChange, isPostCreated]);

  useEffect(() => {
    if (isPostDeleted && deletedPostId) {
      const deletedPostPageNum = postIdToPageMap.get(deletedPostId);

      clearRemovedPostData(deletedPostId, deletedPostPageNum);

      const pagesToRemove =
        deletedPostPageNum === SAVED_POSTS_DEFAULT_PAGE - 1
          ? Map()
          : pageIndexMap.filter((_, pageNum) => pageNum > deletedPostPageNum);

      clearPagesOnPostRemoval(pagesToRemove);

      // Only refetch deleted page
      refetchSavedPostPage(deletedPostPageNum + 1);
      // Refetch first posts page
      handlePostsPageChange(POSTS_DEFAULT_PAGE);
    }
  }, [
    clearRemovedPostData,
    clearPagesOnPostRemoval,
    deletedPostId,
    handlePostsPageChange,
    isPostDeleted,
    pageIndexMap,
    postIdToPageMap,
    refetchSavedPostPage,
  ]);

  console.log(
    "Profile LoadedSavedPostsMap: ",
    loadedSavedPostsMap,
    loadedSavedPostsPage,
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

  const ProfileSavedPostItem = ({ savedPost }) => {
    const MemoizedProfileSavedPost = useMemo(
      () => (
        <ItemWrapper key={savedPost?.id}>
          <ProfileSavedPost
            currUser={currUser}
            savedPost={savedPost}
            updateLoadedSavedPostEntry={updateLoadedSavedPostEntry}
            clearUnsavedPostEntryAndRefetch={clearUnsavedPostEntryAndRefetch}
          />
        </ItemWrapper>
      ),
      [savedPost]
    );

    return MemoizedProfileSavedPost;
  };

  const rowContent = (index) => {
    const savedPost = loadedSavedPostsMap.valueSeq().get(index);

    return <ProfileSavedPostItem savedPost={savedPost} />;
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
    if (isLoadingUserLookup) {
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
            loading={isLoadingUserLookup}
          />
        </Flex>
      );
    }

    if (loadedSavedPostsPage.totalPages === 0) {
      return <EmptyProfileSavedPosts />;
    }

    return null;
  };

  return (
    <VirtuosoGrid
      style={{
        height: "100%",
        margin: "0px -4px",
      }}
      totalCount={loadedSavedPostsMap.size}
      endReached={loadMoreSavedPosts}
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

export default ProfileSavedPosts;
