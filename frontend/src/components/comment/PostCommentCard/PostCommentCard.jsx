import {
  Box,
  Card,
  Divider,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { IoRemoveCircleOutline, IoTimerOutline } from "react-icons/io5";
import { Link as RouteLink } from "react-router-dom";
import useTruncateText from "../../../hooks/useTruncateText";
import {
  getRelativeCommentTime,
  isCurrUserComment,
} from "../../../utils/commentUtils";
import { getHumanReadableNumberFormat } from "../../../utils/commonUtils";
import AvatarWithLoader from "../../shared/AvatarWithLoader";
import PostCommentDeleteDialog from "./PostCommentDeleteDialog";

const PostCommentCard = ({ currUser, comment, showRelativeTime = false }) => {
  const {
    isOpen: isOpenPostCommentDeleteDialog,
    onOpen: onOpenPostCommentDeleteDialog,
    onClose: onClosePostCommentDeleteDialog,
  } = useDisclosure();
  const postCommentDeleteDialogCancelRef = useRef();
  const [relativeCommentTime, setRelativeCommentTime] = useState(
    getRelativeCommentTime(comment?.createdAt)
  );
  const truncatedCommentText = useTruncateText(comment?.content, 100);

  const likedByUsersLength = comment?.likedByUsers?.length || 0;
  const likesCount = getHumanReadableNumberFormat(likedByUsersLength);

  useEffect(() => {
    let interval;
    if (showRelativeTime) {
      interval = setInterval(() => {
        setRelativeCommentTime(getRelativeCommentTime(comment?.createdAt));
      }, 60000); // Update every minute
    }

    return () => {
      clearInterval(interval);
    };
  }, [comment?.createdAt, showRelativeTime]);

  return (
    <Box mt={2}>
      <PostCommentDeleteDialog
        isOpen={isOpenPostCommentDeleteDialog}
        onClose={onClosePostCommentDeleteDialog}
        cancelRef={postCommentDeleteDialogCancelRef}
      />

      <HStack align="center" justify="space-between" flexWrap="wrap">
        <Flex flex="1" align="start" gap={2}>
          <Flex align="center">
            <Link
              as={RouteLink}
              to={`/profile/${comment?.user?.username}`}
              rounded="full"
            >
              <AvatarWithLoader
                loaderSize={8}
                name={comment?.user?.name}
                src={comment?.user?.userImage ? comment?.user?.userImage : {}}
                size="sm"
              />
            </Link>
          </Flex>

          <Flex flexDirection="column">
            <HStack
              flex="1"
              minH={8}
              gap={0}
              align="center"
              justify="space-between"
              flexWrap="wrap"
            >
              <Flex flexDirection="column" align="start">
                <Text
                  as="span"
                  fontWeight="semibold"
                  wordBreak="break-all"
                  noOfLines={1}
                >
                  <Link
                    as={RouteLink}
                    to={`/profile/${comment?.user?.username}`}
                  >
                    {comment?.user?.username}
                  </Link>
                </Text>
              </Flex>
            </HStack>

            <Card
              gap={0.5}
              mb={1}
              px={2}
              py={1}
              variant={"outline"}
              rounded="lg"
              boxShadow={"md"}
              _dark={{ variant: "elevated" }}
            >
              <HStack gap={2} align="center" justify="space-between">
                <Text
                  fontSize="xs"
                  color={"gray.500"}
                  _dark={{ color: "gray.400" }}
                  textTransform="capitalize"
                  letterSpacing="wide"
                  fontWeight="semibold"
                  wordBreak="break-all"
                  noOfLines={2}
                >
                  {comment?.user?.name}
                </Text>

                {isCurrUserComment(comment, currUser) && (
                  <IconButton
                    icon={<IoRemoveCircleOutline />}
                    mx={-2}
                    rounded="full"
                    colorScheme="red"
                    size="sm"
                    variant="link"
                    aria-label="Delete Comment"
                    onClick={onOpenPostCommentDeleteDialog}
                  />
                )}
              </HStack>

              <HStack align="start" justify="space-between">
                {truncatedCommentText}
              </HStack>

              <Divider />

              <HStack
                flex="1"
                gap={1.5}
                align="start"
                justify="space-between"
                flexWrap="wrap"
              >
                <Flex gap={1} align="center">
                  <IconButton
                    icon={<FaHeart />}
                    mx={-2}
                    rounded="full"
                    colorScheme="red"
                    size="sm"
                    variant="link"
                    aria-label="Like"
                  />
                  {likedByUsersLength > 0 ? (
                    <Text
                      fontSize="xs"
                      color={"gray.500"}
                      _dark={{ color: "gray.400" }}
                      textTransform="lowercase"
                      letterSpacing="wide"
                    >
                      {likesCount}
                    </Text>
                  ) : (
                    <Text
                      fontSize="xs"
                      color={"gray.500"}
                      _dark={{ color: "gray.400" }}
                      textTransform="capitalize"
                      letterSpacing="wide"
                    >
                      Like
                    </Text>
                  )}
                </Flex>

                {showRelativeTime && (
                  <Flex gap={1} align="center">
                    <IconButton
                      icon={<IoTimerOutline />}
                      mx={-2}
                      pointerEvents="none"
                      rounded="full"
                      colorScheme="teal"
                      size="sm"
                      variant="link"
                      aria-label="Like"
                    />
                    <Text
                      fontSize="xs"
                      color={"gray.500"}
                      _dark={{ color: "gray.400" }}
                      textTransform="lowercase"
                      letterSpacing="wide"
                    >
                      {relativeCommentTime}
                    </Text>
                  </Flex>
                )}
              </HStack>
            </Card>
          </Flex>
        </Flex>
      </HStack>
    </Box>
  );
};

export default PostCommentCard;
