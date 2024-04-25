import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { Link as RouteLink } from "react-router-dom";
import useIsUserAuthenticated from "../../hooks/useIsUserAuthenticated";
import { signoutAction } from "../../redux/actions/auth/authActions";

const BasicProfileCard = ({ user }) => {
  const dispatch = useDispatch();
  const isUserAuthenticated = useIsUserAuthenticated();

  const handleSignOutClick = () => {
    dispatch(signoutAction());
  };

  return (
    <Card
      p={3}
      variant={useColorModeValue("outline", "elevated")}
      rounded="lg"
      boxShadow={"md"}
    >
      <Flex overflow="hidden">
        <Flex alignItems="center" overflow="hidden">
          <Link
            as={RouteLink}
            to={isUserAuthenticated ? `/profile/${user?.username}` : ""}
            bgGradient={"linear(to-tr, yellow.400, pink.400, purple.600)"}
            p={"1"}
            rounded="full"
          >
            <Box bg="gray.50" p={"0.5"} rounded="full">
              <Avatar
                name={user?.name}
                src={user?.userImage}
                // size="md"
                boxSize="14"
                alt="User Avatar"
                boxShadow={"md"}
                loading="lazy"
                _hover={{
                  transition: "transform 0.3s ease",
                  transform: "rotate(8deg) scale(1.2)",
                }}
              />
            </Box>
          </Link>

          <Box px="2" mb={-0.5}>
            <Text
              fontSize="sm"
              textAlign="start"
              fontWeight="semibold"
              wordBreak={"break-word"}
              noOfLines={2}
            >
              {isUserAuthenticated ? (
                <Link as={RouteLink} to={`/profile/${user?.username}`}>
                  {user?.username}
                </Link>
              ) : (
                <Text>Create Account</Text>
              )}
            </Text>
            <Text
              fontSize="sm"
              textAlign="start"
              overflow="hidden"
              color="gray.500"
              wordBreak={"break-word"}
              noOfLines={2}
            >
              {isUserAuthenticated ? user?.name : "To Unlock All Features"}
            </Text>
          </Box>
        </Flex>

        <Flex flex="1" alignItems="center" justifyContent="end">
          {isUserAuthenticated ? (
            <Link
              as={RouteLink}
              href="#"
              fontSize="xs"
              color="cyan.500"
              fontWeight="bold"
              cursor="pointer"
              _dark={{ color: "cyan.400" }}
              onClick={handleSignOutClick}
            >
              <Button
                colorScheme="cyan"
                variant="outline"
                size="xs"
                rounded="full"
              >
                Sign Out
              </Button>
            </Link>
          ) : (
            <Link
              as={RouteLink}
              to="/signup"
              fontSize="xs"
              color="cyan.500"
              fontWeight="bold"
              cursor="pointer"
              _dark={{ color: "cyan.400" }}
            >
              <Button
                colorScheme="cyan"
                variant="outline"
                size="xs"
                rounded="full"
              >
                Sign Up
              </Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default BasicProfileCard;
