import {
  Button,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { IoIosImages } from "react-icons/io";
import CreatePostModal from "../../post/CreatePostModal/CreatePostModal";

const EmptyProfilePosts = ({
  isGivenUserCurrUser = false,
  handleRefreshProfile,
}) => {
  const {
    isOpen: isOpenNewPostModal,
    onOpen: onOpenNewPostModal,
    onClose: onCloseNewPostModal,
  } = useDisclosure();

  const emptyProfileNoticeText = isGivenUserCurrUser ? (
    <>
      Break the silence. Share your thoughts, memorable moments, interests and
      more - it's just a tap away!
      <br />
      Once you share some posts, they will show up here.
    </>
  ) : (
    <>
      This profile doesn't have any posts yet. Once they share thoughts, photos
      or updates, they will show up here.
      <br />
      Tap refresh or check back later on this profile for new updates.
    </>
  );

  return (
    <Flex justify="center" overflow="hidden">
      <CreatePostModal
        isOpen={isOpenNewPostModal}
        onClose={onCloseNewPostModal}
      />

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
            as={IoIosImages}
            mt={2}
            fontSize="9xl"
            color={"gray.400"}
            _dark={{
              color: "gray.500",
            }}
          />
          <Heading
            fontSize="2xl"
            fontWeight="light"
            textAlign="center"
            color="gray.800"
            _dark={{ color: "gray.50" }}
          >
            Nothing to see here yet!
          </Heading>
          <Text
            fontSize="sm"
            colorScheme="gray"
            opacity="0.6"
            textAlign="center"
          >
            {emptyProfileNoticeText}
          </Text>

          <Stack
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="center"
            mb={2}
          >
            <Button
              bg="blue.500"
              _hover={{ bg: "blue.600" }}
              color="white"
              size="sm"
              fontWeight="bold"
              py={2}
              px={4}
              rounded="lg"
              onClick={
                isGivenUserCurrUser ? onOpenNewPostModal : handleRefreshProfile
              }
            >
              {isGivenUserCurrUser ? "Start Posting" : "Refresh"}
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default EmptyProfilePosts;
