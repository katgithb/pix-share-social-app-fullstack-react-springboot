import {
  Box,
  Flex,
  Spinner,
  Text,
  useColorMode,
  useColorModeValue,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { MrMiyagi, Pinwheel } from "@uiball/loaders";
import _ from "lodash";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";
import {
  BarsSpinner,
  CircleSpinner,
  ClapSpinner,
  CubeSpinner,
  FillSpinner,
  FlagSpinner,
  FlapperSpinner,
  GooSpinner,
  GridSpinner,
  GuardSpinner,
  HoopSpinner,
  JellyfishSpinner,
  MagicSpinner,
  RainbowSpinner,
  SphereSpinner,
  SpiralSpinner,
  SwapSpinner,
  SwishSpinner,
  TraceSpinner,
  WhisperSpinner,
} from "react-spinners-kit";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as WindowList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import PostFeedCard from "./PostFeedCard/PostFeedCard";

const PostFeed = ({ currUser, posts }) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef({});
  const itemHeights = useRef({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const fetchNextPageDelayInMs = 8000;
  // const [fetchNextPageTimerInSec, setFetchNextPageTimerInSec] = useState(
  //   fetchNextPageDelayInMs / 1000
  // );
  const pageSize = 15;
  const totalPage = Math.ceil(posts?.length / pageSize);
  const prefetchThreshold = Math.floor(pageSize / 3);

  // const loadMorePosts = (startIndex, stopIndex) => {
  //   // setLoading(true);
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const nextPageStartIndex = (page - 1) * pageSize;
  //       const nextPageStopIndex = page * pageSize;

  //       const newPosts =
  //         posts?.length <= pageSize
  //           ? posts
  //           : posts?.slice(nextPageStartIndex, nextPageStopIndex); // Replace with your actual API response

  //       // setLoadedPosts((prevPosts) => [...prevPosts, ...newPosts]);

  //       if (page >= totalPage) {
  //         setHasMore(false); // Set hasMore to false if the page number exceeds the total number of pages
  //       }

  //       console.log(
  //         "page and totalPages and hasMore: ",
  //         page,
  //         totalPage,
  //         hasMore
  //       );

  //       // setLoading(false);

  //       // resolve(); // Resolve the Promise after the delay
  //       resolve(newPosts); // Resolve the Promise with the newPosts
  //     }, 4000); // Simulate a 4-second delay
  //   }).then((newPosts) => {
  //     setLoadedPosts((prevPosts) => [...prevPosts, ...newPosts]); // Update loadedPosts after the Promise is resolved
  //     setLoading(false); // Set loading to false after the Promise is resolved
  //     setPage((prevPage) => prevPage + 1); // Increment the page state variable
  //   });

  // };

  const loadMorePosts = async () => {
    if (!hasMore) return;
    setLoading(true);
    // const interval = setInterval(() => {
    // setFetchNextPageTimerInSec((prevTimer) => prevTimer - 1);
    // }, 2000);

    try {
      const newPosts = await new Promise((resolve) => {
        setTimeout(() => {
          const nextPageStartIndex = (page - 1) * pageSize;
          const nextPageStopIndex = page * pageSize;

          const postsToLoad =
            posts?.length <= pageSize
              ? posts
              : posts?.slice(nextPageStartIndex, nextPageStopIndex); // Replace with your actual API response

          resolve(postsToLoad); // Resolve the Promise with the postsToLoad
        }, fetchNextPageDelayInMs); // Simulate a delay
      });

      if (page >= totalPage) {
        setHasMore(false); // Set hasMore to false if the page number exceeds the total number of pages
      }

      setLoadedPosts((prevPosts) => [...prevPosts, ...newPosts]); // Update loadedPosts after the Promise is resolved
      // setLoading(false);
      setPage((prevPage) => prevPage + 1); // Increment the page state variable
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      // clearInterval(interval);
      // setFetchNextPageTimerInSec(fetchNextPageDelayInMs / 1000); // Reset the timer
      setLoading(false); // Set loading to false after the Promise has completed
    }
  };

  console.log(
    "page and totalPages and hasMore and loadedPosts: ",
    page,
    totalPage,
    hasMore,
    loadedPosts
  );

  const fetchInitialPosts = (limit) => {
    return posts?.length <= limit ? posts : posts?.slice(0, limit);
  };

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasMore ? loadedPosts.length + 1 : posts?.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = loading ? () => {} : loadMorePosts;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index) => !hasMore || index < loadedPosts.length;

  const measureRowHeight = (index) => {
    const itemHeightPaddingInPx = 16;
    const itemDefaultHeight = 460; // Default height if not measured yet
    return (
      itemHeights.current[index] + itemHeightPaddingInPx ||
      itemDefaultHeight + itemHeightPaddingInPx
    );
  };

  useEffect(() => {
    // Set the initial loadedPosts when the component is loaded
    const initialPosts = fetchInitialPosts(pageSize);
    console.log("initialPosts", initialPosts); // Replace with your logic to fetch the initial posts
    setLoadedPosts(initialPosts);
    setPage(page + 1);
  }, []);

  // console.log("loadedPosts", loadedPosts);
  // console.log("rowHeights: ", itemHeights.current);
  console.log("threshold index: ", prefetchThreshold);

  const PostFeedCardWithResizeHandling = React.memo(({ index, post }) => {
    const { id, image, caption, comments } = post;
    const { height, ref } = useResizeDetector({
      refreshMode: "debounce",
      refreshRate: 400,
    });

    useEffect(() => {
      if (height) {
        const itemHeight = height; // Use the height of the container
        itemHeights.current[index] = itemHeight;
        listRef.current.resetAfterIndex(index);
      }
    }, [height, index]);

    return (
      <div ref={ref} style={{ maxWidth: "100%" }}>
        <PostFeedCard
          currUser={currUser}
          user={post?.user}
          post={{
            id,
            image,
            caption,
            comments,
          }}
        />
      </div>
    );
  });

  PostFeedCardWithResizeHandling.displayName = "PostFeedCardWithResizeHandling";

  const rowRenderer = React.memo(({ index, style }) => {
    const post = loadedPosts[index];

    // if (loading) {
    //   console.log("Loading... ", fetchNextPageTimerInSec, "s");
    // }

    const loadingSpinner = (
      <Flex m={4} justifyContent="center" alignItems="center">
        <MagicSpinner
          color={
            colorMode === "dark"
              ? theme.colors.blue[300]
              : theme.colors.blue[500]
          }
          size={60}
          loading={loading}
        />
      </Flex>
    );

    let content;
    if (!isItemLoaded(index) || index >= loadedPosts.length) {
      content = loadingSpinner;
    } else {
      content = <PostFeedCardWithResizeHandling index={index} post={post} />;
    }

    return (
      <div
        key={post?.id}
        style={{
          ...style,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          scrollBehavior: "smooth",
        }}
      >
        {content}
      </div>
    );
  });

  rowRenderer.displayName = "rowRenderer";

  return (
    <Flex flexDirection={"column"}>
      <div
        style={{
          height: "100vh",
          // overflow: "auto",
          justifyContent: "center",
          // scrollBehavior: "smooth",
          willChange: "transform",
        }}
      >
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          threshold={prefetchThreshold}
        >
          {({ onItemsRendered, ref }) => (
            <AutoSizer disableWidth>
              {({ height }) => (
                <WindowList
                  height={height}
                  itemCount={itemCount}
                  onItemsRendered={onItemsRendered}
                  itemSize={measureRowHeight}
                  // width={width}
                  // ref={ref}
                  ref={(el) => {
                    listRef.current = el;
                    ref(el);
                  }}
                >
                  {rowRenderer}
                </WindowList>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    </Flex>
  );
};

export default PostFeed;
