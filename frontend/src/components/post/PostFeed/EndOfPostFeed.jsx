import {
  Card,
  Flex,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { PiFlagCheckeredFill } from "react-icons/pi";

const EndOfPostFeed = ({ handleRefreshFeed }) => {
  return (
    <Flex justify="center" overflow="hidden">
      <Card
        mb={5}
        variant={"outline"}
        maxW="xl"
        rounded="lg"
        boxShadow={"md"}
        _dark={{ variant: "elevated" }}
      >
        <Flex flexDir="column" align="center" justify="center" pt={0} px={3}>
          <Icon
            as={PiFlagCheckeredFill}
            mt={3}
            fontSize="3xl"
            color={"gray.400"}
            _dark={{
              color: "gray.500",
            }}
          />
          <Text
            p={2}
            fontSize="sm"
            colorScheme="gray"
            opacity="0.6"
            textAlign="center"
          >
            You're all caught up! No more posts to see.
          </Text>

          <IconButton
            icon={<HiOutlineRefresh />}
            mb={3}
            bg={useColorModeValue("gray.100", "gray.500")}
            rounded="full"
            colorScheme="cyan"
            fontSize={{ base: "md", md: "20" }}
            variant="ghost"
            aria-label="Refresh Feed"
            boxShadow={"md"}
            _hover={{
              bg: useColorModeValue("gray.200", "gray.600"),
            }}
            onClick={handleRefreshFeed}
          />
        </Flex>
      </Card>
    </Flex>
  );
};

export default EndOfPostFeed;
