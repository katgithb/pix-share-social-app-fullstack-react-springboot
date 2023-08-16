import {
  Box,
  Flex,
  Link,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaPlay } from "react-icons/fa6";
import { Link as RouteLink } from "react-router-dom";

const WatchAllLink = () => {
  return (
    <VStack>
      <Link as={RouteLink} to="/story/all">
        <Flex
          role="group"
          align="center"
          justify="center"
          borderRadius="full"
          border="2px"
          borderColor={"gray.600"}
          _dark={{
            borderColor: "gray.300",
            _hover: { bg: "gray.300", borderColor: "gray.600" },
          }}
          boxSize="54px"
          _hover={{
            bg: "gray.600",
            borderColor: "gray.100",
          }}
        >
          <Icon
            as={FaPlay}
            fontSize="md"
            color={"gray.600"}
            _dark={{
              color: "gray.300",
            }}
            _groupHover={{
              color: useColorModeValue("gray.100", "gray.600"),
            }}
          />
        </Flex>
      </Link>

      <Box w="80px" textAlign="center" overflow="hidden">
        <Link as={RouteLink} to="/story/all">
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color={"gray.600"}
            _dark={{ color: "gray.300" }}
          >
            Watch all
          </Text>
        </Link>
      </Box>
    </VStack>
  );
};

export default WatchAllLink;
