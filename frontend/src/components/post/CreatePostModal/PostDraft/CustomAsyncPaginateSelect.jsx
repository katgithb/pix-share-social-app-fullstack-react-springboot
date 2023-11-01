import {
  HStack,
  Spinner,
  Text,
  useBreakpointValue,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
// import { Cities, Countries, States } from "countries-states-cities-service";
import React, { useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import unidecode from "unidecode";

const CustomAsyncPaginateSelect = ({ location, setLocation }) => {
  const breakpoint = useBreakpointValue({ base: "base", sm: "sm", md: "md" });
  const isSmallScreen = breakpoint === "base" || breakpoint === "sm";
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const [countriesStatesCities, setCountriesStatesCities] = useState(null);
  const [isLoadingCountriesStatesCities, setIsLoadingCountriesStatesCities] =
    useState(true);

  useEffect(() => {
    const loadCountriesStatesCities = async () => {
      const { Cities, Countries, States } = await import(
        "countries-states-cities-service"
      );
      setCountriesStatesCities({ Cities, Countries, States });
      setIsLoadingCountriesStatesCities(false);
    };

    // Load the module when the modal is opened
    loadCountriesStatesCities();
  }, []);

  const generateQueryRegexPattern = (string1, string2) => {
    const trimmedString1 = string1.trim();
    const trimmedString2 = string2.trim();

    if (trimmedString1 === "") {
      return "^$";
    }

    if (trimmedString1.toLowerCase() === trimmedString2.toLowerCase()) {
      return `^${trimmedString1}$`;
    }

    const wordsArray = trimmedString1.split(" ");
    const wordPatterns = wordsArray.map((word) => `\\b${word}`).join(".*");

    return `^.*${wordPatterns}.*$`;
  };

  const getMatchedCities = (queryArr) => {
    return countriesStatesCities.Cities.getCities().filter((city) =>
      queryArr.some((term) =>
        unidecode(city.name.toLowerCase()).includes(term.trim())
      )
    );
  };

  const getMatchedStates = (queryArr) => {
    return countriesStatesCities.States.getStates().filter((state) =>
      queryArr.some((term) =>
        new RegExp(
          generateQueryRegexPattern(term.trim(), unidecode(state.name)),
          "i"
        ).test(unidecode(state.name))
      )
    );
  };

  const getMatchedCountries = (queryArr) => {
    return countriesStatesCities.Countries.getCountries().filter((country) =>
      queryArr.some((term) =>
        unidecode(country.name.toLowerCase()).includes(term.trim())
      )
    );
  };

  const getFormattedLocationOptions = (city, state, country) => {
    const cityName = city.name;
    const stateName = state
      ? state.name
      : countriesStatesCities.States.getStates().find(
          (state) => state.id === city.state_id
        )?.name;
    const countryName = country
      ? country.name
      : countriesStatesCities.Countries.getCountries().find(
          (country) => country.id === city.country_id
        )?.name;

    const formattedLocation = unidecode(
      `${cityName}, ${stateName}, ${countryName}`
    );

    return {
      value: formattedLocation,
      label: formattedLocation,
    };
  };

  const filterOptionsByMultipleSearchQueries = (matchedOptions, queryArr) => {
    return matchedOptions.filter((cityOption) =>
      queryArr.every((term) =>
        term.trim().split(" ").length > 1
          ? new RegExp(
              generateQueryRegexPattern(
                term.trim(),
                unidecode(cityOption.value)
              ),
              "i"
            ).test(unidecode(cityOption.value.replace(/,/g, "")))
          : unidecode(
              cityOption.value.replace(/,/g, "").toLowerCase()
            ).includes(term.trim())
      )
    );
  };

  const getFilteredUniqueOptions = (matchedOptions) => {
    return matchedOptions.reduce((uniqueList, item) => {
      return uniqueList.some((el) => el.label === item.label)
        ? uniqueList
        : [...uniqueList, item];
    }, []);
  };

  const fetchNextOptions = (value, page, pageSize) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!value || value.trim() === "" || value.trim().length < 3) {
          resolve({
            results: [],
            hasMoreResults: false,
          });
          return;
        }

        // Perform the search and update the options
        const matchedOptions = [];

        // Split the search query by comma if a comma is present, otherwise use the entire search query
        const searchQueryArr = value.includes(",")
          ? value
              .trim()
              .split(",")
              .map((part) => part.trim())
              .filter((part) => part !== "" && part.length >= 2)
          : [value.trim()];

        console.log("searchQueryArr: ", searchQueryArr);

        // Search for cities
        const cityMatches = getMatchedCities(searchQueryArr);
        matchedOptions.push(
          ...cityMatches.map((city) =>
            getFormattedLocationOptions(city, null, null)
          )
        );
        console.log("cityMatches: ", cityMatches);

        // Search for states
        const stateMatches = getMatchedStates(searchQueryArr);
        stateMatches.forEach((state) => {
          const stateCities = countriesStatesCities.Cities.getCities().filter(
            (city) => city.state_id === state.id
          );
          matchedOptions.push(
            ...stateCities.map((city) =>
              getFormattedLocationOptions(city, state, null)
            )
          );
        });
        console.log("stateMatches: ", stateMatches);

        // Search for countries
        const countryMatches = getMatchedCountries(searchQueryArr);
        countryMatches.forEach((country) => {
          const countryCities = countriesStatesCities.Cities.getCities().filter(
            (city) => city.country_id === country.id
          );
          matchedOptions.push(
            ...countryCities.map((city) =>
              getFormattedLocationOptions(city, null, country)
            )
          );
        });
        console.log("countryMatches: ", countryMatches);

        if (value.includes(",")) {
          const filteredOptions = filterOptionsByMultipleSearchQueries(
            matchedOptions,
            searchQueryArr
          );
          console.log("filteredOptions: ", filteredOptions);
          matchedOptions.splice(0, matchedOptions.length, ...filteredOptions);
        }

        const uniqMatchedOptions = getFilteredUniqueOptions(matchedOptions);

        console.log("uniqMatchedOptions: ", uniqMatchedOptions);

        const totalPages = Math.ceil(uniqMatchedOptions.length / pageSize);
        const loadedResults =
          uniqMatchedOptions.length <= pageSize
            ? uniqMatchedOptions
            : uniqMatchedOptions.slice((page - 1) * pageSize, page * pageSize);

        resolve({
          results: loadedResults,
          hasMoreResults: page < totalPages,
        });
      }, 400);
    });
  };

  const loadSearchOptions = async (value, loadedOptions, { page }) => {
    const pageSize = 25;
    const { results, hasMoreResults } = await fetchNextOptions(
      value,
      page,
      pageSize
    );

    console.log(
      "results and hasMoreResults and pageNum: ",
      results,
      hasMoreResults,
      page
    );

    return {
      options: results,
      hasMore: hasMoreResults,
      additional: {
        page: page + 1,
      },
    };
  };

  const asyncSelectStyles = {
    container: (baseStyles) => ({
      ...baseStyles,
      color: colorMode === "dark" ? theme.colors.gray[700] : baseStyles.color,
    }),
    control: (baseStyles) => ({
      ...baseStyles,
      borderColor: "transparent",
      backgroundColor:
        colorMode === "dark" ? theme.colors.gray[700] : baseStyles.color,
      color: colorMode === "dark" ? theme.colors.gray[200] : baseStyles.color,
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      color: colorMode === "dark" ? theme.colors.gray[200] : baseStyles.color,
    }),
    valueContainer: (baseStyles) => ({
      ...baseStyles,
      color: colorMode === "dark" ? theme.colors.gray[300] : baseStyles.color,
    }),
    singleValue: (baseStyles) => ({
      ...baseStyles,
      color: colorMode === "dark" ? theme.colors.gray[300] : baseStyles.color,
    }),
    indicatorsContainer: (baseStyles) => ({
      ...baseStyles,
      color: colorMode === "dark" ? theme.colors.gray[200] : baseStyles.color,
    }),
    clearIndicator: (baseStyles) => ({
      ...baseStyles,
      color: colorMode === "dark" ? theme.colors.gray[200] : baseStyles.color,
      ":hover": {
        ...baseStyles[":hover"],
        color:
          colorMode === "dark"
            ? theme.colors.gray[400]
            : theme.colors.gray[800],
      },
    }),
    dropdownIndicator: (baseStyles) => ({
      ...baseStyles,
      color: colorMode === "dark" ? theme.colors.gray[200] : baseStyles.color,
      ":hover": {
        ...baseStyles[":hover"],
        color:
          colorMode === "dark"
            ? theme.colors.gray[400]
            : theme.colors.gray[800],
      },
    }),
    indicatorSeparator: (baseStyles) => ({
      ...baseStyles,
      color: colorMode === "dark" ? theme.colors.gray[200] : baseStyles.color,
    }),
    loadingIndicator: (baseStyles) => ({
      ...baseStyles,
      color: colorMode === "dark" ? theme.colors.gray[300] : baseStyles.color,
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      color:
        colorMode === "dark" ? theme.colors.gray[400] : theme.colors.gray[400],
    }),
  };

  return (
    <>
      {isLoadingCountriesStatesCities ? (
        // Render a loading state while the module is being loaded
        <HStack p={1} align="center" justify="center">
          <Spinner size="sm" speed="0.65s" color="gray.400" />
          <Text fontSize="sm" opacity="0.7" colorScheme="gray">
            Loading...
          </Text>
        </HStack>
      ) : (
        <AsyncPaginate
          value={location}
          loadOptions={loadSearchOptions}
          debounceTimeout={400}
          onChange={setLocation}
          additional={{
            page: 1,
          }}
          loadOptionsOnMenuOpen={false}
          maxMenuHeight={isSmallScreen ? "45vh" : "33.05vh"}
          menuPlacement={isSmallScreen ? "top" : "auto"}
          cacheOptions
          isClearable
          isSearchable
          styles={asyncSelectStyles}
        />
      )}
    </>
  );
};

export default CustomAsyncPaginateSelect;
