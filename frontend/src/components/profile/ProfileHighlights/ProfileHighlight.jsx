import { Box, Flex, Image, Link, Icon, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import { Link as RouteLink } from "react-router-dom";

const ProfileHighlight = ({ highlight }) => {
  return (
    <VStack>
      <Box>
        <Link as={RouteLink} href="#" style={{ textDecoration: "none" }}>
          <Flex
            align="center"
            justify="center"
            borderRadius="xl"
            border="1px"
            borderColor="gray.300"
            p="1"
            boxSize="54px"
            overflow="hidden"
          >
            {highlight ? (
              <Image
                src={`https://picsum.photos/1280/720?random=${
                  Math.random() * 100
                }`}
                // fallbackSrc="path/to/placeholder.jpg"
                alt="Highlight"
                boxSize="45px"
                objectFit="cover"
                rounded="lg"
                boxShadow={"md"}
                _hover={{
                  transition: "transform 0.3s ease",
                  transform: "translateY(-2%) scale(1.2)",
                }}
              />
            ) : (
              <Icon
                as={FaPlus}
                fontSize="xl"
                color={"gray.500"}
                _dark={{ color: "gray.400" }}
              />
            )}
          </Flex>
        </Link>
      </Box>
      <Box w="80px" textAlign="center" overflow="hidden">
        <Text color={"gray.500"} _dark={{ color: "gray.400" }} noOfLines={1}>
          {highlight ? `Highlight${highlight}` : "New"}
        </Text>
      </Box>
    </VStack>
  );
};

export default ProfileHighlight;
