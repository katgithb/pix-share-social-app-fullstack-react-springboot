import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa6";

const PostCommentCard = ({ user, comment }) => {
  const useTruncateAndAddReadMore = (text, maxChars = 100) => {
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);
    if (text.length <= maxChars) {
      return <Text>{text}</Text>;
    } else {
      const truncatedText = isTextOverflowing
        ? text
        : `${text.substring(0, maxChars)}...`;
      const readMoreLink = (
        <Text
          as="span"
          alignSelf="end"
          color={"gray.500"}
          _dark={{ color: "gray.400" }}
          fontWeight="semibold"
          cursor="pointer"
          _hover={{
            textDecorationLine: "underline",
          }}
          onClick={() => setIsTextOverflowing(!isTextOverflowing)}
        >
          {isTextOverflowing ? "less" : "more"}
        </Text>
      );
      return (
        <>
          <Text noOfLines={!isTextOverflowing ? 2 : {}}>{truncatedText}</Text>

          {readMoreLink}
        </>
      );
    }
  };

  const truncatedComment = useTruncateAndAddReadMore(comment, 100);

  return (
    <Box my={2}>
      <HStack align="center" justify="space-between" flexWrap="wrap">
        <Flex flex="1" align="start" gap={2}>
          <Flex align="center" flexDirection="column" gap={0}>
            <Avatar
              p="0.5"
              name={user?.fullname}
              src={user?.dp}
              boxSize={9}
              loading="lazy"
            />
            <IconButton
              icon={<BiCommentDetail />}
              pointerEvents="none"
              my={-0.5}
              rounded="full"
              colorScheme="blue"
              size="sm"
              fontSize="lg"
              variant="ghost"
            />
          </Flex>
          <Flex flex="1" pl={-0.5} flexDirection="column" flexWrap="wrap">
            <HStack align="start" justify="space-between">
              <Flex flexDirection="column" align="start">
                <Text
                  as="span"
                  fontWeight="semibold"
                  wordBreak="break-word"
                  noOfLines={1}
                >
                  {user?.username}
                </Text>
                <Text
                  fontSize="xs"
                  my={-0.5}
                  color={"gray.500"}
                  _dark={{ color: "gray.400" }}
                  textTransform="lowercase"
                  letterSpacing="wide"
                >
                  16h ago |{" "}
                  <Text
                    as="span"
                    fontSize="xs"
                    color={"gray.500"}
                    _dark={{ color: "gray.400" }}
                    textTransform="lowercase"
                    letterSpacing="wide"
                  >
                    12.84K Likes
                  </Text>
                </Text>
              </Flex>

              <VStack alignSelf="center">
                <IconButton
                  icon={<FaHeart />}
                  my={-2}
                  rounded="full"
                  colorScheme="red"
                  size="sm"
                  variant="ghost"
                  aria-label="Like"
                  _hover={{
                    bg: "gray.200",
                    _dark: { bg: "gray.600" },
                  }}
                />
              </VStack>
            </HStack>

            <HStack
              alignItems="flex-start"
              justify="space-between"
              mt={1}
              gap={2}
            >
              {truncatedComment}
            </HStack>
          </Flex>
        </Flex>
      </HStack>
    </Box>
  );
};

export default PostCommentCard;
