import React, { useEffect, useRef, useState } from "react";
import { VariableSizeList as WindowList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
import { StageSpinner } from "react-spinners-kit";
import SearchResultsListCard from "./SearchResultsListCard";
import { useResizeDetector } from "react-resize-detector";

const SearchResultsList = ({ searchQuery, searchResults }) => {
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const [loadedResults, setLoadedResults] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef({});
  const itemHeights = useRef({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const fetchNextPageDelayInMs = 4000;
  const pageSize = 25;
  const totalPage = Math.ceil(searchResults?.length / pageSize);
  const prefetchThreshold = Math.floor(pageSize / 3);

  const loadMoreResults = async () => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const newResults = await new Promise((resolve) => {
        setTimeout(() => {
          const nextPageStartIndex = (page - 1) * pageSize;
          const nextPageStopIndex = page * pageSize;

          const resultsToLoad =
            // searchResults?.length <= pageSize
            //   ? searchResults
            //   :
            searchResults?.slice(nextPageStartIndex, nextPageStopIndex);

          resolve(resultsToLoad); // Resolve the Promise with the resultsToLoad
        }, fetchNextPageDelayInMs); // Simulate a delay
      });

      if (page >= totalPage) {
        setHasMore(false); // Set hasMore to false if the page number exceeds the total number of pages
      }

      setLoadedResults((prevResults) => [...prevResults, ...newResults]); // Update loadedResults after the Promise is resolved
      setPage((prevPage) => prevPage + 1); // Increment the page state variable
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setLoading(false); // Set loading to false after the Promise has completed
    }
  };

  console.log(
    "searchResults page and totalPages and hasMore: ",
    page,
    totalPage,
    hasMore
  );

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasMore ? loadedResults.length + 1 : searchResults?.length;

  const loadMoreItems = loading ? () => {} : loadMoreResults;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index) => !hasMore || index < loadedResults.length;

  const measureRowHeight = (index) => {
    const itemHeightPaddingInPx = 12;
    const itemDefaultHeight = isSmallScreen ? 90 : 42; // Default height if not measured yet
    return (
      itemHeights.current[index] + itemHeightPaddingInPx ||
      itemDefaultHeight + itemHeightPaddingInPx
    );
  };

  useEffect(() => {
    setLoadedResults([]);
    setHasMore(true);
    setPage(1);
  }, [searchQuery]);

  const SearchResultsListCardWithResizeHandling = React.memo(
    ({ index, searchResult }) => {
      // console.log("index and searchResult:", index, searchResult);
      const { user } = searchResult;

      const { height, ref } = useResizeDetector({
        refreshMode: "debounce",
        refreshRate: 500,
      });

      useEffect(() => {
        if (height) {
          const itemHeight = height; // Use the height of the container
          itemHeights.current[index] = itemHeight;
          listRef.current.resetAfterIndex(index);
        }
      }, [height, index]);

      return (
        <div ref={ref}>
          <SearchResultsListCard user={user} />
        </div>
      );
    }
  );

  SearchResultsListCardWithResizeHandling.displayName =
    "SearchResultsListCardWithResizeHandling";

  const rowRenderer = React.memo(({ index, style }) => {
    const searchResult = loadedResults[index];

    const loadingSpinner = (
      <Flex
        m={1}
        pt={loading && loadedResults.length === 0 ? 3 : 0}
        maxH="full"
        justifyContent="center"
        alignItems="center"
      >
        <StageSpinner
          color={
            colorMode === "dark"
              ? theme.colors.gray[300]
              : theme.colors.gray[400]
          }
          loading={loading}
        />
      </Flex>
    );

    let content;
    if (!isItemLoaded(index) || index >= loadedResults.length) {
      content = loadingSpinner;
    } else {
      content = (
        <SearchResultsListCardWithResizeHandling
          index={index}
          searchResult={searchResult}
        />
      );
    }

    return (
      <div
        key={searchResult?.userId}
        style={{
          ...style,
          padding: "4px 8px",
        }}
      >
        {content}
      </div>
    );
  });

  rowRenderer.displayName = "rowRenderer";

  return (
    <Box mx={-2}>
      {loadedResults.length > 0 && (
        <Flex px={2} mt={-4} mb={2}>
          <Text
            fontWeight="bold"
            textAlign="start"
            color="gray.500"
            _dark={{ color: "gray.400" }}
            fontSize="sm"
          >
            Found {searchResults?.length} results
          </Text>
        </Flex>
      )}

      <Box mb={2} rounded="lg" scrollBehavior="smooth" overflowY="auto">
        <Flex
          flexDirection="column"
          h={
            loading && loadedResults.length === 0
              ? "100px"
              : { base: "65vh", md: "62.5vh" }
          }
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
        </Flex>
      </Box>
    </Box>
  );
};

export default SearchResultsList;
