import { Box, Divider, Fade, Flex, Text } from "@chakra-ui/react";
import _ from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsersAction } from "../../../redux/actions/user/userLookupActions";
import { fetchUserProfileAction } from "../../../redux/actions/user/userProfileActions";
import { clearSearchUsers } from "../../../redux/reducers/user/userLookupSlice";
import {
  clearFollowedUser,
  clearUnfollowedUser,
} from "../../../redux/reducers/user/userSocialSlice";
import { getAuthToken } from "../../../utils/authUtils";
import {
  SEARCH_USERS_DEFAULT_PAGE,
  SEARCH_USERS_PER_PAGE,
  SEARCH_USERS_SORT_BY,
  SEARCH_USERS_SORT_DIRECTION,
} from "../../../utils/constants/pagination/userPagination";
import CustomizableModal from "../../shared/CustomizableModal";
import SearchInputBar from "../SearchInputBar";
import SearchResultsList from "./SearchResultsList";

const SearchResultsListModal = ({ isOpen, onClose }) => {
  const searchQuery = useRef("");
  const [searchResultsPage, setSearchResultsPage] = useState({});
  const followStatusUpdatedUsersSet = useRef(new Set());

  const dispatch = useDispatch();
  const token = getAuthToken();
  const { searchUsers: selectSearchUsers } = useSelector(
    (store) => store.user.userLookup
  );
  const searchUsersByQuery = useMemo(
    () => selectSearchUsers,
    [selectSearchUsers]
  );

  const handleSearchInputChange = (e) => {
    const searchKeyword = e.target.value;

    searchQuery.current = searchKeyword;
    performSearch(searchKeyword);
  };

  const performSearch = _.debounce((searchKeyword) => {
    if (searchKeyword.length >= 3) {
      changeSearchResultsPage(searchKeyword, SEARCH_USERS_DEFAULT_PAGE);
    }

    setSearchResultsPage({
      content: [],
      page: SEARCH_USERS_DEFAULT_PAGE - 1,
      size: SEARCH_USERS_PER_PAGE,
      totalRecords: 0,
      totalPages: 0,
      last: true,
    });
  }, 500);

  const changeUserFollowUpdatesSet = useCallback((userId) => {
    if (!followStatusUpdatedUsersSet.current.has(userId)) {
      followStatusUpdatedUsersSet.current.add(userId);
    }
  }, []);

  const clearUserFollowUpdatesAndRefetchUser = (
    userFollowUpdatesSet = new Set()
  ) => {
    if (token && userFollowUpdatesSet.size > 0) {
      const data = { token };

      dispatch(fetchUserProfileAction(data));
    }

    for (let userId of userFollowUpdatesSet) {
      if (userId) {
        dispatch(clearFollowedUser(userId));
        dispatch(clearUnfollowedUser(userId));
      }
    }
  };

  const handleModalClose = () => {
    searchQuery.current = "";
    setSearchResultsPage({});
    dispatch(clearSearchUsers());

    clearUserFollowUpdatesAndRefetchUser(followStatusUpdatedUsersSet.current);
    followStatusUpdatedUsersSet.current.clear();
    onClose();
  };

  const changeSearchResultsPage = useCallback(
    async (query, pageNumber) => {
      if (token && query) {
        const data = {
          token,
          query,
          pageFetchParams: {
            page:
              pageNumber > 0 ? pageNumber - 1 : SEARCH_USERS_DEFAULT_PAGE - 1,
            size: SEARCH_USERS_PER_PAGE,
            sortBy: SEARCH_USERS_SORT_BY,
            sortDir: SEARCH_USERS_SORT_DIRECTION,
          },
        };
        dispatch(searchUsersAction(data));
      }
    },
    [dispatch, token]
  );

  const handleSearchResultsPageChange = useCallback(
    (query, pageNumber) => {
      changeSearchResultsPage(query, pageNumber);
    },
    [changeSearchResultsPage]
  );

  useEffect(() => {
    const searchResultsPage = searchUsersByQuery;

    if (searchResultsPage) {
      console.log("Search Users Results Page: ", searchResultsPage);
      setSearchResultsPage(searchResultsPage);
    }
  }, [searchUsersByQuery]);

  return (
    <CustomizableModal
      isOpen={isOpen}
      onClose={handleModalClose}
      size={"3xl"}
      header={
        <HeaderContent
          searchQuery={searchQuery.current}
          handleSearchInputChange={handleSearchInputChange}
        />
      }
      showModalCloseButton={false}
      isCentered={false}
    >
      {searchQuery.current.length >= 3 ? (
        <Fade in>
          <SearchResultsList
            searchQuery={searchQuery.current}
            searchResults={searchResultsPage}
            totalSearchResults={searchResultsPage?.totalRecords || 0}
            handlePageChange={handleSearchResultsPageChange}
            changeUserFollowUpdatesSet={changeUserFollowUpdatesSet}
          />
        </Fade>
      ) : (
        <Flex mt={-2} mb={2} align="center" justify="center" flex={1} h="full">
          <Text
            fontWeight="bold"
            textAlign="center"
            color="gray.500"
            _dark={{ color: "gray.400" }}
            fontSize="sm"
          >
            Type your search query... (3+ characters)
          </Text>
        </Flex>
      )}
    </CustomizableModal>
  );
};

const HeaderContent = ({ searchQuery, handleSearchInputChange }) => {
  return (
    <Box>
      <SearchInputBar
        isNavSearchBar={false}
        handleSearchInputChange={handleSearchInputChange}
      />

      <Box mt={3} mx={-6}>
        <Divider />
      </Box>
    </Box>
  );
};

export default SearchResultsListModal;
