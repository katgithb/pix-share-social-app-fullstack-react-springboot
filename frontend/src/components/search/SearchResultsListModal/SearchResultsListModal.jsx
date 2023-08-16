import {
  Box,
  Card,
  Divider,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  HStack,
  InputGroup,
  Input,
  InputLeftElement,
  ScaleFade,
  ListItem,
  List,
  Fade,
  Collapse,
  Stack,
  useBreakpointValue,
  useTheme,
  useColorMode,
  Slide,
  SlideFade,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useResizeDetector } from "react-resize-detector";
import {
  BarsSpinner,
  ClapSpinner,
  FlapperSpinner,
  ImpulseSpinner,
  MagicSpinner,
  PulseSpinner,
  RainbowSpinner,
  SequenceSpinner,
  SphereSpinner,
  SpiralSpinner,
  StageSpinner,
  SwapSpinner,
} from "react-spinners-kit";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import { VariableSizeList as WindowList } from "react-window";
import CustomizableModal from "../../shared/CustomizableModal";
import SearchResultsListCard from "./SearchResultsListCard";
import SearchInputBar from "../SearchInputBar";
import SearchResultsList from "./SearchResultsList";

const SearchResultsListModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const userIds = [20, 72, 58, 29, 89, 17, 94, 69, 11, 23, 10, 90, 18, 81, 79];
  const userIdList = Array.from(
    { length: 100 },
    () => userIds[Math.floor(Math.random() * userIds.length)]
  );

  const fullnames = [
    "Jane Smith",
    "Alex Johnson Hades Kate Wilber Robert",
    "Sarah Thompson",
    "John Doe",
  ];
  const fullnameList = Array.from(
    { length: 100 },
    () => fullnames[Math.floor(Math.random() * fullnames.length)]
  );

  function generateUsernameFromName(fullname) {
    const username = fullname.replace(/\s+/g, "_").toLowerCase();

    return username;
  }

  const handleSearchInputChange = (e) => {
    const searchKeyword = e.target.value;
    setSearchQuery(searchKeyword);
    performSearch(searchKeyword);
  };

  const performSearch = _.debounce((searchKeyword) => {
    if (searchKeyword.length >= 3) {
      const filteredResults = fullnameList.reduce((results, name, index) => {
        if (name.toLowerCase().includes(searchKeyword.toLowerCase())) {
          const userId = userIdList[index];
          const gender = userId % 2 === 0 ? "men" : "women";
          const searchResult = {
            userId: userId,
            user: {
              dp: `https://randomuser.me/api/portraits/${gender}/${Math.round(
                userId
              )}.jpg`,
              fullname: name,
              username: generateUsernameFromName(name),
            },
          };
          results.push(searchResult);
        }
        return results;
      }, []);

      setSearchResults(filteredResults);
      console.log("filteredResults: ", filteredResults);
    } else {
      setSearchResults([]);
    }
  }, 400);

  const handleModalClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  return (
    <CustomizableModal
      isOpen={isOpen}
      onClose={handleModalClose}
      size={"3xl"}
      header={
        <HeaderContent
          searchQuery={searchQuery}
          handleSearchInputChange={handleSearchInputChange}
        />
      }
      showModalCloseButton={false}
      isCentered={false}
    >
      {searchResults.length > 0 && searchQuery.length >= 3 ? (
        <Fade in>
          <SearchResultsList
            searchQuery={searchQuery}
            searchResults={searchResults}
          />
        </Fade>
      ) : searchQuery.length > 0 ? (
        <Flex mt={-2} mb={2} align="center" justify="center" flex={1} h="full">
          <Text
            fontWeight="bold"
            textAlign="start"
            color="gray.500"
            _dark={{ color: "gray.400" }}
            fontSize="sm"
          >
            No results found
          </Text>
        </Flex>
      ) : (
        <Flex mt={-2} mb={2} align="center" justify="center" flex={1} h="full">
          <Text
            fontWeight="bold"
            textAlign="start"
            color="gray.500"
            _dark={{ color: "gray.400" }}
            fontSize="sm"
          >
            Type your search query...
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
        searchQuery={searchQuery}
        handleSearchInputChange={handleSearchInputChange}
      />

      <Box mt={3} mx={-6}>
        <Divider />
      </Box>
    </Box>
  );
};

export default SearchResultsListModal;
