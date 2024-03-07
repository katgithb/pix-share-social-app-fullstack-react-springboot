import {
  Box,
  Fade,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
import { OrderedMap } from "immutable";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { StageSpinner } from "react-spinners-kit";
import { Virtuoso } from "react-virtuoso";
import { getHumanReadableNumberFormat } from "../../../utils/commonUtils";
import { SEARCH_USERS_DEFAULT_PAGE } from "../../../utils/constants/pagination/userPagination";
import SearchResultsListCard from "./SearchResultsListCard";

const SearchResultsList = ({
  searchQuery,
  searchResults,
  totalSearchResults = 0,
  handlePageChange,
  changeUserFollowUpdatesSet = () => {},
}) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const [latestLoadedPage, setLatestLoadedPage] = useState(
    SEARCH_USERS_DEFAULT_PAGE
  );
  const [loadedSearchResultsPage, setLoadedSearchResultsPage] = useState({});
  const [loadedSearchResultsMap, setLoadedSearchResultsMap] = useState(
    OrderedMap()
  );

  const { isSearchUsersLoading } = useSelector(
    (store) => store.user.userLookup
  );
  const searchResultsCount = getHumanReadableNumberFormat(totalSearchResults);
  const searchResultsText = totalSearchResults === 1 ? "result" : "results";

  const loadMoreSearchResults = () => {
    if (loadedSearchResultsPage.last) return;

    handlePageChange(searchQuery, latestLoadedPage + 1);

    // Increment the latestLoadedPage state variable
    latestLoadedPage < loadedSearchResultsPage.totalPages
      ? setLatestLoadedPage((prevPage) => prevPage + 1)
      : setLatestLoadedPage(loadedSearchResultsPage.page + 1);
  };

  const populateInitialSearchResultsPage = useCallback(
    (initialSearchResultsPage) => {
      if (initialSearchResultsPage?.content) {
        const initialSearchResults = initialSearchResultsPage?.content;
        console.log("Initial SearchResults:", initialSearchResults);

        const newLoadedSearchResultsMap = OrderedMap(
          initialSearchResults.map((user) => [user.id, user])
        );
        setLoadedSearchResultsMap(newLoadedSearchResultsMap);
      }
    },
    []
  );

  const addNewSearchResultsPageData = useCallback((newSearchResultsPage) => {
    if (
      newSearchResultsPage?.content &&
      newSearchResultsPage?.page < newSearchResultsPage?.totalPages
    ) {
      const newSearchResults = newSearchResultsPage?.content;
      console.log("New SearchResults:", newSearchResults);

      const newLoadedSearchResultsMap = OrderedMap(
        newSearchResults.map((user) => [user.id, user])
      );
      setLoadedSearchResultsMap((prevSearchResultsMap) =>
        prevSearchResultsMap.merge(newLoadedSearchResultsMap)
      );
    }
  }, []);

  useEffect(() => {
    if (searchResults) {
      const loadedSearchResultsPage = searchResults;
      setLoadedSearchResultsPage(searchResults);
      console.log("loadedSearchResultsPage: ", loadedSearchResultsPage);

      if (loadedSearchResultsPage?.page === SEARCH_USERS_DEFAULT_PAGE - 1) {
        populateInitialSearchResultsPage(loadedSearchResultsPage);
      } else {
        addNewSearchResultsPageData(loadedSearchResultsPage);
      }
    }
  }, [
    addNewSearchResultsPageData,
    loadedSearchResultsPage,
    populateInitialSearchResultsPage,
    searchResults,
  ]);

  useEffect(() => {
    if (searchQuery) {
      setLatestLoadedPage(SEARCH_USERS_DEFAULT_PAGE);
      setLoadedSearchResultsPage({});
      setLoadedSearchResultsMap(OrderedMap());
    }
  }, [searchQuery]);

  const SearchResultsListCardItem = ({ searchResultUser }) => {
    const MemoizedSearchResultsListCard = useMemo(
      () => (
        <SearchResultsListCard
          user={searchResultUser}
          changeUserFollowUpdatesSet={changeUserFollowUpdatesSet}
        />
      ),
      [searchResultUser]
    );

    return MemoizedSearchResultsListCard;
  };

  const rowContent = (index) => {
    const searchResultUser = loadedSearchResultsMap.valueSeq().get(index);

    return <SearchResultsListCardItem searchResultUser={searchResultUser} />;
  };

  const ScrollSeekPlaceholder = ({ height, width, index }) => (
    <Flex
      key={index}
      h={height}
      flex="1"
      align="start"
      mt={0.5}
      px={2}
      py={1}
      gap={2}
      overflow="hidden"
      pointerEvents="none"
    >
      <Flex align="center">
        <SkeletonCircle size="2.5em" />
      </Flex>

      <Flex flex="1" flexDirection="column" align="start" gap={2}>
        <Skeleton
          height="14px"
          width={{ base: "30%", md: "20%" }}
          rounded="lg"
        />
        <Skeleton
          mb={1}
          height="1em"
          width={{ base: "50%", md: "35%" }}
          rounded="lg"
        />
      </Flex>
    </Flex>
  );

  const Footer = () => {
    if (isSearchUsersLoading) {
      return (
        <Flex
          m={1}
          pt={isSearchUsersLoading && totalSearchResults === 0 ? 2 : 0}
          maxH="full"
          justify="center"
          align="center"
        >
          <StageSpinner
            color={
              colorMode === "dark"
                ? theme.colors.gray[300]
                : theme.colors.gray[400]
            }
            loading={isSearchUsersLoading}
          />
        </Flex>
      );
    }

    if (!_.isEmpty(loadedSearchResultsPage) && totalSearchResults === 0) {
      return (
        <Fade in>
          <Flex m={1} pt={5} maxH="full" align="center" justify="center">
            <Text
              fontWeight="bold"
              textAlign="center"
              color="gray.500"
              _dark={{ color: "gray.400" }}
              fontSize="sm"
            >
              No results found
            </Text>
          </Flex>
        </Fade>
      );
    }

    if (_.isEmpty(loadedSearchResultsPage)) {
      return (
        <Fade in>
          <Flex m={1} pt={5} maxH="full" align="center" justify="center">
            <Text
              fontWeight="bold"
              textAlign="center"
              color="gray.500"
              _dark={{ color: "gray.400" }}
              fontSize="sm"
            >
              Failed to fetch results
            </Text>
          </Flex>
        </Fade>
      );
    }

    return null;
  };

  console.log(
    "loadedSearchResultsMap: ",
    searchQuery,
    latestLoadedPage,
    loadedSearchResultsPage,
    loadedSearchResultsMap
  );

  return (
    <Box mx={-2}>
      {totalSearchResults > 0 && (
        <Flex px={2} mt={-4} mb={2}>
          <Text
            fontWeight="bold"
            textAlign="start"
            color="gray.500"
            _dark={{ color: "gray.400" }}
            fontSize="sm"
          >
            Found {searchResultsCount} {searchResultsText}
          </Text>
        </Flex>
      )}

      <Box mb={2} rounded="lg" alignItems="center">
        <Flex
          flexDirection="column"
          h={totalSearchResults === 0 ? "20" : { base: "65vh", md: "62.5vh" }}
          justify="center"
          align="center"
        >
          <Virtuoso
            style={{
              flex: 1,
              width: "100%",
              scrollBehavior: "smooth",
            }}
            totalCount={loadedSearchResultsMap.size}
            endReached={loadMoreSearchResults}
            itemContent={rowContent}
            components={{ ScrollSeekPlaceholder, Footer }}
            scrollSeekConfiguration={{
              enter: (velocity) => Math.abs(velocity) > 500,
              exit: (velocity) => Math.abs(velocity) < 62.5,
            }}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default SearchResultsList;
