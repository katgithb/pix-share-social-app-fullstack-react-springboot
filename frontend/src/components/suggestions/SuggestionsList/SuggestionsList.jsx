import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Link as RouteLink } from "react-router-dom";
import SuggestionsListCard from "./SuggestionsListCard";

const SuggestionsList = ({ users }) => {
  // function generateUsernameFromName(fullname) {
  //   const username = fullname.replace(/\s+/g, "_").toLowerCase();

  //   return username;
  // }

  return (
    <Card
      mt={5}
      p={3}
      variant={useColorModeValue("outline", "elevated")}
      rounded="lg"
      boxShadow={"md"}
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
          // const id = item;
          // const gender = id % 2 === 0 ? "men" : "women";
          // const userDetails = {
          //   dp: `https://randomuser.me/api/portraits/${gender}/${Math.round(
          //     id
          //   )}.jpg`,
          //   fullname: fullnames[index],
          //   username: generateUsernameFromName(fullnames[index]),
          // };

          return <SuggestionsListCard key={index} user={user} />;
        })}
      </Box>
    </Card>
  );
};

export default SuggestionsList;
