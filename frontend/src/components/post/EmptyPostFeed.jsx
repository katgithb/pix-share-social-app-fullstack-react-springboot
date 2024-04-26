import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { CgFeed } from "react-icons/cg";
import { Link as RouteLink } from "react-router-dom";
import SuggestionsList from "../suggestions/SuggestionsList/SuggestionsList";
import CreatePostModal from "./CreatePostModal/CreatePostModal";

const EmptyPostFeed = ({
  isUserAuthenticated = false,
  isHomePageFeed = false,
  suggestedUsers,
}) => {
  const {
    isOpen: isOpenNewPostModal,
    onOpen: onOpenNewPostModal,
    onClose: onCloseNewPostModal,
  } = useDisclosure();
  const showSuggestedUsers =
    isHomePageFeed && suggestedUsers && suggestedUsers?.length > 0;

  return (
    <Flex justify="center" overflow="hidden">
      {isUserAuthenticated && (
        <CreatePostModal
          isOpen={isOpenNewPostModal}
          onClose={onCloseNewPostModal}
        />
      )}

      <Card
        flex={1}
        mb={5}
        variant={"outline"}
        maxW="xl"
        rounded="lg"
        boxShadow={"md"}
        _dark={{ variant: "elevated" }}
      >
        <CardBody
          as={Flex}
          flexDir="column"
          align="center"
          justify="center"
          pt={0}
          px={3}
        >
          <Icon
            as={CgFeed}
            mt={2}
            fontSize="9xl"
            color={"gray.400"}
            _dark={{
              color: "gray.500",
            }}
          />
          <Heading
            pt={2}
            fontSize="2xl"
            fontWeight="light"
            textAlign="center"
            color="gray.800"
            _dark={{ color: "gray.50" }}
          >
            {isHomePageFeed
              ? "Explore and Connect"
              : "Nothing to see here yet!"}
          </Heading>
          <Text
            p={2}
            fontSize="sm"
            colorScheme="gray"
            opacity="0.6"
            textAlign="center"
          >
            {isUserAuthenticated
              ? `Your feed is empty right now, but you can easily change that! Feel
            free to share your thoughts in your first post - it's just a tap
            away.`
              : "Your feed seems a bit empty! There aren't any posts available just yet. Sign up and share your thoughts - we can't wait to hear from you!"}
            <br />
            {isHomePageFeed
              ? `You can also discover new people or topics you're interested in and
            follow them to see their posts in your feed. And don't forget to
            follow friends, family, contacts - whoever you want to keep up with!`
              : "Once some posts are shared, they will show up here."}
          </Text>

          <Stack
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="center"
          >
            {isHomePageFeed && (
              <Link
                as={RouteLink}
                to={"/discover"}
                style={{ textDecoration: "none" }}
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
                >
                  Discover People
                </Button>
              </Link>
            )}

            {isUserAuthenticated ? (
              <Button
                bg="blue.500"
                _hover={{ bg: "blue.600" }}
                color="white"
                size="sm"
                fontWeight="bold"
                py={2}
                px={4}
                rounded="lg"
                onClick={onOpenNewPostModal}
              >
                Start Posting
              </Button>
            ) : (
              <Link
                as={RouteLink}
                to={"/signup"}
                style={{ textDecoration: "none" }}
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
                >
                  Sign Up
                </Button>
              </Link>
            )}
          </Stack>
        </CardBody>

        {showSuggestedUsers && (
          <CardFooter pt={0} px={3} overflow="hidden">
            <Flex flex={1} flexDir="column" px={2} w="full">
              <Text
                fontSize="sm"
                colorScheme="gray"
                opacity="0.6"
                textAlign="center"
              >
                Expand your network and discover new content by following these
                suggested users.
              </Text>

              <SuggestionsList users={suggestedUsers} />
            </Flex>
          </CardFooter>
        )}
      </Card>
    </Flex>
  );
};

export default EmptyPostFeed;
