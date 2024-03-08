import {
  Box,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchInputBar = ({
  isNavSearchBar,
  onOpenSearchModal,
  handleSearchInputChange,
}) => {
  return (
    <Box>
      {isNavSearchBar ? (
        <HStack alignItems={"center"}>
          <InputGroup>
            <Input
              borderColor={"gray.300"}
              _dark={{ borderColor: "gray.500" }}
              rounded="md"
              type="text"
              placeholder="Search..."
              readOnly
              cursor="pointer"
              onKeyDown={(e) => e.preventDefault()} // Prevent typing
              onClick={onOpenSearchModal}
            />
            <InputLeftElement
              h={"full"}
              cursor="pointer"
              onClick={onOpenSearchModal}
            >
              <Icon as={FaMagnifyingGlass} fontSize="lg" color={"gray.400"} />
            </InputLeftElement>
          </InputGroup>
        </HStack>
      ) : (
        <HStack alignItems={"center"}>
          <InputGroup>
            <Input
              borderColor={"gray.300"}
              _dark={{ borderColor: "gray.500" }}
              rounded="md"
              fontWeight="normal"
              type="text"
              placeholder="Search..."
              onChange={
                handleSearchInputChange ? handleSearchInputChange : () => {}
              }
            />
            <InputLeftElement h={"full"}>
              <Icon as={FaMagnifyingGlass} fontSize="lg" color={"gray.400"} />
            </InputLeftElement>
          </InputGroup>
        </HStack>
      )}
    </Box>
  );
};

export default SearchInputBar;
