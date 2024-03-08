import {
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { IoMdBookmarks } from "react-icons/io";
import { Link as RouteLink } from "react-router-dom";

const EmptyProfileSavedPosts = () => {
  return (
    <Flex justify="center" overflow="hidden">
      <Flex flex={1} justify="center" maxW="md">
        <Flex
          flexDir="column"
          align="center"
          justify="center"
          pt={0}
          px={3}
          gap={2}
        >
          <Icon
            as={IoMdBookmarks}
            mt={2}
            fontSize="9xl"
            color={"gray.400"}
            _dark={{
              color: "gray.500",
            }}
            transform={"scale(1.1675)"}
          />
          <Heading
            fontSize="2xl"
            fontWeight="light"
            textAlign="center"
            color="gray.800"
            _dark={{ color: "gray.50" }}
          >
            Nothing saved yet!
          </Heading>
          <Text
            fontSize="sm"
            colorScheme="gray"
            opacity="0.6"
            textAlign="center"
          >
            Save the posts you love by tapping the save icon. Saving posts lets
            you easily find them again later.
            <br />
            When you save a post, it will be added to your collection here.
          </Text>

          <Stack
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="center"
            mb={2}
          >
            <Link as={RouteLink} to="/" style={{ textDecoration: "none" }}>
              <Button
                bg="blue.500"
                _hover={{ bg: "blue.600" }}
                color="white"
                size="sm"
                fontWeight="bold"
                py={2}
                px={4}
                rounded="lg"
              >
                Start Saving Posts
              </Button>
            </Link>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default EmptyProfileSavedPosts;
