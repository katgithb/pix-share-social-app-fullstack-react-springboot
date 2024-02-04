import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Link as RouteLink } from "react-router-dom";

const UserProfileStatsNotFound = ({ handleRefreshProfile }) => {
  return (
    <>
      <HStack
        fontSize="sm"
        w="full"
        justify={{ base: "center", md: "space-between" }}
        color={useColorModeValue("gray.500", "gray.400")}
        p="2"
        mt={{
          base: "1",
          md: "3",
        }}
      >
        <Box flex={{ base: "1", md: "0" }} textAlign="center">
          <Text
            as="strong"
            color={useColorModeValue("gray.700", "gray.200")}
            fontSize="lg"
            fontWeight="bold"
            textTransform="uppercase"
            display="block"
          >
            N/A
          </Text>{" "}
          posts
        </Box>
        <Box flex={{ base: "1", md: "0" }} textAlign="center">
          <Text
            as="strong"
            color={useColorModeValue("gray.700", "gray.200")}
            fontSize="lg"
            fontWeight="bold"
            textTransform="uppercase"
            display="block"
          >
            N/A
          </Text>{" "}
          followers
        </Box>
        <Box flex={{ base: "1", md: "0" }} textAlign="center">
          <Text
            as="strong"
            color={useColorModeValue("gray.700", "gray.200")}
            fontSize="lg"
            fontWeight="bold"
            textTransform="uppercase"
            display="block"
          >
            N/A
          </Text>{" "}
          following
        </Box>
      </HStack>

      <Stack direction={{ base: "row", md: "column" }} w="full" spacing={4}>
        <Flex flex="1" justify="center">
          <Link
            as={RouteLink}
            w="full"
            to="/"
            style={{ textDecoration: "none" }}
          >
            <Button
              size="md"
              w="full"
              rounded="2xl"
              colorScheme="gray"
              fontSize={"sm"}
            >
              Back to Home
            </Button>
          </Link>
        </Flex>
        <Flex flex="1" justify="center">
          <Button
            size="md"
            w="full"
            color={useColorModeValue("gray.50", "gray.100")}
            bg={useColorModeValue("blue.500", "blue.400")}
            rounded="2xl"
            fontSize={"sm"}
            _hover={{
              bg: useColorModeValue("blue.600", "blue.500"),
              color: useColorModeValue("gray.100", "gray.200"),
            }}
            onClick={handleRefreshProfile}
          >
            Refresh
          </Button>
        </Flex>
      </Stack>
    </>
  );
};

export default UserProfileStatsNotFound;
