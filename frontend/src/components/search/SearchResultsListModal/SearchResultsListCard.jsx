import { Avatar, Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import { Link as RouteLink } from "react-router-dom";

const SearchResultsListCard = ({ user }) => {
  return (
    <Flex>
      <Flex alignItems="center">
        <Link as={RouteLink} href="#">
          <Avatar
            name={user?.fullname}
            src={user?.dp}
            // size="sm"
            boxSize="10"
            loading="lazy"
            alt="User Avatar"
            boxShadow={"md"}
            _hover={{
              transition: "transform 0.3s ease",
              transform: "rotate(8deg) scale(1.2)",
            }}
          />
        </Link>

        <Box px="2" mb={-0.5}>
          <Text
            fontSize="sm"
            textAlign="start"
            fontWeight="semibold"
            wordBreak={"break-word"}
          >
            <Link as={RouteLink} to={`/username`}>
              {user?.username}
            </Link>
          </Text>
          <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
            {user?.fullname}
          </Text>
        </Box>
      </Flex>

      <Flex flex="1" alignItems="center" justifyContent="end">
        <Link
          as={RouteLink}
          href="#"
          fontSize="xs"
          color={"cyan.500"}
          _dark={{ color: "cyan.400" }}
          fontWeight="bold"
        >
          <Button colorScheme="cyan" variant="outline" size="xs" rounded="full">
            Follow
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default SearchResultsListCard;
