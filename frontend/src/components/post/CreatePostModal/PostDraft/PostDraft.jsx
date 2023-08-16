import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Icon,
  Link,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaRegFaceSmile } from "react-icons/fa6";
import { Link as RouteLink } from "react-router-dom";
import CustomAsyncPaginateSelect from "./CustomAsyncPaginateSelect";

const PostDraft = ({
  user,
  files,
  caption,
  location,
  setLocation,
  handleCaptionChange,
  // handleLocationChange,
}) => {
  // const [searchResults, setSearchResults] = useState([]);
  // const [loadedResults, setLoadedResults] = useState([]);
  // const [hasMore, setHasMore] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);
  // const searchCache = {};

  // const handleSearchChange = _.debounce((value) => {
  //   // setSearchTerm(value);
  //   // setInputValue(value);

  //   if (!value || value.trim() === "" || value.trim().length < 3) {
  //     setSearchResults([]);
  //     setLoadedResults([]);
  //     return;
  //   }

  //   // Check if the search results are already cached for the input value
  //   const cachedResults = searchCache[value];
  //   if (
  //     cachedResults &&
  //     Date.now() - cachedResults.timestamp < 1 * 60 * 60 * 1000
  //   ) {
  //     setSearchResults(cachedResults.searchResults);
  //     setLoadedResults(cachedResults.searchResults.slice(0, 20));
  //     return;
  //   }

  //   setIsLoading(true);

  //   // Perform the search and update the options
  //   const filteredOptions = [];

  //   // Split the search query by comma if a comma is present, otherwise use the entire search query
  //   const searchQuery = value.includes(",")
  //     ? value
  //         .trim()
  //         .split(",")
  //         .map((part) => part.trim())
  //         .filter((part) => part !== "" && part.length >= 2)
  //     : [value.trim()];

  //   console.log("searchQuery: ", searchQuery);

  //   // Search for cities
  //   const cityMatches = Cities.getCities().filter((city) =>
  //     searchQuery.some((term) =>
  //       unidecode(city.name.toLowerCase()).includes(term.trim())
  //     )
  //   );
  //   filteredOptions.push(
  //     ...cityMatches.map((city) => {
  //       const stateName = States.getStates().find(
  //         (state) => state.id === city.state_id
  //       )?.name;
  //       const countryName = Countries.getCountries().find(
  //         (country) => country.id === city.country_id
  //       )?.name;
  //       const formattedLocation = unidecode(
  //         `${city.name}, ${stateName}, ${countryName}`
  //       );
  //       return {
  //         value: formattedLocation,
  //         label: formattedLocation,
  //       };
  //     })
  //   );

  //   console.log("cityMatches: ", cityMatches);

  //   // Search for states
  //   const stateMatches = States.getStates().filter((state) =>
  //     searchQuery.some((term) =>
  //       new RegExp(
  //         generateQueryRegexPattern(term.trim(), unidecode(state.name)),
  //         "i"
  //       ).test(unidecode(state.name))
  //     )
  //   );
  //   stateMatches.forEach((state) => {
  //     const stateCities = Cities.getCities().filter(
  //       (city) => city.state_id === state.id
  //     );
  //     filteredOptions.push(
  //       ...stateCities.map((city) => {
  //         const countryName = Countries.getCountries().find(
  //           (country) => country.id === city.country_id
  //         )?.name;
  //         const formattedLocation = unidecode(
  //           `${city.name}, ${state.name}, ${countryName}`
  //         );
  //         return {
  //           value: formattedLocation,
  //           label: formattedLocation,
  //         };
  //       })
  //     );
  //   });

  //   console.log("stateMatches: ", stateMatches);

  //   // Search for countries
  //   const countryMatches = Countries.getCountries().filter((country) =>
  //     searchQuery.some((term) =>
  //       unidecode(country.name.toLowerCase()).includes(term.trim())
  //     )
  //   );
  //   countryMatches.forEach((country) => {
  //     const countryCities = Cities.getCities().filter(
  //       (city) => city.country_id === country.id
  //     );
  //     filteredOptions.push(
  //       ...countryCities.map((city) => {
  //         const stateName = States.getStates().find(
  //           (state) => state.id === city.state_id
  //         )?.name;
  //         const formattedLocation = unidecode(
  //           `${city.name}, ${stateName}, ${country.name}`
  //         );
  //         return {
  //           value: formattedLocation,
  //           label: formattedLocation,
  //         };
  //       })
  //     );
  //   });

  //   console.log("countryMatches: ", countryMatches);

  //   if (value.includes(",")) {
  //     const options = filteredOptions.filter((cityOption) =>
  //       searchQuery.every((term) =>
  //         term.trim().split(" ").length > 1
  //           ? new RegExp(
  //               generateQueryRegexPattern(
  //                 term.trim(),
  //                 unidecode(cityOption.label)
  //               ),
  //               "i"
  //             ).test(unidecode(cityOption.label.replace(/,/g, "")))
  //           : unidecode(
  //               cityOption.label.replace(/,/g, "").toLowerCase()
  //             ).includes(term.trim())
  //       )
  //     );
  //     console.log("options: ", options);
  //     filteredOptions.splice(0, filteredOptions.length, ...options);
  //   }

  //   const uniqFilteredOptions = filteredOptions.reduce((uniqueList, item) => {
  //     return uniqueList.some((el) => el.label === item.label)
  //       ? uniqueList
  //       : [...uniqueList, item];
  //   }, []);

  //   setSearchResults(uniqFilteredOptions);

  //   if (uniqFilteredOptions.length <= 20) {
  //     setLoadedResults(uniqFilteredOptions);
  //   } else {
  //     setLoadedResults(uniqFilteredOptions.slice(0, 20));
  //   }
  //   setIsLoading(false);

  //   // Cache the search results for the input value with timestamp
  //   searchCache[value] = {
  //     searchResults: uniqFilteredOptions,
  //     timestamp: Date.now(),
  //   };
  // }, 400); // Debounce delay of 400ms

  // const handleLoadMoreResults = () => {
  //   if (loadedResults.length === searchResults.length) {
  //     setHasMore(false);
  //     return; // Stop calling handleLoadMore if all results are already loaded
  //   }

  //   const nextBatch = searchResults.slice(
  //     loadedResults.length,
  //     loadedResults.length + 20
  //   );
  //   setLoadedResults((prevLoadedResults) => [
  //     ...prevLoadedResults,
  //     ...nextBatch,
  //   ]);
  // };

  // const generateQueryRegexPattern = (string1, string2) => {
  //   const trimmedString1 = string1.trim();
  //   const trimmedString2 = string2.trim();

  //   if (trimmedString1 === "") {
  //     return "^$";
  //   }

  //   if (trimmedString1.toLowerCase() === trimmedString2.toLowerCase()) {
  //     return `^${trimmedString1}$`;
  //   }

  //   const wordsArray = trimmedString1.split(" ");
  //   const wordPatterns = wordsArray.map((word) => `\\b${word}`).join(".*");

  //   return `^.*${wordPatterns}.*$`;
  // };

  console.log("user: ", user);
  console.log("files: ", files);
  console.log("location: ", location);

  return (
    <Flex
      h="85vh"
      flexDir={{ base: "column", md: "inherit" }}
      justify="center"
      mt={-4}
      gap={2}
    >
      <Flex flex={3} overflow="hidden" mb={{ base: "3", md: "inherit" }}>
        <Flex justify="center" align="center" h="full">
          <Image
            src={files[0]?.preview}
            key={files[0]?.name}
            maxH="full"
            objectFit="contain"
            alt=""
            rounded="lg"
          />
        </Flex>
      </Flex>

      <Box my={-2}>
        <Divider orientation="vertical" />
      </Box>

      <Flex flexDir="column" flex={1}>
        <Box boxShadow="md" rounded="lg">
          <Flex align="center" gap={1.5} px={2} py={1} flexWrap="wrap">
            <Link
              as={RouteLink}
              to={`/username`}
              bgGradient={useColorModeValue(
                "linear(to-tr, blackAlpha.500, blackAlpha.300)",
                "linear(to-tr, whiteAlpha.600, whiteAlpha.800)"
              )}
              p="1"
              rounded="full"
            >
              <Avatar size="sm" src={user?.dp} alt="User Avatar" />
            </Link>
            <Box justifyContent={"start"} wordBreak="break-word">
              <Link
                as={RouteLink}
                to={`/username`}
                style={{ textDecoration: "none" }}
              >
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  opacity="0.7"
                  colorScheme="gray"
                >
                  {user?.username}
                </Text>
              </Link>
            </Box>
          </Flex>
          <Box px={2} mt={2}>
            <Textarea
              name="caption"
              py={1}
              px={0}
              w="full"
              outline="none"
              borderColor="transparent"
              rows={6}
              placeholder="Write a caption..."
              onChange={handleCaptionChange}
              value={caption}
            />
            <Flex justify="space-between" py={1}>
              <Icon as={FaRegFaceSmile} fontSize="md" color="gray.400" />
              <Text fontSize="sm" color="gray.400">
                {caption?.length}/250
              </Text>
            </Flex>
          </Box>
        </Box>

        <Divider />
        <Flex
          justify="center"
          align="center"
          // px={2}
          mt={3}
          boxShadow="md"
          rounded="lg"
        >
          <Box w="full" maxW={{ base: {}, md: "350px" }}>
            <Box w="full">
              <CustomAsyncPaginateSelect
                location={location}
                setLocation={setLocation}
              />
            </Box>
          </Box>
          {/* <Icon as={GoLocation} ml={2} fontSize="md" color="gray.400" /> */}
        </Flex>
        <Divider />
        <Flex flex="1" mt={3} mb={1} align="end" justify="center">
          <Button
            size="md"
            w="full"
            color={useColorModeValue("gray.50", "gray.100")}
            bg={useColorModeValue("blue.500", "blue.400")}
            rounded="2xl"
            fontSize={"md"}
            _hover={{
              bg: useColorModeValue("blue.600", "blue.500"),
              color: useColorModeValue("gray.100", "gray.200"),
            }}
            // onClick={handleCreatePost}
          >
            Share
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostDraft;
