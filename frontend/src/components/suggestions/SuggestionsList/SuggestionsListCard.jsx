import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import { Link as RouteLink } from "react-router-dom";
import AvatarWithLoader from "../../shared/AvatarWithLoader";

const SuggestionsListCard = ({ user }) => {
  return (
    <Flex py="2">
      <Flex alignItems="center">
        <Link as={RouteLink} to={`/profile/${user?.username}`} rounded="full">
          <AvatarWithLoader
            loaderSize={10}
            name={user?.name}
            src={user?.userImage ? user?.userImage : {}}
            size="sm"
            boxSize="10"
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
            noOfLines={2}
          >
            <Link as={RouteLink} to={`/profile/${user?.username}`}>
              {user?.username}
            </Link>
          </Text>
          <Text fontSize="xs" color="gray.500">
            Suggested for you
          </Text>
        </Box>
      </Flex>

      <Flex flex="1" alignItems="center" justifyContent="end">
        <Link
          as={RouteLink}
          to={`/profile/${user?.username}`}
          fontSize="xs"
          color={"cyan.500"}
          _dark={{ color: "cyan.400" }}
          fontWeight="bold"
        >
          <Button colorScheme="cyan" variant="outline" size="xs" rounded="full">
            Profile
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default SuggestionsListCard;
