import { Flex } from "@chakra-ui/react";
import { Map, OrderedMap, Set } from "immutable";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Virtuoso } from "react-virtuoso";
import {
  POSTS_DEFAULT_PAGE,
  POSTS_PER_PAGE,
} from "../../../utils/constants/pagination/postPagination";
import EmptyPostFeed from "../EmptyPostFeed";
import EndOfPostFeed from "./EndOfPostFeed";
import PostFeedCard from "./PostFeedCard/PostFeedCard";
import PostFeedCardSkeleton from "./PostFeedCard/PostFeedCardSkeleton";

const PostFeed = ({ currUser, posts, handlePageChange }) => {
  const [currentPage, setCurrentPage] = useState(POSTS_DEFAULT_PAGE);
  const [loadedPostsPage, setLoadedPostsPage] = useState(posts);
  const [pageIndexMap, setPageIndexMap] = useState(Map());
  const [postIdToPageMap, setPostIdToPageMap] = useState(Map());
  const [loadedPostsMap, setLoadedPostsMap] = useState(OrderedMap());

  const { popularUsers } = useSelector((store) => store.user.userLookup);
  const { isPostCreated, isPostDeleted, deletedPostId } = useSelector(
    (store) => store.post.postManagement
  );
  const { isLoading: isLoadingPostLookup } = useSelector(
    (store) => store.post.postLookup
  );
  const virtuosoRef = useRef(null);

  const loadMorePosts = () => {
    if (loadedPostsPage.last) return;

    handlePageChange(currentPage + 1);

    // Increment the currentPage state variable
    currentPage < loadedPostsPage.totalPages
      ? setCurrentPage((prevPage) => prevPage + 1)
      : setCurrentPage(loadedPostsPage.page + 1);
  };

  const handleRefreshFeed = () => {
    // Scroll to the last item in the list
    const itemCount = loadedPostsMap.size;
    virtuosoRef.current?.scrollToIndex({
      index: itemCount - 1,
    });

    // Reload the page
    window.location.reload();
  };

  useEffect(() => {
    if (posts) {
      setLoadedPostsPage(posts);

      if (posts?.content && posts?.page < posts?.totalPages) {
        const newPosts = posts?.content;
        console.log("New Posts:", newPosts);

        const postIds = newPosts.map((post) => post.id);
        const newPageIndexMap = Map().set(posts.page, postIds);

        setPageIndexMap((prevMap) => {
          return posts?.page === POSTS_DEFAULT_PAGE - 1
            ? newPageIndexMap
            : prevMap.merge(newPageIndexMap);
        });

        const newPostIdToPageMap = Map(
          newPosts.map((post) => [post.id, posts.page])
        );
        setPostIdToPageMap((prevMap) =>
          posts?.page === POSTS_DEFAULT_PAGE - 1
            ? newPostIdToPageMap
            : prevMap.merge(newPostIdToPageMap)
        );

        const newLoadedPostsMap = OrderedMap(
          newPosts.map((post) => [post.id, post])
        );

        setLoadedPostsMap((prevPosts) =>
          posts?.page === POSTS_DEFAULT_PAGE - 1
            ? newLoadedPostsMap
            : prevPosts.merge(newLoadedPostsMap)
        );
      }
    }
  }, [posts]);

  useEffect(() => {
    if (isPostCreated) {
      // Refetch first page
      handlePageChange(POSTS_DEFAULT_PAGE);

      setCurrentPage(POSTS_DEFAULT_PAGE);
    }
  }, [handlePageChange, isPostCreated]);

  useEffect(() => {
    if (isPostDeleted && deletedPostId) {
      const deletedPostPageNum = postIdToPageMap.get(deletedPostId);

      setPageIndexMap((prevMap) =>
        prevMap.filter((postIds, pageNum) => pageNum !== deletedPostPageNum)
      );

      setPostIdToPageMap((prevMap) =>
        prevMap.filter((pageNum, postId) => postId !== deletedPostId)
      );

      setLoadedPostsMap((prevPostsMap) =>
        prevPostsMap.filter((post, postId) => postId !== deletedPostId)
      );

      const pagesToRemove =
        deletedPostPageNum === POSTS_DEFAULT_PAGE - 1
          ? Map()
          : pageIndexMap.filter(
              (postIds, pageNum) => pageNum > deletedPostPageNum
            );

      let postIdsToRemove = Set();
      const postIdsToRemoveBatches = [];

      pagesToRemove.forEach((postIds, pageNum) => {
        const pagePostIds = pageIndexMap.get(pageNum);
        const postIdsToRemoveBatch = Set(pagePostIds);

        postIdsToRemove = postIdsToRemove.union(pagePostIds);

        postIdsToRemoveBatches.push(postIdsToRemoveBatch);
      });

      console.log("pagesToRemove: ", pagesToRemove);

      setPageIndexMap((prevMap) =>
        prevMap.filter((postIds, pageNum) => !pagesToRemove.has(pageNum))
      );

      setPostIdToPageMap((prevMap) =>
        prevMap.filter((pageNum, postId) => !postIdsToRemove.has(postId))
      );

      setLoadedPostsMap((prevPostsMap) =>
        postIdsToRemoveBatches.reduce(
          (map, batch) => map.filter((post, postId) => !batch.has(postId)),
          prevPostsMap
        )
      );

      // Only refetch deleted page
      handlePageChange(deletedPostPageNum + 1);

      setCurrentPage(deletedPostPageNum + 1);
    }
  }, [
    isPostDeleted,
    deletedPostId,
    postIdToPageMap,
    handlePageChange,
    pageIndexMap,
  ]);

  console.log(
    "currentPage and totalPages and lastPage and loadedPostsPage and loadedPosts: ",
    currentPage,
    loadedPostsPage.totalPages,
    loadedPostsPage.last,
    loadedPostsPage,
    pageIndexMap,
    postIdToPageMap,
    loadedPostsMap
  );

  const PostFeedCardItem = ({ post }) => {
    const MemoizedPostFeedCard = useMemo(
      () => (
        <Flex key={post?.id} justifyContent="center">
          <PostFeedCard currUser={currUser} post={post} />
        </Flex>
      ),
      [post]
    );

    return MemoizedPostFeedCard;
  };

  const rowContent = (index) => {
    const post = loadedPostsMap.valueSeq().get(index);

    return <PostFeedCardItem post={post} />;
  };

  const ScrollSeekPlaceholder = ({ height, width, index }) => (
    <PostFeedCardSkeleton height={height} width={width} index={index} />
  );

  const Footer = () => {
    if (isLoadingPostLookup) {
      // Adjust the number of loading placeholders based on the page size
      const loadingPlaceholderCount = Math.ceil(POSTS_PER_PAGE / 5);

      // Generate the loading placeholders
      const loadingPlaceholders = Array.from(
        { length: loadingPlaceholderCount },
        (_, index) => <PostFeedCardSkeleton key={index} index={index} />
      );

      return <>{loadingPlaceholders}</>;
    }

    if (loadedPostsPage.totalPages === 0) {
      return <EmptyPostFeed suggestedUsers={popularUsers} />;
    }

    if (loadedPostsPage.totalPages > 0 && loadedPostsPage.last) {
      return <EndOfPostFeed handleRefreshFeed={handleRefreshFeed} />;
    }

    return null;
  };

  return (
    <Flex flexDirection={"column"}>
      <div
        style={{
          height: "100vh",
          scrollBehavior: "smooth",
          // willChange: "transform",
        }}
      >
        <Virtuoso
          ref={virtuosoRef}
          style={{
            height: "100%",
          }}
          totalCount={loadedPostsMap.size}
          endReached={loadMorePosts}
          itemContent={rowContent}
          components={{ ScrollSeekPlaceholder, Footer }}
          scrollSeekConfiguration={{
            enter: (velocity) => Math.abs(velocity) > 1250,
            exit: (velocity) => Math.abs(velocity) < 100,
          }}
        />
      </div>
    </Flex>
  );
};

export default PostFeed;
