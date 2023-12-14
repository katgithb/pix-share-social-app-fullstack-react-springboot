import { Box, Card, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import SuggestionsListCard from "./SuggestionsListCard";

const SuggestionsList = ({ users }) => {
  return (
    <Card
      mt={5}
      p={3}
      variant={useColorModeValue("outline", "elevated")}
      rounded="lg"
      boxShadow={"md"}
      w="full"
    >
      <Box>
        <Flex>
          <Text
            fontWeight="bold"
            textAlign="start"
            color="gray.500"
            fontSize="sm"
          >
            Suggestions For You
          </Text>
          {/* <Box textAlign="right" fontSize="sm">
          <Link
            as={RouteLink}
            href="#"
            fontSize="xs"
            color="black.400"
            fontWeight="bold"
          >
            See All
          </Link>
        </Box> */}
        </Flex>

        {users?.map((user, index) => {
          return <SuggestionsListCard key={index} user={user} />;
        })}
      </Box>
    </Card>
  );
};

export default SuggestionsList;
